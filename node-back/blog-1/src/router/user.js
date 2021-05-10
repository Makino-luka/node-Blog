const { login } = require('../controller/login')
const { SucessModel, ErrorModel } = require('../model/resModel')
const { set, get } = require('../db/redis')

const handleUserRouter = (req, res) =>{
  const method = req.method

  if(method === 'POST' && req.path === '/api/user/login'){
    const { username, password } = req.body
    // const { username, password } = req.query
    const result = login(username, password)
    return result.then(data =>{
      if(data.username){
        //设置session
        req.session.username = data.username
        req.session.realname = data.realname
        // set session
        set(req.sessionId, req.session)
        // console.log(req.session);

        return new SucessModel('登录成功')
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }

  // if (method === 'GET' && req.path === '/api/user/logintest') {
  //   if (req.session.username) {
  //     return Promise.resolve(new SucessModel({
  //       // session: req.session
  //     }))
  //   }
  //   return Promise.resolve(new ErrorModel('尚未登录'))
  // }
}

module.exports = handleUserRouter