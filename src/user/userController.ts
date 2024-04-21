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
      token,
      newUser,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while sigining the jwt token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are Required"));
  }
  const user = await userModal.findOne({ email });
  if (!user) {
    return next(createHttpError(400, "User not found"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(400, "Username or password mismatch"));
  }
  const token = sign({ sub: user._id }, config.jwtsecret as string, {
    expiresIn: "2d",
  });

  res.json({ message: "User login successfully", token, user });
};

export { registerUser, loginUser };
