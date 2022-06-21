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
} = require("../controlls/post");
const router = express.Router();
router.get("/get_all", [authMiddleware], getAllPosts);
router.get("/get_one/:id", getPostById);
router.post("/add", [authAdmin], add);
// [authAdmin, authEditor]
router.delete("/delete/:id", [authAdmin], del);
// [authAdmin, authReviewer]
router.put("/update", [authAdmin, authEditor], update);
// ______admins_____
router.get("/admin/all", [authAdmin, authReviewer], getAllPostsAdmin);
router.get(
  "/status/:status",
  // [authAdmin, authReviewer],
     [authAdmin],
  getPostsByStatus
);
router.get("/admin/accept/:id", [authAdmin], acceptPost);
// [authAdmin, authReviewer]
router.get("/admin/cancel/:id", [authAdmin], cancelPost);
// [authAdmin, authReviewer]
router.get(
  "/admin/get_all_by_editor_id/:id",
  [authAdmin, authEditor],
  getPostByeditorId
);
module.exports = router;
