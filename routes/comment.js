var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Feed = require('../models/feed');

router.get('/getFeedSpec/:feedId', (req, res) => {
    /*피드 눌렀을때 피드 상세보기
    * 작성자 섬네일, 피드 바디, 좋아요수
    * */
    console.log(req.params.feedId)
    Feed.findOne({_id: req.params.feedId}, (err, feed) => {
        if (err) {
            throw err;
            console.log('getFeedSpec err');
            res.status(403).end();
        }
        else {
            if (feed == null) {
                res.status(403).end();
            }
            res.status(200).json(feed);
        }
    });

});


router.post('/addComment/:feedId', (req, res) => {
    //댓글 달기 댓글 작성자의 userId, 댓글 바디 필요


    Feed.findOne({_id: req.params.feedId}, (err, feed) => {
        if (err || feed == null) {
            console.log('addComment error');
            res.status(403).end();
        } else {
            //feed 찾음
            User.findOne({_id: req.body._id}, (err, user) => {
                if (err) {
                    console.log('addcomment user find error');
                } else {
                    var newComment = {
                        userId: user._id,
                        pic_url: user.pic_url,
                        commentBody: req.body.commentBody
                    };
                    feed.comment.push(newComment);
                    feed.save((err, feed) => {
                        if (err) {
                            console.log('addcomment feed save error');

                            res.status(403).end();
                        } else {
                            res.status(201).json(feed);
                        }
                    });
                }
            });

        }
    });
});
router.delete('/deleteComment/:feedId/:commentId/:userId', (req, res) => {
    //댓글 삭제
    let foundUser;
    User.findOne({_id: req.params.userId}, (err, user) => {
        if (err) {
            res.status(403).end();
        }
        else {
            if (!user)
                res.status(419).end();
            foundUser = user;
        }
    });
    Feed.findOne({_id: req.params.feedId}, (err, feed) => {
        if (err || feed == null) {
            throw err;
            res.status(403).end();
        } else {
            let foundIndex;
            for (let i = 0; i < feed.comment.length; i++) {
                if (feed.comment[i]._id == req.params.commentId) {
                    foundIndex = i;
                    break;
                }
            }

            if(foundUser!=undefined && foundUser._id != feed.comment[foundIndex].userId)
            {
                res.status(403).send('access denied');
            }

            console.log('comment length : ' + feed.comment.length);
            console.log('foundIndex : ' + foundIndex);
            feed.comment.splice(foundIndex, 1);
            feed.save((err) => {
                if (err) {
                    console.log(err);
                    res.status(403).end;
                } else
                    console.log('delete comment save success');
                res.status(201).end();
            })
        }
    });
});
router.put('/editCommnet/:feedId/:commentId/:userId', (req, res) => {
    //댓글 수정
});
module.exports = router;
