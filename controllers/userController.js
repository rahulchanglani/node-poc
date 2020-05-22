let userModel = require('../model/User'),
    express = require('express'),
    router = express.Router();


router.get('/', function (req, res) {
    res.send(' users home page')
})

router.post('/', function (req, res) {
    
})

module.exports = router;