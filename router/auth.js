const {registerUser, loginUser, forgotPassword, resetPassword, uploadProfile, addInterest, addPurpose, showMe} = require("../controllers/authController");
const {attachCookies} = require("../utils");
const {getCookies} = require("../utils/attachCookies");
const router = require('express').Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/showMe').get(getCookies, showMe)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)
router.route('/upload-photo').post(getCookies, uploadProfile)
router.route('/add-interests').post(getCookies, addInterest)
router.route('/add-purpose').post(getCookies, addPurpose)

module.exports = router