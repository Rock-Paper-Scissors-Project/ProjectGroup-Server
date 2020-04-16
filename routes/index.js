const router = require('express').Router()

router.get('/', function(req, res) {
    res.status(200).json({
        message: 'Home Domain Connected'
    })
})








module.exports = router