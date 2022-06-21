const AdminModel = require("../models/admin");
const PostsModel = require("../models/Post");
const autherData = async (req, res, next) => {
  const { id } = req.params;
  const userInfo = await AdminModel.find({ role: "editor", _id: id });
  const posts = await PostsModel.find({ auther: id });
  let data={}
  if (userInfo.length > 0) {
     data = {
      fullName: userInfo[0].firstName + " " + userInfo[0].lastName,
      image:userInfo[0].image,
      posts: posts,
      numOfPosts: posts.length,
    };
  } else {
    return res.status(404).json({ messgae: "user not found" });
  }
  res.status(200).json(data);
};
module.exports = {
  autherData,
};
