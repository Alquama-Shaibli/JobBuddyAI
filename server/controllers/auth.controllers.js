import User from "../models/User.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) =>{
    const { username, email, password, skills, experience, preferredRole, location, resume } = req.body;

    // validation
    if(!username || !password || !email || username =='' || password =='' || email ==''){
        return next({statusCode:400, message:'please provide all required fields'})
    }

    // is user already existed
    const user = await User.findOne({ email });
    if(user){
        return next({statusCode: 400, message: 'Email already existed'}) // if it is not return then then code will proceed further 
    }

    try {
        // hash password
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        // new user created
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            skills,
            experience,
            preferredRole,
            location,
            resume
        });

        // save user
        await newUser.save();

        res.status(201).json({
            message: `Account created Successfully for ${username}`,
            success: true
        })
    } catch (error) {
        next(error)
    }
};

export const loginUser = async(req, res, next)=> {
    const { email, password } = req.body;

    // validation
    if(!email || !password || email=='' || password==''){
        return next({statusCode: 400, message:'please provide all required fields'})
    };

    try {
        const validUser = await User.findOne({ email });
        if(!validUser){
            return next({ statusCode: 404, message: 'user not found' });
        };
        
        // valid password
        const validPassword = await bcryptjs.compare(password, validUser.password);
        if(!validPassword){
            return next({statusCode: 401, message:'Invalid password or email'});
        };

        // generate token
        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin}, process.env.SECRET)

        // sanitized user data and remove password using destructure
        const { password: pass, ...rest} = validUser._doc;

        // sending rest data and saving cookie in frontend
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(({
            success: true,
            user: rest
        }))
        
    } catch (error) {
        next(error)
    }
};