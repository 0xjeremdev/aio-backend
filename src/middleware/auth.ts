import { Response, NextFunction } from "express";
import User from "../models/auth.model";
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const getToken = req.header("Authorization");

    if (!getToken)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const token = getToken.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const user = await User.findOne({ _id: decoded?.user?._id }).select(
      "-password"
    );
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    req.user = user;

    next();
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};
