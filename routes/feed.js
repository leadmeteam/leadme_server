var express = require('express');
var router = express.Router();
var configs = require('../bin/config');
var User = require('../models/user');
var Feed = require('../models/feed');
var multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./public/images');
    },
    filename : function(req,file,cb){
        console.log('multer');
       // console.log(file);
        cb(null,file.originalname);
    }
});
var uploads = multer({storage: storage});


router.post('/upload',uploads.single('avatar'),function(req,res,next){
    console.log(req.file);
    console.log(req.body);
    res.status(201).end();
});


module.exports = router;


router.get('/allFeed', (req, res) => {

    Feed.find()
        .sort({_id: -1})
        .populate('writer')
        .exec((err, feeds) => {
            if (err)
                throw err;
            res.status(201).json(feeds);
        });

});
router.get('/firstFeed', (req, res) => {
    //첫번쨰 피드 요청.
    Feed.find()
        .sort({_id: -1})
        .limit(6)
        .populate('writer')
        .exec((err, feeds) => {

            if (err || !feeds)
                res.status(403).end();
            res.status(201).json(feeds);
        });
});


router.get('/feedScroll', (req, res) => {

    Feed.find({_id: {$lt: req.body.lastFeed}})
        .sort({_id: -1})
        .limit(6)
        .exec((err, feeds) => {
            if (err || !feeds)
                res.status(403).end();
            res.status(201).json(feeds);
        });
});
router.get('/getFeed/:standard', (req, res) => {
    //조건에 맞는 피드 검색
    //현재 지역 기준으로 설정
    Feed.find({district: req.params.standard}, (err, feeds) => {
        if (err) res.status(403).end();
        else
            res.status(201).json(feeds);
    });
});


router.post('/addFeed',uploads.single('feed_image'), (req, res) => {
    //피드 작성
    //body 들어온 userId가 존재해야 feed추가
    console.log(req.body.userId);
    console.log(req.body);
    User.findOne({_id: req.body.userId}, (err, user) => {
        if (err) res.status(403).end();
        else {
            if (user == null)
                res.status(403).end();
            else {
                var fileName ="";
                if(req.file!=undefined && req.file.originalname != undefined)
                {
                    fileName = req.file.originalname;
                    fileName = configs.imageStorage+'/'+fileName;
                    console.log('fileName : '+fileName);
                }
                var newFeed = new Feed({
                    userId: req.body.userId,
                    district: req.body.district,
                    feedBody: req.body.feedBody,
                    writer: user._id,
                    feed_pic_url: fileName

                });

                newFeed.save((err, newfeed) => {
                    if (err) res.status(403).end();
                    else
                        res.status(201).json(newfeed);
                });
            }
        }
    });
});
// //kill code just for debug
// router.delete('/deleteAllFeed',(req, res)=>{
//     Feed.remove({},(err)=>{
//         if(err)
//             res.status(403).end();
//         else
//             res.status(201).end();
//     });
// });


router.delete('/deleteFeed', (req, res) => {
    //피드 삭제
    //feedID로 찾고 userId와 다르면 err, 같으면 삭제
    Feed.findOne({_id: req.body.feedId}, (err, feed) => {
        if (err) res.status(403).end();
        else {
            console.log(feed);
            if (feed.userId == req.body.userId) {
                feed.remove((err) => {
                    if (err) res.status(403).end();
                    else
                        res.status(201).send({
                            success: true
                        });
                });
            } else
                res.status(403).send(
                    'userId incorrect'
                );
        }
    });
});
router.put('/editFeed', (req, res) => {
    //피드 수정
    //body 피드 id 입력, body 있는 sender의 userid가
    //feed 모델의 userId와 같으면 편집 가능

    Feed.findOne({_id: req.body.feedId}, (err, feed) => {
        if (err) res.status(404).end();
        else {
            if (feed.userId == req.body.userId) {
                //수정
                feed.feedBody = req.body.feedBody;
                feed.save((err, feed) => {
                    if (err)
                        res.status(403).end();
                    else
                        res.status(201).json(feed);
                });
            } else {
                res.status(405).end();
            }
        }

    });

});
router.put('/addLike', (req, res) => {
    //좋아요 누르기
    Feed.findOne({_id: req.body.feedId}, (err, feed) => {
        if (err) res.status(403).end();
        else {
            var likes = parseInt(feed.like) + 1;
            feed.like = likes.toString();

            feed.save((err, feed) => {
                if (err)
                    res.status(403).end();
                else
                    res.status(201).json(feed);
            });
        }
    });
});

module.exports = router;
