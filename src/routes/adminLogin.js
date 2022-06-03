const router=require('express').Router()
const {login}=require('../controlls/adminLogin')

router.post('/',login)

module.exports=router