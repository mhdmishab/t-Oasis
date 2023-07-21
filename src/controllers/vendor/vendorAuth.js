import joi from 'joi';
import jwt from "jsonwebtoken"
import { Vendors } from "../../model/vendor.js";
import bcrypt from "bcrypt";
import { genSalt } from 'bcrypt';
import dotenv from "dotenv";
import { mailOtpGenerator } from "../../helpers/otp/mailOtpGenerator.js"
import { verifyOtp } from '../../helpers/otp/verifyOtp.js';
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

    

        let vendor = await Vendors.findOne({ email: req.body.email });
        if (vendor) {
            return res.status(400).json({
                success: false,
                message: "vendor already exists"
            });
        }
        const { name, email, password } = req.body;


        vendor = { name, email, password };

        const salt = await bcrypt.genSalt(10);
        vendor.password = await bcrypt.hash(vendor.password, salt);

        mailOtpGenerator(vendor).then((response => {

            console.log(response + " iam in constrollers");
            res.json({
                success:true,
                token: response
            })
        }))



    } catch (error) {
        return res.status(500).send(error.message);

    }

};

const verifyotp = async (req, res) => {
    const otpData = req.body;
    const { otp, otptoken } = otpData;
    console.log(otpData, " in controllers")
    const otpVerified = verifyOtp(otpData);
    if (!otpVerified) return res.status(400).json({
        success: false,
        message: "Otp verification failed"
    });


    const tokenData = jwt.decode(otptoken);
    console.log(tokenData);

    const vendor = new Vendors({
        name: tokenData.name,
        email: tokenData.email,
        password: tokenData.password
    });

    await vendor.save();

    const token = jwt.sign({  name: vendor.name, email: vendor.email }, secretKey);



    return res.json({
        _id: vendor._id,
        success: true,
        token: token,
        message: "Login successfull"
    })

}

const login = async (req, res) => {
    console.log("inside vender login")

    const Schema = joi.object({

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

    const { email, password } = req.body;

    let vendor = await Vendors.findOne({ email: email });
    if (!vendor) {
        console.log("invalid mail vendor");
        return res.status(400).json({
            
            success: false,
            message: "invalid vendor email or password"
        });
    }

    let verified = bcrypt.compareSync(password, vendor.password);

    if (!verified) {
        console.log("invalid password vendor");
        return res.status(400).json({
            success: false,
            message: "invalid vendor email or password"
        });
    }

    const token = jwt.sign({  name: vendor.name, email: vendor.email }, secretKey);



    return res.json({
        _id: vendor._id,
        success: true,
        token: token,
        message: "Login successfull"
    })


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





export { signUp, verifyotp, login, resendOtp };