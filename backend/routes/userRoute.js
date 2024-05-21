const express = require('express');
const { test, updateUser, deleteUser, signout, getUser } = require('../controller/userController');
const { verifyToken } = require('../utils/verifyUser');
const router = express.Router()

router.get('/test', test)

router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout', signout)
router.get('/getby/:userId', getUser)


module.exports = router;