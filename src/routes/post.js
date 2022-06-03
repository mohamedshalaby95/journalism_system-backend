const express = require('express');
const {getAllUsers ,add , del , update,getPostById} = require('../controlls/post')
const router = express.Router();
router.get('/get_all',getAllUsers)
router.get('/get_one/:id',getPostById)
router.post('/add',add)
router.delete('/delete',del)
router.put('/update',update)


module.exports = router;