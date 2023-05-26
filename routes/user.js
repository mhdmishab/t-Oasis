import express from "express";
import {userSignup} from "../controllers/user.js"


const user=express.Router();

user.post('/',userSignup);

export default user;







