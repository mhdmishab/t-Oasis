import { Bookings } from "../../model/bookings.js"
import cron from 'node-cron'


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

// cron.schedule("* * * * *", async function generateMonthlyRent() {
//     try {
//       const currentDate = new Date();
//       const bookings = await Bookings.find({ status: "booked", date: { $lt: currentDate } });
      
//       bookings.forEach(async (booking) => {
//         booking.status = "completed";
//         await booking.save();
//       });
      
//     } catch (error) {
//       console.error(error);
//     }
//   });

cron.schedule("0 * * * *", async function updateBookingStatus() {
    try {
      console.log("try insdie cron")
      const currentDate = new Date();
      const currentHour = currentDate.getHours().toString().padStart(2, '0'); // Get the current hour in 24-hour format with leading zero if necessary
  
      const bookings = await Bookings.find({ status: "booked", date: { $lt: currentDate } });
      
      bookings.forEach(async (booking) => {
        const { booked_slots } = booking;
  
        // Check if the current hour is in the booked_slots array
        if (booked_slots.includes(currentHour)) {
          booking.status = "completed";
          await booking.save();
        }
      });
      
    } catch (error) {
      console.error(error);
    }
  });



