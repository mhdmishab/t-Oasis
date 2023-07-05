
import mongoose from 'mongoose';

const bookingSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        Ref:"user"
    },
    vendor_id:{
        type:mongoose.Schema.Types.ObjectId,
        Ref:"vendor"
    },
    facility_id:{
        type:mongoose.Schema.Types.ObjectId,
        Ref:"facility"
    },
    status:{
        type:String,
        default:"pending"
    },
    booked_date:{
        type:Date,
        required:true
    },
    booked_slots:[{
        type:String,
        required:true
    }],
    date:{
        type:Date,
        default:new Date()
    }




})

export const Bookings=mongoose.model('booking',bookingSchema);