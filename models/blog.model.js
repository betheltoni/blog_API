
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  author: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  state: {
    type: String,
    default: "draft",
    enum: ["draft", "published"],
  },
  read_count: {
    type: Number,
    default: 0,
  },
  reading_time: {
    type: Number,
    default: 0,
  },
  tags: {
    type: Array,
  },
  body: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

// Create a blog model based on the schema
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
