const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model("SubCategories", SubCategorySchema);

module.exports = SubCategory;
