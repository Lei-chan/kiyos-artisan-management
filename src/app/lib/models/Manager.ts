import mongoose from "mongoose";

const ManagerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, select: false, required: true },
    isAllowedToAdd: Boolean,
  },
  { timestamps: true },
);

export default mongoose.models.Manager ||
  mongoose.model("Manager", ManagerSchema);
