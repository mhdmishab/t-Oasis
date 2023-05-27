import express from "express";
import dbConnection from "./src/config/dbConnection.js";
import dotenv  from "dotenv";
dotenv.config();
dbConnection();
const app=express();
app.use(express.json());

const port=process.env.PORT;
import user from "./src/routes/user.js";


app.use('/',user);



app.listen(port,()=>{
    console.log(`Running on port ${port}`);
})




