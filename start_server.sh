#!/usr/bin/env bash

echo Starting Tornado server...
cd server
python3 ./server.py >>/dev/null 2>&1 &
RETVAL=$?
PID=$!
[ $RETVAL -eq 0 ] && echo $PID > ./server.pid 
echo started
