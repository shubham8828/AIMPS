import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  shopname:{
    type:String,
    required:true,
    default:"N/A"

  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    localArea: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL or Base64 string
  },
  role:{
    type:String,
    default:"user"
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date when the document is created
  },
});

const User = mongoose.model("User", userSchema);
export default User;

