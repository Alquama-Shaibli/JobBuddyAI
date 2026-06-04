import './config/env.js';
import express    from 'express';
import cookieParser from 'cookie-parser';
import cors       from 'cors';
import helmet     from 'helmet';
import rateLimit  from 'express-rate-limit';
import morgan     from 'morgan';
import path       from 'path';
import { fileURLToPath } from 'url';
import fs         from 'fs';

import connectDb      from './db/db.js';
import logger         from './utils/logger.js';
import errorHandler   from './middlewares/error.middleware.js';

import authRoutes      from './routes/auth.routes.js';
import userRoutes      from './routes/user.routes.js';
import jobRoutes       from './routes/job.routes.js';
import mockTestRoutes  from './routes/mockTest.routes.js';
import resultRoutes    from './routes/result.routes.js';
import chatRoutes      from './routes/chat.routes.js';
import resumeRoutes    from './routes/resume.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import quizRoutes      from './routes/quiz.routes.js';

// ── Path to React build ───────────────────────────────────────────
// import.meta.url is ALWAYS the absolute URL of this file —
// it is independent of process.cwd() (which can be '/' on some hosts).
//
//   On Render:  __dirname = /opt/render/project/src/server
//               CLIENT_BUILD = /opt/render/project/src/client/dist  ✅
//
const __filename   = fileURLToPath(import.meta.url);
const __dirname    = path.dirname(__filename);
const CLIENT_BUILD = path.join(__dirname, '..', 'client', 'dist');
const CLIENT_INDEX = path.join(CLIENT_BUILD, 'index.html');

const distExists  = fs.existsSync(CLIENT_BUILD);
const indexExists = fs.existsSync(CLIENT_INDEX);

logger.info('──────────────────────────────────────────────');
logger.info('JobBuddy AI  starting…');
logger.info(`  NODE_ENV     : ${process.env.NODE_ENV || 'development'}`);
logger.info(`  CLIENT_BUILD : ${CLIENT_BUILD}`);
logger.info(`  dist exists  : ${distExists}`);
logger.info(`  index.html   : ${indexExists}`);
logger.info('──────────────────────────────────────────────');

// ── Database ──────────────────────────────────────────────────────
await connectDb();

// ── Express ───────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 8080;
const isProd = process.env.NODE_ENV === 'production';

// ── Trust proxy (required on Render — sits behind reverse proxy) ──
app.set('trust proxy', 1);

// ── Security headers ──────────────────────────────────────────────
// contentSecurityPolicy disabled — Vite uses ES-module crossorigin scripts
// that a strict CSP would block, producing a white screen.
app.use(helmet({
    contentSecurityPolicy:      false,
    crossOriginEmbedderPolicy:  false,
    crossOriginResourcePolicy:  { policy: 'cross-origin' },
}));

// ── CORS ──────────────────────────────────────────────────────────
// Production: same-origin (Express serves the React build).
// Dev: Vite dev server runs on :5173, API on :8080.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

if (!isProd) allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);                     // same-origin / curl
        if (allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: blocked origin ${origin}`));
    },
    credentials: true,
}));

// ── Rate limiters ─────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      300,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { success: false, message: 'Too many requests — try again later.' },
});
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      20,
    standardHeaders: true,
    legacyHeaders:   false,
    skipSuccessfulRequests: true,
    message: { success: false, message: 'Too many auth attempts — try again in 15 minutes.' },
});
app.use(globalLimiter);

// ── Body parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ── Inline NoSQL injection guard (Express 5 compatible) ───────────
// express-mongo-sanitize mutates req.query which is read-only in Express 5
const cleanObj = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const k of Object.keys(obj)) {
        if (k.startsWith('$') || k.includes('.')) delete obj[k];
        else cleanObj(obj[k]);
    }
};
app.use((req, _res, next) => { cleanObj(req.body); next(); });

// ── Request logging ───────────────────────────────────────────────
app.use(morgan(isProd ? 'combined' : 'dev', {
    stream: isProd ? { write: msg => logger.info(msg.trim()) } : undefined,
}));

// ── Static assets — BEFORE api routes & SPA fallback ─────────────
if (distExists) {
    app.use(express.static(CLIENT_BUILD, {
        maxAge: isProd ? '7d' : 0,
        etag:   true,
    }));
}

// ── Health check ─────────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
    res.json({
        status:      'ok',
        env:         process.env.NODE_ENV || 'development',
        distExists,
        indexExists,
        timestamp:   new Date().toISOString(),
    });
});

// ── API routes ────────────────────────────────────────────────────
app.use('/api/v1/auth',      authLimiter, authRoutes);
app.use('/api/v1/user',      userRoutes);
app.use('/api/v1/jobs',      jobRoutes);
app.use('/api/v1/mock-test', mockTestRoutes);
app.use('/api/v1/result',    resultRoutes);
app.use('/api/v1/ai',        chatRoutes);
app.use('/api/v1/resume',    resumeRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/v1/quiz',      quizRoutes);

// ── SPA fallback — React Router deep links ────────────────────────
// express.static already handles /assets/*, /logo.png, etc.
// This middleware catches all remaining non-API paths (/dashboard, /jobs…)
// and returns index.html so React Router can handle them client-side.
if (indexExists) {
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        // Don't serve index.html for static file extensions that weren't found
        if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|map|json)$/i.test(req.path)) return next();
        res.sendFile(CLIENT_INDEX);
    });
}

// ── 404 (API routes only reach here) ─────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `${req.method} ${req.originalUrl} not found` });
});

// ── Error handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ── Process guards ────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
    logger.error('unhandledRejection:', reason);
    // Don't exit on rejection — log and continue to avoid 502s from transient errors
});
process.on('uncaughtException', (err) => {
    logger.error('uncaughtException:', err);
    process.exit(1);
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀  Server listening on :${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
