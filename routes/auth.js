const express = require("express");
const router = express.Router();
const {login, register, deleteUser, getUsers, getUser} = require('../controllers/auth')

router.post('/login', login)
router.route('/register').post(register)
router.delete('/delete', deleteUser)
router.route('/user').get(getUsers)
router.route('/userone').get(getUser)

module.exports = router;
