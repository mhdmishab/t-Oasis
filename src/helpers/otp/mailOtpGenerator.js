import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function generateOTP(length) {
  const min = Math.pow(10, length - 1); // Minimum value with given length
  const max = Math.pow(10, length) - 1; // Maximum value with given length
  return Math.floor(min + Math.random() * (max - min + 1));
}

export const mailOtpGenerator = async (data) => {
  try {
    console.log(data);

    const email = data.email;

    if (!email) {
      console.log("Email is not provided");
      return;
    }

    // Generate OTP
    const otp = generateOTP(6);
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 10);

    const salt = await bcrypt.genSalt(10);
    const otpEncrypt = await bcrypt.hash(otp.toString(), salt);

    data = { ...data, otpEncrypt };

    console.log(data);

    const otpSecretKey = process.env.OTP_SECRET_KEY;

    const otpToken = jwt.sign(
      { name: data.name, email: data.email, OTP: data.otpEncrypt,password:data.password },
      otpSecretKey
    );

    console.log(otpToken);

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'louisa.welch@ethereal.email',
        pass: 'KBp4YJQ41SSCdRqNNW'
      }
    });

    const mailOptions = {
      from: `"T-OASIS OFFICIAL" <${process.env.EMAIL_ADDRESS}>`,
      to: `${email}`,
      subject: 'OTP Verification',
      text: `Your OTP for verification is: ${otp}`
    };

    await transporter.verify();

    const response = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("sendmail error", err);
          reject(err);
        } else {
          console.log("Mail sent successfully", info);
          resolve(otpToken);
        }
      });
    });

    return response;
  } catch (err) {
    console.log("mailOtpGenerator error:", err.message);
  }
};


