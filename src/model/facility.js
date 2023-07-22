
import mongoose from 'mongoose';

const facilitySchema= mongoose.Schema({

    vendor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vendor"
    },
  
    facilityName:{
        type:String,
        required:true
    },
    facilityToken:{
        type:Number,
        required:true
    },
    facilityPrice:{
        type:Number,
        required:true
    },
    facilityDescription:{
        type:String,
        required:true
    },
    facilityImage:{

            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }

        
    },
    reviews:[{
        rating:{
            type:Number
        },
        review_text:{
            type:String
        }
    }],
    isBlocked:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:new Date()
    }
})

export const Facilities=mongoose.model('facility',facilitySchema);
