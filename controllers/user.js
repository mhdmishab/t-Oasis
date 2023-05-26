import {users} from "../model/user.js";


const userSignup=async(req,res)=>{
    const {name,Phone,isBlocked,date} =req.body;


    let Users=new users({
        name,
        Phone,
        isBlocked,
        date
    });
    
    try{
        Users=await Users.save();
        res.send(Users);
    }catch(err){
        res.status(500).send(err.message);
        console.log(err.message);
    }

};

export {userSignup};