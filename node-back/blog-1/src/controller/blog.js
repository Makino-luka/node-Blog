const { exec } = require('../db/mysql')

const getList = (author, keywords) => {
    let sql = `select id, title, content, createtime, author from blog where 1=1 `
    if (author) {
      sql += `and author = '${author}' `
    }
    if (keywords) {
      sql += `and title like '%${keywords}%' `
    }
    sql += `order by createtime desc; `
    console.log(sql);
    return exec(sql)
}

const getDetails = (id) => {
  let sql = `select id, title, content, createtime, author from blog where id=${id} `
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData是一个博客对象，包含title content属性
  // console.log('newBlog...', blogData);
  const title = blogData.title
  const content = blogData.content
  const author = blogData.author
  const createtime = Date.now()
  
  const sql = 
  `INSERT INTO blog (title, content, createtime, author)
  VALUES('${title}', '${content}', '${createtime}', '${author}')`

  console.log(sql);
  return exec(sql).then(insertData => {
    // console.log('insertData=',insertData)
    return {
      id: insertData.insertId
    }
  })
} 

const updateBlog = (id, blogData = {}) => {
  // id就是要更新博客的id
  // blogData是一个博客对象，包含title content属性
  // console.log('updateBlog...', blogData, 'id...', id);
  // return true;

  const title = blogData.title
  const content = blogData.content
  const sql = `update blog set title='${title}', content='${content}' where id='${id}' `

  return exec(sql).then(updateData => {
    // console.log('updateData...', updateData)
    if (updateData.affectedRows > 0) {
      return true
    } else {
      return false
    }
  })
}

const deleteBlog = (id, author = {}) => {
  // id就是要删除博客的id
  // const author = blogData.author
  const sql = `delete from blog where id='${id}' and author='${author}' `
  return exec(sql).then(deleteData => {
    // console.log('deleteData...', deleteData)
    if (deleteData.affectedRows > 0) {
      return true
    } else {
      return false
    }
  })
}

module.exports = { 
  getList,
  getDetails,
  newBlog,
  updateBlog,
  deleteBlog
}