import { Vendors } from "../../model/vendor.js";
import { Lounges } from '../../model/lounge.js';

const getAllLounges=async(req,res)=>{
    // const id=req.params.id;
    // console.log(id);

   console.log("helo here")

    const lounges=await Lounges.find();
    console.log(lounges)

    return res.json({
        success: true,
        lounges:lounges,
        message: "get lounges user successfull "
    })
}

export { getAllLounges };