import express from "express";
import {login, resendOtp, signUp, verifyotp} from "../controllers/vendor/vendorAuth.js"
import { addLounge, getLounge } from "../controllers/vendor/loungeController.js";
import uploadImage from "../middlewares/multer/config.js";
import { addFacility, getFacilities } from "../controllers/vendor/facilityController.js";



const vendor=express.Router();


vendor.post('/signup',signUp);
vendor.post('/verifyotp',verifyotp)
vendor.post('/login',login);
vendor.post('/resendotp',resendOtp);
vendor.post('/addlounge/:id',uploadImage,addLounge);
vendor.get('/get-lounge/:id',getLounge);
vendor.post('/addfacility/:loungeId/:vendorId',uploadImage,addFacility);
vendor.get('/get-facilities/:id',getFacilities);




export default vendor;