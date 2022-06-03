const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
       unique: true
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Categories", CategorySchema);

module.exports = Category;
