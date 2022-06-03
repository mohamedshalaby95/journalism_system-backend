const router = require("express").Router();
const SubCategoryController = require("../controlls/SubCategoryController");

router.get("/:category", SubCategoryController.getAllSubCategoriesByCategory);
router.post("/", SubCategoryController.addSubCategory);
router.put("/:id", SubCategoryController.updateSubCategory);
router.delete("/:id", SubCategoryController.deleteSubCategory);


module.exports = router;
