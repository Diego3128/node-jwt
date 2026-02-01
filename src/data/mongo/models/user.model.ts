import { Schema } from "mongoose";
import mongoose from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
    trim: true,
    lowercase: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [2, "Email too short"],
    maxlength: [70, "Email cannot exceed 70 characters"],
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
    minlength: [6, "Password must be atleast 6 characters long"],
    maxlength: [100, "Password cannot exceed 100 characters"],
  },
  img: {
    type: String,
    default: null,
  },
  role: {
    type: [String],
    default: ["USER_ROLE"],
    enum: {
      values: ["USER_ROLE", "ADMIN_ROLE"],
      message: "Role must be either USER_ROLE or ADMIN_ROLE",
    },
  },
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret, options) {
    (ret as any).id = ret._id;
    delete (ret as any)._id;
    delete (ret as any).password;
    return ret;
  },
})
// generate model
export const UserModel = mongoose.model("User", UserSchema);
