const { exec, escape } = require('../db/mysql')

const login = (username, password) => {
  username = escape(username)
  password = escape(password)
  const sql = `select username, realname from user where username=${username} and userpassword=${password}`
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}
module.exports = { login };