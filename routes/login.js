/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var router = express.Router();
var user_wrapper = require('../module/user_arapper');
var user = require('../module/user');

/* GET login page. */
router.get('/', function(req, res) {
    res.render('login', { title: 'login' });
});

router.post('/', function(req, res) {
    user_wrapper.get_user(req.body.username,function(user){
        if(req.body.password != user.get_password()){
            return res.redirect('/');
        }
        else{
            req.session.user = user;
            return res.redirect('/config2');
        }
    });
});

module.exports = router;
