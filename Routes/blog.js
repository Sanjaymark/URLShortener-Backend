import express from "express";
import { Blog } from "../models/blogs.js";

const router = express.Router();

//All Blogs
router.get("/all", async (req,res)=>{
    try
    {
        const blogs = await Blog.find();
        if(!blogs){
            return res.status(400).send({error:"Couldn't load document"})
        };
        res.status(200).send({message:"Successfully got all data", data: blogs})
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send({error: "Internal Server error"});  
    }
});

//Blogs of the user
router.get("/user", async (req,res)=>{
    try {
        const blogs = await Blog.find({ user: req.user.id}).populate("user","name email");
        if(!blogs){
            return res.status(400).send({ error: "Couldn't load document"});
        }
        res.status(200).send({message: "Successfully got data", data: blogs})
    } catch (error) {
        console.log(error);
        res.status(500).send({error: "Internal Server error"}); 
    }
});

// Add a new blog
router.post("/add", async (req,res)=>{
    try {
        const postDate =  new Date().toLocaleString();
        const blog = await new Blog({...req.body, date: postDate, user: req.user_id}).save();
        if(!blog){
            return res.status(400).json({message: "Error Uploading Blog"});
        }
        res.status(201).send({message: "Notes saved Successfully", data:blog});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: "Internal Server error"});
    }
});

// Edit a blog
router.put("/edit/:id", async (req,res)=>{
    try 
    {
        //select and update the blog
        const updatedBlog = await Blog.findOneAndUpdate({_id:req.params.id},{$set: req.body},{new: true});

        if(!updatedBlog)
        {
            return res.status(400).send({error: "Error Ocurred"});
        }
        
        res.status(200).send({message: "Successfully Updated", data: updatedBlog})
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send({error: "Internal Server error"});
    }
});

// Delete a blog
router.delete("/:id", async (req,res)=>{
    try
    {
        const deletedBlog = await Blog.findByIdAndDelete({ _id: req.params.id});
        if(!deletedBlog)
        {
            return res.status(400).send({ error: "Error Ocurred"});
        }
        res.status(200).send({ message: "Successfully Deleted"});
    } 
    catch (error)
    {
        console.log(error);
        res.status(500).send({error: "Internal Server error"});
    }
});


export const blogRouter= router;