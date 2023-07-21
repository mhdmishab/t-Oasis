import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyUser=(req,res,next)=>{

    const token = req.headers.authorization;

    if(!token){
        console.log("user header authorization")
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }

    try {

        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);
       
        if(decoded){
        next();
    }
      
    } catch (error) {
    //   next(error)
    return res.status(500).json({
        message:"Inavlid Request",
        success:false
    })
    }
}

export default {verifyUser}