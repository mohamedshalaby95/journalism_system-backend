const router=require('express').Router();
const adminControll=require('../controlls/admin');
const adminAuth=require("../middelewares/adminAuth");
const administrator=require("../middelewares/administrator")



router.post("/",
//[adminAuth,administrator],
adminControll.addAdmin)
router.get("/",adminControll.getAdmins)
router.patch("/",
//adminAuth,
adminControll.updateAdmin)
router.delete("/:id",adminControll.deleteAdmin)
module.exports=router  

