import mongoose from 'mongoose'

const facilitytypesSchema=mongoose.Schema({
    facilitytypeName:{
            type:String,
            required:true
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

export const Facilitytypes=mongoose.model('facilitytypes',facilitytypesSchema)

