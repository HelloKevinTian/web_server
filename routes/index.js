var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',
      {
          title: 'tools',
          link_show: req.session.user ? "注销":"登录",
          link: req.session.user ? "/logout":"/login"});
});



module.exports = router;
