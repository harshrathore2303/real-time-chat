import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profile: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
