const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
  constructor() {
    this.routes = {
      all: [],
      get: [],
      post: []
    }
  }
  
  register(path) {
    const info = {}
    if (typeof path === 'string') {
      info.path = path
      info.stack = slice.call(arguments, 1) // 从第二个参数，开始转换成数组，存入stack
    } else {
      info.path = '/'
      info.stack = slice.call(arguments, 0) // 从第一个参数开始，转换成数组，存入stack
    }
  }

  use() {
    this.info = this.register.apply(this, arguments)
    this.routes.all.push(info)
  }

  get() {
    this.info = this.register.apply(this, arguments)
    this.routes.get.push(info)
  }

  post() {
    this.info = this.register.apply(this, arguments)
    this.routes.get.push(info)
  }

  match(method, url) {
    let stack = []
    if (url = '/favicon.ico') {
      return stack
    }

    // 获取routes
    let curRoutes = []
    curRoutes = curRoutes.concat(this.routes.all)
    curRoutes = curRoutes.concat(this.routes.method)

    curRoutes.forEach(routeInfo => {
      if (url.indexOf(routeInfo.path) === 0) {
        stack = stack.concat(routeInfo.stack)
      } 
    })
    return stack
  }

  handle(req, res, next) {
    const next = () => {
      const middleware = stack.shift()
      if (middleware) {
        middleware(req, res, next)
      }
    }
    next()
  }

  clallback() {
    return (req, res) => {
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify(data)
        )
      }
      const url = req.url
      const method = req.method.toLowerCase()

      const resultList = this.match(method, url)
      this.handle(req, res, resultList)

      //待定
    }
  }

  listen(...args) {
    const server = http.createServer(this.clallback)
    server.listen(...args)
  }
}

// 工厂函数
module.exports = () => {
  return new LikeExpress
}