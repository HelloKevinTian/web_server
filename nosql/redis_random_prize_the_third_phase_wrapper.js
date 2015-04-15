
var redis_pools = require("../nosql/redis_pools");
var h_random_prize_the_third_phase = 'h_random_prize_the_third_phase';
var l_random_prize_the_third_phase_award = 'l_random_prize_the_third_phase_award';
var h_random_prize_the_third_phase_award_phone = 'h_random_prize_the_third_phase_award_phone';

var random_prize_the_third_phase_wrapper = module.exports;

random_prize_the_third_phase_wrapper.set = function(device_guid,free_flag){
    var date = new Date();
    var date_string = ":" + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
    redis_pools.execute('pool_1',function(client, release){
        client.hset(h_random_prize_the_third_phase,device_guid + date_string,free_flag,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            release();
        });
    });
};

random_prize_the_third_phase_wrapper.add_award = function(award_info){
    var date = new Date();
    var date_string = ":" + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
    redis_pools.execute('pool_1',function(client, release){
        client.lpush(l_random_prize_the_third_phase_award + date_string ,JSON.stringify(award_info),function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            release();
        });
    });
};

random_prize_the_third_phase_wrapper.get_all_award = function(date_string,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.lrange(l_random_prize_the_third_phase_award + date_string,0,-1,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

random_prize_the_third_phase_wrapper.get = function(device_guid,cb){
    var date = new Date();
    var date_string = ":" + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
    redis_pools.execute('pool_1',function(client, release){
        client.hget(h_random_prize_the_third_phase,device_guid + date_string,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

random_prize_the_third_phase_wrapper.update_phone = function(device_guid,phone_number){
    redis_pools.execute('pool_1',function(client, release){
        client.hset(h_random_prize_the_third_phase_award_phone,device_guid,phone_number,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            release();
        });
    });
};

random_prize_the_third_phase_wrapper.get_phone = function(device_guid,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hget(h_random_prize_the_third_phase_award_phone,device_guid,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};
