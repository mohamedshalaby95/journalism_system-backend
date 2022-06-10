const router = require("express").Router();
const CategoryController = require("../controlls/CategoryController");
const adminAuth = require("../middelewares/adminAuth")
const administrator = require("../middelewares/administrator")

router.get("/",CategoryController.getAllCategories);
router.post("/",
// [adminAuth,administrator], 
 CategoryController.addCategory);
router.put("/:id",
//[adminAuth,administrator],
  CategoryController.updateCategory);
router.delete("/:id",
// [adminAuth,administrator], 
CategoryController.deleteCategory);

module.exports = router;
