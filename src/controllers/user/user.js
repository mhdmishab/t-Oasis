import joi from 'joi';
import jwt from "jsonwebtoken"
import { Users } from "../../model/user.js";
import bcrypt from "bcrypt";
import { genSalt } from 'bcrypt';
import dotenv from "dotenv";
import { mailOtpGenerator } from "../../helpers/otp/mailOtpGenerator.js"
import { verifyOtp } from '../../helpers/otp/verifyOtp.js';
import { Bookings } from '../../model/bookings.js';
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;


const signUp = async (req, res) => {

    try {
        const Schema = joi.object({
            name: joi.string().min(3).max(30).required(),
            email: joi.string().min(3).max(200).email().required(),
            password: joi.string().min(6).max(100).required(),


        })
        const { error } = Schema.validate(req.body);

        if (error) {
            console.log("validation error")

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });

        }



        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "user already exists"
            });
        }
        const { name, email, password } = req.body;


        user = { name, email, password };

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        mailOtpGenerator(user).then((response => {

            res.json({
                token: response
            })
        }))
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });


    }

};

const verifyotp = async (req, res) => {
    const otpData = req.body;
    const { otp, otptoken } = otpData;
    console.log(otpData, " in user controllers")
    const otpVerified = verifyOtp(otpData);
    if (!otpVerified) return res.status(400).json({
        success: false,
        message: "Otp verification failed"
    });

    const tokenData = jwt.decode(otptoken);


    const user = new Users({
        name: tokenData.name,
        email: tokenData.email,
        password: tokenData.password
    });

    await user.save();

    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, secretKey);



    return res.json({
        _id: user._id,
        success: true,
        token: token,
        message: "otp verification success"
    })

}

const login = async (req, res) => {

    console.log("inside user login")
    const Schema = joi.object({
        email: joi.string().min(3).max(200).email().required(),
        password: joi.string().min(6).max(100).required(),


    })
    const { error } = Schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });

    }
    try {
        let user = await Users.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid  email or password"
            });
        }
        const password = req.body.password;
        const validPassword = bcrypt.compareSync(password, user.password);
        console.log(validPassword + "here password")

        if (!validPassword) return res.status(400).json({
            success: false,
            message: "Invalid  email or password"
        });

        const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, secretKey);

        return res.json({
            _id:user._id,
            success: true,
            token: token,
            message: "login success"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        console.log(error.message);
    }



}

const resendOtp = async (req, res) => {

    try {

        const { otptoken } = req.body;
        console.log("hello resend")
        console.log(otptoken);
        const data = jwt.decode(otptoken);
        console.log(data);
        const { name, email, password } = data;
        const user = { name, email, password };
        console.log(user);
        mailOtpGenerator(user).then((response => {

            res.json({
                token: response,
                message: "OTP Resend successfully"

            })
        }))
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        console.log(error.message);
    }



}

const getProfile=async(req,res)=>{
    try{
        console.log("inside user");

        const userId=req.params.id;
        const user=await Users.find({ _id: userId, isBlocked: false },{ password: 0, isBlocked: 0 });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid authority"
            });
        }
        const bookings=await Bookings.find({user_id:userId}).populate("user_id","email").populate("lounge_id","loungeName loungeDistrict")
        .populate("facility_id","facilityName").sort({ date: -1 }).exec();

        console.log(bookings)
        console.log(user);
        res.status(200).json({
            user:user,
            bookings:bookings,
            success:true
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
        console.log(error.message);
    }
}

const uploadImageUser=async(req,res)=>{
    try{
        console.log(req.file);
        console.log(req.params.id, "userid is here");
        const userId = req.params.id;
        const { path, filename } = req.file;

        let user = await Users.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid authority"
        });
    }

    await Users.updateOne({_id:userId},{$set:{
        image: {
            public_id: filename,
            url: path,
        }
    }})

    res.status(200).json({ message: 'Image updated successfully' });

    


    }catch(error){

        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating Image' });
    }
}

const cancelBooking=async(req,res)=>{
    try{
        
        console.log(req.params.userId, "userid is here");
        const userId = req.params.userId;
        const bookId = req.params.bookId;
       

        let user = await Users.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid authority"
        });
    }

    await Bookings.updateOne({_id:bookId},{$set:{
        status:"cancelled"
    }})

    

    res.status(200).json({ message: 'booking cancelled successfully' });

    


    }catch(error){

        console.error(error);
        res.status(500).json({ message: 'An error occurred while cancellation' });
    }
}

export { signUp, login, verifyotp, resendOtp,getProfile,uploadImageUser,cancelBooking };