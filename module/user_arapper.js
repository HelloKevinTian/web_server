/**
 * Created by King Lee on 2014/7/9.
 */
var redis_user_wrapper = require('../nosql/redis_user_wrapper');

var user_arapper = module.exports;

user_arapper.get_user = function( name,cb) {
    redis_user_wrapper.get_user(name,cb);
};