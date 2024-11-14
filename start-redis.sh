#!/bin/bash
set -e

SERVER="redis-server";
REDIS_PASSWORD="changeit";

TEXT="=====> Stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"

echo "\033[1;3;35m $TEXT \033[0m"
(docker kill $SERVER || :) && \
(docker rm $SERVER || :) && \
docker run --name $SERVER -p 6379:6379 \
  -v ./data/redis:/data \
  -e REDIS_PASSWORD=$REDIS_PASSWORD \
  -d redis/redis-stack-server:latest \
  redis-server --save 20 1 --loglevel warning --requirepass $REDIS_PASSWORD && \
echo "\033[1;35m =====> Done \033[0m"