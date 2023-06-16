import joi from 'joi';
import jwt from "jsonwebtoken"
import { Lounges } from '../../model/lounge.js';


const addLounge = async (req, res) => {

    console.log(req.params.id,"id is here");

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
            loungeName:loungeName,
            loungeDistrict:loungeDistrict,
            loungeState:loungeState,
            loungeDescription:loungeDescription,
            loungeLat:loungeLat,
            loungeLng:loungeLng,
            loungeLocation:loungeLocation,
            loungeImage:{
                public_id:filename,
                url:path,
            }

        })

        console.log(lounge);

        

    } catch (error) {
        console.log(error + "error catched at lounge")
    }

}

export { addLounge };