import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// On Render (NODE_ENV=production), env vars are injected directly by the platform.
// We still call dotenv.config() so local dev works — it silently no-ops if .env is missing.
const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });

if (result.error && process.env.NODE_ENV !== 'production') {
    // Only warn in development — missing .env on Render is expected/correct
    console.warn('[env] .env file not found — relying on platform-injected environment variables');
}