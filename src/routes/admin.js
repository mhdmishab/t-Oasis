import express from "express";
import { login } from "../controllers/admin/adminAuth.js";
import { approveLounge, getLounge, rejectLounge } from "../controllers/admin/loungeControllers.js";
import { addnewFacility, getnewFacility, manageStatusFacility } from "../controllers/admin/manageFacility.js";


const admin=express.Router();


admin.post('/login',login);
admin.get('/get-lounge',getLounge);
admin.patch('/reject-lounge/:id',rejectLounge);
admin.patch('/approve-lounge/:id',approveLounge);
admin.post('/add-newfacility',addnewFacility);
admin.get('/get-newfacility',getnewFacility);
admin.patch('/facility-status/:id',manageStatusFacility);


export default admin;