const router=require('express').Router();
const userControll=require('../controlls/user');
const adminstritorRole=require('../middelewares/administrator')
const authAdmin=require('../middelewares/adminAuth')





router.post("/",userControll.addUser)
router.get("/",[authAdmin,adminstritorRole],userControll.getUser)
router.patch("/",userControll.updateUser)
module.exports=router