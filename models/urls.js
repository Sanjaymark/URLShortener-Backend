import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
    {
        shortUrl:{
            type:String
        },
        longUrl:{
            type:String
        },
        clicks:{
            type: Number,
            default: 0
        },
        createdAt:{
            type: Date,
            default: Date.now
        }
    }
)

const Url = mongoose.model("Url", UrlSchema);

export { Url }; 
