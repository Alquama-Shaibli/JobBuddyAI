import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.warn(`Invalid token attempt from ${req.ip}`);
        return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
    }
};

export default verifyToken;