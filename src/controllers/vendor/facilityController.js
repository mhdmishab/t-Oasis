import { Lounges } from '../../model/lounge.js';
import { Facilities } from "../../model/facility.js";
import joi from 'joi';


const addFacility = async (req, res) => {
   
    console.log(req.params.loungeId,"loungeid is here");
    console.log(req.params.vendorId,"vendorid is here");
    console.log(req.body);
    const loungeId=req.params.loungeId; 
    const vendorId=req.params.vendorId; 
    const { path, filename } = req.file;
    const {facilityName,facilityToken,facilityPrice,facilityDescription,facilityImage}=req.body;

    try {
        const Schema = joi.object({
            facilityName: joi.string().min(3).max(20).required(),
            facilityDescription: joi.string().min(5).max(100).required(),
            facilityToken: joi.number().min(1).max(3).required(),
            facilityPrice: joi.number().min(10).max(5000).required(),
            
        })
        const { error } = Schema.validate(req.body);

        if (error) {
            if (error) {
                console.log("validation error facility")
                console.log(error.details[0].message)
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }
        }
        const facility=new Facilities({
            vendor_id:vendorId,
            lounge_id:loungeId,
            facilityName:facilityName,
            facilityToken:facilityToken,
            facilityPrice:facilityPrice,
            facilityDescription:facilityDescription,
          
            facilityImage:{
                public_id:filename,
                url:path,
            }
        })
        await facility.save();
        return res.json({
            success: true,
            message: "facility saved succesfully"
        })
    } catch (error) {
        console.log(error + "error catched at facility")
    }
}


const getFacilities=async(req,res)=>{
    const id=req.params.id;
    console.log(id);

    // let lounge=await Lounges.findOne({_id:id});
    // if(!vendor){
    //     return res.status(400).json({
    //         success: false,
    //         message: "Invalid authority"
    //     });
    // }

    const facilities=await Facilities.find({lounge_id:id});
    console.log(facilities)

    return res.json({
        lounge_id: id,
        success: true,
        facilities:facilities,
        message: "get facilities successfull"
    })
}


export { addFacility,getFacilities};
