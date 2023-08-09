import { Vendors } from "../../model/vendor.js";
import { Lounges } from '../../model/lounge.js';
import { Bookings } from "../../model/bookings.js";
import { Users } from "../../model/user.js";

const getLounge=async(req,res)=>{

try{

    const lounges=await Lounges.find();
    // console.log(lounges)

    return res.json({
        success: true,
        lounges:lounges,
    })
}catch(error){
    return res.status(500).json({message:"internal server error"})
}
}

const rejectLounge=async(req,res)=>{
    const loungeId=req.params.id;
    try {
        await Lounges.updateOne({ _id: loungeId }, { $set: { isApproved: 'rejected' } });
        res.status(200).json({ message: 'Lounge rejected successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Lounge rejection failed' });
      }
}

const approveLounge=async(req,res)=>{

    const loungeId=req.params.id;
    try {
        await Lounges.updateOne({ _id: loungeId }, { $set: { isApproved: 'approved' } });
        res.status(200).json({ message: 'Lounge Approved successfully' });

      } catch (error) {
        res.status(500).json({ message: 'Lounge Approval Failed' });
      }
}

const getDashboard = async (req, res) => {
  try {
    
  
    const TODAY = new Date();
    const YEAR_BEFORE = new Date(TODAY);
    YEAR_BEFORE.setFullYear(YEAR_BEFORE.getFullYear() - 1);

    const MONTHS_ARRAY = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const bookingPipeLine = [
      {
        $match: {
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

    const loungenumbers = await Lounges.countDocuments({  isBlocked: false, isApproved: "approved" });
    const vendornumbers = await Vendors.countDocuments({  isBlocked: false });
   
    const usernumbers = await Users.countDocuments({  isBlocked: false });
   
    const totalRevenue = await Bookings.aggregate([
      {
        $match: {  status: "completed" }
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
    console.log("lounges:", usernumbers);
    console.log("lounges:", loungenumbers);
  
    console.log("Revenue:", totalRevenue);
    console.log("average loungeRating:", avgLoungeRating);


        


    res.status(200).json({ bookingChart,revenueChart,vendornumbers,loungenumbers,usernumbers,totalRevenue,avgLoungeRating });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to get vendor dashboard" });
  }
}

export { getLounge,rejectLounge,approveLounge,getDashboard }