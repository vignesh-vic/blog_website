const express = require('express')
const { verifyToken } = require('../utils/verifyUser')
const { create, getposts, deletepost, updatepost,  } = require('../controller/postController')
const { getusers } = require('../controller/userController')

const router = express.Router()

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId',verifyToken, deletepost)
router.put('/updatepost/:postId/:userId',verifyToken,updatepost)
router.get('/getusers', verifyToken, getusers)
module.exports = router;
