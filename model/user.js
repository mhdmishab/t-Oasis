// const mongoose= require('mongoose');
import mongoose from 'mongoose';


const user= mongoose.Schema({

    name:{ type:String,required: true},
    Phone:{type:Number},
    isBlocked:{type:Boolean,default:false},
    date:{type:Date,default:new Date()}
});

export const users=mongoose.model('user',user);




