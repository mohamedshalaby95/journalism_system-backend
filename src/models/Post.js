const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Post = new schema({
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
  comments: [ {comment:String,user:{  type: schema.Types.ObjectId, ref: "User" }}],
  auther: {type: schema.Types.ObjectId, ref: "Admin" , required:true},
  regien: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Post", Post);
