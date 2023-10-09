const {getAllQuizzes, addQuiz} = require("../controllers/quizController");
const grantAccess = require("../middleware/grantAccess");
const router = require('express').Router()

router.route('/').get(getAllQuizzes).post(grantAccess, addQuiz)

module.exports = router