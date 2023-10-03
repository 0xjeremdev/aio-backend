import express from "express";
import {
  registerController,
  signinController,
} from "../controllers/auth.controller";
import { validAuth } from "../helpers/valid/validAuth";

const router = express.Router();

router.post("/register", validAuth, registerController);

router.post("/login", validAuth, signinController);

export default router;
