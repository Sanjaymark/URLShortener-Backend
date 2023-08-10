import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {dbConnection} from "./db.js";
import { urlRouter } from "./Routes/url.js";
import { userRouter } from "./Routes/user.js";



//configure env
dotenv.config();

//DB Connection
dbConnection();

const PORT = process.env.PORT;

//iniitalizing server
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/user", userRouter); 
app.use("/url", urlRouter);


//start Listening
app.listen(PORT, ()=>console.log(`server started in localhost:${PORT}`));