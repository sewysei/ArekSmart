import { UserModel } from "../../models/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const existingUser = await UserModel.findOne({ email });

    if (!name) {
      return res.status(400).json({
        status: "Failed",
        message: "Nama Lengkap tidak boleh kosong",
      });
    }
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
    if (!passwordConfirmation) {
      return res.status(400).json({
        status: "Failed",
        message: "Konfirmasi Password tidak boleh kosong",
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "Failed",
        message: "Masukkan email yang valid.",
      });
    }
    if (existingUser) {
      return res.status(400).json({
        status: "Failed",
        message: "Email sudah terdaftar",
      });
    }
    if (password != passwordConfirmation) {
      return res.status(400).json({
        status: "Failed",
        message: "Password dan confirm password tidak cocok",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await new UserModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.status(200).json({
      status: "Success",
      message: "Pendaftaran berhasil",
    });
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      message: `Catch error: ${err.message}`,
    });
  }
};
