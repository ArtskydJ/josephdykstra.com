#!/bin/sh

rm nohup.out
npm install
nohup node http-server.js &
nohup node ftp-server.js &
