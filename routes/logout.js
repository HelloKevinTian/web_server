/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res) {
    req.session.user = null;
    res.render('logout', {
        title: 'logout',
        link_show: req.session.user ? "注销":"登录",
        link: req.session.user ? "/logout":"/login"
    });
});

module.exports = router;

