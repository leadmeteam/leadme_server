var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Guide = require('../models/guide');

router.get('/allGuides', (req, res) => { //모든 가이드 정보 조회
  User.find().populate({
    path: "guideId"
  }).exec((err, guides) => {
    if (err) res.status(403).json(err);
    else {
      var guideArray = [];
      guides.forEach((guide) => {
        guideArray.push(guide.guideId)
        if (guideArray.length == guides.length)
          res.status(201).json(guideArray);
      })
    }
  })
});

router.post('/guide', (req, res) => { //가이드 정보 조회
  User.findById(req.body.userId).populate('guideId').exec((err, guide) => {
    if (err) res.status(403).json(err);
    else if (!guide) res.json({
      message: "not guide"
    })
    else res.status(201).json(guide.guideId);
  });
});

router.post('/guide/signUp', (req, res) => { //가이드 가입 및 유저 디비 연결
  var userId = req.body.userId;
  var guideId = "";
  var newGuide = new Guide({
    regions: req.body.guideRegions,
    languages: req.body.guideLanguage,
    license: req.body.guideLicense,
    introduction: req.body.guideIntroduction,
    name: ""
  });

  User.findById(userId, (err, user) => {
    if (err) res.status(403).json(err);
    else if (!user) res.status(404).json({
      error: 'user not found!'
    });
    else {
      newGuide.name = user.last_name + user.first_name;

      if (!user.guideId) {
        newGuide.save((err, guide) => {
          if (err) res.status(501).json(err);
          else {
            user.update({
              guideId: guide._id,
              lastGuideRegisterDate: Date.now()
            }, (err) => {
              if (err) res.status(501).json(err);
              else res.json({
                message: "guide active"
              })
            });
          }
        });
      } else {
        res.json({
          message: "guide already!"
        });
      }
    }
  });
});

router.post('/guide/activeToggle', (req, res) => { // 가이드 활동상태 토글
  User.findById(req.body.userId).populate('guideId')
    .exec((err, user) => {
      if (err) res.status(403).json(err);
      else if (user.guideId.activation)
        user.guideId.update({
          "activation": false
        }, (err) => {
          if (err) res.status(403).json(err);
          else res.status(404).json({
            message: 'toggle sucess!'
          });
        });
      else {
        user.guideId.update({
          "activation": true
        }, (err) => {
          if (err) res.status(403).json(err);
          else res.status(404).json({
            message: 'toggle sucess!'
          });
        });
      }
    });
});

router.post('/guide/findByName', (req, res) => { // 이름으로 가이드들 검색
  User.find().populate({
    path: "guideId",
    match: {
      name: req.body.guideName
    }
  }).exec((err, guides) => {
    if (err) res.status(403).json(err);
    else {
      var guideArray = [];
      guides.forEach((guide) => {
        guideArray.push(guide.guideId)
        if (guideArray.length == guides.length)
          res.status(201).json(guideArray);
      })
    }
  });
});

router.post('/guide/findByRegion', (req, res) => { // 지역으로 가이드를 검색
  User.find().populate({
    path: "guideId",
    match: {
      regions: req.body.region
    }
  }).exec((err, guides) => {
    if (err) res.status(403).json(err);
    else {
      var guideArray = [];
      guides.forEach((guide) => {
        guideArray.push(guide.guideId)
        if (guideArray.length == guides.length)
          res.status(201).json(guideArray);
      })
    }
  })
});

router.post('/guide/findByLanguage', (req, res) => { // 언어로 가이드를 검색
  User.find().populate({
    path: "guideId",
    match: {
      "languages.languageName": req.body.language
    }
  }).exec((err, guides) => {
    if (err) res.status(403).json(err);
    else {
      var guideArray = [];
      guides.forEach((guide) => {
        guideArray.push(guide.guideId)
        if (guideArray.length == guides.length)
          res.status(201).json(guideArray);
      })
    }
  })
});

router.get('/guide/findByLicense', (req, res) => { // 라이센스 등록 가이드를 검색
  User.find().populate({
    path: "guideId",
    match: {
      "license": true
    }
  }).exec((err, guides) => {
    if (err) res.status(403).json(err);
    else {
      var guideArray = [];
      guides.forEach((guide) => {
        guideArray.push(guide.guideId)
        if (guideArray.length == guides.length)
          res.status(201).json(guideArray);
      })
    }
  })
});

router.get('/guide/findByRecentDate', (req, res) => { // 라이센스 등록 날짜 최근순 검색
  User.find().populate({
    path: "guideId"
  }).sort({
    "lastGuideRegisterDate": -1
  }).exec((err, guides) => {
    if (err) res.status(403).json(err);
    else {
      var guideArray = [];
      guides.forEach((guide) => {
        guideArray.push(guide.guideId)
        if (guideArray.length == guides.length)
          res.status(201).json(guideArray);
      })
    }
  })
});

router.get('/guide/findByOldestDate', (req, res) => { // 라이센스 등록 날짜 오래된순 검색
  User.find().populate({
    path: "guideId"
  }).sort({
    "lastGuideRegisterDate": 1
  }).exec((err, guides) => {
    if (err) res.status(403).json(err);
    else {
      var guideArray = [];
      guides.forEach((guide) => {
        guideArray.push(guide.guideId)
        if (guideArray.length == guides.length)
          res.status(201).json(guideArray);
      })
    }
  })
});

router.post('/guide/findGuide', (req, res) => { // 가이드 조회 통합 *테스트중
  var findOptions = {
    name: req.body.name,
    regions: req.body.regions,
    "languages.languageName": req.body.languages,
    license: req.body.license,
  };
  var sorting = -1;
  if (req.body.sorting) sorting = 1

  User.find().populate({
    path: "guideId",
    match: findOptions
  }).sort({
    "lastGuideRegisterDate": sorting
  }).exec((err, guides) => {
    if (err) res.status(403).json(err);
    else {
      var guideArray = [];
      guides.forEach((guide) => {
        guideArray.push(guide.guideId)
        if (guideArray.length == guides.length)
          res.status(201).json(guideArray);
      })
    }
  })
});

module.exports = router;
