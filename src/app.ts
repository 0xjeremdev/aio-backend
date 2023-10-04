import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import connectDB from "./config/db";

import connectSocket from "./controllers/socket.controller";

// import routers
import authRouter from "./routes/auth.route";
import errorMiddleware from "./middleware/error";

const app = express();

app.use(cors());
dotenv.config();

// Connect to Database
connectDB();

// Body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Socket io
const server = http.createServer(app);
connectSocket(server);

// Use Routes
app.use("/auth", authRouter);

// Middleware for Errors
app.use(errorMiddleware);

const port: any = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`App is running on port: ${process.env.PORT}`);
});
