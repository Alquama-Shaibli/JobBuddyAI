import User from "../models/user.model.js";

export const profileUpdate = async(req,res,next)=>{
    const { skills, experience, preferredRole, location, education, phone, bio, github, portfolio } = req.body;

    // validation
    if(req.user.id !== req.params.userId){
        return next({statusCode: 403, message: 'You are not authorized to edit this profile'})
    }

    const updateData = {};
    if (Array.isArray(skills) && skills.length > 0) {
        updateData.skills = skills;
    }

    if(experience !== undefined && experience >= 0) updateData.experience = experience;

    if(preferredRole !== undefined && preferredRole.trim() !=='') updateData.preferredRole = preferredRole;

    if(education !== undefined && education.trim() !=='') updateData.education = education;
    if(bio !== undefined && bio.trim() !=='') updateData.bio = bio;
    if(github !== undefined && github.trim() !=='') updateData.github = github;
    if(portfolio !== undefined && portfolio.trim() !=='') updateData.portfolio = portfolio;
    if(phone !== undefined && phone.trim() !=='') updateData.phone = phone;
    
    if (location !== undefined && typeof location === "string" && location.trim() !== '') {
        updateData.location = location;
    }

    try {
        const user = await User.findByIdAndUpdate(req.user.id,
            {
                $set: updateData
            },
            // {new : true }  //oldre version to get updated document after updated data ( will depereciated soon it is still valid with small warnings)
            {returnDocument: "after"} //newer version to get updated document after updated data
        )

        // if user get missing in db and get deleted by admin when user is logged in so check
        if (!user) {
            return next({
                statusCode: 404,
                message: "User not found"
            });
        }

        // remove username, email, password 
        const { password: pass, ...rest } = user._doc

        res.status(200).json({
            success: true,
            message: 'profile updated successfully',
            user: rest
        })
    } catch (error) {
        next(error)
    }
};

export const getProfile = async (req, res, next) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if(!user) {
            return next({
                statusCode: 404,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        next(error);
    }
};