
import { Facilitytypes } from "../../model/facilitytypes.js";

const addnewFacility=async(req,res)=>{

try{
    console.log(req.body);
    const {facilitytypeName}=req.body;

    const facilityName=await Facilitytypes.findOne({facilitytypeName:facilitytypeName});
    if(facilityName){
        return res.status(400).json({
            success:false,
            message:"the facility already exists"
        })
    }

    const newFacility=new Facilitytypes({
        facilitytypeName:facilitytypeName
    });

    newFacility.save();

    return res.status(200).json({
        success:true,
        message:"new facility added successfully"
    })

}catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Add new facility failed"
    })
}

}

const getnewFacility=async(req,res)=>{

    try{
        const facilitytypes= await Facilitytypes.find({});

        res.status(200).json({
            success:true,
            newfacilitys:facilitytypes
        })
    }catch(error){

        console.log(error);
    return res.status(500).json({
        success:false,
        message:"Internal server error"
    })

    }

}

const manageStatusFacility=async(req,res)=>{
    try {
        const { id } = req.params;
        const facility = await Facilitytypes.findById(id);
    
        if (!facility) {
          return res.status(404).json({ success: false, message: "Facility not found" });
        }
    
        const isBlocked = facility.isBlocked; 
    
        await Facilitytypes.updateOne({ _id: id }, { $set: { isBlocked: !isBlocked } });
        console.log("Facility status updated successfully")
        return res.status(200).json({ success: true, message: "Facility status updated successfully" });
    
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to update facility status" });
      }
}

export {addnewFacility,getnewFacility,manageStatusFacility};