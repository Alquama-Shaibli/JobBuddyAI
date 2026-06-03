import User from "../models/user.model.js";

/**
 * Middleware that blocks access to protected features until the user
 * has completed the onboarding wizard (isOnboarded === true).
 * Must be used AFTER verifyToken so that req.user.id is available.
 */
const requireOnboarded = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('isOnboarded');
        if (!user) {
            return next({ statusCode: 404, message: 'User not found' });
        }
        if (!user.isOnboarded) {
            return res.status(403).json({
                success: false,
                message: 'Onboarding required',
                code: 'ONBOARDING_REQUIRED'
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};

export default requireOnboarded;
