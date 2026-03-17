import jwt from 'jsonwebtoken'

const verifyToken = async(req, res, next)=>{
    const token = req.cookies.access_token;

    if(!token){
        return next({statusCode: 401, message:'Token not found. Please login'})
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded //attach user to request
        next()
    } catch (error) {
        next(error)
    }
}

export default verifyToken;