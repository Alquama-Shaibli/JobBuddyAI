import './config/env.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import connectDb from './db/db.js';
import logger from './utils/logger.js';
import errorHandler from './middlewares/error.middleware.js';

import authRoutes      from './routes/auth.routes.js';
import userRoutes      from './routes/user.routes.js';
import jobRoutes       from './routes/job.routes.js';
import mockTestRoutes  from './routes/mockTest.routes.js';
import resultRoutes    from './routes/result.routes.js';
import chatRoutes      from './routes/chat.routes.js';
import resumeRoutes    from './routes/resume.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import quizRoutes      from './routes/quiz.routes.js';

// ── Path Resolution ───────────────────────────────────────────
// import.meta.url is ALWAYS the absolute URL of THIS file.
// It does NOT depend on process.cwd() or how the process was started.
//
// On Render (native Node):
//   import.meta.url → file:///opt/render/project/src/server/index.js
//   __dirname       → /opt/render/project/src/server
//   CLIENT_BUILD    → /opt/render/project/src/client/dist   ← CORRECT
//
// On Windows (local):
//   import.meta.url → file:///C:/Users/.../server/index.js
//   CLIENT_BUILD    → C:\Users\...\client\dist               ← CORRECT
//
// process.cwd() is intentionally NOT used here — Render returns '/'
// as CWD which causes path.join(cwd, 'client', 'dist') = '/client/dist'.

const __filename    = fileURLToPath(import.meta.url);
const __dirname     = path.dirname(__filename);
const CLIENT_BUILD  = path.join(__dirname, '..', 'client', 'dist');
const CLIENT_INDEX  = path.join(CLIENT_BUILD, 'index.html');

// ── Startup Diagnostics ───────────────────────────────────────
console.log('='.repeat(60));
console.log('JobBuddy AI — Server Starting');
console.log(`  NODE_ENV     : ${process.env.NODE_ENV || 'development'}`);
console.log(`  process.cwd(): ${process.cwd()}`);
console.log(`  __dirname    : ${__dirname}`);
console.log(`  CLIENT_BUILD : ${CLIENT_BUILD}`);
console.log(`  dist exists  : ${fs.existsSync(CLIENT_BUILD)}`);
console.log(`  index.html   : ${fs.existsSync(CLIENT_INDEX)}`);
console.log('='.repeat(60));

// ── Database ──────────────────────────────────────────────────
connectDb();

// ── Express App ───────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

// ── Trust Proxy ───────────────────────────────────────────────
// MUST come before rate-limiters.
// Render (and all PaaS) sit behind a reverse proxy that sets
// X-Forwarded-For. Without this, express-rate-limit throws:
// ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
app.set('trust proxy', 1);

// ── Security Headers ──────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS ──────────────────────────────────────────────────────
// Full-stack mode: frontend served by the same Express server.
// CORS only matters for local dev (frontend on :5173, API on :8080).
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);       // same-origin / no-CORS
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));

// ── Rate Limiters ─────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts. Try again in 15 minutes.' },
    skipSuccessfulRequests: true,
});

app.use(globalLimiter);

// ── Body Parsing & Sanitization ───────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// NoSQL injection guard (Express 5 compatible — req.query is read-only)
const sanitizeBody = (obj) => {
    if (obj && typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            } else {
                sanitizeBody(obj[key]);
            }
        }
    }
};
app.use((req, _res, next) => { if (req.body) sanitizeBody(req.body); next(); });

// XSS guard
const escapeHtml = (str) =>
    str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' })[c]);
const sanitizeXss = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') obj[key] = escapeHtml(obj[key]);
        else if (typeof obj[key] === 'object') sanitizeXss(obj[key]);
    }
};
app.use((req, _res, next) => { if (req.body) sanitizeXss(req.body); next(); });

// ── HTTP Request Logging ──────────────────────────────────────
if (!isProduction) {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
}

// ── Health Check ──────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
        status:       'ok',
        environment:  process.env.NODE_ENV || 'development',
        distExists:   fs.existsSync(CLIENT_BUILD),
        indexExists:  fs.existsSync(CLIENT_INDEX),
        clientBuild:  CLIENT_BUILD,
        timestamp:    new Date().toISOString(),
    });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/v1/auth',      authLimiter, authRoutes);
app.use('/api/v1/user',      userRoutes);
app.use('/api/v1/jobs',      jobRoutes);
app.use('/api/v1/mock-test', mockTestRoutes);
app.use('/api/v1/result',    resultRoutes);
app.use('/api/v1/ai',        chatRoutes);
app.use('/api/v1/resume',    resumeRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/v1/quiz',      quizRoutes);

// ── Serve React Frontend ──────────────────────────────────────
if (fs.existsSync(CLIENT_BUILD)) {
    // Serve static assets (JS/CSS/images/fonts)
    app.use(express.static(CLIENT_BUILD, {
        maxAge: isProduction ? '1d' : 0,
        etag: true,
        index: false,         // let the SPA fallback handle /
    }));

    // SPA fallback: Express 5 dropped wildcard '*' support in app.get()
    // Use app.use() middleware instead — equivalent and works in Express 5
    app.use((req, res, next) => {
        // Skip — let API 404 handler below handle API misses
        if (req.path.startsWith('/api')) return next();

        res.sendFile(CLIENT_INDEX, (err) => {
            if (err) {
                logger.error(`sendFile failed: ${err.message}`);
                if (!res.headersSent) {
                    res.status(500).json({ success: false, message: 'Frontend unavailable.' });
                }
            }
        });
    });

    console.log(`✅ React frontend is being served from:\n   ${CLIENT_BUILD}`);
} else {
    // This block means the build step didn't produce client/dist.
    // Check Render build logs for "vite build" output.
    console.error('❌ client/dist NOT FOUND — frontend will NOT be served!');
    console.error(`   Expected at: ${CLIENT_BUILD}`);
    console.error('   Ensure build command includes: cd client && npm install && npm run build');
}

// ── API 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ── Process-level Safety Net ──────────────────────────────────
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', reason);
    if (isProduction) process.exit(1);
});
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
