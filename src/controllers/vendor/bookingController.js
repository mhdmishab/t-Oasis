import { Bookings } from "../../model/bookings.js"
import cron from 'node-cron'
import { Facilities } from "../../model/facility.js";


const getBookings=async(req,res)=>{

try{
    const id=req.params.id;
    const currentPage=req.params.page;
    const skipNumber=((currentPage-1)*10);
     const bookings=await Bookings.find({vendor_id:id}).skip(skipNumber).limit(10).populate("user_id","email").populate("lounge_id","loungeName loungeDistrict")
     .populate("facility_id","facilityName").sort({ date: -1 }).exec()
    //  console.log(bookings.user_id.email);
    //const bookings=await Bookings.find({_id:bookingId});
    console.log(bookings)

    res.status(200).json({

        success:true,
        vendor_id:id,
        bookings:bookings
    })
}catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:"Internal server error"
    })
}
}


export {getBookings};



cron.schedule("0 * * * *", async function updateBookingStatus() {
   
    try {
      console.log("try inside updateBookingStatus");
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      const currentMinute = currentDate.getMinutes();
    
      // Find bookings where the status is "booked" and the date is less than or equal to the current date
      const bookings = await Bookings.find({ status: "booked", date: { $lte: currentDate } }).exec();
    
      for (const booking of bookings) {
        const { date, booked_slots } = booking;
    
        // Check if the booked date is less than the current date
        if (date < currentDate) {
          booking.status = "completed";
          await booking.save();
        } else if (date.toDateString() === currentDate.toDateString()) {
          // If the booked date is equal to the current date, check the booked time
          const allSlotsBeforeCurrentTime = booked_slots.every(slot => {
            const [slotHour, slotMinute] = slot.split(":").map(Number);
            return slotHour < currentHour || (slotHour === currentHour && slotMinute < currentMinute);
          });
    
          if (allSlotsBeforeCurrentTime) {
            booking.status = "completed";
            await booking.save();
          }
        }
      }
    
    } catch (error) {
      console.error(error);
    }
    
  });




