
import mongoose from 'mongoose';

const bookingSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    vendor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vendor"
    },
    lounge_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"lounge"
    },
    facility_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"facility"
    },
    status:{
        type:String,
        enum:['booked','cancelled','completed'],
        default:"booked"
    },
    booked_date:{
        type:Date,
        required:true
    },
    booked_slots:[{
        type:String,
        required:true
    }],
    booked_id:{
        type:String,
        required:true
    },
    payment_id:{
        type:String,
        required:true
    },
    amount_paid:{
        type:Number,
        required:true
    },
    review_added:{
        type:Boolean,
        default:false
    },
    complaint_added:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:new Date()
    }




})

export const Bookings=mongoose.model('booking',bookingSchema);