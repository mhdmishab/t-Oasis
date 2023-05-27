import jwt from 'jsonwebtoken';
import dotenv  from "dotenv";
dotenv.config();

const secretKey=process.env.JWT_SECRET_KEY;

function auth(req,res,next){
    const token=req.header("x-auth-token");

    if(!token){
        res.status(400).send("Not authorized ..");
    }
try{
    const payload=jwt.verify(token,secretKey);
    req.user=payload;
    next();
}catch(error){
    res.status(400).send('Invalid token..')
}

}

export default auth;