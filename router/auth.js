const {registerUser, loginUser, forgotPassword, resetPassword, uploadProfile, addInterest, addPurpose} = require("../controllers/authController");
const router = require('express').Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)
router.route('/upload-photo').post(uploadProfile)
router.route('/add-interests').post(addInterest)
router.route('/add-purpose').post(addPurpose)

module.exports = router