import express from "express";
import {login, resendOtp, signUp, verifyotp} from "../controllers/vendor/vendorAuth.js"


const vendor=express.Router();


vendor.post('/signup',signUp);
vendor.post('/verifyotp',verifyotp)
vendor.post('/login',login);
vendor.post('/resendotp',resendOtp);



export default vendor;