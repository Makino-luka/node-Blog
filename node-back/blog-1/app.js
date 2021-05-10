const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')

const getCookieExpires = () =>{
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  // console.log(d.toGMTString());
  return d.toGMTString()
}

// session 数据
// const SESSION_DATA = {}

// 用于处理postdata
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
  return promise
}
const serverHandle = (req, res) => {
  // 记录accesslog
  console.log(222);
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
  // 设置返回格式 JSON
  res.setHeader('Content-Type', 'application/json')

  // 获取path
  const url = req.url
  req.path = url.split('?')[0]
  

  // 解析参数
  req.query = querystring.parse(url.split('?')[1])
  // console.log(JSON.stringify(req.query));

  // 解析cookies
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(element => {
    if (!element) {
      return
    }
    const arr = element.split('=')
    const key = arr[0].trim()
    const value = arr[1].trim()
    req.cookie[key] = value
    // console.log(req.cookie);
  })

   // if (userId) {
  //   // console.log(SESSION_DATA);
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]

  // 解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化session
    set(userId, {})
  }
  req.sessionId = userId
  get(req.sessionId).then(sessionData => {
    if (sessionData == null) {
      // 初始化session
      set(req.sessionId, {})
      req.session = {}
    } else {
      req.session = sessionData
    }
    // console.log('req.session=',req.session); 
    // 处理postData
    return getPostData(req)
  }).then(postData => {
    req.body = postData

    // 处理blog路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
          res.end(
            JSON.stringify(blogData)
          )
      })
      return
    }
    // const blogData = handleBlogRouter(req, res)
    // if (blogData) {
    //   res.end(
    //     JSON.stringify(blogData)
    //   )
    //   return
    // }

    //处理user路由
    // const userData = handleUserRouter(req, res)
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(userData)
        )
      })
      return
    }
    // console.log(userData);
    // if (userData) {
    //   res.end(
    //     JSON.stringify(userData)
    //   )
    //   return
    // }

    // 未命中返回404
    res.writeHead(404, {"content-type": 'text/plain'})
    res.write("404 NOT FOUND\n")
    res.end()
    // res.end(JSON.stringify(resData))
    })
}

module.exports = serverHandle