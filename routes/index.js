var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/', function (req, res) {
  var user = olinapps.user(req);
  console.log(user);
  res.render('index', {title: user.username})
})

module.exports = router;
