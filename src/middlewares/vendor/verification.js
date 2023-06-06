import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyVendor=(req,res,next)=>{
    const data=JSON.parse(req.header.authorization);
    const{token} = data

    if(!token){
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(decoded){
        next();
    }
      
    } catch (error) {
      next(error)
    }
}

export default {verifyVendor}