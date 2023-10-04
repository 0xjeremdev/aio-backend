import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import User from "../models/auth.model";
// import ErrorHandler from "../utils/errorHandler";
import createToken from "../utils/jwtToken";
import { errorHandler } from "../helpers/dbErrorHandling";
import { encryptPassword } from "../utils/authUtils";

// Register Account
export const registerController = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error: any) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    } else {
      const old_user = await User.findOne({ username }).exec();

      if (old_user) {
        return res.status(400).json({
          errors: "This username is already used!",
        });
      }

      const user = new User({
        username,
        hashed_password: encryptPassword(password),
      });

      const token = createToken(user, "7d");
      user
        .save()
        .then((data) => {
          return res.json({
            success: true,
            message: "Signup success",
            token,
            user: data,
          });
        })
        .catch((error) => {
          return res.status(401).json({
            errors: errorHandler(error),
          });
        });
    }
  }
);

// Login Account
export const signinController = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    } else {
      const user = await User.findOne({
        username,
      }).exec();

      if (!user) {
        return res.status(400).json({
          errors: "Invalid username or password.",
        });
      } else if (user.hashed_password != encryptPassword(password)) {
        console.log(password, user.hashed_password, encryptPassword(password));
        return res.status(400).json({
          errors: "Invalid username or password.",
        });
      } else {
        const token = createToken(user, "7d");
        return res.json({
          success: true,
          message: "Signin success",
          token,
          user,
        });
      }
    }
  }
);
