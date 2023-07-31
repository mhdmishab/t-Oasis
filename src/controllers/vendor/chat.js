import { Conversation } from "../../model/conversation.js";
import { Message } from "../../model/messages.js";
import mongoose from 'mongoose';



const privateChat = async (req, res) => {
    try {
        let vendorId = req.params.vendorId;
        let userId = req.params.userId;
        console.log(vendorId)
        console.log("body",req.body);
        let vendorid = mongoose.Types.ObjectId.createFromHexString(vendorId);
        let userid = mongoose.Types.ObjectId.createFromHexString(userId);
        

        // Find or create the conversation between the sender and the recipient
        const conversation = await Conversation.findOneAndUpdate(
            {
                $and: [{ vendorId: vendorid }, { userId: userid }],
            },
            {
                vendorId: vendorid,
                userId: userid,
                lastMessage: req.body.data,
                date: Date.now(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        // Create a new message
        const message = new Message({
            conversation: conversation._id,
            vendorId: vendorid,
            userId: userid,
            vendorbody: req.body.data,
        });

        // Save the message
        await message.save();

        // Emit the message to clients using websockets (assuming you're using Socket.io)

        // Send the success response with conversationId
        
        res.end(
            JSON.stringify({
                message: 'Success',
                conversationId: conversation._id,
                recieverId:userid,
                date:conversation.date,
                chat:req.body.data,
            })
        );
    } catch (err) {
        console.error(err);
        
        res.status(500).end(JSON.stringify({ message: 'Failure' }));
    }
};

const getChatConversation = async (req, res) => {
    try {
        let vendorId = req.params.vendorId;
        let userId = req.params.userId;
        let conversationId = req.params.conversationId;
        // console.log(vendorId);
        let vendor = mongoose.Types.ObjectId.createFromHexString(vendorId);
        let user = mongoose.Types.ObjectId.createFromHexString(userId);
        // console.log(vendor);
        const messages = await Message.aggregate([
            {
                $lookup: {
                    from: 'vendor',
                    localField: 'vendorId',
                    foreignField: '_id',
                    as: 'toObj',
                },
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'fromObj',
                },
            },
            {
                $match: {
                    
                         $and: [{ vendorId: vendor }, { userId: user }] ,
                       
                },
            },
            {
                $project: {
                    _id: 0,
                    conversation:1,
                    userbody: 1,
                    vendorbody: 1,
                    date:1,
                },
            },
        ]).exec();

        // console.log(messages);
        res.json(messages); // Send messages as a JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failure' }); // Send error response with status code 500
    }
};


const getConversations = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const conversations = await Conversation.find({ 'vendorId': vendorId })
            .populate({
                path: 'userId',
                select: '-date -password -__v -image -isBlocked', // Excludes the specified fields from the populated user documents
            })
            .exec();

        // console.log(conversations);
        res.json(conversations); // Send users as a JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failure' });
    }
}







export {privateChat,getConversations,getChatConversation}
