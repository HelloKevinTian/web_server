var redis_pools = require("../nosql/redis_pools");

//  current is the x week
var getWeek = function(date) {
	var onejan = new Date(date.getFullYear(), 0, 1);
	//	delay_day ,such as 3,that means wednesday is the first day of new week
	var delay_day = 3;
	return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1 + delay_day) / 7);
};

//上周的week id
var championship_id = getWeek(new Date()) - 1;

//	zrange z_rank:1 0 10000 withscores
var z_rank = "z_rank_pvp_score:" + championship_id;
var h_rank = "h_rank_pvp:" + championship_id;

var redis_rank_for_pvp_week = module.exports;

redis_rank_for_pvp_week.get_cur_week_rank_for_pvp = function(callback) {
	var rank = [];
	var range_low = 0;
	var range_high = 9999;
	var args1 = [z_rank, range_low, range_high, 'withscores'];

	redis_pools.execute('pool_1',function(client, release){
		client.zrevrange(args1, function(err, reply) {
			for (var i = 0; i < reply.length; ++i) {
				var contact = new Object();
				contact.device_id = reply[i++];
				contact.score = reply[i];
				rank.push(contact);
			}

			var args1 = [];
			args1.push(h_rank);
			for (var j = 0; j < rank.length; ++j) {
				args1.push(rank[j].device_id);
			}
			client.hmget(args1, function(err, reply1) {
				var index = 0;
				for (var v in reply1) {
					rank[index].rank = index + 1;
					//delete rank[index].device_id;
					rank[index].phone = JSON.parse(reply1[v]) ? JSON.parse(reply1[v]).phone_number : null;
					rank[index].channel = JSON.parse(reply1[v]) ? JSON.parse(reply1[v]).channel : null;
					rank[index].version = JSON.parse(reply1[v]) ? JSON.parse(reply1[v]).version : null;
					rank[index].nickname = JSON.parse(reply1[v]) ? JSON.parse(reply1[v]).nickname : null;
					var lastUploadTime = JSON.parse(reply1[v]) ? JSON.parse(reply1[v]).upload_last_time : null;
					var lastUploadDate = new Date(lastUploadTime);
				    rank[index].date = lastUploadDate.toString();
					index++;
				}
				callback(rank);
				release();
			});
		});
	});
}

