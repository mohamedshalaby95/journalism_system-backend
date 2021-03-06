const router = require("express").Router();
const SubCategoryController = require("../controlls/SubCategoryController");
const adminAuth = require("../middelewares/adminAuth");
const administrator = require("../middelewares/administrator");

router.get("/getAll", SubCategoryController.getAll);
router.get("/:category", SubCategoryController.getAllSubCategoriesByCategory);

router.post("/",
// [adminAuth,administrator], 
SubCategoryController.addSubCategory);
router.put("/:id"
// ,[adminAuth,administrator]
, SubCategoryController.updateSubCategory);
router.delete("/:id",
// [adminAuth,administrator],
 SubCategoryController.deleteSubCategory);
router.get("/", SubCategoryController.getAllSubCategories);



module.exports = router;
