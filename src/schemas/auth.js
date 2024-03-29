import mongoose from "mongoose";

const Users=new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
})

export default mongoose.model("Users",Users)