var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/allUsers', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(403).end();
        }
        res.status(201).json(users);
    });
});

router.post('/signup', (req, res) => {

    var newUser = new User({
        email : req.body.email,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        AccessToken : req.body.AccessToken,
        pic_url : req.body.pic_url
    });

    newUser.save((err)=>{
        if(err) res.status(501).end();
        else
            res.status(201).json(newUser);
    });
});

module.exports = router;
