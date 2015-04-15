/**
 * Created by King Lee on 14-7-15.
 */

var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res) {
    return res.redirect('/');
});

router.post('/', function(req, res) {
    return res.redirect('/');
});
module.exports = router;
