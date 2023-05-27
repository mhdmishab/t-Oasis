// const mongoose= require('mongoose');
import mongoose from 'mongoose';


const user= mongoose.Schema({

    name:{
        type:String,
        minlength:3,
        maxlength:30,
        required:true
    },

    email:{
        type:String,
        minlength:3,
        maxlength:200,
        required: true,
        unique:true
    },
    password:{
        type:String,
        minlength:3,
        maxlength:1024,
        required: true,
    },
    phone:{
        type:Number
    },

    isBlocked:{
        type:Boolean,
        default:false
    },

    date:{
        type:Date,
        default:new Date()
    }
});

export const users=mongoose.model('user',user);




