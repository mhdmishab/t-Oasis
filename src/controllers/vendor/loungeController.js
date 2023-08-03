
import { Vendors } from "../../model/vendor.js";
import { Lounges } from '../../model/lounge.js';
import joi from 'joi';
import { Bookings } from "../../model/bookings.js";
import mongoose from 'mongoose';
import { Users } from "../../model/user.js";



const addLounge = async (req, res) => {

    console.log(req.params.id, "id is here");
    const id = req.params.id;

    let vendor = await Vendors.findOne({ _id: id });
    if (!vendor) {
        return res.status(400).json({
            success: false,
            message: "Invalid authority"
        });
    }

    console.log(req.file);
    const { path, filename } = req.file;

    const { loungeName, loungeDistrict, loungeState, loungeLocation, loungeLat, loungeLng, loungeDescription } = req.body;


    try {
        const Schema = joi.object({
            loungeName: joi.string().min(3).max(20).required(),
            loungeDescription: joi.string().min(5).max(4000).required(),
            loungeDistrict: joi.string().min(3).max(100).required(),
            loungeState: joi.string().min(3).max(100).required(),
            // loungeLocation: joi.string(),
            // loungeLat: joi.number(),
            // loungeLng: joi.number(),

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
        const lounge = new Lounges({
            vendor_id: id,
            loungeName: loungeName,
            loungeDistrict: loungeDistrict,
            loungeState: loungeState,
            loungeDescription: loungeDescription,
            loungeLat: loungeLat,
            loungeLng: loungeLng,
            loungeLocation: loungeLocation,
            loungeImages: {
                public_id: filename,
                url: path,
            }
        })
        await lounge.save();
        return res.status(200).json({
            success: true,
            message: "lounge request send successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Lounge request failed"
        });

    }
}

const editLounge = async (req, res) => {

    console.log(req.params.vendorid, "id is here");
    const vendorId = req.params.vendorid;
    const loungeId = req.params.loungeid;

    try {


        let vendor = await Vendors.findOne({ _id: vendorId });
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Invalid authority"
            });
        }



        const { loungeName, loungeDistrict, loungeState, loungeLocation, loungeLat, loungeLng, loungeDescription, existingImage, existingLoungeLocation } = req.body;

        console.log(existingImage?.[0]);
        console.log(existingLoungeLocation);
        console.log(loungeLocation);
        if (existingImage && existingLoungeLocation) {
            console.log("existing image is here");


            await Lounges.updateOne({ _id: loungeId }, {
                $set: {



                    loungeName: loungeName,
                    loungeDistrict: loungeDistrict,
                    loungeState: loungeState,
                    loungeDescription: loungeDescription,


                }
            })
        } else if (existingImage) {


            await Lounges.updateOne({ _id: loungeId }, {
                $set: {

                    loungeName: loungeName,
                    loungeDistrict: loungeDistrict,
                    loungeState: loungeState,
                    loungeDescription: loungeDescription,
                    loungeLat: loungeLat,
                    loungeLng: loungeLng,
                    loungeLocation: loungeLocation,


                }
            })
        } else if (existingLoungeLocation) {
            console.log("newfile is here")
            console.log(req.file);
            const { path, filename } = req.file;
            await Lounges.updateOne({ _id: loungeId }, {
                $set: {

                    loungeName: loungeName,
                    loungeDistrict: loungeDistrict,
                    loungeState: loungeState,
                    loungeDescription: loungeDescription,
                    loungeLat: loungeLat,
                    loungeLng: loungeLng,
                    loungeLocation: loungeLocation,
                    loungeImages: {
                        public_id: filename,
                        url: path,
                    }

                }
            })
        } else {
            console.log("newfile is here2")
            console.log(req.file);
            const { path, filename } = req.file;

            await Lounges.updateOne({ _id: loungeId }, {
                $set: {

                    loungeName: loungeName,
                    loungeDistrict: loungeDistrict,
                    loungeState: loungeState,
                    loungeDescription: loungeDescription,
                    loungeLat: loungeLat,
                    loungeLng: loungeLng,
                    loungeLocation: loungeLocation,
                    loungeImages: {
                        public_id: filename,
                        url: path,
                    }

                }
            })

        }


        return res.status(200).json({
            success: true,
            message: "lounge edited successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Lounge edit request failed"
        });

    }

}


const getLounge = async (req, res) => {
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

        const lounges = await Lounges.find({ vendor_id: id });
        console.log(lounges)



        return res.json({
            vendor_id: id,
            success: true,
            lounges: lounges,

            message: "get lounges successfull"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}

const blockUnblockLounge = async (req, res) => {

    try {
        const vendorId = req.params.vendorid;
        const loungeId = req.params.loungeid;

        let vendor = await Vendors.findOne({ _id: vendorId });
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Invalid authority"
            });
        }
        const lounge = await Lounges.findById(loungeId);

        if (!lounge) {
            return res.status(404).json({ success: false, message: "lounge not found" });
        }

        const isBlocked = lounge.isBlocked;

        await Lounges.updateOne({ _id: loungeId }, { $set: { isBlocked: !isBlocked } });
        console.log(`lounge updated successfully`)
        return res.status(200).json({ success: true, message: "lounge status updated successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to update lounge status" });
    }

}

const getDashboard = async (req, res) => {
    try {
      const vendorId = req.params.id;
      console.log(vendorId);
      let vendor = mongoose.Types.ObjectId.createFromHexString(vendorId);
      const TODAY = new Date();
      const YEAR_BEFORE = new Date(TODAY);
      YEAR_BEFORE.setFullYear(YEAR_BEFORE.getFullYear() - 1);
  
      const MONTHS_ARRAY = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      const bookingPipeLine = [
        {
          $match: {
            vendor_id: vendor,
            booked_date: { $gte: YEAR_BEFORE, $lte: TODAY },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$booked_date' } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            count: 1,
            month: {
              $let: {
                vars: {
                  monthsArray: [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December',
                  ],
                },
                in: {
                  $arrayElemAt: [
                    '$$monthsArray',
                    {
                      $subtract: [
                        { $toInt: { $substrCP: ['$_id', 5, 2] } },
                        1,
                      ],
                    },
                  ],
                },
              },
            },
            _id: 0,
          },
        },
      ];
      
      

      const revenuePipeLine = [
        {
          $match: {
            vendor_id: vendor,
            status:'completed',
            booked_date: { $gte: YEAR_BEFORE, $lte: TODAY },
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$booked_date' } },
            count: { $sum: '$amount_paid' } // Add this line to calculate the sum of amount_paid for each month
          }
        },
        {
          $sort: { _id: 1 }
        },
        {
            $project: {
              count: 1,
              month: {
                $let: {
                  vars: {
                    monthsArray: [
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December',
                    ],
                  },
                  in: {
                    $arrayElemAt: [
                      '$$monthsArray',
                      {
                        $subtract: [
                          { $toInt: { $substrCP: ['$_id', 5, 2] } },
                          1,
                        ],
                      },
                    ],
                  },
                },
              },
              _id: 0,
            },
          },
      ];

      
      const revenueChart = await Bookings.aggregate(revenuePipeLine);
      const bookingChart = await Bookings.aggregate(bookingPipeLine);

      const loungenumbers = await Lounges.countDocuments({ vendor_id: vendor, isBlocked: false, isApproved: "approved" });
      const pendingloungenumbers = await Lounges.countDocuments({ vendor_id: vendor, isBlocked: false, isApproved: "pending" });
      const pendingbookingnumbers = await Bookings.countDocuments({ vendor_id: vendor, status:"booked"});
      const compleatedbookingnumbers = await Bookings.countDocuments({ vendor_id: vendor, status:"completed"});
      const cancelledbookingnumbers = await Bookings.countDocuments({ vendor_id: vendor, status:"cancelled"});
      const totalRevenue = await Bookings.aggregate([
        {
          $match: { vendor_id: vendor, status: "completed" }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount_paid" }
          }
        }
      ]);

        const thisMonthStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
        const thisMonthEnd = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0, 23, 59, 59);

        const thismonthRevenue = await Bookings.aggregate([
            {
                $match: {
                    vendor_id: vendor,
                    status: "completed",
                    booked_date: { $gte: thisMonthStart, $lte: thisMonthEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount_paid" }
                }
            }
        ]);

        const avgLoungeRating = await Lounges.aggregate([
            {
              $match: {
                vendor_id: vendor,
                isBlocked: false,
                isApproved: "approved"
              }
            },
            {
              $unwind: "$reviews" // Unwind the reviews array
            },
            {
              $group: {
                _id: null,
                averageRating: { $avg: "$reviews.rating" } // Use $avg to calculate the average rating
              }
            }
          ]);

      console.log("Booking Chart:", bookingChart);
      console.log("Revenue chart:", revenueChart);
      console.log("lounges:", loungenumbers);
      console.log("bookings:", pendingbookingnumbers);
      console.log("bookings:", compleatedbookingnumbers);
      console.log("bookings:", cancelledbookingnumbers);
      console.log("Revenue:", totalRevenue);
      console.log("average loungeRating:", avgLoungeRating);

  
      res.status(200).json({ bookingChart,revenueChart,pendingloungenumbers,loungenumbers,pendingbookingnumbers,compleatedbookingnumbers,cancelledbookingnumbers,totalRevenue,avgLoungeRating });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Failed to get vendor dashboard" });
    }
  }
  
  



export { addLounge, getLounge, editLounge, blockUnblockLounge, getDashboard };