import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyUser=(req,res,next)=>{
    
    const token = req.headers.authorization;
    console.log(token);

    if(!token){
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }

    try {
        console.log("inside try")
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);
       
        if(decoded){
        next();
    }
      
    } catch (error) {
      next(error)
    }
}

export default {verifyUser}