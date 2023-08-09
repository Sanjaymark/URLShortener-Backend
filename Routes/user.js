import express, { response } from "express";
import { User, generateToken } from "../models/users.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


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
}); 

//Route for Forgot-password
router.post("/forgot-password", async (req,res) =>
{
    try 
    {
        //Find the user by email
        const user = await User.findOne({ email: req.body.email});
        if(!user)
        {
            return res.status(404).send({ error : "User not Found"});
        }
        
        //Generate a random rest token
        const resetToken = Math.random().toString(36).slice(2);

        //Store the resetToken in user's record
        user.resetToken = resetToken;
        await user.save();
        res.status(200).send({message:"Random String generated and stored successfully", resetToken})

        //Send reset link via email
        const transporter = nodemailer.createTransport(
            {
                //Configure email service
                service:"Gmail",
                auth:{
                    user:process.env.EMAIL_ID,
                    password:process.env.EMAIL_PASSWORD,
                }

            }
        );

        const resetLink = `https://64d30b38debf9d1bcdab5af3--zesty-puffpuff-4ae4b2.netlify.app/?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_ID, 
            to: user.email,
            subject: "Password Reset",
            text: `Click the following link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) =>
        {
            if (error) {
                console.log("Error sending email:", error);
                return res.status(500).send({ error: "Failed to send email" });
            }
            console.log("Email sent:", info.response);
            res.status(200).send({ message: "Password reset email sent" });
        });
    } 
    catch(error)
    {
        //error handling
        console.log(error);
        res.status(500).send({ error:"Internal Server Error"});
    }
})


//Route for reset password
router.post("/reset-password/:token", async(req,res)=>
{
    try
    {
        const{token} = req.params;
        
        //Find user by reset token
        const user = await User.findOne({resetToken: token});

        if(!user)
        {
            return res.status(404).send({ error: 'Invalid reset token' });
        }
        if(token !== user.resetToken) 
        {
            return res.status(400).json({ error: 'Reset token not found in DB' });
        }
            // Update user's password and clear the reset token
            const salt = await bcrypt.genSalt(10);
            const hashedPassword =  await bcrypt.hash(req.body.password, salt);

            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password updated successfully'});
    }

    catch(error)
    {
         //error handling
         console.log(error);
         res.status(500).send({ error:"Internal Server Error"});
    }
})


export const userRouter = router;