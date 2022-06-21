const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Post = new schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    likes: [{ type: schema.Types.ObjectId, ref: "User" }],
    comments: [
      { comment: String, user: { type: schema.Types.ObjectId, ref: "User" } },
    ],
    auther: { type: schema.Types.ObjectId, ref: "admin", required: true },
    region: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "canceled"],
      default: "pending",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", Post);
