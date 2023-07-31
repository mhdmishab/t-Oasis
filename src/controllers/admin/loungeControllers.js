import { Vendors } from "../../model/vendor.js";
import { Lounges } from '../../model/lounge.js';

const getLounge=async(req,res)=>{

try{

    const lounges=await Lounges.find();
    // console.log(lounges)

    return res.json({
        success: true,
        lounges:lounges,
    })
}catch(error){
    return res.status(500).json({message:"internal server error"})
}
}

const rejectLounge=async(req,res)=>{
    const loungeId=req.params.id;
    try {
        await Lounges.updateOne({ _id: loungeId }, { $set: { isApproved: 'rejected' } });
        res.status(200).json({ message: 'Lounge rejected successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Lounge rejection failed' });
      }
}

const approveLounge=async(req,res)=>{

    const loungeId=req.params.id;
    try {
        await Lounges.updateOne({ _id: loungeId }, { $set: { isApproved: 'approved' } });
        res.status(200).json({ message: 'Lounge Approved successfully' });

      } catch (error) {
        res.status(500).json({ message: 'Lounge Approval Failed' });
      }
}

export { getLounge,rejectLounge,approveLounge }