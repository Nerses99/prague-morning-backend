import express from "express"
import mongoose from "mongoose";
import jobRouter from "./routers/jobRouter.js";
import authRouter from "./routers/authRouter.js";
import cors from "cors";
import Stripe from 'stripe';
import multer from "multer";
import Users from "./schemas/auth.js";
import resumeRouter from "./routers/resumeRouter.js";



const DB_URL = `mongodb+srv://nersesgrigoryan94:nersesgrigoryan94@cluster0.1kwe2yv.mongodb.net/?retryWrites=true&w=majority`
const PORT = 8080
const app = express()
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions))
app.use(express.json())
app.use("/api", jobRouter)
app.use("/api", authRouter)
app.use("/api", resumeRouter)

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});
// STRIPE
const stripe = new Stripe('sk_test_51OaEQrE5f8QAmzh8hJL8AQ49u87Q3jFxtHPsPm8keBNyTs7mIxUJF8OeRQxWm02YSwfEFLNgbsCbZkiyyiCxGE2x00NBhVttfQ');

app.post("/pay", async (res, req) => {
  const {email} = req.body
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5000,
    currency: 'usd',
    payment_method_types: ['card'],
    receipt_email: email
  });
  await res.json("client_secret", paymentIntent("client_secret"))
})



async function startApp() {
  try {
    await mongoose.connect(DB_URL)
    app.listen(PORT, () => console.log("Server started" + " " + PORT))
  } catch (e) {
    console.log(e)
  }
}

await startApp()