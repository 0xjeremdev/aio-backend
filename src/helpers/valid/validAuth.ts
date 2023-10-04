import { check } from "express-validator";

export const validAuth = [
  check("username", "Username is required")
    .notEmpty()
    .isLength({
      min: 3,
    })
    .withMessage("Username must be at least 6 characters."),
  check("password", "password is required")
    .notEmpty()
    .isLength({
      min: 6,
    })
    .withMessage("Password must be at least 6 characters."),
];
