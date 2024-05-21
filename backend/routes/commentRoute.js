const express = require('express')
const { createComment, getPostComment, likeCommment, editComment, deleteComment, getComments } = require('../controller/commentController')
const { verifyToken } = require('../utils/verifyUser')

const router = express.Router()

router.post('/create', verifyToken, createComment)
router.get('/getPostComment/:postId', getPostComment)
router.put('/likeComment/:commentId', verifyToken, likeCommment)
router.put('/editComment/:commentId', verifyToken, editComment)
router.delete('/deleteComment/:commentId', verifyToken, deleteComment)
router.get('/getcomments', verifyToken, getComments)
module.exports = router;