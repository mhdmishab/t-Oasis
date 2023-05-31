import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';





export const verifyOtp=(otpData)=>{

    console.log(otpData)
    const {otp,otpToken}=otpData;

    const tokenData=jwt.decode(otpToken);
    console.log(tokenData);

    const user={
        name:tokenData.name,
        email:tokenData.email,
        password:tokenData.password
    }

    const hashOtp=tokenData.OTP;

    console.log(hashOtp);
    console.log(otp);

    const otpVerified=bcrypt.compareSync(otp,hashOtp);
    

    console.log(otpVerified);
    return otpVerified;

}

