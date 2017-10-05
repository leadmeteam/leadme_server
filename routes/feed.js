var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Feed = require('../models/feed');

router.get('/allFeed', (req, res) => {
    //모든 피드 검색
    Feed.find({}, (err, feeds) => {
        if (err) res.status(403).end();
        else
            res.status(200).json(feeds);
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
router.post('/addFeed/:userId', (req, res) => {
    //피드 작성
    //params로 들어온 userId가 존재해야 feed추가
    console.log(req.params);
    console.log(req.body);
    User.findOne({_id: req.params.userId}, (err, user) => {
        if (err) res.status(403).end();
        else {
            if (user == null)
                res.status(403).end();
            else {
                var newFeed = new Feed({
                    userId: req.params.userId,
                    district: req.body.district,
                    feedBody: req.body.feedBody,
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

router.delete('/deleteFeed/:feedId/:userId', (req, res) => {
    //피드 삭제
    //feedID로 찾고 userId와 다르면 err, 같으면 삭제
    Feed.findOne({_id: req.params.feedId}, (err, feed) => {
        if (err) res.status(403).end();
        else {
            console.log(feed);
            if (feed.userId == req.params.userId) {
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
router.put('/editFeed/:feedId/:userId', (req, res) => {
    //피드 수정
    //params로 피드 id 입력, params에 있는 sender의 userid가
    //feed 모델의 userId와 같으면 편집 가능

    Feed.findOne({_id: req.params.feedId}, (err, feed) => {
        if (err) res.status(404).end();
        else {
            if (feed.userId == req.params.userId) {
                //수정
                feed.feedBody = req.body.feedBody;
                feed.save((err,feed)=>{
                    if(err)
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
router.put('/addLike/:feedId', (req, res) => {
    //좋아요 누르기
    Feed.findOne({_id: req.params.feedId}, (err, feed) => {
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

router.post('/addComment/:feedId', (req, res) => {
    //댓글 달기
});
router.delete('/deleteComment', (req, res) => {
    //댓글 삭제
});
router.put('/editCommnet', (req, res) => {
    //댓글 수정
});
module.exports = router;
