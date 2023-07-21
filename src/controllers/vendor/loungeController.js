
import { Vendors } from "../../model/vendor.js";
import { Lounges } from '../../model/lounge.js';
import joi from 'joi';



const addLounge = async (req, res) => {
   
    console.log(req.params.id,"id is here");
    const id=req.params.id;

    let vendor=await Vendors.findOne({_id:id});
    if(!vendor){
        return res.status(400).json({
            success: false,
            message: "Invalid authority"
        });
    }

    console.log(req.file);
    const { path, filename } = req.file;
   
    const {loungeName,loungeDistrict,loungeState,loungeLocation,loungeLat,loungeLng,loungeDescription}=req.body;


    try {
        const Schema = joi.object({
            loungeName: joi.string().min(3).max(20).required(),
            loungeDescription: joi.string().min(5).max(4000).required(),
            loungeDistrict: joi.string().min(3).max(100).required(),
            loungeState: joi.string().min(3).max(100).required(),
            loungeLocation:joi.string(),
            loungeLat:joi.number(),
            loungeLng:joi.number(),

        })
        const { error } = Schema.validate(req.body);

        if (error) {
            if (error) {
                console.log("validation error")
                console.log(error.details[0].message)
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }
        }
        const lounge=new Lounges({
            vendor_id:id,
            loungeName:loungeName,
            loungeDistrict:loungeDistrict,
            loungeState:loungeState,
            loungeDescription:loungeDescription,
            loungeLat:loungeLat,
            loungeLng:loungeLng,
            loungeLocation:loungeLocation,
            loungeImages:{
                public_id:filename,
                url:path,
            }
        })
        await lounge.save();
        return res.status(200).json({
            success: true,
            message: "lounge request send successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Lounge request failed"
        });
    
    }
}

const editLounge=async(req,res)=>{

    console.log(req.params.vendorid,"id is here");
    const vendorId=req.params.vendorid;
    const loungeId=req.params.loungeid;

    try {
        // const Schema = joi.object({
        //     loungeName: joi.string().min(3).max(20).required(),
        //     loungeDescription: joi.string().min(5).max(4000).required(),
        //     loungeDistrict: joi.string().min(3).max(100).required(),
        //     loungeState: joi.string().min(3).max(100).required(),
        //     loungeLocation:joi.string(),
        //     loungeLat:joi.number(),
        //     loungeLng:joi.number(),
        //     existingImage:joi.array[{}],

        // })
        // const { error } = Schema.validate(req.body);

        // if (error) {
        //     if (error) {
        //         console.log("validation error")
        //         console.log(error.details[0].message)
        //         return res.status(400).json({
        //             success: false,
        //             message: error.details[0].message
        //         });
        //     }
        // }

    let vendor=await Vendors.findOne({_id:vendorId});
    if(!vendor){
        return res.status(400).json({
            success: false,
            message: "Invalid authority"
        });
    }

    // console.log(req.file);
    // const { path, filename } = req.file;
   
    const {loungeName,loungeDistrict,loungeState,loungeLocation,loungeLat,loungeLng,loungeDescription,existingImage,existingLoungeLocation}=req.body;

    console.log(existingImage?.[0]);
    console.log(existingLoungeLocation);
    console.log(loungeLocation);
    if(existingImage && existingLoungeLocation){
        console.log("existing image is here");

        // const {public_id,url}=existingImage
        // console.log(existingImage);
        // console.log(public_id);
        // console.log(url);


        await Lounges.updateOne({_id:loungeId},{$set:{

            

            loungeName:loungeName,
            loungeDistrict:loungeDistrict,
            loungeState:loungeState,
            loungeDescription:loungeDescription,
            // loungeLocation:existingLoungeLocation,
            // loungeImages:{
            //     public_id:public_id,
            //     url:url,
            // }

        }})
    }else if(existingImage){
        // const {public_id,url}=existingImage;

        await Lounges.updateOne({_id:loungeId},{$set:{

            loungeName:loungeName,
            loungeDistrict:loungeDistrict,
            loungeState:loungeState,
            loungeDescription:loungeDescription,
            loungeLat:loungeLat,
            loungeLng:loungeLng,
            loungeLocation:loungeLocation,
            // loungeImages:{
            //     public_id:public_id,
            //     url:url,
                
            // }

        }})
    }else if(existingLoungeLocation){
        console.log("newfile is here")
        console.log(req.file);
        const { path, filename } = req.file;
        await Lounges.updateOne({_id:loungeId},{$set:{

            loungeName:loungeName,
            loungeDistrict:loungeDistrict,
            loungeState:loungeState,
            loungeDescription:loungeDescription,
            loungeLat:loungeLat,
            loungeLng:loungeLng,
            loungeLocation:loungeLocation,
            loungeImages:{
                public_id:filename,
                url:path,               
            }

        }})
    }else{
        console.log("newfile is here2")
        console.log(req.file);
        const { path, filename } = req.file;

        await Lounges.updateOne({_id:loungeId},{$set:{

            loungeName:loungeName,
            loungeDistrict:loungeDistrict,
            loungeState:loungeState,
            loungeDescription:loungeDescription,
            loungeLat:loungeLat,
            loungeLng:loungeLng,
            loungeLocation:loungeLocation,
            loungeImages:{
                public_id:filename,
                url:path,
            }

        }})

    }

        
        return res.status(200).json({
            success: true,
            message: "lounge edited successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Lounge edit request failed"
        });
    
    }

}


const getLounge=async(req,res)=>{
try{
    const id=req.params.id;
    console.log(id);

    let vendor=await Vendors.findOne({_id:id});
    if(!vendor){
        return res.status(400).json({
            success: false,
            message: "Invalid authority"
        });
    }

    const lounges=await Lounges.find({vendor_id:id});
    console.log(lounges)

    

    return res.json({
        vendor_id: id,
        success: true,
        lounges:lounges,
        
        message: "get lounges successfull"
    })
}catch(error){
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });

}
}

const blockUnblockLounge=async(req,res)=>{

    try {
        const vendorId = req.params.vendorid;
        const loungeId=req.params.loungeid;

        let vendor = await Vendors.findOne({ _id: vendorId });
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Invalid authority"
            });
        }
        const lounge = await Lounges.findById(loungeId);
    
        if (!lounge) {
          return res.status(404).json({ success: false, message: "lounge not found" });
        } 
    
        const isBlocked = lounge.isBlocked; 
    
        await Lounges.updateOne({ _id: loungeId }, { $set: { isBlocked: !isBlocked } });
        console.log(`lounge updated successfully`)
        return res.status(200).json({ success: true, message: "lounge status updated successfully" });
    
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to update lounge status" });
      }
    
}



export { addLounge,getLounge,editLounge,blockUnblockLounge };