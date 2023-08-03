import express from "express";
import dbConnection from "./src/config/dbConnection.js";
import dotenv  from "dotenv";
import cors from 'cors';
import { createServer } from "http";
import { Server } from 'socket.io';



dotenv.config();
dbConnection();
const app=express();

app.use(cors({
    origin: ["http://localhost:3000","https://toasis.restinpillows.shop","https://toasis.netlify.app"]
}));


app.use(express.json());


const port=process.env.PORT;


const server = createServer(app); 
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000","https://toasis.restinpillows.shop","https://toasis.netlify.app"] 
  },
});

io.on("connection", (socket) => {


    console.log("Connected to socket.io");

    socket.on("setup", (userId) => {
        console.log("setup worked")
        if (!userId) {
            socket.emit("error", "Invalid userData");
            return;
        }
        console.log("userData : ", userId);
        socket.join(userId);
        socket.emit("connected");

    });

    socket.on("join chat", (room) => {
        try {
            socket.join(room);
            console.log("User Joined Room: " + room);
        } catch (error) {
            console.log("error at join chat");
        }
    });


    socket.on("new message", (newMessageReceived) => {
        console.log(newMessageReceived)
        var recieverId = newMessageReceived.recieverId;


        if (!newMessageReceived.conversationId) return console.log("chat not defined");

        socket.in(recieverId).emit("message received", newMessageReceived);

    });

    socket.on("disconnect", (userId) => {
        console.log("USER DISCONNECTED");
        if (userId) {
            socket.leave(userId);
        }
    });
});
import user from "./src/routes/user.js";
import vendor from "./src/routes/vendor.js";
import admin from "./src/routes/admin.js";


app.use('/',user);
app.use('/vendor',vendor);
app.use('/admin',admin);



server.listen(port,()=>{
    console.log(`Running on port ${port}`);
})




