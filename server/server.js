import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createClient } from "redis";

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
