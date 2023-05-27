import express from "express";
import auth from "../middlewares/auth.js";
import {signUp,login} from "../controllers/user.js"


const user=express.Router();


user.post('/signup',signUp);
user.post('/login',login);
user.get('/',auth,(req,res)=>{
    res.send("home");
})

export default user;







