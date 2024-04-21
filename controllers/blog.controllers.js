import Blog from "../models/blog.model.js";
import {calculateReadingTime} from "../middleware/middelwares.js";

// get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    // pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    //filtering by state, author and tags
    const state = req.query.state || "published";

    // filter object
    const filter = {
      state: state,
    };
    if (req.query.author) {
      filter.author = req.query.author;
    }
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    // Count total documents
    const totalData = await Blog.countDocuments(filter);
    // Calculate total pages
    const totalPages = Math.ceil(totalData / limit);

    let blogsQuery = Blog.find(filter);

    if (req.query.order) {
      blogsQuery = blogsQuery.sort(req.query.order);
    }

    const blogs = await blogsQuery
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author")
      .exec();
    res.status(200).json({
      message: "Blogs fetched successfully",
      blogs,
      totalData,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("Error getting blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get single blog
export const getBlog = async (req, res) => {
  try {
    // anytime the blog is requested the read_count should be incremented by 1
    await Blog.findByIdAndUpdate(req.params.id, {$inc: {read_count: 1}}, {new: true});
    const blog = await Blog.findById(req.params.id).populate("author");
    res.status(200).json({
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    console.error("Error getting blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//create blog
export const createBlog = async (req, res) => {
  try {
    const creator = req.user.userId;
    const {
      title,
      description,
      state,
      author,
      tags,
      body,
      reading_time,
      read_count,
    } = req.body;
    const estimatedReadingTime = calculateReadingTime(body);
    const blog = await Blog.create({
      title,
      description,
      state,
      author: creator,
      tags,
      body,
      reading_time: estimatedReadingTime,
      read_count,
    });
    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update blog
export const updateBlog = async (req, res) => {
  try {
    // check if the author of the blog is the same as the user before updating the state
    const blog = await Blog.findById(req.params.id);
    if (blog.author != req.user.userId) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this blog" });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Blog deleted successfully",
      blog,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update blog state to published
export const publishBlog = async (req, res) => {
  try {
    // check if the author of the blog is the same as the user before updating the state
    const blog = await Blog.findById(req.params.id);
    if (blog.author != req.user.userId) {
      return res
        .status(401)
        .json({ message: "You are not authorized to publish this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { state: "published" },
      { new: true }
    );
    res.status(200).json({
      message: "Blog published successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error publishing blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
