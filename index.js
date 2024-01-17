import express from "express"
import mongoose from "mongoose";
import jobRouter from "./routers/jobRouter.js";
import authRouter from "./routers/authRouter.js";
import cors from "cors";



const DB_URL=`mongodb+srv://nersesgrigoryan94:nersesgrigoryan94@cluster0.1kwe2yv.mongodb.net/?retryWrites=true&w=majority`
const PORT=8080
const app=express()
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions))
app.use(express.json())
app.use("/api",jobRouter)
app.use("/api",authRouter)

async function startApp(){
  try {
    await mongoose.connect(DB_URL)
    app.listen(PORT,()=>console.log("Server started"+" "+PORT))
  }
  catch (e) {
    console.log(e)
  }
}

await startApp()