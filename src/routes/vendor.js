import express from "express";
import {login, signUp, verifyotp} from "../controllers/vendor/vendorAuth.js"


const vendor=express.Router();


vendor.post('/signup',signUp);
vendor.post('/verifyotp',verifyotp)
vendor.post('/login',login);
// user.get('/',(req,res)=>{
//     res.send("home");
// })


export default vendor;