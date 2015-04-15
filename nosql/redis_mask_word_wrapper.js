/**
 * Created by King Lee on 2015/1/13.
 */
var redis_pools = require("../nosql/redis_pools");
var async = require('async');
var l_mask_word_online = 'l_mask_word_online';
var redis_mask_work_wrapper = module.exports;

redis_mask_work_wrapper.get = function(word,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hget(h_mask_word,word,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_mask_work_wrapper.get_all_online = function(cb){
    redis_pools.execute('pool_1',function(client, release){
        client.lrange(l_mask_word_online,0,-1,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_mask_work_wrapper.add_online = function(key_word,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.lpush(l_mask_word_online,key_word,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_mask_work_wrapper.del_online = function(key_word,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.lrem(l_mask_word_online,0,key_word,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};