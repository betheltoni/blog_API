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
