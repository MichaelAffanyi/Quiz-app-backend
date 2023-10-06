const {generalSettings, changePassword, deleteAccount} = require("../controllers/settingsController");
const router = require('express').Router()

router.route('/general').post(generalSettings)
router.route('/change-password').post(changePassword)
router.route('/delete-account').delete(deleteAccount)

module.exports = router