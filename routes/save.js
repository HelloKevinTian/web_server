/**
 * Created by King Lee on 14-7-16.
 */
var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res) {
    return res.redirect('/');
});

router.post('/', function(req, res) {
    var result = {code :200}
    res.end(JSON.stringify(result) + '\n', 'utf8');
});
module.exports = router;
