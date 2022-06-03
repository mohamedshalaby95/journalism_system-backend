const router = require("express").Router();
const CategoryController = require("../controlls/CategoryController");

router.get("/", CategoryController.getAllCategories);
router.post("/",  CategoryController.addCategory);
router.put("/:id",  CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
