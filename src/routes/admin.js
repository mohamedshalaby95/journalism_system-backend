const router=require('express').Router();
const adminControll=require('../controlls/admin');
const adminAuth=require("../middelewares/adminAuth");
const administrator=require("../middelewares/administrator")

router.post("/",[adminAuth,administrator],adminControll.addAdmin)
router.patch("/:id",adminAuth,adminControll.updateAdmin)
module.exports=router