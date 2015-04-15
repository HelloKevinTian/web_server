/**
 * Created by King Lee on 2014/6/19.
 */
var redis_pools = require("../nosql/redis_pools");
var h_activity = 'h_activity';

var redis_activity_wrapper = module.exports;

redis_activity_wrapper.add_activity = function(channel,varsion,activity,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hset(h_activity,channel + ':' + varsion,JSON.stringify(activity),function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_activity_wrapper.del_activity = function(channel,varsion,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hdel(h_activity,channel + ':' + varsion,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_activity_wrapper.save_activity = function(channel_varsion,activity,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hset(h_activity,channel_varsion,activity,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_activity_wrapper.get_activity = function(channel,version,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hget(h_activity,channel + ':' + version,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_activity_wrapper.get_all_activity = function(cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hgetall(h_activity,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};
