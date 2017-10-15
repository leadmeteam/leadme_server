var express = require('express');
var router = express.Router();
var https = require('https');
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


function facebookLogin(access_token, res) {
    var path = 'https://graph.facebook.com/me?access_token=' + access_token;
    //console.log('path : ', path);
    https.get(path, (response) => {
        response.on('data', (d) => {
            var json = JSON.parse(d);
            console.log('json id : '+json.id);
            User.findOne({facebook_id: json.id}, (err, user) => {
                var foundUser;
                if (err) res.status(400).end();
                if (user == null) {
                    //signup
                    var path = `https://graph.facebook.com/${json.id}/?access_token=${access_token}&fields=email,picture,first_name,last_name`;
                    https.get(path, (response) => {
                        response.on('data', (d) => {
                            var json = JSON.parse(d);
                            console.log('graph api data : ', json);
                            var newUser = new User({
                                email: json.email,
                                first_name: json.first_name,
                                last_name: json.last_name,
                                pic_url: json.picture.data.url,
                                facebook_id: json.id,

                            });
                            console.log(json.picture.data.url);
                            newUser.save((err) => {
                                if (err) res.status(500);
                            });
                            foundUser = newUser;
                            res.status(200).json(foundUser);
                        });
                        //graph api
                    }).on('error', (e) => {
                        console.log(e);
                    });
                }
                else {
                    //login
                    foundUser = user;
                    res.status(200).json(foundUser);
                }
            });
        });
    }).on('error', (e) => {

        console.log(e);
        res.status(500).end();
    });
}


router.post('/signup', (req, res) => {

    console.log('accessToken : '+req.body.accesstoken);
    facebookLogin(req.body.accesstoken,res);
    //
    // User.findOne({AccessToken: req.body.AccessToken}, (err, user) => {
    //     if (err)
    //         res.status(403).end();
    //     if (user == null) {
    //         var newUser = new User({
    //             email: req.body.email,
    //             first_name: req.body.first_name,
    //             last_name: req.body.last_name,
    //             AccessToken: req.body.AccessToken,
    //             pic_url: req.body.pic_url
    //         });
    //
    //         newUser.save((err) => {
    //             if (err) res.status(501).end();
    //             else
    //                 res.status(201).json(newUser);
    //         });
    //     }
    //     else {
    //         res.status(200).json(user);
    //     }
    // });


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
