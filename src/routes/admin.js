import express from "express";
import { login } from "../controllers/admin/adminAuth.js";
import { getLounge } from "../controllers/admin/loungeControllers.js";
import { approveLounge, rejectLounge } from "../controllers/vendor/loungeController.js";


const admin=express.Router();


admin.post('/login',login);
admin.get('/get-lounge',getLounge);
admin.patch('/reject-lounge/:id',rejectLounge);
admin.patch('/approve-lounge/:id',approveLounge);


export default admin;