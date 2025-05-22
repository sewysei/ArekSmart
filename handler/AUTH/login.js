import jwt from "jsonwebtoken";
import { UserModel } from "../../models/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const loginUSer = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      status: "Failed",
      message: "Email tidak boleh kosong",
    });
  }
  if (!password) {
    return res.status(400).json({
      status: "Failed",
      message: "Password tidak boleh kosong",
    });
  }

  try {
    const checkUser = await UserModel.findOne({ email });

    if (!checkUser) {
      return res.status(400).json({
        status: "Failed",
        message: "Email atau password tidak valid",
      });
    }

    const isMatch = bcrypt.compare(password, checkUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Email atau password salah" });
    }

    const token = jwt.sign({ userId: checkUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // use HTTPS in production
      sameSite: "Strict", // prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      status: "Success",
      message: "Login berhasil",
      token,
    });
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      message: `Catch error: ${err.message}`,
    });
  }
};
