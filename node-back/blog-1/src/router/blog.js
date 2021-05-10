const { getList, getDetails, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SucessModel, ErrorModel } = require('../model/resModel')

// 登录状态检测

const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(
      new ErrorModel('尚未登录')
    )
  }
}

const handleBlogRouter = (req, res) =>{
    const method = req.method
    const id = req.query.id || ''
    const postId = req.body.id || ''

    if(method === 'GET' && req.path === '/api/blog/list'){
      const author = req.query.author || ''
      const keywords = req.query.keywords || ''
      // const ListData = getList(author, keywords)
      // return new SucessModel(ListData)
      const result = getList(author, keywords)
      return result.then(listData => {
        return new SucessModel(listData)
      })
    }

    if(method === 'GET' && req.path === '/api/blog/detail'){
      // const detailData = getDetails(id)
      // return new SucessModel(detailData)
      const result = getDetails(id)
      return result.then(data => {
        return new SucessModel(data)
      })
    }

    if(method === 'POST' && req.path === '/api/blog/new'){
      // const data = newBlog(req.body)
      // return new SucessModel(data)
      const loginCheckResult = loginCheck(req)
      if (loginCheckResult) {
        return loginCheckResult
      }
      // const author = 'wangwu'
      req.body.author = req.session.username
      const result = newBlog(req.body)
      return result.then(data => {
        return new SucessModel(data)
      })
    }

    if(method === 'POST' && req.path === '/api/blog/update'){
      const result = updateBlog(id, req.body)
      const loginCheckResult = loginCheck(req)
      // console.log();
      if (loginCheckResult) {
        return loginCheckResult
      }
      return result.then(val => {
        if (val) {
          return new SucessModel(val)
        } else {
          return new ErrorModel('修改失败')
        }
      })
      
    }

    if(method === 'POST' && req.path === '/api/blog/del'){
      // const author = 'wangwu'
      let author = req.session.username
      const result = deleteBlog(id, author)
      const loginCheckResult = loginCheck(req)
      if (loginCheckResult) {
        return loginCheckResult
      }
      return result.then(val => {
        if (val) {
          return new SucessModel(val)
        } else {
          return new ErrorModel('删除博客失败')
        }
      })
    }
}

module.exports = handleBlogRouter