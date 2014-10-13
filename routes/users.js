var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/test',function(req, res) {
	res.send("This is a test. This is only a test.");
});

module.exports = router;
