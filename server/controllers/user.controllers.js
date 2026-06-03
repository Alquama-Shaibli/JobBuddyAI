import User from "../models/user.model.js";
import { profileUpdateSchema, onboardingSchema } from "../validators/auth.validators.js";

export const profileUpdate = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return res.status(403).json({ success: false, message: 'You are not authorized to edit this profile' });
    }

    const parsed = profileUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }

    const { skills, experience, preferredRole, location, education, phone, bio, github, portfolio } = parsed.data;

    const updateData = {};
    if (Array.isArray(skills) && skills.length > 0) updateData.skills = skills;
    if (experience !== undefined && experience >= 0) updateData.experience = experience;
    if (preferredRole?.trim()) updateData.preferredRole = preferredRole.trim();
    if (education?.trim()) updateData.education = education.trim();
    if (bio?.trim()) updateData.bio = bio.trim();
    if (github !== undefined) updateData.github = github;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (phone?.trim()) updateData.phone = phone.trim();
    if (location?.trim()) updateData.location = location.trim();

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password').lean();
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const completeOnboarding = async (req, res, next) => {
    const parsed = onboardingSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }

    const { targetRole, skills, languages } = parsed.data;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    preferredRole: targetRole.trim(),
                    skills: skills.map(s => s.trim()).filter(Boolean),
                    languages: languages.map(l => l.trim()).filter(Boolean),
                    isOnboarded: true
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Onboarding complete! Welcome to JobBuddy AI.',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};