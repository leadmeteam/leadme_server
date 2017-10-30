var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Guide = require('../models/guide');
var Feed = require('../models/feed');

router.post('/mypage/likedFeeds',(req, res)=>{  // 좋아요한 피드들
  var userId = req.body.userId;

  Feed.find({"like.userId":userId}, (err,feeds)=>{
    if (err) res.status(403).end();
    else if (!feeds) res.json({
      message: "no feed"
    })
    else {
      res.status(201).json(feeds);
    }
  });
});

router.post('/mypage/wrotedFeeds',(req, res)=>{ // 내가 쓴 피드들
  var userId = req.body.userId;

  Feed.find({"userId":userId},(err,feeds)=>{
    if (err) res.status(403).end();
    else if (!feeds) res.json({
      message: "no feed"
    })
    else {
      res.status(201).json(feeds);
    }
  });
});

module.exports = router;
