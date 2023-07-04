
import { Lounges } from '../../model/lounge.js';
import { Facilities } from '../../model/facility.js';
import { Bookings } from '../../model/bookings.js';

const getAllFacilities = async (req, res) => {

    try {

        const id = req.params.id;
        console.log(id);

        console.log("helo facility here")

        const facilities = await Facilities.find({ lounge_id: id }, { isBlocked: false });
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
    console.log(req.params);
    const { bookedDate, bookedSlots } = req.body;
    const { userId, loungeId, facilityId } = req.params;


    const booking = new Bookings({
        user_id: userId,
        lounge_id: loungeId,
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
    const loungeId=req.params.loungeId
    const facilityId=req.params.facilityId
    console.log(date,loungeId,facilityId);
    const bookings = await Bookings?.find({$and:[{lounge_id:loungeId},{facility_id:facilityId},{ booked_date: date }]});
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