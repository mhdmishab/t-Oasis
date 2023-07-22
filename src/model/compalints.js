
import mongoose from 'mongoose';

const complaintSchema=mongoose.Schema({
    booking_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"booking"
    },
    complaint:[{
        subject:{
            type:String
        },
        content:{
            type:String
        }
    }],
    date:{
        type:Date,
        default:new Date()
    }




})

export const Complaints=mongoose.model('complaint',complaintSchema);