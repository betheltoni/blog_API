import { Router } from "express";
import { getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog, publishBlog } from "../controllers/blog.controllers.js";
import { verifyToken } from "../middleware/middelwares.js";

export const blogRouter = Router();


blogRouter.get('/:id', getBlog)
blogRouter.patch('/:id', verifyToken, publishBlog)
blogRouter.post('/', verifyToken, createBlog)
blogRouter.put('/:id', verifyToken, updateBlog)
blogRouter.delete('/:id', verifyToken, deleteBlog)
blogRouter.get('/',  getAllBlogs)

