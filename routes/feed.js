var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Feed = require('../models/feed');

router.get('/allFeed',(req,res)=>{
    //모든 피드 검색
    Feed.find({},(err, feeds)=>{
        if(err) res.status(404).end();
        else
            res.status(200).json(feeds);
    });
});
router.post('/addFeed/:userId',(req,res)=>{
    //피드 작성
    console.log(req.params);
    console.log(req.body);
    var newFeed = new Feed({
        userId : req.params.userId,
        district : req.body.district,
        feedBody : req.body.feedBody,
    });

    newFeed.save((err, newfeed)=>{
        if(err) res.status(403).end();
        else
            res.status(201).json(newfeed);
    });


});

router.delete('/deleteFeed',(req,res)=>{
    //피드 삭제
});
router.put('/editFeed/:feedId',(req,res)=>{
    //피드 수정
    //params로 피드 id 입력, req.body에 있는 sender의 userid가
    //feed 모델의 userId와 같으면 편집 가능

    Feed.findOne({_id:req.params.feedId},(err,feed)=>{
        if(err) res.status(404).end();
        else {
            if(feed.userId == req.body.senderId) {
                //수정
                res.status(201).json(feed);
            }else
            {
                res.status(405).end();
            }
        }
    });

});
router.post('/addComment',(req,res)=>{
    //댓글 달기
});
router.delete('/deleteComment',(req,res)=>{
    //댓글 삭제
});
router.put('/editCommnet',(req,res)=>{
    //댓글 수정
});
module.exports = router;
