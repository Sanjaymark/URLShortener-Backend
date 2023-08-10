import express from "express";
import {nanoid}  from "nanoid";
import { Url } from "../models/urls.js"

const router = express.Router();

router.post("/shorteningUrl", async(req,res) =>
{
    try 
    {
        const longUrl = req.body.url;

        const shortUrl = nanoid(7); //Generate a short URL

        const url = new Url({shortUrl,longUrl});
        await url.save();
        
        console.log(url);

        res.status(200).send({message:"URL Shortened Successfully", data:url})
    } 
    catch(error) 
    {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get("/:shortUrl", async (req, res) =>
{
    try 
    {
        const {shortenedUrl} = req.params;

        // Finding the URl
       const url = await Url.findOne({ shortUrl: shortenedUrl });
       
       
       if (!url)
       {
        return res.status(404).json({ error: "Short Url not found"})
       }

       url.clicks++;
       await url.save();

       res.redirect(url.longUrl);
       console.log(url.longUrl)
    } 
    catch(error) 
    {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.get('/shortUrls/created', async (req, res) => {
    try {
        const urls = await Url.find({}, 'shortUrl'); // Only fetch the shortUrl property
        const shortUrls = urls.map(url => url.shortUrl);
        res.status(200).json(shortUrls);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });



export const urlRouter = router;