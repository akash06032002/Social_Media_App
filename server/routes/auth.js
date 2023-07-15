import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

// Define a POST route for the "/login" endpoint and specify the "login" controller function to handle the request.
router.post("/login", login);

export default router;
