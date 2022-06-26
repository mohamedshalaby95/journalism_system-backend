const categoryValidators = require("../validations/CategoryValidators");
const Category = require("../models/Category");
const PostsModel =require("../models/Post")
const SubCategoriesModel = require('../models/SubCategory')

const addCategory = async (req, res) => {
  const { error } = categoryValidators(req.body);

  if (error) {
    res.status(401);
    throw new Error(`${error.details[0].message}`);
  }

  try {
    const newCategory = await new Category(req.body);
    const category = await newCategory.save();
    if (category) {
      res.status(200).send(category);
    } else {
      res.status(400).send("Something Wrong");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories) {
      console.log("fetched",categories)
      res.status(200).send(categories);
    } else {
      res.status(404).send("Data Not Found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const updateCategory = async (req, res) => {
  try {
    const { error } = categoryValidators(req.body);

    if (error) {
      res.status(401);
      throw new Error(`${error.details[0].message}`);
    }
    const category = await Category.findById(req.params.id);
    if (category) {
     await Category.updateOne({ _id: category.id }, req.body, {
        returnOriginal: true,
      });
      res.status(200).send(category);
    } else {
      res.status(400).send("Category Not Found");
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Server Error");
  }
};

const deleteCategory = async (req, res) => {
  // try {
    const category = await Category.findById(req.params.id);
    if (category) {
      const delack = await Category.deleteOne({ _id: category.id });
      return res.status(200).json(delack);
    } else {
      return res.status(400).json("Category Not Found");
    }
  // } catch (err) {
  //   return res.status(500).json("Server Error");
  // }
};
const getCategoryPostsBycategoryName =async(req,res,next)=>{
  const {category}=req.params
   const posts=await PostsModel.find({category})
}
const getByCategory=async(req,res,next)=>{
  const {categoryId} = req.params;
const subCategories = await SubCategoriesModel.find({parent:categoryId})
 res.status(200).json(subCategories) ; 
}

module.exports = {
  deleteCategory,
  addCategory,
  getAllCategories,
  updateCategory,
  getByCategory
};
