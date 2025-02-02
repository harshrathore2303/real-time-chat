import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import GenerateToken from "../utils/GenerateToken.js";
import cloudinary from "../utils/cloudinary.js";

const signup = asyncHandler(async (req, res) => {
  const { email, fullName, password } = req.body;
  console.log(req.body);

  if (fullName == "" || email === "" || password === "") {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existed = await User.findOne({ email });

  if (existed) {
    throw new ApiError(400, "User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const user = await User.findById(newUser._id).select("-password");

  if (!user) {
    throw new ApiError(500, "Something went wrong");
  }
  GenerateToken(user._id, res);
  await user.save();
  return res.status(200).json(new ApiResponse(200, user, "Signup Successfull"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email == "" || password == "") {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (!existedUser) {
    throw new ApiError(400, "Invalid Email");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existedUser.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is not correct");
  }

  const user = await User.findOne(existedUser._id).select("-password");

  GenerateToken(existedUser._id, res);

  return res.status(200).json(new ApiResponse(200, user, "Signup Successfull"));
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json(new ApiResponse(200, { message: "Logout" }));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { profile } = req.body;
  const userId = req.user._id;

  if (!profile) {
    throw new ApiError(400, "profile is required");
  }

  const uploadResponse = await cloudinary.uploader.upload(profile);

  const updatedUser = await User.findByIdAndUpdate(userId, {profile: uploadResponse.secure_url}, {new: true});
  res.status(200).json(new ApiResponse(200, updatedUser, "Uploaded Successfully"))
});

const checkAuth = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "Current login user details"));
})

export { login, signup, logout, updateProfile, checkAuth };
