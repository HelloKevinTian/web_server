/**
 * Created by King Lee on 15-1-20.
 */
var express = require('express');
var router = express.Router();
var random_prize_the_third_phase_wrapper = require('../module/random_prize_the_third_phase_wrapper');
var gacha_the_third_phase_real_limit_json = require('../config/gacha_the_third_phase_real_limit');
var async = require('async');

var get_month = function (month_string){
    var month = 0;
    switch(month_string){
        case "Jan":{
            month = 0;
            break;
        }
        case "Feb":{
            month = 1;
            break;
        }
        case "Mar":{
            month = 2;
            break;
        }
        case "Apr":{
            month = 3;
            break;
        }
        case "May":{
            month = 4;
            break;
        }
        case "Jun":{
            month = 5;
            break;
        }
        case "Jul":{
            month = 6;
            break;
        }
        case "Aug":{
            month = 7;
            break;
        }
        case "Sep":{
            month = 8;
            break;
        }
        case "Oct":{
            month = 9;
            break;
        }
        case "Nov":{
            month = 10;
            break;
        }
        case "Dec":{
            month = 11;
            break;
        }
        default :{
            break;
        }
    }
    return month;
};

var data_2_name = function(data){
    for (var v in gacha_the_third_phase_real_limit_json){
        if(gacha_the_third_phase_real_limit_json[v].data == data){
            return gacha_the_third_phase_real_limit_json[v].name;
        }
    }
    return "nothing";
};

/* GET home page. */
router.get('/', function(req, res) {
    var date_now = new Date();
    var month_now = date_now.getMonth() + 1;
    var day_now = date_now.getDate();
    var year_now = date_now.getFullYear();
    var date_format = year_now + "-" + month_now + "-" + day_now;
    res.render('prize', { title: 'Express' ,date:date_format});
});

router.post('/', function(req, res) {
    var result = {
        code :200
    };
    var type = req.body.type;
    var date = req.body.date;
    if(type == "get"){
        if(typeof date == "string"){
            date = date.split(' ');
        }
        var month = get_month(date[1]) + 1;
        var day = parseInt(date[2]);
        var year = parseInt(date[3]);
        var date_string = ":" + year + month + day;
        random_prize_the_third_phase_wrapper.get_all_award(date_string,function(reply){
            if(!reply){
                code :201
            }
            var prize_real_numbers = [];
            var prize_real_list = [];
            for(var i = 0; i < reply.length; ++i){
                var prize = JSON.parse(reply[i]);
                var find = false;
                var index = 0;
                for(var j = 0; j < prize_real_numbers.length; ++j){
                    if(data_2_name(prize.prize.data) == prize_real_numbers[j][0]){
                        find = true;
                        index = j;
                        break;
                    }
                }
                if(find){
                    ++prize_real_numbers[index][1];
                }
                else{
                    prize_real_numbers.push([data_2_name(prize.prize.data),1]);
                }
            }
            result.data1 = prize_real_numbers;
            var count = 0;
            async.whilst(
                function () { return count < reply.length; },
                function (callback) {
                    async.waterfall([
                        function(callback){
                            var prize = JSON.parse(reply[count]);
                            random_prize_the_third_phase_wrapper.get_phone(prize.device_guid,function(reply){
                                callback(null,reply,data_2_name(prize.prize.data));
                            });
                        },
                        function(phone,name,callback){
                            if(!phone){
                                phone = "no_phone_record";
                            }
                            prize_real_list.push([phone,name]);
                            callback(null);
                        }
                    ],
                        // optional callback
                        function(err){
                            if(err){
                                console.error(err);
                            }
                            ++count;
                            callback(null);
                        });
                },
                function (err) {
                    //  whilst end,do nothing
                    if(err){
                        console.error(err);
                    }
                    result.data2 = prize_real_list;
                    return  res.end(JSON.stringify(result) + '\n', 'utf8');
                }
            );
        });
    }
});
module.exports = router;
