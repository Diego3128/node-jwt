import { Schema } from "mongoose";
import mongoose from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
    trim: true,
    lowercase: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
    unique: [true, "There is already a product with that name"],
  },
  available: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, "The description is required"],
    trim: true,
    lowercase: true,
    minlength: [10, "The description must be at least 10 characters long"],
    maxlength: [500, "The description cannot exceed 500 characters"],
  },
  img: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // same model name of User
    required: [true, "The product must belong to a valid user"],
    index: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category", // same model name of Category
    required: [true, "The product must belong to a valid category"],
    index: true,
  },
});

ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    (ret as any).id = (ret as any)._id;
    delete (ret as any)._id;
    ret.img = ret.img ?? '';
    return ret;
  },
});

// generate model
export const ProductModel = mongoose.model("Product", ProductSchema);
