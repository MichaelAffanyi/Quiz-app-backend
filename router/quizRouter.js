const {getAllQuizzes, addQuiz, filterQuiz} = require("../controllers/quizController");
const grantAccess = require("../middleware/grantAccess");
const router = require('express').Router()

router.route('/').get(getAllQuizzes).post(grantAccess, addQuiz)
router.route('/filter-quiz').post(filterQuiz)

module.exports = router