import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const MAX_RETRIES    = 3;
const RETRY_DELAY_MS = 3000;

/* ── Validate required env vars ── */
const validateEnv = () => {
    const missing = [];
    if (!process.env.MONGO_URI)  missing.push('MONGO_URI');
    if (!process.env.DB_NAME)    missing.push('DB_NAME');
    if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');

    if (missing.length > 0) {
        // Use console.error so this is ALWAYS visible on Render/cloud hosts
        console.error(`[DB] ❌ MISSING env vars: ${missing.join(', ')}`);
        console.error('[DB]    → Set these in your Render dashboard → Environment Variables');
        // Throw instead of process.exit so the caller can catch and handle
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

/* ── Connect with retry ── */
const connectWithRetry = async (attempt = 1) => {
    console.log(`[DB] Connection attempt ${attempt}/${MAX_RETRIES}…`);

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName:                    process.env.DB_NAME,
            serverSelectionTimeoutMS:  10000,
            socketTimeoutMS:           45000,
            connectTimeoutMS:          10000,
            heartbeatFrequencyMS:      10000,
            maxPoolSize:               10,
            minPoolSize:               2,
            retryWrites:               true,
            retryReads:                true,
        });

        logger.info(`✅ MongoDB connected → ${mongoose.connection.host} / ${process.env.DB_NAME}`);

    } catch (error) {
        console.error(`[DB] Attempt ${attempt} failed: ${error.message}`);

        // Surface common Atlas issues
        if (error.message.includes('ENOTFOUND'))
            console.error('[DB]   → DNS failed. Verify MONGO_URI is a valid Atlas SRV string.');
        if (error.message.includes('Authentication failed'))
            console.error('[DB]   → Wrong username or password in MONGO_URI.');
        if (error.message.includes('IP') || error.message.includes('whitelist'))
            console.error('[DB]   → IP not whitelisted. Atlas → Network Access → add 0.0.0.0/0');
        if (error.message.includes('SSL') || error.message.includes('TLS'))
            console.error('[DB]   → TLS error. Ensure MONGO_URI uses mongodb+srv:// scheme.');

        if (attempt < MAX_RETRIES) {
            console.log(`[DB] Retrying in ${RETRY_DELAY_MS / 1000}s…`);
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
            return connectWithRetry(attempt + 1);
        }

        // Throw instead of process.exit — let server/index.js decide what to do
        throw new Error(`MongoDB connection failed after ${MAX_RETRIES} attempts: ${error.message}`);
    }
};

/* ── Main export ── */
const connectDb = async () => {
    validateEnv(); // throws if missing — caught by server/index.js

    const safeUri = process.env.MONGO_URI.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2');
    console.log(`[DB] URI: ${safeUri}`);
    console.log(`[DB] DB : ${process.env.DB_NAME}`);

    await connectWithRetry();

    mongoose.connection.on('disconnected', () => logger.warn('⚡ MongoDB disconnected — driver will reconnect'));
    mongoose.connection.on('error',        (e) => logger.error(`⚡ MongoDB error: ${e.message}`));
    mongoose.connection.on('reconnected',  () => logger.info('✅ MongoDB reconnected'));
};

export default connectDb;