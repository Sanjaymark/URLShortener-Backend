import express, { response } from "express";
import { User, generateToken } from "../models/users.js";
import bcrypt from "bcrypt";

const router = express.Router();

//signup a user to the website
router.post("/signup", async (req, res) =>{
    try{
        //find user already registered
        let user = await User.findOne({ email: req.body.email});
        if(user)
        {
            return res.status(400).send({error:"Email Already Exists"});
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // add the user to the database
        user= await new User({...req.body, password: hashedPassword}).save();

        //generate a token and give it as a response
        const token = generateToken(user._id);
        res.status(201).send({ message: "Successfully Created", token});
    }
    catch(error)
    {
        //error handling
        console.log(error);
        res.status(500).send({ error: "Internal Server error"});
    }
})

// login a user to the website

router.post("/login", async (req, res) =>{
    try{
        //find the user exist
        const user = await User.findOne({ email: req.body.email});
        if(!user)
        {
            return res.status(404).send({error: "Invalid email or Password"});
        }

        //validate the password
        const validatePassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if(!validatePassword)
        {
            return res.status(400).send({error:"Invalid Email or Password"});
        }

        //generate a token and give it as a response
        const token = generateToken(user._id);
        res.status(200).send({ message:"Successfully Logged in", token});
    }
    catch(error)
    {
        //error handling
        console.log(error);
        res.status(500).send({ error:"Internal Server Error"});
    }
})

export const userRouter = router;