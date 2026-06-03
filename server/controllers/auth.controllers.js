import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import logger from "../utils/logger.js";

export const registerUser = async (req, res, next) => {
    // Zod validation
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }

    const { username, email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    try {
        const existingUser = await User.findOne({ email: normalizedEmail }).lean();
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);

        // SECURITY: isAdmin is always forced to false — never from request body
        const newUser = await User.create({
            username: username.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            isAdmin: false,
        });

        logger.info(`New user registered: ${normalizedEmail}`);

        res.status(201).json({
            success: true,
            message: `Account created successfully for ${username}`
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }

    const { email, password } = parsed.data;

    try {
        const validUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (!validUser) {
            logger.warn(`Failed login attempt for: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            logger.warn(`Invalid password attempt for: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _pass, ...rest } = validUser._doc;

        const isProd = process.env.NODE_ENV === 'production';

        res.status(200)
            .cookie('access_token', token, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .json({ success: true, user: rest });

        logger.info(`User logged in: ${email}`);
    } catch (error) {
        next(error);
    }
};

export const logoutUser = async (req, res) => {
    res.clearCookie('access_token').json({ success: true, message: 'Logged out successfully' });
};