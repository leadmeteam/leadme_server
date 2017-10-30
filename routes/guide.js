var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Guide = require('../models/guide');
var Feed = require('../models/feed');

router.get('/allGuides', (req, res) => { //모든 가이드 정보 조회
  Guide.find().populate({
    path: "userId",
  }).exec((err, guides) => {
    if (err) res.status(403).end();
    else if (!guides) res.json({
      message: "nobody guides"
    })
    else {
      res.status(201).json(guides);
    }
  })
});

router.post('/guide/delete', (req, res) => { // 가이드 삭제
  Guide.findOneAndRemove({
    "userId": req.body.userId
  }, (err) => {
    if (err) res.status(403).end();
    else {
      res.status(201).json({
        message: "delete sucess!"
      });
    }
  })
});

router.post('/guide/signUp', (req, res) => { //가이드 가입 및 유저 디비 연결
  var newGuide = new Guide({
    userId: req.body.userId,
    regions: req.body.regions,
    languages: {
      mostConfidentLanguage: req.body.mostConfidentLanguage,
      availableLanguage: req.body.availableLanguage,
      levelOfLanguage: req.body.levelOfLanguage
    },
    license: req.body.license,
    introduction: req.body.introduction,
    userName: ""
  });

  Guide.findOne({
    "userId": req.body.userId
  }, (err, result) => {
    console.log(result)
    if (err) res.status(403).json(err);
    else if (result) res.status(201).json({
      message: "already Guide"
    });
    else {
      User.findById(req.body.userId, (err, user) => {
        if (err) res.status(403).json(err);
        else if (!user) res.status(404).json({
          error: 'user cant found!'
        });
        else {
          newGuide.userName = user.last_name + user.first_name;

          newGuide.save((err, guide) => {
            if (err) res.status(501).json(err);
            else res.json({
              message: "guide active"
            });
          });
        }
      });
    }
  });
});

router.post('/guide', (req, res) => { //가이드 정보 조회 INPUT(userId) -> OUTPUT(guide정보 객체)
  Guide.findOne({
    "userId": req.body.userId
  }).populate({
    path: "userId"
  }).exec((err, guide) => {
    if (err) res.status(403).json(err);
    else if (!guide) res.status(201).json({
      message: "Not Guide"
    })
    else res.status(201).json(guide)
  })
});

router.post('/guide/modify', (req, res) => { //가이드 정보 변경
  var userId = req.body.userId;
  var modifyGuide = {
    regions: req.body.regions,
    languages: {
      mostConfidentLanguage: req.body.mostConfidentLanguage,
      availableLanguage: req.body.availableLanguage,
      levelOfLanguage: req.body.levelOfLanguage
    },
    license: req.body.license,
    introduction: req.body.introduction,
    userName: req.body.userName,
    activation: req.body.activation,
    createdDate: Date.now()
  };

  Guide.findOneAndUpdate({
    "userId": userId
  }, {
    $set: modifyGuide
  }, (err, guide) => {
    if (err) res.status(403).json(err);
    else if (!guide) res.status(201).json({
      message: "Not Guide"
    })
    else res.status(201).json({
      message: "modify Sucess!!"
    });
  });
});

router.post('/guide/activeToggle', (req, res) => { // 가이드 활동상태 토글
  Guide.findOne({
    "userId": req.body.userId
  }).populate({
    path: "userId"
  }).exec((err, guide) => {
    if (err) res.status(403).json(err);
    else if (!guide) res.status(201).json({
      message: "Not Guide"
    })
    else {
      guide.update({
        $set: {
          activation: !guide.activation
        }
      }, (err) => {
        if (err) res.status(403).json(err);
        else res.status(201).json({
          message: "toggle sucess!"
        })
      });
    }
  });
});

router.get('/guide/sortBy/:standard', (req, res) => { // 가이드 검색 정렬
  var standard = {}; //정렬 기준
  var sorting = -1; //오름차순 : 1, 내림차순 : -1
  if (req.params.standard == 0) standard["rating.star"] = sorting; // 파라미터 0 이면 레이팅 솔팅
  else if (req.params.standard == 1) standard["createdDate"] = sorting; // 파라미터 1이면 최신순

  Guide.find({
    "activation": true
  }).sort(standard).populate({
    path: "userId"
  }).exec((err, guides) => {
    if (err) res.status(403).end();
    else if (!guides) res.json({
      message: "nobody guides"
    })
    else {
      res.status(201).json(guides);
    }
  });
});

router.get('/guide/search/:qs',(req,res)=> {  // 가이드 이름 검색
  var regx= new regEXP(req.params.qs+'.*',"i");

  Guide.find({"userName": {$regex:regx}},(err,guides)=>{
    if (err) res.status(403).end();
    else {
      res.status(201).json(guides);
    }
  })
});

// router.post('/guide/findByName', (req, res) => { // 이름으로 가이드들 검색
//   var nameRegex = new RegExp(req.query.guideName);
//   Guide.find({'name': {$regex: nameRegex, options: 'i'}}, (err, guides) => {
//     if (err) {
//       res.status(403).end();
//     }
//     res.status(201).json(guides);
//   });
// });
//
// router.post('/guide/findByRegion', (req, res) => { // 지역으로 가이드를 검색
//   User.find().populate({
//     path: "guideId",
//     match: {
//       regions: req.body.region
//     }
//   }).exec((err, guides) => {
//     if (err) res.status(403).json(err);
//     else if (guides.length == 0) res.status(201).json(guides);
//     else {
//       var guideArray = [];
//       guides.forEach((guide) => {
//         guideArray.push(guide.guideId)
//         if (guideArray.length == guides.length)
//           res.status(201).json(guideArray);
//       })
//     }
//   })
// });
//
// router.post('/guide/findByLanguage', (req, res) => { // 언어로 가이드를 검색
//   User.find().populate({
//     path: "guideId",
//     match: {
//       "languages.languageName": req.body.language
//     }
//   }).exec((err, guides) => {
//     if (err) res.status(403).json(err);
//     else if (guides.length == 0) res.status(201).json(guides);
//     else {
//       var guideArray = [];
//       guides.forEach((guide) => {
//         guideArray.push(guide.guideId)
//         if (guideArray.length == guides.length)
//           res.status(201).json(guideArray);
//       })
//     }
//   })
// });
//
// router.get('/guide/findByLicense', (req, res) => { // 라이센스 등록 가이드를 검색
//   User.find().populate({
//     path: "guideId",
//     match: {
//       "license": true
//     }
//   }).exec((err, guides) => {
//     if (err) res.status(403).json(err);
//     else {
//       var guideArray = [];
//       guides.forEach((guide) => {
//         guideArray.push(guide.guideId)
//         if (guideArray.length == guides.length)
//           res.status(201).json(guideArray);
//       })
//     }
//   })
// });
//
// router.get('/guide/findByRecentDate', (req, res) => { // 라이센스 등록 날짜 최근순 검색
//   User.find().populate({
//     path: "guideId"
//   }).sort({
//     "lastGuideRegisterDate": -1
//   }).exec((err, guides) => {
//     if (err) res.status(403).json(err);
//     else if (guides.length == 0) res.status(201).json(guides);
//     else {
//       var guideArray = [];
//       guides.forEach((guide) => {
//         guideArray.push(guide.guideId)
//         if (guideArray.length == guides.length)
//           res.status(201).json(guideArray);
//       })
//     }
//   })
// });
//
// // router.get('/guide/findByOldestDate', (req, res) => { // 라이센스 등록 날짜 오래된순 검색
// //   User.find().populate({
// //     path: "guideId"
// //   }).sort({
// //     "lastGuideRegisterDate": 1
// //   }).exec((err, guides) => {
// //     if (err) res.status(403).json(err);
// // else if(guides.length==0) res.status(201).json(guides);
// //     else {
// //       var guideArray = [];
// //       guides.forEach((guide) => {
// //         guideArray.push(guide.guideId)
// //         if (guideArray.length == guides.length)
// //           res.status(201).json(guideArray);
// //       })
// //     }
// //   })
// // });
//
// router.get('/guide/findByOldestDate', (req, res) => {
//   User.find().populate({
//     path: "guideId",
//     options: {
//       sort: [{
//         'name': -1
//       }]
//     }
//   }).exec((err, guides) => {
//     if (err) res.status(403).json(err);
//     else if (guides.length == 0) res.status(201).json(guides);
//     else {
//       var guideArray = [];
//       guides.forEach((guide) => {
//         guideArray.push(guide.guideId)
//         if (guideArray.length == guides.length)
//           res.status(201).json(guideArray);
//       })
//     }
//   });
// });
//
// router.post('/guide/findGuide', (req, res) => { // 가이드 조회 통합 *테스트중
//   var findOptions = {
//     name: req.body.name,
//     regions: req.body.regions,
//     "languages.languageName": req.body.languages,
//     license: req.body.license,
//   };
//   var sorting = -1;
//   if (req.body.sorting) sorting = 1
//
//   User.find().populate({
//     path: "guideId",
//     match: findOptions
//   }).sort({
//     "lastGuideRegisterDate": sorting
//   }).exec((err, guides) => {
//     if (err) res.status(403).json(err);
//     else if (guides.length == 0) res.status(201).json(guides);
//     else {
//       var guideArray = [];
//       guides.forEach((guide) => {
//         guideArray.push(guide.guideId)
//         if (guideArray.length == guides.length)
//           res.status(201).json(guideArray);
//       })
//     }
//   })
// });
//
// function fetchRatingFirst(userId, callback) { // guide's rating 패치 함수 *아직 확인 못함
//   var licensePoint = 0;
//   var totalFeedPoint = 0;
//   var totalFeedLikePoint = 0;
//   var newStar = 0;
//   var totalLike = 0;
//   var arrayLength = 0;
//   Guide.findOne({
//     "userId": userId
//   }).populate("wroteFeed").exec((err, guide) => {
//     if (err) callback(err);
//     else if (!guide) callback({
//       message: "cant find guide"
//     });
//     else {
//       forEach(guide.wroteFeed){
//         totalLike = totalLike+ guide.wroteFeed.like;
//         arrayLength++;
//         if(guide.wroteFeed.length == arrayLength){
//           guide.update({
//             $set: {
//               "rating.totalFeed": guide.wroteFeed.length,
//               "rating.totalFeedLike": totalLike
//             }
//           },(err)=>{
//             if (err) callback(err);
//             else{
//               Guide.findOne({
//                 "userId": userId
//               }, (err, guide) => {
//                 if (err) callback(err);
//                 else if (!guide) callback({
//                   message: "cant find guide"
//                 });
//                 else {
//                   if (guide.license) licensePoint = 1;
//                   totalFeedPoint = parseInt(guide.rating.Feed / 5);
//                   if (totalFeedPoint > 2) totalFeedPoint = 2;
//                   totalFeedLikePoint = parseInt(guide.rating.totalFeedLike / 10);
//                   if (totalFeedLikePoint) totalFeedLikePoint = 2;
//                   newStar = licensePoint + totalFeedPoint + totalFeedLikePoint;
//
//                   guide.update({$set:{
//                     "star" :newStar
//                   }},(err)=>{
//                     if (err) callback(err);
//                     else callback(json({message:"fetch sucess!"}))
//                   })
//                 }
//               });
//             }
//           })
//         }
//       }
//     }
//   })
// }
module.exports = router;
