#!/bin/sh

rm nohup.out
npm install
nohup node httpServer.js &
nohup node ftpServer.js &
