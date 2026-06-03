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
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Trust Proxy ───────────────────────────────────────────────
// MUST be set before rate-limiters.
// Fixes ERR_ERL_UNEXPECTED_X_FORWARDED_FOR on Render (sits behind a proxy).
app.set('trust proxy', 1);

// ── Path Resolution ───────────────────────────────────────────
// start:prod = 'node server/index.js' (run from repo root)
//   process.cwd() → /opt/render/project/src/
//   __dirname     → /opt/render/project/src/server/
// Both candidates resolve to the same location.
// We check both so Render logs reveal exactly where the build landed.
const BUILD_FROM_CWD = path.join(process.cwd(), 'client', 'dist');
const BUILD_FROM_DIR = path.join(__dirname, '..', 'client', 'dist');
const CLIENT_BUILD   = fs.existsSync(BUILD_FROM_CWD) ? BUILD_FROM_CWD : BUILD_FROM_DIR;
const CLIENT_INDEX   = path.join(CLIENT_BUILD, 'index.html');

// ── Startup Diagnostics (visible in Render logs) ──────────────
console.log('='.repeat(60));
console.log('JobBuddy AI — Server Starting');
console.log(`  NODE_ENV      : ${process.env.NODE_ENV || 'development'}`);
console.log(`  CWD           : ${process.cwd()}`);
console.log(`  __dirname     : ${__dirname}`);
console.log(`  BUILD_FROM_CWD: ${BUILD_FROM_CWD}  [${fs.existsSync(BUILD_FROM_CWD) ? 'FOUND ✅' : 'NOT FOUND ❌'}]`);
console.log(`  BUILD_FROM_DIR: ${BUILD_FROM_DIR}  [${fs.existsSync(BUILD_FROM_DIR) ? 'FOUND ✅' : 'NOT FOUND ❌'}]`);
console.log(`  CLIENT_BUILD  : ${CLIENT_BUILD}`);
console.log(`  dist exists   : ${fs.existsSync(CLIENT_BUILD)}`);
console.log(`  index.html    : ${fs.existsSync(CLIENT_INDEX)}`);
console.log('='.repeat(60));

// ── Security Headers ──────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS ──────────────────────────────────────────────────────
// In full-stack mode, frontend is served by the same Express server.
// Browser never sends cross-origin requests — CORS is for local dev only.
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
// trust proxy is set above so X-Forwarded-For is trusted correctly
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
// Always attempts to serve — no isProduction gate so it works in any env.
if (fs.existsSync(CLIENT_BUILD)) {
    // Static assets — 1-day cache in production
    app.use(express.static(CLIENT_BUILD, {
        maxAge: isProduction ? '1d' : 0,
        etag: true,
    }));

    // SPA fallback — app.use() is required in Express 5 (app.get('*') is unsupported)
    // Intercepts all non-API requests and returns index.html for React Router
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
    console.warn(`⚠️  client/dist NOT found at: ${CLIENT_BUILD}`);
    console.warn('   Build command must run "npm run build:full" before starting the server.');
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
