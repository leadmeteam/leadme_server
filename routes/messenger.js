var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Guide = require('../models/guide');
var Message = require('../models/message');

var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000', {reconnect: true});

router.post('/message/send', (req, res) => { // 메세지 전송 -> 디비 입력

  User.findById(req.body.senderId,(err, user)=>{
    if (err) res.status(403).end();
    else if (!user) res.status(403).json({
      message: "no user!"
    })
    else
      socket.emit("chat", { msg: {from: { name: user.last_name + user.first_name,
      userid: user._id}, msg: req.body.messageBody} });
  });

  var newMessage = {
    participants : [req.body.senderId, req.body.reciverId]
  };
  var messages = {
    sender : req.body.senderId,
    messageBody : req.body.messageBody,
    messageDate : Date.now()
  }

  Message.find({"participants": {$in : newMessage.participants}}, (err, messageDB)=>{
    if (err) res.status(403).end();
    else if (!messageDB)
      newMessage.save((err, messageDB)=>{
        if (err) res.status(403).end();
        else if(messageDB) messageDB.update({$push: {"messages": messages}}, (err)=>{
          if (err) res.status(403).end();
          else res.status(201).json({
            message: "send sucess!"
          })
        });
      });
    else {
      messageDB.update({$push: {"messages": messages}}, (err)=>{
        if (err) res.status(403).end();
        else res.status(201).json({
          message: "send sucess!"
        })
      });
    }
  });
});

router.post('/message/openChat', (req,res)=>{ // 메세지창 오픈

  User.findById(req.body.senderId,(err, user)=>{
    if (err) res.status(403).end();
    else if (!user) res.status(403).json({
      message: "no user!"
    })
    else
    socket.emit("login", {
      // name: "ungmo2",
      name: user.last_name + user.first_name,
      userid: user._id
    });
  });

  var openMessage = {
    participants : [req.body.senderId, req.body.reciverId]
  };

  Message.find({"participants": {$in : openMessage.participants}}, (err, messageDB)=>{
    if (err) res.status(403).end();
    else if (messageDB)
    res.status(201).json(messageDB.messages)
    else res.status(201).json({
      message: "new message!"
    })
  });
});

module.exports = router;
