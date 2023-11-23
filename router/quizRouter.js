const {getAllQuizzes, addQuiz, filterQuiz, getSingleQuiz, getQuestion, updateQuizQuestion} = require("../controllers/quizController");
const grantAccess = require("../middleware/grantAccess");
const uploadImage = require("../middleware/uploadImage");
const router = require('express').Router()

router.route('/').get(getAllQuizzes).post(
    grantAccess,
    addQuiz)
router.route('/filter-quiz').post(filterQuiz)
router.route('/:id').get(getSingleQuiz)
router.route('/:id/add-question').post(updateQuizQuestion)
router.route('/:id/:questionNo').get(getQuestion)

module.exports = router