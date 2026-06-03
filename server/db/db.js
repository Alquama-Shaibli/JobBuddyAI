import mongoose from 'mongoose';
import logger from '../utils/logger.js';

/* ── Max retry attempts before hard exit ── */
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

/* ── Validate required env vars at startup ── */
const validateEnv = () => {
    const missing = [];
    if (!process.env.MONGO_URI)  missing.push('MONGO_URI');
    if (!process.env.DB_NAME)    missing.push('DB_NAME');
    if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');

    if (missing.length > 0) {
        logger.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
        logger.error('Set these in your Render dashboard under Environment → Environment Variables');
        process.exit(1);
    }
};

/* ── Connect with retry logic ── */
const connectWithRetry = async (attempt = 1) => {
    logger.info(`🔌 MongoDB connection attempt ${attempt}/${MAX_RETRIES}...`);
    logger.info(`📡 Host: ${process.env.MONGO_URI?.split('@')[1]?.split('/')[0] || 'unknown'}`);
    logger.info(`🗄  Database: ${process.env.DB_NAME}`);

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Pass DB name as option — avoids URL mutation bugs with Atlas SRV strings
            dbName: process.env.DB_NAME,

            // Atlas-optimised timeouts
            serverSelectionTimeoutMS: 10000,   // Give up selecting a server after 10s
            socketTimeoutMS:          45000,   // Close idle sockets after 45s
            connectTimeoutMS:         10000,   // TCP connect timeout
            heartbeatFrequencyMS:     10000,   // How often driver checks server health

            // Connection pool
            maxPoolSize: 10,
            minPoolSize: 2,

            // Retry on initial connection
            retryWrites: true,
            retryReads:  true,
        });

        const host = mongoose.connection.host;
        logger.info(`✅ MongoDB connected → ${host} / ${process.env.DB_NAME}`);

    } catch (error) {
        logger.error(`❌ MongoDB connection attempt ${attempt} failed: ${error.message}`);

        // Diagnose common Atlas issues
        if (error.message.includes('ENOTFOUND')) {
            logger.error('   → DNS resolution failed. Check that MONGO_URI is a valid Atlas SRV string.');
        }
        if (error.message.includes('Authentication failed')) {
            logger.error('   → Wrong username or password in MONGO_URI.');
        }
        if (error.message.includes('IP')) {
            logger.error('   → IP not whitelisted. In Atlas → Network Access → add 0.0.0.0/0');
        }
        if (error.message.includes('SSL') || error.message.includes('TLS')) {
            logger.error('   → TLS/SSL error. Ensure MONGO_URI uses mongodb+srv:// scheme.');
        }

        if (attempt < MAX_RETRIES) {
            logger.warn(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
            return connectWithRetry(attempt + 1);
        }

        logger.error(`💀 MongoDB connection failed after ${MAX_RETRIES} attempts. Exiting.`);
        process.exit(1);
    }
};

/* ── Main export ── */
const connectDb = async () => {
    validateEnv();

    // Mask credentials before logging URI
    const safeUri = process.env.MONGO_URI.replace(/:\/\/[^@]+@/, '://***:***@');
    logger.info(`🍃 MONGO_URI detected: ${safeUri}`);
    logger.info('🔄 Attempting MongoDB Atlas connection...');

    await connectWithRetry();

    // Handle post-connect events
    mongoose.connection.on('disconnected', () => {
        logger.warn('⚡ MongoDB disconnected. Driver will auto-reconnect.');
    });

    mongoose.connection.on('error', (err) => {
        logger.error(`⚡ MongoDB runtime error: ${err.message}`);
    });

    mongoose.connection.on('reconnected', () => {
        logger.info('✅ MongoDB reconnected successfully.');
    });
};

export default connectDb;