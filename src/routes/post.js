const express = require("express");
const authMiddleware = require("../middelewares/auth");
const authEditor = require("../middelewares/editor");
const authReviewer = require("../middelewares/reviewer");
const authAdmin = require("../middelewares/adminAuth");
const auth = require("../middelewares/auth");
const {
  getAllPosts,
  add,
  del,
  update,
  getPostById,
  getAllPostsAdmin,
  getPostsByStatus,
  acceptPost,
  cancelPost,
  getPostByeditorId,
  addView,
  mostViewed,
  mostRecently,
  getIntrested,
  getPostsBySubCategory,
  getPostsByCategory,
  searchByKeyWord
} = require("../controlls/post");
const router = express.Router();

router.get("/get_all", [authMiddleware], getAllPosts);
router.get("/get_one/:id", getPostById);

router.post("/add", [authAdmin], add);
[authAdmin, authEditor]
router.delete("/delete/:id", [authAdmin], del);
[authAdmin, authReviewer]

router.put("/update",
 [authAdmin, authEditor],
  update);
// ______admins_____
router.get("/admin/all", 
[authAdmin], 
getAllPostsAdmin);
router.get(
  "/status/:status",
  [authAdmin, authReviewer],
     [authAdmin],
  getPostsByStatus
);
router.get("/admin/accept/:id", [authAdmin], acceptPost);
[authAdmin, authReviewer]
router.get("/admin/cancel/:id", [authAdmin], cancelPost);
[authAdmin, authReviewer]
router.get(
  "/admin/get_all_by_editor_id/:id",
  [authAdmin, authEditor],
  getPostByeditorId
);
router.patch("/add_view/:id", addView);
router.get("/most_viewed", mostViewed);
router.get("/most_recently", mostRecently);
router.get("/intrests",[auth],getIntrested);
router.get("/get_posts_by_sub_category/:subCategoryName",getPostsBySubCategory);
router.get('/get-post-by-category/:category',getPostsByCategory)
router.get('/search/:keyWord',searchByKeyWord)
module.exports = router;
