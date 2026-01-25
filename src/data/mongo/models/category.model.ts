import { Schema } from "mongoose";
import mongoose from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The category name is required"],
      trim: true,
      lowercase: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    available: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // same model name of User
      required: [true, "The category must belong to a valid user"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);
// generate model
export const CategoryModel = mongoose.model("Category", CategorySchema);
