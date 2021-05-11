const fs = require('fs')
const path = require('path')
const readline = require('readline')

 const filename = path.resolve(__dirname, '../', '../', 'logs', 'access.log')
 const readStream = fs.createReadStream(filename)

 const rl = readline.createInterface({
   input: readStream
 })

 let cromeNum = 0
 let num  = 0

 // 逐行读取
 rl.on('line', (lineData) => {
   if (!lineData) {
     return
   }

   //记录总行数
   num++;

   const arr = lineData.split(' -- ')
   if (arr[2] && arr[2].indexOf('Chrome') > 0){
      cromeNum++;
   }
 })

 rl.on('close', () =>{
   console.log('Chrome 占比：' + cromeNum / num)
 })