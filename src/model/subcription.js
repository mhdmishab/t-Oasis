import mongoose from 'mongoose';

const subcriptionSchema= mongoose.Schema({

    vendor_id:{
        type:mongoose.Schema.Types.ObjectId,
        Ref:"vendor"
    },
    

    
})