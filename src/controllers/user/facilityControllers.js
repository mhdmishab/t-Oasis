
import { Lounges } from '../../model/lounge.js';
import { Facilities } from '../../model/facility.js';
import { Bookings } from '../../model/bookings.js';
import CryptoJS from 'crypto-js'
import Razorpay from 'razorpay';
import dotenv  from "dotenv";
dotenv.config();



const getAllFacilities = async (req, res) => {

    try {

        const id = req.params.id;
        console.log(id);

        console.log("helo facility here")

        const facilities = await Facilities.find({ vendor_id: id, isBlocked: false });
        console.log(facilities)

        return res.status(200).json({
            success: true,
            facilities: facilities,
            message: "get facilities user successfull "
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    
    }
}

const bookFacility = async (req, res) => {

try{

    console.log(req.body);
    console.log(req.params,"params");
    const { bookedDate, bookedSlots,razorpay_order_id,razorpay_payment_id,amount_paid} = req.body;
    const { userId, vendorId,loungeId, facilityId } = req.params;


    const booking = new Bookings({
        user_id: userId,
        vendor_id: vendorId,
        lounge_id:loungeId,
        facility_id: facilityId,
        booked_date: bookedDate,
        booked_slots: bookedSlots,
        booked_id:razorpay_order_id,
        payment_id:razorpay_payment_id,
        amount_paid:amount_paid

    });

    booking.save();

    return res.json({
        success: true,
        message: "Booking done successfully"
    })
}catch(error){
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });

}

}

const getAvailableSlots = async (req, res) => {
    // console.log(req.body)
try{
    const date = req.params.date;
    const vendorId=req.params.vendorId;
    const facilityId=req.params.facilityId
    console.log(date,vendorId,facilityId);
    const bookings = await Bookings?.find({$and:[{vendor_id:vendorId},{facility_id:facilityId},{ booked_date: date },{status:'booked'}]});
    console.log(bookings)
    const bookedSlots = bookings?.map((booking) => booking.booked_slots);
    console.log(bookedSlots)
    const bookedslots = bookedSlots.flat();
    console.log(bookedslots)


    
    return res.json({
        success:true,
        bookedSlots:bookedslots
    })
}catch(error){
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });

}
}

const bookingPayment=async(req,res)=>{

    try{
        const { numberOfSlots }=req.body;

        
        console.log(numberOfSlots);
        const facilityId =req.params.facilityId;
        console.log(facilityId)

        const facility=await Facilities.find({_id:facilityId});
        const amount=facility[0].facilityPrice;
        console.log(amount)

        const instance=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })

        const randomValue = "OD"+Math.floor(Math.random() * Date.now()).toString(16)
        const options={
            amount:amount*numberOfSlots*100,
            currency:"INR",
            receipt: randomValue

        }

        instance.orders.create(options,(error,order)=>{
            if(error){
                console.log(error);
                return res.status(500).json({message:"Something went wrong on payment serverside"})
            }
            return res.status(200).json({data:order});
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"})

    }

}

const paymentVerify=(req,res)=>{
    try{

        console.log("inside verify payment")

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature}=req.body

            const sign=razorpay_order_id+"|"+razorpay_payment_id;

        const expectedSign=CryptoJS.createHmac("sha256".process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex")

        if(razorpay_signature===expectedSign){
            return res.status(200).res.json({message:"payment verified successfully"});
        }else{
            return res.status(400).res.json({message:"Invalid signature"})
        }



    }catch(error){

        console.log(error);
        return res.status(500).json({message:"Internal server error"})

    }
}

export { getAllFacilities, bookFacility, getAvailableSlots,bookingPayment,paymentVerify };