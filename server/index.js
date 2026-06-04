/* ── Startup checkpoints use raw console.log so they're ALWAYS ──────
   visible on Render, regardless of Winston configuration.
   Winston writes to files in production — cloud logs capture stdout.  */

// ── CHECKPOINT 0: File is being parsed ───────────────────────────
console.log('[BOOT] CHECKPOINT 0: server/index.js parsing started');

import './config/env.js';

// ── CHECKPOINT 1: env loaded ──────────────────────────────────────
console.log('[BOOT] CHECKPOINT 1: env loaded');
console.log(`[BOOT]   NODE_ENV     : ${process.env.NODE_ENV || 'MISSING'}`);
console.log(`[BOOT]   PORT         : ${process.env.PORT || 'MISSING (will use 8080)'}`);
console.log(`[BOOT]   MONGO_URI    : ${process.env.MONGO_URI ? 'PRESENT' : 'MISSING ❌'}`);
console.log(`[BOOT]   DB_NAME      : ${process.env.DB_NAME ? 'PRESENT' : 'MISSING ❌'}`);
console.log(`[BOOT]   JWT_SECRET   : ${process.env.JWT_SECRET ? 'PRESENT' : 'MISSING ❌'}`);
console.log(`[BOOT]   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'PRESENT' : 'MISSING (optional)'}`);

import express    from 'express';
import cookieParser from 'cookie-parser';
import cors       from 'cors';
import helmet     from 'helmet';
import rateLimit  from 'express-rate-limit';
import morgan     from 'morgan';
import path       from 'path';
import { fileURLToPath } from 'url';
import fs         from 'fs';

// ── CHECKPOINT 2: express + stdlib imports resolved ───────────────
console.log('[BOOT] CHECKPOINT 2: express & stdlib imports resolved');

import connectDb      from './db/db.js';
import logger         from './utils/logger.js';
import errorHandler   from './middlewares/error.middleware.js';

// ── CHECKPOINT 3: server utilities imported ───────────────────────
console.log('[BOOT] CHECKPOINT 3: db, logger, errorHandler imported');

import authRoutes      from './routes/auth.routes.js';
import userRoutes      from './routes/user.routes.js';
import jobRoutes       from './routes/job.routes.js';
import mockTestRoutes  from './routes/mockTest.routes.js';
import resultRoutes    from './routes/result.routes.js';
import chatRoutes      from './routes/chat.routes.js';
import resumeRoutes    from './routes/resume.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import quizRoutes      from './routes/quiz.routes.js';

// ── CHECKPOINT 4: all routes imported ────────────────────────────
console.log('[BOOT] CHECKPOINT 4: all route files imported');

// ── Process-level safety net ──────────────────────────────────────
// Must be registered BEFORE any async work so import-time throws are caught.
process.on('uncaughtException', (err) => {
    console.error('[FATAL] uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    // On transient errors (e.g. network blip) we log but do NOT exit —
    // exiting here causes Render 502 loops.
    console.error('[WARN] unhandledRejection:', reason);
});
process.on('SIGTERM', () => { console.log('[BOOT] SIGTERM received — graceful shutdown'); process.exit(0); });
process.on('SIGINT',  () => { console.log('[BOOT] SIGINT received — graceful shutdown');  process.exit(0); });

// ── Path resolution ───────────────────────────────────────────────
const __filename   = fileURLToPath(import.meta.url);
const __dirname    = path.dirname(__filename);
const CLIENT_BUILD = path.join(__dirname, '..', 'client', 'dist');
const CLIENT_INDEX = path.join(CLIENT_BUILD, 'index.html');
const distExists   = fs.existsSync(CLIENT_BUILD);
const indexExists  = fs.existsSync(CLIENT_INDEX);

// ── CHECKPOINT 5: paths resolved ─────────────────────────────────
console.log('[BOOT] CHECKPOINT 5: path resolution done');
console.log(`[BOOT]   CLIENT_BUILD : ${CLIENT_BUILD}`);
console.log(`[BOOT]   dist exists  : ${distExists}`);
console.log(`[BOOT]   index.html   : ${indexExists}`);

// ── Database ──────────────────────────────────────────────────────
console.log('[BOOT] CHECKPOINT 6: attempting MongoDB connection…');

try {
    await connectDb();
    console.log('[BOOT] CHECKPOINT 7: MongoDB connected ✅');
} catch (err) {
    console.error('[FATAL] MongoDB connection failed:', err.message);
    process.exit(1);
}

// ── Express setup ─────────────────────────────────────────────────
console.log('[BOOT] CHECKPOINT 8: creating Express app…');

const app    = express();
const PORT   = Number(process.env.PORT) || 8080;
const isProd = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

// ── Security ──────────────────────────────────────────────────────
// CSP disabled — Vite ES-module crossorigin scripts are blocked by
// Helmet's default policy, producing a client-side white screen.
app.use(helmet({
    contentSecurityPolicy:     false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

console.log('[BOOT] CHECKPOINT 9: helmet applied');

// ── CORS ──────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(o => o.trim()).filter(Boolean);
if (!isProd) allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: blocked origin ${origin}`));
    },
    credentials: true,
}));

// ── Rate limiters ─────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 300,
    standardHeaders: true, legacyHeaders: false,
    message: { success: false, message: 'Too many requests — try again later.' },
});
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 20,
    standardHeaders: true, legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { success: false, message: 'Too many auth attempts — try again in 15 minutes.' },
});
app.use(globalLimiter);

// ── Body parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ── NoSQL injection guard (Express 5 compatible) ──────────────────
const cleanObj = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const k of Object.keys(obj)) {
        if (k.startsWith('$') || k.includes('.')) delete obj[k];
        else cleanObj(obj[k]);
    }
};
app.use((req, _res, next) => { cleanObj(req.body); next(); });

// ── HTTP request logging ──────────────────────────────────────────
app.use(morgan(isProd ? 'combined' : 'dev'));

console.log('[BOOT] CHECKPOINT 10: all middleware registered');

// ── Static assets ─────────────────────────────────────────────────
if (distExists) {
    app.use(express.static(CLIENT_BUILD, { maxAge: isProd ? '7d' : 0, etag: true }));
    console.log(`[BOOT] CHECKPOINT 11: static assets served from ${CLIENT_BUILD}`);
} else {
    console.warn('[BOOT] CHECKPOINT 11: client/dist NOT found — frontend will not be served');
}

// ── Health check ─────────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', env: process.env.NODE_ENV, distExists, indexExists, ts: new Date().toISOString() });
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

console.log('[BOOT] CHECKPOINT 12: all API routes registered');

// ── SPA fallback ─────────────────────────────────────────────────
if (indexExists) {
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|map|json)$/i.test(req.path)) return next();
        res.sendFile(CLIENT_INDEX);
    });
}

// ── 404 fallback ─────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `${req.method} ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────────
app.use(errorHandler);

// ── Start listening ───────────────────────────────────────────────
console.log(`[BOOT] CHECKPOINT 13: starting server on port ${PORT}…`);

app.listen(PORT, '0.0.0.0', () => {
    logger.info('──────────────────────────────────────────────');
    logger.info(`🚀  JobBuddy AI running on :${PORT} [${process.env.NODE_ENV || 'development'}]`);
    logger.info(`📁  Static: ${distExists ? CLIENT_BUILD : 'NOT FOUND'}`);
    logger.info('──────────────────────────────────────────────');
    console.log(`[BOOT] CHECKPOINT 14: ✅ Server listening on port ${PORT} — STARTUP COMPLETE`);
});
