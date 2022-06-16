const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    // image: {
    //   type: String,
    //   required: false,
    //   default:"",
    // },
  },
  { timestamps: true }
);

const Category = mongoose.model("Categories", CategorySchema);

module.exports = Category;
