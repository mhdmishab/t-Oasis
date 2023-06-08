import express from "express";

import {signUp,login,verifyotp, resendOtp} from "../controllers/user/user.js"


const user=express.Router();


user.post('/signup',signUp);
user.post('/login',login);
user.post('/verifyotp',verifyotp);
user.post('/resendotp',resendOtp);

export default user;







