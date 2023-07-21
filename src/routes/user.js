import express from "express";

import {signUp,login,verifyotp, resendOtp, getProfile,uploadImageUser, cancelBooking} from "../controllers/user/user.js"
import { getAllLounges } from "../controllers/user/loungeControllers.js";
import { bookFacility, bookingPayment, getAllFacilities, getAvailableSlots, paymentVerify} from "../controllers/user/facilityControllers.js";
import Verification from "../middlewares/user/Verification.js";
import uploadImage from "../middlewares/multer/config.js";


const user=express.Router();


user.post('/signup',signUp);
user.post('/login',login);
user.post('/verifyotp',verifyotp);
user.post('/resendotp',resendOtp);
user.get('/get-lounges',getAllLounges);
user.get('/get-facilities/:id',getAllFacilities);
user.post('/book-facility/:userId/:vendorId/:loungeId/:facilityId',Verification.verifyUser,bookFacility);
user.post('/booking-payment/:facilityId',Verification.verifyUser,bookingPayment);
user.patch('/upload-image/:id',Verification.verifyUser,uploadImage,uploadImageUser);
user.get('/user-profile/:id',Verification.verifyUser,getProfile);
user.patch('/cancel-booking/:userId/:bookId',Verification.verifyUser,cancelBooking);
user.post('/verify-payment',Verification.verifyUser,paymentVerify);
user.get('/get-slots/:date/:vendorId/:facilityId',getAvailableSlots);


export default user;







