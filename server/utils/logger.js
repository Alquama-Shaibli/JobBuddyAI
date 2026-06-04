import winston from 'winston';
import path    from 'path';
import { fileURLToPath } from 'url';
import fs      from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir   = path.join(__dirname, '..', 'logs');

// Ensure logs directory exists (non-fatal if it fails)
try {
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
} catch { /* logs dir optional — console transport is always active */ }

const { combine, timestamp, printf, colorize, errors } = winston.format;

const plainFmt = printf(({ level, message, timestamp, stack }) =>
    `${timestamp} [${level}]: ${stack || message}`);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), plainFmt),
    transports: [
        // ─── Console transport is ALWAYS active ──────────────────
        // On Render (and any cloud host), stdout/stderr is the only
        // visible log stream. File-only logging causes a silent crash
        // from Render's perspective (exit 1, no diagnostic output).
        new winston.transports.Console({
            format: combine(
                colorize({ all: false }),
                timestamp({ format: 'HH:mm:ss' }),
                errors({ stack: true }),
                plainFmt
            ),
        }),
    ],
});

// File transports added only when the logs dir is writable
try {
    fs.accessSync(logsDir, fs.constants.W_OK);
    logger.add(new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5,
    }));
    logger.add(new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        maxsize: 10 * 1024 * 1024,
        maxFiles: 5,
    }));
} catch {
    // Disk not writable — console-only mode, which is fine for Render
}

export default logger;
