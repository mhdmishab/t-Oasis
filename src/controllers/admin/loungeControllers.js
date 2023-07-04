import { Vendors } from "../../model/vendor.js";
import { Lounges } from '../../model/lounge.js';

const getLounge=async(req,res)=>{
    const id=req.params.id;
    console.log(id);

   

    const lounges=await Lounges.find();
    console.log(lounges)

    return res.json({
        vendor_id: id,
        success: true,
        lounges:lounges,
        message: "get lounges successfull"
    })
}

export { getLounge };