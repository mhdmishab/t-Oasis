import { Lounges } from '../../model/lounge.js';
import { Facilities } from "../../model/facility.js";
import joi from 'joi';
import { Facilitytypes } from '../../model/facilitytypes.js';
import { Vendors } from '../../model/vendor.js';


const addFacility = async (req, res) => {


    console.log(req.params.vendorId, "vendorid is here");
    console.log(req.body);

    const vendorId = req.params.vendorId;

    let vendor = await Vendors.findOne({ _id: vendorId });
    if (!vendor) {
        return res.status(400).json({
            success: false,
            message: "Invalid authority"
        });
    }
    const { path, filename } = req.file;
    const { facilityName, facilityToken, facilityPrice, facilityDescription, facilityImage } = req.body;

    try {
        const Schema = joi.object({
            facilityName: joi.string().min(3).max(20).required(),
            facilityDescription: joi.string().min(5).max(4000).required(),
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
        const facility = new Facilities({
            vendor_id: vendorId,

            facilityName: facilityName,
            facilityToken: facilityToken,
            facilityPrice: facilityPrice,
            facilityDescription: facilityDescription,

            facilityImage: {
                public_id: filename,
                url: path,
            }
        })
        await facility.save();
        return res.json({
            success: true,
            message: "facility saved succesfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}


const getFacilities = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);

        let vendor = await Vendors.findOne({ _id: id });
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Invalid authority"
            });
        }


        const facilities = await Facilities.find({ vendor_id: id });
        console.log(facilities);

        const facilitytypes = await Facilitytypes.find({ isBlocked: false });
        console.log(facilitytypes);

        return res.json({
            vendor_id: id,
            success: true,
            facilities: facilities,
            facilitytypes: facilitytypes,
            message: "get facilities successfull"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}

const editFacility = async (req, res) => {

    try {
        const vendorId=req.params.vendorid;
        const facilityId = req.params.facilityid;
        const { facilityName, facilityToken, facilityPrice, facilityDescription, facilityImage,existingImage } = req.body;

        let vendor = await Vendors.findOne({ _id: vendorId });
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Invalid authority"
            });
        }

        if(existingImage){
            await Facilities.updateOne({ _id: facilityId }, {
                $set: {
                    facilityName: facilityName,
                    facilityToken: facilityToken,
                    facilityPrice: facilityPrice,
                    facilityDescription: facilityDescription,

                }
            })

        }else{

            const { path, filename } = req.file;

            await Facilities.updateOne({ _id: facilityId }, {
                $set: {
                    facilityName: facilityName,
                    facilityToken: facilityToken,
                    facilityPrice: facilityPrice,
                    facilityDescription: facilityDescription,
    
                    facilityImage: {
                        public_id: filename,
                        url: path,
                    }
                }
            })
        }

        

        res.status(200).json({ message: 'Facility updated successfully' });
    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the facility' });
    }
}

const blockUnblockFacility=async(req,res)=>{

    try {
        const vendorId = req.params.vendorid;
        const facilityId=req.params.facilityid;

        let vendor = await Vendors.findOne({ _id: vendorId });
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Invalid authority"
            });
        }
        const facility = await Facilities.findById(facilityId);
    
        if (!facility) {
          return res.status(404).json({ success: false, message: "Facility not found" });
        } 
    
        const isBlocked = facility.isBlocked; 
    
        await Facilities.updateOne({ _id: facilityId }, { $set: { isBlocked: !isBlocked } });
        console.log(`Facility updated successfully`)
        return res.status(200).json({ success: true, message: "Facility status updated successfully" });
    
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to update facility status" });
      }
    
}


export { addFacility, getFacilities,editFacility,blockUnblockFacility };
