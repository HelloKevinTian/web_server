/**
 * Created by King Lee on 14-7-31.
 */
var redis_pools = require("../nosql/redis_pools");
var h_schedule = 'h_schedule';
var h_schedule_log = 'h_schedule_log';

var redis_schedule_wrapper = module.exports;

redis_schedule_wrapper.add_schedule = function(start_time,schedule,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hset(h_schedule,JSON.stringify(start_time),JSON.stringify(schedule),function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_schedule_wrapper.del_schedule = function(start_time,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hdel(h_schedule,start_time,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_schedule_wrapper.get_all_schedule = function(cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hgetall(h_schedule,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_schedule_wrapper.clear_schedule = function(cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hgetall(h_schedule,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            for(var v in reply){
                client.hdel(h_schedule,v,function (err, reply){
                    if(err){
                        //  some thing log
                        console.error(err);
                    }
                    //release();
                });
            }
            release();
        });
    });
};

//////////////////////////////////////////////////////////////////////////////////////
redis_schedule_wrapper.add_schedule_log = function(type,schedule){
    redis_pools.execute('pool_1',function(client, release){
        var operator = {};
        var __date = new Date();
        operator.time = __date.toGMTString();
        operator.type = type;
        client.hset(h_schedule_log,JSON.stringify(operator),JSON.stringify(schedule),function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            release();
        });
    });
};

redis_schedule_wrapper.get_all_schedule_log = function(cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hgetall(h_schedule_log,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};