#!/bin/sh
cd /Users/shenghui.li/Documents/Front-end-learn/node-blog/node-back/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
