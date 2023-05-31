import express from "express";
import dbConnection from "./src/config/dbConnection.js";
import dotenv  from "dotenv";
import cors from 'cors';
dotenv.config();
dbConnection();
const app=express();

app.use(cors());
app.use(express.json());


const port=process.env.PORT;
import user from "./src/routes/user.js";


app.use('/',user);



app.listen(port,()=>{
    console.log(`Running on port ${port}`);
})




