import mongoose from "mongoose";

export function dbConnection()
{
    const params = 
    {
        useNewUrlParser:true,
        useUnifiedTopology: true,
    }
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/blog", params);
        console.log("Database connected Successfully")
    }catch(error)
    {
        console.log("Error connecting DB", error)
    }
}