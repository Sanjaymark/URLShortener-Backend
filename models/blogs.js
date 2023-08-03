import mongoose,{ mongo } from "mongoose";
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        date:{
            type:String,
            required:true,
        },
        blog:{
            type:String,
            required:true,
        },
        user:{
            type:ObjectId,
            ref: "user",
        },
    }
)

const Blog = mongoose.model("blog", blogSchema);
export { Blog };