import express from "express";
import {login, resendOtp, signUp, verifyotp} from "../controllers/vendor/vendorAuth.js"
import { addLounge } from "../controllers/vendor/loungeController.js";
import uploadImage from "../middlewares/multer/config.js";



const vendor=express.Router();


vendor.post('/signup',signUp);
vendor.post('/verifyotp',verifyotp)
vendor.post('/login',login);
vendor.post('/resendotp',resendOtp);
vendor.post('/addlounge/:id',uploadImage,addLounge);



export default vendor;