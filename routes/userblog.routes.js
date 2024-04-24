import { Router } from "express";
import {
  getMyBlogs,
  getMyBlogById,
  deleteMyBlog,
  publishMyBlog,
  updateMyBlog,
} from "../controllers/userblog.controllers.js";

export const userBlogRouter = Router();

userBlogRouter.get("/", getMyBlogs);
userBlogRouter.get("/:id", getMyBlogById);
userBlogRouter.delete("/:id", deleteMyBlog);
userBlogRouter.patch("/:id", publishMyBlog);
userBlogRouter.put("/:id", updateMyBlog);
