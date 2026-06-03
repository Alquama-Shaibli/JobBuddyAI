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
// import.meta.url → ALWAYS the absolute URL of this file.
// Does NOT depend on process.cwd() (Render returns '/' as cwd).
//
//   import.meta.url  →  file:///opt/render/project/src/server/index.js
//   __dirname        →  /opt/render/project/src/server
//   CLIENT_BUILD     →  /opt/render/project/src/client/dist   ✅
const __filename   = fileURLToPath(import.meta.url);
const __dirname    = path.dirname(__filename);
const CLIENT_BUILD = path.join(__dirname, '..', 'client', 'dist');
const CLIENT_INDEX = path.join(CLIENT_BUILD, 'index.html');

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
// Fixes: ERR_ERL_UNEXPECTED_X_FORWARDED_FOR on Render.
app.set('trust proxy', 1);

// ── Security Headers ──────────────────────────────────────────
// IMPORTANT: Helmet's default CSP blocks ES module scripts served
// with 'crossorigin' attribute (which Vite uses). We disable the
// default contentSecurityPolicy so React/Vite JS bundles load correctly.
// We keep all other Helmet protections active.
app.use(helmet({
    contentSecurityPolicy: false,          // Vite uses crossorigin ES modules
    crossOriginEmbedderPolicy: false,      // Required for external fonts (Google Fonts)
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS ──────────────────────────────────────────────────────
// Full-stack: frontend + API on same Express server.
// CORS only needed for local dev split (Vite :5173 ↔ Express :8080).
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
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

// NoSQL injection guard (Express 5 — req.query is read-only, avoid mutating it)
const sanitizeBody = (obj) => {
    if (obj && typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            if (key.startsWith('$') || key.includes('.')) delete obj[key];
            else sanitizeBody(obj[key]);
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

// ── Static Assets — MUST be before API routes and SPA fallback ─
// Serves /assets/*.js, /assets/*.css, /logo.png, etc.
// express.static() calls next() if file not found, so API routes
// and the SPA fallback are reached only when static lookup fails.
if (fs.existsSync(CLIENT_BUILD)) {
    app.use(express.static(CLIENT_BUILD, {
        maxAge: isProduction ? '7d' : 0,
        etag: true,
        // Do NOT set index:false — let express.static serve index.html for /
        // The SPA fallback below is only needed for deep links like /dashboard
    }));
    console.log(`✅ Static assets served from: ${CLIENT_BUILD}`);
}

// ── Health Check ──────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
        status:      'ok',
        environment: process.env.NODE_ENV || 'development',
        distExists:  fs.existsSync(CLIENT_BUILD),
        indexExists: fs.existsSync(CLIENT_INDEX),
        clientBuild: CLIENT_BUILD,
        timestamp:   new Date().toISOString(),
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

// ── SPA Fallback — for React Router deep links ────────────────
// Handles routes like /dashboard, /jobs, /profile that don't
// correspond to actual files. express.static handles /, /assets/*.
//
// Excluded:
//   /api/*    → handled by API routes above (or 404 handler below)
//   /assets/* → already served by express.static above
//   *.map     → source maps — return 404 not index.html
if (fs.existsSync(CLIENT_INDEX)) {
    app.use((req, res, next) => {
        const p = req.path;

        // Let these fall through to the API 404 handler
        if (p.startsWith('/api')) return next();

        // Static asset extensions — if express.static missed them, 404 them
        // (returning index.html for .js/.css causes a blank page)
        const staticExt = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map|json)$/i;
        if (staticExt.test(p)) return next();

        // All other paths → serve index.html for React Router
        res.sendFile(CLIENT_INDEX);
    });

    console.log('✅ SPA fallback active — React Router deep links will work');
} else {
    console.error('❌ index.html not found — SPA fallback not registered');
    console.error(`   Expected: ${CLIENT_INDEX}`);
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
    // Don't exit on rejection in production — log and continue
    // (prevents 502s from transient DB/network errors)
});
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
