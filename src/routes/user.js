import express from "express";
import auth from "../middlewares/auth.js";
import {signUp,login,verifyotp} from "../controllers/user.js"


const user=express.Router();


user.post('/signup',signUp);
user.post('/login',login);
user.get('/',(req,res)=>{
    res.send("home");
})
user.post('/verifyotp',verifyotp);

export default user;







