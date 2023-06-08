
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;


const login = (req, res) => {

    const { email, password } = req.body;

    try {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            console.log("inside success")
            const token = jwt.sign({name: "Admin", email: email }, secretKey);
            return res.json({
                success: true,
                token: token,
                message: "Admin login success"
            })

        }else{
            return res.json({
                success:false,
                message:"Admin login failed"
            })
        }
    } catch (error) {
        return res.json({
            success:false,
            message:"Admin login failed"
        })

    }
}


export {login};