const express = require('express');
const authMiddleware = require("../middelewares/auth")
const authEditor = require("../middelewares/editor")
const authReviewer  = require("../middelewares/reviewer")
const authAdmin  = require("../middelewares/adminAuth")
const {getAllPosts ,add , del , update,getPostById} = require('../controlls/post')
const router = express.Router();
router.get('/get_all',[authMiddleware],getAllPosts)
router.get('/get_one/:id',getPostById)
router.post('/add',[authAdmin,authEditor],add)
router.delete('/delete',[authAdmin,authReviewer],del)
router.put('/update',[authAdmin,authEditor],update)


module.exports = router;