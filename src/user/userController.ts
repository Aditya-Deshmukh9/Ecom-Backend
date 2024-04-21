import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModal from "./userModal";
import bcrypt from "bcrypt";
import { User } from "./userTypes";
import { config } from "../config/config";
import { sign } from "jsonwebtoken";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const error = createHttpError(400, " All fields are required");
    return next(error);
  }

  // ..database call

  try {
    const user = await userModal.findOne({ email });

    if (user) {
      const error = createHttpError(500, "User already exists");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while Getting User"));
  }

  const hashPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModal.create({
      username,
      email,
      password: hashPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating new User"));
  }

  try {
    const token = sign({ sub: newUser._id }, config.jwtsecret as string, {
      expiresIn: "2d",
    });

    res.json({
      message: "user Registered successfully",
      response: newUser._id,
      token: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while sigining the jwt token"));
  }
};

export default registerUser;
