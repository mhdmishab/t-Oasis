import joi from 'joi';
import jwt from "jsonwebtoken"
import {users} from "../model/user.js";
import bcrypt from "bcrypt";
import { genSalt } from 'bcrypt';
import dotenv  from "dotenv";
dotenv.config();

const secretKey=process.env.JWT_SECRET_KEY;


const signUp=async(req,res)=>{
 
    try{   
    const Schema=joi.object({
    name:joi.string().min(3).max(30).required(),
    email:joi.string().min(3).max(200).email().required(),
    password:joi.string().min(6).max(100).required(),
   

})
const {error} = Schema.validate(req.body);

if(error) return res.status(400).send(error.details[0].message);
     



    let user= await users.findOne({email:req.body.email});
    if(user) {
        res.status(400).send("user already exists");
    }
    const {name,email,password}=req.body;

    user=new users({
        name,email,password
    });

    const salt=await bcrypt.genSalt(10);
    user.password= await bcrypt.hash(user.password,salt);

    await user.save();

    const token=jwt.sign({_id:user._id,name:user.name,email:user.email},secretKey);

    res.send(token);

    


    }catch(error){
    res.status(500).send(error.message);
    console.log(error.message);
}

};

const login=async(req,res)=>{
    const Schema=joi.object({
        email:joi.string().min(3).max(200).email().required(),
        password:joi.string().min(6).max(100).required(),
       
    
    })
    const {error} = Schema.validate(req.body);
    
    if(error) {
         res.status(400).send(error.details[0].message)
    }
  try{
    let user= await users.findOne({email:req.body.email});

    if(!user){
        res.status(400).send("Invalid email or password");
    }
    const password=req.body.password;
    const validPassword=bcrypt.compare(password,user.password);

    if(!validPassword) return  res.status(400).send("Invalid email or password");;

    const token=jwt.sign({_id:user._id,name:user.name,email:user.email},secretKey);

    res.send(token)


}catch(error){
    res.status(500).send(error.message);
    console.log(error.message);
}



}

export {signUp,login};