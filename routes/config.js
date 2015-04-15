/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var activity_wrapper = require('../module/activity_wrapper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if(!req.session.user){
        return res.redirect('/login');
    }
    activity_wrapper.get_all(function(reply){
        var all_channel = reply;
        var array = [];
        var default_channel = "template:template";
        var default_activity = {};
        for(var v in all_channel){
            if(default_channel == v){
                default_activity = all_channel[v];
            }
            array.push(v);
        }
        res.render('config', {
            title: 'config',
            channel:default_channel,
            activity:default_activity,
            content:'content',
            array:array,
            link_show: req.session.user ? "注销":"登录",
            link: req.session.user ? "/logout":"/login"
        });
    });
});

router.post('/', function(req, res) {
    var val = req.body.text_value;
    var select_channel = req.body.select_channel;
    var config_info = req.body.config_info;
    var save = req.body.save;
    if(save){
        if(config_info){
            try {
                JSON.parse(config_info);
            } catch (err) {
                return res.send("save failed");
            }
            activity_wrapper.save(select_channel,config_info,function(reply){
                if(0 == reply){
                    return res.send("save succeed");
                }
                return res.send("save failed");
            });

        }
    }
    else  if(select_channel){
        activity_wrapper.get_all(function(reply){
            var all_channel = reply;
            var array = [];
            for(var v in all_channel){
                array.push(v);
            }
            for(var v in all_channel){
                if(v == select_channel){
                    return res.render('config',{
                        title: 'config',
                        channel:v,
                        activity:all_channel[v],
                        content:'content',
                        array:array,
                        link_show: req.session.user ? "注销":"登录",
                        link: req.session.user ? "/logout":"/login"
                    });
                }
            }
        });
    }
    else{
        return res.redirect('/');
    }
});

module.exports = router;
