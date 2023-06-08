import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';





export const verifyOtp=(otpData)=>{

    console.log(otpData)
    const {otp,otptoken}=otpData;
    console.log(otptoken);
    const tokenData=jwt.decode(otptoken);
    console.log(tokenData);


    const hashOtp=tokenData.OTP;

    const otpVerified=bcrypt.compareSync(otp,hashOtp);
    

    console.log(otpVerified);
    return otpVerified;

}






