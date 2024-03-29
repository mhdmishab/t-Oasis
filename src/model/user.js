
import mongoose from 'mongoose';


const userSchema= mongoose.Schema({

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

    image:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        }
    },

    date:{
        type:Date,
        default:new Date()
    }
});

export const Users=mongoose.model('user',userSchema);




