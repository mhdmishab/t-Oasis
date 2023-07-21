import { Vendors } from "../../model/vendor.js";
import { Lounges } from '../../model/lounge.js';

const getAllLounges=async(req,res)=>{
    // const id=req.params.id;
    // console.log(id);
try{

   console.log("helo here")

    const lounges=await Lounges.find({isBlocked:false});
    console.log(lounges)

    return res.json({
        success: true,
        lounges:lounges,
        message: "get lounges user successfull "
    })
}catch(error){
    return res.status(500).json({
        success: false,
        message: error.message
    });

}
}

export { getAllLounges };