import express from "express";
import { login } from "../controllers/admin/adminAuth.js";


const admin=express.Router();


admin.post('/login',login);


export default admin;