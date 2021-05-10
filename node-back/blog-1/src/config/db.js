const env = process.env.NODE_ENV


// 创建链接对象
const con_dev = {
  host: 'localhost',
  user: 'root',
  password: '12345678',
  port: '3306',
  database: 'myblog'
}

const con_prod = {
  host: 'localhost',
  user: 'root',
  password: '12345678',
  port: '3306',
  database: 'myblog'
}

const rcon_dev = {
  host: '127.0.0.1',
  port: 6379
}

// 配置环境变量
let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
  MYSQL_CONF = con_dev
  REDIS_CONF = rcon_dev
}

if (env === 'production') {
  MYSQL_CONF = con_prod
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}