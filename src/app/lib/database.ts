import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export default async function dbConnect() {
  if (!MONGODB_URI)
    throw new Error("MONGODB_URL environment variable not defined");

  await mongoose.connect(MONGODB_URI);

  return mongoose;
}
