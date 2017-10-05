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

    User.findOne({AccessToken: req.body.AccessToken}, (err, user) => {
        if (err)
            res.status(403).end();
        if (user == null) {
            var newUser = new User({
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                AccessToken: req.body.AccessToken,
                pic_url: req.body.pic_url
            });

            newUser.save((err) => {
                if (err) res.status(501).end();
                else
                    res.status(201).json(newUser);
            });
        }
        else {
            res.status(200).json(user);
        }
    });


});

router.delete('/deleteUser/:userId', (req, res) => {
    User.findOne({_id: req.params.userId}, (err, user) => {
        if (err) res.status(403).end();
        else
            user.remove((err) => {
                if (err)
                    res.status(403).end();
                else
                    res.status(201).send({
                        success: true
                    });
            });
    });
});
module.exports = router;
