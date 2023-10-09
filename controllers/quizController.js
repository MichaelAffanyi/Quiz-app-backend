const asyncWrapper = require('../utils/asyncWrapper')

exports.addQuiz = asyncWrapper(async (req, res, next) => {
    res.send('add quiz')
})