import { check } from "express-validator";

export const validAuth = [
  check("username", "Username is required")
    .notEmpty()
    .isLength({
      min: 3,
      max: 32,
    })
    .withMessage("Username must be between 3 to 32 characters"),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),
];
