const router=require('express').Router()
//get user_data
const {autherData}=require("../controlls/auther")

router.get('/:id',autherData)

module.exports=router
