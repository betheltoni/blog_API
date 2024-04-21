import { Router } from "express";
import { getMyBlogs } from "../controllers/userblog.controllers.js";

export const userBlogRouter = Router();

userBlogRouter.get("/", getMyBlogs)

