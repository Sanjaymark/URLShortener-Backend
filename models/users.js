import mongoose,{ mongo } from "mongoose";
import jwt from "jsonwebtoken";

//Defining Schema

const userSchema = new mongoose.Schema(
    {
        name : {
            type:String,
            required:true,
            trim:true,
            maxlength:32
        },
        email :{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        contact:{
            type:Number
        },
        password:{
            type:String,
            required:true
        }
    }
)

const User = mongoose.model("user", userSchema);

const generateToken=(id)=>{
    return jwt.sign({id},process.env.SECRET_KEY)
}
export { User, generateToken };