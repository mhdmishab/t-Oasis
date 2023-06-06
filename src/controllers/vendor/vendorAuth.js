import joi from 'joi';
import jwt from "jsonwebtoken"
import {users} from "../../model/user.js";
import bcrypt from "bcrypt";
import { genSalt } from 'bcrypt';
import dotenv  from "dotenv";
import {mailOtpGenerator} from "../../helpers/otp/mailOtpGenerator.js"
import { verifyOtp } from '../../helpers/otp/verifyOtp.js';
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

if(error) {
    console.log("validation error")
  return res.status(400).json({
        success:false,
        message:error.details[0].message
    });

}



    let user= await users.findOne({email:req.body.email});
    if(user) {
       return  res.status(400).json({
        success:false,
        message:"user already exists"
       });
    }
    const {name,email,password}=req.body;

    
    user={name,email,password};

    const salt=await bcrypt.genSalt(10);
    user.password= await bcrypt.hash(user.password,salt);

    mailOtpGenerator(user).then((response=>{

        console.log(response+" iam in constrollers");
        res.json({
            token:response
        })
    }))

    

    // await user.save();

    // const token=jwt.sign({_id:user._id,name:user.name,email:user.email},secretKey);

    // res.send(token);

    


    }catch(error){
    return res.status(500).send(error.message);
    
}

};

const verifyotp=async(req,res)=>{
    const otpData=req.body;
    const {otp,otptoken}=otpData;
    console.log(otpData," in controllers")
    const otpVerified=verifyOtp(otpData);
    if(!otpVerified) return  res.status(400).json({
        success:false,
        message:"Otp verification failed"
       });


    const tokenData=jwt.decode(otptoken);
    console.log(tokenData);

    const user=new users({
        name:tokenData.name,
        email:tokenData.email,
        password:tokenData.password
    });

    await user.save();

    const token=jwt.sign({_id:user._id,name:user.name,email:user.email},secretKey);



    return res.json({
        success:true,
        token:token,
        message:"otp verification success"
    })

}

const login=async(req,res)=>{
   
        const Schema=joi.object({
       
        email:joi.string().min(3).max(200).email().required(),
        password:joi.string().min(6).max(100).required(),
       
    
    })
    const {error} = Schema.validate(req.body);
    if(error) {
        console.log("validation error")
      return res.status(400).json({
            success:false,
            message:error.details[0].message
        });
    
    }

    const {email,password}=req.body;

    let user= await users.findOne({email:email});
    if(!user) {
       return  res.status(400).json({
        success:false,
        message:"invalid email or password"
       });
    }

    let verified=bcrypt.compareSync(password,user.password);

    if(!verified){
        return  res.status(400).json({
            success:false,
            message:"invalid email or password"
           });
    }

    const token=jwt.sign({_id:user._id,name:user.name,email:user.email},secretKey);



    return res.json({
        success:true,
        token:token,
        message:"Login successfull"
    })

 
}





export {signUp,verifyotp,login};