const { login } = require('../controller/user')
var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel')


/* GET users listing. */
router.post('/login', function(req, res, next) {
  const { username, password } = req.body
        // const { username, password } = req.query
  const result = login(username, password)
  return result.then(data => {
      if (data.username) {
          // 设置 session
          req.session.username = data.username
          req.session.realname = data.realname

          res.json(
            new SuccessModel()
          )
          return
      }
      res.json(
        new ErrorModel('登录失败')
      )
  })
});

router.get('/login-test', function(req, res, next) {
  if (req.session.username){
    res.json({
      status: 0,
      msg: '测试成功'
    })
    return
  }

  res.json({
    status: -1, 
    msg: '未登录'
  })
})

module.exports = router;
