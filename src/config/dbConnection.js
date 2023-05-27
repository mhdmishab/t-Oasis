import mongoose from "mongoose";
import dotenv  from "dotenv";
dotenv.config();

const connection_string=process.env.CONNECTION_STRING;

const dbConnection=()=>{mongoose.connect(connection_string,{
    useNewUrlParser:true,
   useUnifiedTopology:true
}).then(()=>console.log("mongoDB connected")).catch((err)=>console.error("mongoDB connection failed",err.message))
}

export default dbConnection;