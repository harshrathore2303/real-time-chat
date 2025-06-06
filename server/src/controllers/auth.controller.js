import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import GenerateToken from "../utils/GenerateToken.js";
import cloudinary from "../utils/cloudinary.js";

const signup = asyncHandler(async (req, res) => {
  const { email, fullName, password } = req.body;
  console.log(req.body);

  if (fullName == "" || email === "" || password === "") {
    return res.status(400).json({ message: "All fields are required" });  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  const existed = await User.findOne({ email });

  if (existed) {
    return res.status(400).json({ message: "Email already exists" });
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
    return res.status(500).json({ message: "Something went wrong"});
  }
  GenerateToken(user._id, res);
  await user.save();
  return res.status(200).json(user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email == "" || password == "") {
    return res.status(400).json({ message: "Invalid credentials"});
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (!existedUser) {
    return res.status(400).json({ message: "User not found"});
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existedUser.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid Password" });
  }

  const user = await User.findOne(existedUser._id).select("-password");

  GenerateToken(existedUser._id, res);

  return res.status(200).json(user);
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({message: "Loggout Successfully"});
});

const updateProfile = asyncHandler(async (req, res) => {
  const { profile } = req.body;
  const userId = req.user._id;

  if (!profile) {
    return res.status(400).json({ message: "Profile is required"});
  }
  // console.log(profile)
  const uploadResponse = await cloudinary.uploader.upload(profile);

  const updatedUser = await User.findByIdAndUpdate(userId, {profile: uploadResponse.secure_url}, {new: true});
  return res.status(200).json(updatedUser);
});

const checkAuth = asyncHandler(async (req, res) => {
  return res.status(200).json(req.user);
})

export { login, signup, logout, updateProfile, checkAuth };
