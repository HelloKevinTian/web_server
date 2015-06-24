/**
 * @ Author Kevin
 * @ Email  tianwen@chukong-inc.com
 * @ 2015/6/24 	
 */

var express = require('express');
var router = express.Router();
var redis_rank_for_pvp_week = require('../nosql/redis_rank_for_pvp_week');

/* GET rank_for_pvp_week page. */
router.get('/', function(req, res) {
    req.session.user = null;
    redis_rank_for_pvp_week.get_cur_week_rank_for_pvp(function(rank_info){
    	console.log(rank_info);
	    res.render('rank_for_pvp_week', {
	        title: 'rank_for_pvp_week',
	        rank_info: rank_info
	    });
    })
});


module.exports = router;