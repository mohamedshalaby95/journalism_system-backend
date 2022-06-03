const PostModel = require("../models/Post");
const UserModel = require("../models/user")
const {
  addValidation,
  delValidation,
  updateValidation,
} = require("../validations/post");

const getPostById = async (req, res, next) => {
  const id = req.params.id;
  const post = await PostModel.findById(id);
  if (!post) {
    return res.status(400).json({
      message: "this post dosen't exist",
    });
  }
  res.status(200).json(post);
};

const getAllUsers = async (req, res, next) => {
  //   const posts = await PostModel.find();
  const posts = await PostModel.aggregate([
    {
      $group: {
        _id: "$category",
        posts: { $push: "$$ROOT" },
      },
    },
  ]);
  if(req.user)
  {
    const user = await UserModel.findById(req.user);
    const response = posts.filter(category=>(user.intrests.find(category._id)))
    return  res.status(200).json(response);
   
  }

  res.status(200).json(posts);
};

const add = async (req, res, next) => {
  const { title, description, image, category, subCategory, regien } = req.body;
  const { value, error } = addValidation(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  console.log(value);
  const post = await new PostModel(req.body).save();
  res.status(200).json(post);
};
const del = async (req, res, next) => {
  const { _id } = req.body;
  const { value, error } = delValidation(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  const delAck = await PostModel.findOneAndDelete({ _id });
  if (!delAck) {
    return res.status(400).json({
      message: "this post dosen't exist",
    });
  }
  res.status(200).json(delAck);
};
const update = async (req, res, next) => {
  const { _id } = req.body;
  const { value, error } = updateValidation(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  const updateAck = await PostModel.findOneAndUpdate({ _id }, req.body);
  res.status(200).send(updateAck);
};

module.exports = { getAllUsers, add, del, update, getPostById };
