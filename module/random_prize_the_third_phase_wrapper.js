/**
 * Created by King Lee on 2014/9/16.
 */
var redis_random_prize_the_third_phase_wrapper = require('../nosql/redis_random_prize_the_third_phase_wrapper');
var random_prize_the_third_phase_wrapper = module.exports;

random_prize_the_third_phase_wrapper.get_all_award = function(date_string,cb){
    redis_random_prize_the_third_phase_wrapper.get_all_award(date_string,cb);
};

random_prize_the_third_phase_wrapper.get_phone = function(device_guid,cb){
    redis_random_prize_the_third_phase_wrapper.get_phone(device_guid,cb);
};