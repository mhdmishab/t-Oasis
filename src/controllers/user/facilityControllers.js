
import { Lounges } from '../../model/lounge.js';
import { Facilities } from '../../model/facility.js';
import { Bookings } from '../../model/bookings.js';

const getAllFacilities = async (req, res) => {

    try {

        const id = req.params.id;
        console.log(id);

        console.log("helo facility here")

        const facilities = await Facilities.find({ vendor_id: id }, { isBlocked: false });
        console.log(facilities)

        return res.json({
            success: true,
            facilities: facilities,
            message: "get facilities user successfull "
        })
    } catch (error) {
        console.log(error)
    }
}

const bookFacility = async (req, res) => {

    console.log(req.body);
    console.log(req.params,"params");
    const { bookedDate, bookedSlots } = req.body;
    const { userId, vendorId, facilityId } = req.params;


    const booking = new Bookings({
        user_id: userId,
        vendor_id: vendorId,
        facility_id: facilityId,
        booked_date: bookedDate,
        booked_slots: bookedSlots

    });

    booking.save();


    return res.json({
        success: true,
        message: "Booking done successfully"
    })

}

const getAvailableSlots = async (req, res) => {
    // console.log(req.body)
    const date = req.params.date;
    const vendorId=req.params.vendorId
    const facilityId=req.params.facilityId
    console.log(date,vendorId,facilityId);
    const bookings = await Bookings?.find({$and:[{vendor_id:vendorId},{facility_id:facilityId},{ booked_date: date }]});
    console.log(bookings)
    const bookedSlots = bookings?.map((booking) => booking.booked_slots);
    console.log(bookedSlots)
    const bookedslots = bookedSlots.flat();
    console.log(bookedslots)


    
    return res.json({
        success:true,
        bookedSlots:bookedslots
    })
}

export { getAllFacilities, bookFacility, getAvailableSlots };