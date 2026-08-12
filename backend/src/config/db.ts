import mongoose from "mongoose";

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGODB_URI as string);

  console.log("MongoDB connected");
};

export default connectDB;
