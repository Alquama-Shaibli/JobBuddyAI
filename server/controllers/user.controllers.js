import User from "../models/User.model.js";

export const profileUpdate = async(req,res,next)=>{
    const { skills, experience, preferredRole, location } = req.body;

    // validation
    if(req.user.id !== req.params.userId){
        next({statusCode: 403, message: 'You are not authorized to edit this profile'})
    }

    const updateData = {};
    if(skills && skills.length >0) updateData.skills = skills;

    if(experience !== undefined && experience >= 0) updateData.experience = experience;

    if(preferredRole !== undefined && preferredRole.trim() !=='') updateData.preferredRole = preferredRole;
    
    if(location !== undefined && location.trim() !== '') updateData.location = location;

    try {
        const user = await User.findByIdAndUpdate(req.user.id,
            {
                $set: updateData
            },
            // {new : true }  //oldre version to get updated document after updated data ( will depereciated soon it is still valid with small warnings)
            {returnDocument: "after"} //newer version to get updated document after updated data
        )

        res.status(201).json({
            success: true,
            message: 'profile updated successfully',
            user
        })
    } catch (error) {
        next(error)
    }
};