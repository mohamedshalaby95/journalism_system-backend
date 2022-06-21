const express = require("express");
const authMiddleware = require("../middelewares/auth");
const authEditor = require("../middelewares/editor");
const authReviewer = require("../middelewares/reviewer");
const authAdmin = require("../middelewares/adminAuth");
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
} = require("../controlls/post");
const router = express.Router();

router.get("/get_all", [authMiddleware], getAllPosts);
router.get("/get_one/:id", getPostById);
router.post(
  "/add",
  //  [authAdmin, authEditor],
     [authAdmin],
  add
);
router.delete("/delete/:id", 
// [authAdmin, authReviewer],
 del);
router.put("/update", [authAdmin, authEditor], update);
// ______admins_____
router.get("/admin/all", 
// [authAdmin, authReviewer], 
getAllPostsAdmin);
router.get(
  "/admin/status/:status",
  [authAdmin, authReviewer],
  getPostsByStatus
);
router.get("/admin/accept/:id", [authAdmin, authReviewer], acceptPost);
router.get("/admin/cancel/:id", [authAdmin, authReviewer], cancelPost);
router.get(
  "/admin/get_all_by_editor_id/:id",
  [authAdmin, authEditor],
  getPostByeditorId
);
router.patch("/add_view/:id", addView);
router.get("/most_viewed", mostViewed);
router.get("/most_recently", mostRecently);
module.exports = router;
