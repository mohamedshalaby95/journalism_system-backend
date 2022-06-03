const subCategoryValidators = require("../validations/SubCategoryValidators");

const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");

const addSubCategory = async (req, res) => {
    const { error } = subCategoryValidators(req.body);

    if (error) {
      res.status(401);
      throw new Error(`${error.details[0].message}`);
    }
  try {
    

    const category = await Category.findOne({ title: req.body.parent });
    if (category) {
      const newSubCategory = await new SubCategory({
        title: req.body.title,
        parent: category._id,
      });
      const subCategory = await newSubCategory.save();
      if (subCategory) {
        res.status(200).send(subCategory);
      } else {
        res.status(400).send("Something Wrong");
      }
    } else {
      res.status(400).send("Category Not Found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const getAllSubCategoriesByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ title: req.params.category });

    const subCategories = await SubCategory.find({ parent: category.id });
    if (subCategories) {
      res.status(200).send(subCategories);
    } else {
      res.status(404).send("Data Not Found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const updateSubCategory = async (req, res) => {
    const { error } = subCategoryValidators(req.body);

    if (error) {
      res.status(401);
      throw new Error(`${error.details[0].message}`);
    }
  try {
    
    const category = await Category.findOne({ title: req.body.parent });
    const subCategory = await SubCategory.findById(req.params.id);
    if (subCategory) {
      await SubCategory.updateOne(
        { _id: subCategory.id },
        {
          title: req.body.title,
          parent: category._id,
        },
        {
          returnOriginal: true,
        }
      );
      res.status(200).send(subCategory);
    } else {
      res.status(400).send("Category Not Found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (subCategory) {
      await SubCategory.deleteOne({ _id: subCategory.id });
      res.status(200).send(subCategory);
    } else {
      res.status(400).send("Category Not Found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllSubCategoriesByCategory,
  deleteSubCategory,
  addSubCategory,
  updateSubCategory,
};
