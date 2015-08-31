// Dependencies
var express = require('express');
var router = express.Router();

router.use('/table', require('./routes/table'));
router.use('/session', require('./routes/session'));
router.use('/user', require('./routes/user'));

module.exports = router;
