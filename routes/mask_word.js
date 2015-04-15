/**
 * Created by King Lee on 15-1-19.
 */
var express = require('express');
var router = express.Router();
var mask_word_wrapper = require('../module/mask_word_wrapper');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('mask_word', { title: 'Express' });
});

router.post('/', function(req, res) {
    var result = {
        code :200
    };
    var type = req.body.type;
    var keyword = req.body.keyword;
    if(type == "add"){
        mask_word_wrapper.add(keyword,function(reply){
            if(!reply){
                code :201
            }
            return  res.end(JSON.stringify(result) + '\n', 'utf8');
        });
    }else if(type == "del"){
        mask_word_wrapper.del(keyword,function(reply){
            if(reply){
                if(!reply){
                    code :201
                }
            }
            return  res.end(JSON.stringify(result) + '\n', 'utf8');
        });
    }

});
module.exports = router;
