var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Feed = require('../models/feed');

router.get('/feed:standard',(req,res)=>{
    //현재 기준으로 피드 검색
});
router.post('/feed/makeFeed',(req,res)=>{
    //피드 작성
});

router.delete('/feed/deleteFeed',(req,res)=>{
    //피드 삭제
});
router.put('/feed/editFeed',(req,res)=>{
    //피드 수정
});
router.post('/feed/addComment',(req,res)=>{
    //댓글 달기
});
router.delete('/feed/deleteComment',(req,res)=>{
    //댓글 삭제
});
router.put('/feed/editCommnet',(req,res)=>{
    //댓글 수정
});
module.exports = router;
