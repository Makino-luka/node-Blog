const fs = require('fs')
const path = require('path')
const readline = require('readline')

 const filename = path.resolve(__dirname, '../', '../', 'logs', '')
 const readStream = fs.createReadStream(filename)