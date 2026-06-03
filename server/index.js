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

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import jobRoutes from './routes/job.routes.js';
import mockTestRoutes from './routes/mockTest.routes.js';
import resultRoutes from './routes/result.routes.js';
import chatRoutes from './routes/chat.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import quizRoutes from './routes/quiz.routes.js';

// ── Database ──────────────────────────────────────────────────
connectDb();

// ── Express App ───────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolved path to React build output
const CLIENT_BUILD = path.join(__dirname, '..', 'client', 'dist');
const CLIENT_INDEX = path.join(CLIENT_BUILD, 'index.html');

// ── Startup Diagnostics (visible in Render logs) ───────────────
console.log('='.repeat(60));
console.log('JobBuddy AI — Server Starting');
console.log(`  NODE_ENV    : ${process.env.NODE_ENV || 'development'}`);
console.log(`  CWD         : ${process.cwd()}`);
console.log(`  __dirname   : ${__dirname}`);
console.log(`  CLIENT_BUILD: ${CLIENT_BUILD}`);
console.log(`  dist exists : ${fs.existsSync(CLIENT_BUILD)}`);
console.log(`  index.html  : ${fs.existsSync(CLIENT_INDEX)}`);
console.log('='.repeat(60));

// ── Security Headers ──────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS ──────────────────────────────────────────────────────
// In full-stack mode (Option 2), the frontend is served by this
// same Express server — browser never sends a cross-origin request,
// so CORS is effectively not needed. We still configure it for:
//   1. Local dev (frontend on :5173, server on :8080)
//   2. Split deploy (Vercel frontend + Render backend)
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow same-origin requests (no Origin header) and preflight
        if (!origin) return callback(null, true);
        // Allow explicitly listed origins
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // In production full-stack mode, browser never sends cross-origin
        // requests — all traffic is same-origin. Reject everything else.
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
    message: { success: false, message: 'Too many authentication attempts. Please try again in 15 minutes.' },
    skipSuccessfulRequests: true,
});

app.use(globalLimiter);

// ── Body Parsing & Sanitization ───────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Prevent NoSQL injection — custom sanitizer for Express 5 compatibility
// (express-mongo-sanitize mutates req.query which is read-only in Express 5)
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
app.use((req, _res, next) => {
    if (req.body) sanitizeBody(req.body);
    next();
});

// Prevent XSS attacks — sanitize req.body string values (Express 5 compatible)
const escapeHtml = (str) => str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' })[c]);
const sanitizeXss = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
            obj[key] = escapeHtml(obj[key]);
        } else if (typeof obj[key] === 'object') {
            sanitizeXss(obj[key]);
        }
    }
};
app.use((req, _res, next) => {
    if (req.body) sanitizeXss(req.body);
    next();
});

// ── HTTP Request Logging ──────────────────────────────────────
if (!isProduction) {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: { write: (msg) => logger.info(msg.trim()) },
    }));
}

// ── Health Check ──────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
    });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/mock-test', mockTestRoutes);
app.use('/api/v1/result', resultRoutes);
app.use('/api/v1/ai', chatRoutes);
app.use('/api/v1/resume', resumeRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/v1/quiz', quizRoutes);

// ── Serve Built Frontend ──────────────────────────────────────
// Not gated by isProduction — serves from client/dist whenever it exists.
// On Render: Render's build step creates client/dist before start.
// In local dev without a build: logs a warning and skips gracefully.
if (fs.existsSync(CLIENT_BUILD)) {
    // Static assets (JS, CSS, images) — cached 1 day in prod
    app.use(express.static(CLIENT_BUILD, {
        maxAge: isProduction ? '1d' : 0,
        etag: true,
    }));

    // SPA fallback — app.use() works in Express 5 (app.get('*') does not)
    // Intercepts all non-API requests and returns index.html so React Router works
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(CLIENT_INDEX, (sendErr) => {
            if (sendErr) {
                console.error(`sendFile error: ${sendErr.message}`);
                res.status(500).json({ success: false, message: 'Failed to load frontend.' });
            }
        });
    });

    console.log(`✅ React frontend served from: ${CLIENT_BUILD}`);
} else {
    // Build hasn't run — warn clearly so Render logs show the root cause
    console.warn(`⚠️  client/dist NOT found at: ${CLIENT_BUILD}`);
    console.warn('   Render build command must run "npm run build:full" before start.');
}

// ── 404 Handler (API-only catch-all) ─────────────────────────
// Only reached by /api/* routes that matched no handler above
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ── Unhandled Rejections & Exceptions ─────────────────────────
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
    logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
