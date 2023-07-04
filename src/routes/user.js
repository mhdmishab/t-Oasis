import express from "express";

import {signUp,login,verifyotp, resendOtp} from "../controllers/user/user.js"
import { getAllLounges } from "../controllers/user/loungeControllers.js";
import { bookFacility, getAllFacilities, getAvailableSlots} from "../controllers/user/facilityControllers.js";


const user=express.Router();


user.post('/signup',signUp);
user.post('/login',login);
user.post('/verifyotp',verifyotp);
user.post('/resendotp',resendOtp);
user.get('/get-lounges',getAllLounges);
user.get('/get-facilities/:id',getAllFacilities);
user.post('/book-facility/:userId/:loungeId/:facilityId',bookFacility);
user.get('/get-slots/:date/:loungeId/:facilityId',getAvailableSlots);

export default user;







