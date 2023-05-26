import express from "express";
import dbConnection from "./config/dbConnection.js";
import dotenv  from "dotenv";
dotenv.config();
dbConnection();
const app=express();
app.use(express.json());

const port=process.env.PORT;
import user from "./routes/user.js";


app.get('/',user)



app.listen(port,()=>{
    console.log(`Running on port ${port}`);
})




