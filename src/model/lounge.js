
import mongoose from 'mongoose';


const loungeSchema=mongoose.Schema({

    vendor_id:{
        type:mongoose.Schema.Types.ObjectId,
        Ref:"vendor"
    },

    loungeName:{
        type:String,
        required:true
    },

    loungeDistrict:{
        type:String,
        required:true
        
    },
    loungeState:{
        type:String,
        required:true
        
    },
    loungeDescription:{
        type:String,
        required:true
        
    },
   
    loungeLat:{
        type:Number,
        required:true
       },
    loungeLng:{
        type:Number,
        required:true
       },
       
    loungeLocation:{
        type:String,
        required:true
            
    },
    loungeImages:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }

        }
    ],
    isBlocked:{
        type:Boolean,
        default:false,
        
    },
    isApproved:{
        type:String,
        default:'pending'
        
    },
    date:{
        type:Date,
        default:new Date()
    }
})

export const Lounges = mongoose.model('lounge',loungeSchema);