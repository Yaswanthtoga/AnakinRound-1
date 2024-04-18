import express from 'express';
import { login, register } from '../controllers/auth.controller';
const router = express.Router();

// Register
router.post("/register",register);

// Login
router.post("/login",login);

export default router;