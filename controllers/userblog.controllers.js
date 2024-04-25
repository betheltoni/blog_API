import { populate } from "dotenv";
import Blog from "../models/blog.model.js";
export const getMyBlogs = async (req, res) => {
  try {
    const creator = req.user.userId;
    // pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // filterig by state
    const state = req.query.state || "published";
    // query options
    const options = {
      page: page,
      limit: limit,
      populate: "author",
    };

    // filter object
    const filter = { author: creator, state: state };

    // Count total documents
    const totalData = await Blog.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalData / limit);
    const blogs = await Blog.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author")
      .exec();
    res.status(200).json({
      message: "My blogs fetched successfully",
      blogs,
      totalData,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("Error getting my blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get my blog by id
export const getMyBlogById = async (req, res) => {
  try {
    // anytime the blog is requested the read_count should be incremented by 1
    await Blog.findByIdAndUpdate(req.params.id, {$inc: {read_count: 1}}, {new: true});
    const blog = await Blog.findById(req.params.id).populate("author");
    res.status(200).json({
      message: "My blog fetched successfully",
      blog,
    });
  } catch (error) {
    console.error("Error getting my blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete my blog
export const deleteMyBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "My blog deleted successfully",
      blog,
    });
  } catch (error) {
    console.error("Error deleting my blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update my blog
export const updateMyBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "My blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Error updating my blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// publish my blog
export const publishMyBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, {
      state: "published",
    });
    res.status(200).json({
      message: "My blog published successfully",
      blog,
    });
  } catch (error) {
    console.error("Error publishing my blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
