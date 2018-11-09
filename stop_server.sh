#!/usr/bin/env bash
echo Killing Tornado server
kill -9 `cat server/server.pid`
rm server/server.pid
echo terminated
