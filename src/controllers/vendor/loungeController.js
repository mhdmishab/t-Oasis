
import { Vendors } from "../../model/vendor.js";
import { Lounges } from '../../model/lounge.js';
import joi from 'joi';


const addLounge = async (req, res) => {
   
    console.log(req.params.id,"id is here");
    const id=req.params.id;
    console.log(req.file);
    const { path, filename } = req.file;
    const {loungeName,loungeDistrict,loungeState,loungeLocation,loungeLat,loungeLng,loungeDescription}=req.body;

    try {
        const Schema = joi.object({
            loungeName: joi.string().min(3).max(20).required(),
            loungeDescription: joi.string().min(5).max(100).required(),
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
        return res.json({
            success: true,
            message: "lounge request send successfully"
        })
    } catch (error) {
        console.log(error + "error catched at lounge")
    }
}


const getLounge=async(req,res)=>{
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
}

const rejectLounge=async(req,res)=>{
    const loungeId=req.params.id;
    try {
        await Lounges.updateOne({ _id: loungeId }, { $set: { isApproved: 'rejected' } });
        res.status(200).json({ message: 'Lounge rejected successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error rejecting lounge' });
      }
}

const approveLounge=async(req,res)=>{

    const loungeId=req.params.id;
    try {
        await Lounges.updateOne({ _id: loungeId }, { $set: { isApproved: 'approved' } });
        res.status(200).json({ message: 'Lounge Approved successfully' });

      } catch (error) {
        res.status(500).json({ message: 'Error Approving lounge' });
      }
}

export { addLounge,getLounge,rejectLounge,approveLounge };