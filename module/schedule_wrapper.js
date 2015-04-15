/**
 * Created by King Lee on 14-7-31.
 */
var redis_schedule_wrapper = require('../nosql/redis_schedule_wrapper');
var activity_wrapper = require('../module/activity_wrapper');

var schedule_list = [];
var schedule_log_list = [];
var schedule_timer_list = [];

var schedule_wrapper = module.exports;

schedule_wrapper.init = function() {
    redis_schedule_wrapper.get_all_schedule(function(reply){
        if(reply){
            for(var v in reply){
                var schedule = JSON.parse(reply[v]);
                var text = JSON.parse(schedule.text);
                schedule_wrapper.create_timer(text.version,text.channel_src,text.channel_des,text.plan_date,v,function(){

                });
            }
        }
    });

    redis_schedule_wrapper.get_all_schedule_log(function(reply){
        if(reply){
            for(var v in reply){
                var schedule = JSON.parse(reply[v]);
                var text = JSON.parse(schedule.text);
                var operator = JSON.parse(v);
                schedule_log_list.push({id:schedule_log_list.length,text:JSON.stringify({type:operator.type ,time:operator.time ,
                    version:text.version,channel_src:text.channel_src,channel_des:text.channel_des,plan_date:text.plan_date}) });
            }
        }
    });

    setInterval(function(){
        var date_now_tmp = new Date();
        var month_now = date_now_tmp.getMonth() + 1;
        var day_now = date_now_tmp.getDate();
        var year_now = date_now_tmp.getFullYear();
        for(var n = 0; n < schedule_list.length; ++n){
            var plan_date = JSON.parse(schedule_list[n].text).plan_date;
            var version = JSON.parse(schedule_list[n].text).version;
            var channel_src = JSON.parse(schedule_list[n].text).channel_src;
            var channel_des = JSON.parse(schedule_list[n].text).channel_des;
            if(typeof plan_date == "string"){
                plan_date = plan_date.split(' ');
            }
            var month = schedule_wrapper.get_month(plan_date[1]) + 1;
            var day = parseInt(plan_date[2]);
            var year = parseInt(plan_date[3]);
            if(month_now == month && day_now == day && year_now == year){
                activity_wrapper.get_just(channel_src,version,function(activity){
                    if(activity){
                        activity_wrapper.save(channel_des + ":" + version,activity,function(reply){

                        });
                    }
                });
                schedule_wrapper.del_schedule(schedule_timer_list[n][0]);
                redis_schedule_wrapper.add_schedule_log("excute",schedule_list[n]);
                var text = JSON.parse(schedule_list[n].text);
                var time_now = new Date();
                schedule_log_list.push({id:schedule_log_list.length,text:JSON.stringify({type:"excute" ,time:time_now.toLocaleString() ,
                    version:text.version,channel_src:text.channel_src,channel_des:text.channel_des,plan_date:text.plan_date}) });
                schedule_list.splice(n,1);
                schedule_timer_list.splice(n,1);
            }
        }
    },60*1000);
};

schedule_wrapper.get_schedule_list = function() {
    return schedule_list;
};

schedule_wrapper.get_schedule_log_list = function() {
    return schedule_log_list;
};

schedule_wrapper.get_schedule_timer_list = function() {
    return schedule_timer_list;
};

schedule_wrapper.add_schedule = function( start_time,schedule) {
    redis_schedule_wrapper.add_schedule(start_time,schedule,function(reply){
        if(reply){
            console.log("add_schedule ok");
        }
    });
};

schedule_wrapper.del_schedule = function( start_time) {
    redis_schedule_wrapper.del_schedule(start_time,function(reply){
        if(reply){
            console.log("del_schedule ok");
        }
    });
};

schedule_wrapper.clear_schedule = function() {
    for(var n = 0; n < schedule_timer_list.length; ++n){
        clearInterval(schedule_timer_list[n][1]);
        schedule_wrapper.del_schedule(schedule_timer_list[n][0]);
        redis_schedule_wrapper.add_schedule_log("clean",schedule_list[n]);
        var text = JSON.parse(schedule_list[n].text);
        var time_now = new Date();
        schedule_log_list.push({id:schedule_log_list.length,text:JSON.stringify({type:"clean" ,time:time_now.toLocaleString(),
            version:text.version,channel_src:text.channel_src,channel_des:text.channel_des,plan_date:text.plan_date}) });
    }
    schedule_list = [];
    schedule_timer_list = [];
};

schedule_wrapper.create_timer = function(version,channel_src,channel_des,plan_date,timer_id,cb) {
    if(typeof plan_date == "string"){
        plan_date = plan_date.split(' ');
    }
    var month = schedule_wrapper.get_month(plan_date[1]) + 1;
    var day = parseInt(plan_date[2]);
    var year = parseInt(plan_date[3]);
    var date_future = new Date(year,month,day);
    var date_now_tmp = new Date();
    var month_now = date_now_tmp.getMonth() + 1;
    var day_now = date_now_tmp.getDate();
    var year_now = date_now_tmp.getFullYear();

    var hours_now = date_now_tmp.getHours();
    var minutes_now = date_now_tmp.getMinutes();
    var second_now = date_now_tmp.getSeconds();

    var date_now = new Date(year_now,month_now,day_now,hours_now,minutes_now,second_now);
    var timer_interval = date_future.getTime() - date_now.getTime();
    var interval_object = setInterval(function(){
        if(0){
            activity_wrapper.get_just(channel_src,version,function(activity){
                if(activity){
                    activity_wrapper.save(channel_des + ":" + version,activity,function(reply){

                    });
                }
            });
            clearInterval(interval_object);
            for(var n = 0; n < schedule_timer_list.length; ++n){
                if(interval_object == schedule_timer_list[n][1]){
                    schedule_wrapper.del_schedule(schedule_timer_list[n][0]);
                    redis_schedule_wrapper.add_schedule_log("excute",schedule_list[n]);
                    var text = JSON.parse(schedule_list[n].text);
                    var time_now = new Date();
                    schedule_log_list.push({id:schedule_log_list.length,text:JSON.stringify({type:"excute" ,time:time_now.toLocaleString() ,
                        version:text.version,channel_src:text.channel_src,channel_des:text.channel_des,plan_date:text.plan_date}) });
                    schedule_list.splice(n,1);
                    schedule_timer_list.splice(n,1);
                }
            }
        }
    },timer_interval);
    var time_now = timer_id;
    if(!time_now){
        time_now = Date.now();
        var time_now2 = new Date();
        schedule_wrapper.add_schedule(time_now,{id:schedule_list.length,text:JSON.stringify({version:version,channel_src:channel_src,channel_des:channel_des,plan_date:plan_date}) });
        redis_schedule_wrapper.add_schedule_log("add",{id:schedule_list.length,text:JSON.stringify({version:version,channel_src:channel_src,channel_des:channel_des,plan_date:plan_date}) });
        schedule_log_list.push({id:schedule_log_list.length,text:JSON.stringify({type:"add" ,time:time_now2.toLocaleString(),version:version,channel_src:channel_src,channel_des:channel_des,plan_date:plan_date}) });
    }
    schedule_timer_list.push([time_now,interval_object]);
    schedule_list.push({id:schedule_list.length,text:JSON.stringify({version:version,channel_src:channel_src,channel_des:channel_des,plan_date:plan_date}) });
    cb(schedule_list);
};

schedule_wrapper.get_month = function (month_string){
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