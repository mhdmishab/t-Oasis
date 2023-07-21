import express from "express";
import {login, resendOtp, signUp, verifyotp} from "../controllers/vendor/vendorAuth.js"
import { addLounge, blockUnblockLounge, editLounge, getLounge } from "../controllers/vendor/loungeController.js";
import uploadImage from "../middlewares/multer/config.js";
import { addFacility, blockUnblockFacility, editFacility, getFacilities } from "../controllers/vendor/facilityController.js";
import verification from "../middlewares/vendor/verification.js";
import { getBookings } from "../controllers/vendor/bookingController.js";



const vendor=express.Router();


vendor.post('/signup',signUp);
vendor.post('/verifyotp',verifyotp)
vendor.post('/login',login);
vendor.post('/resendotp',resendOtp);
vendor.post('/addlounge/:id',verification.verifyVendor,uploadImage,addLounge);
vendor.patch('/edit-lounge/:vendorid/:loungeid',verification.verifyVendor,uploadImage,editLounge);
vendor.get('/get-lounge/:id',verification.verifyVendor,getLounge);
vendor.patch('/block-unblock-lounge/:vendorid/:loungeid',verification.verifyVendor,blockUnblockLounge);
vendor.post('/addfacility/:vendorId',verification.verifyVendor,uploadImage,addFacility);
vendor.get('/get-facilities/:id',verification.verifyVendor,getFacilities);
vendor.patch('/edit-facility/:vendorid/:facilityid',verification.verifyVendor,uploadImage,editFacility)
vendor.get('/get-bookings/:id/:page',verification.verifyVendor,getBookings);
vendor.patch('/block-unblock-facility/:vendorid/:facilityid',verification.verifyVendor,blockUnblockFacility);




export default vendor;