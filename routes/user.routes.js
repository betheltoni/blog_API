import { Router } from "express";
import { getAllUsers, signup, getUser, login } from "../controllers/user.controllers.js";

export const userRouter = Router();

// route for signup
userRouter.post('/signup', signup);
userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUser)
userRouter.post('/login', login)