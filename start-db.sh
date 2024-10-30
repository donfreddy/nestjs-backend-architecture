#!/bin/bash

# This script is used to start the database server.
# type `sh start-db.sh` in the terminal.

# Remove address already in use error message
# `sudo ss -lptn 'sport = :27017'` and then `kill <pid>`

set -e

SERVER="mongo_blogs";
USERNAME="blogs-db-user";
PASSWORD="changeIt";
DB="blogs-db";
VOLUME_NAME="db_data";

TEXT="=====> Stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"

echo "\033[1;3;35m $TEXT \033[0m"
(docker kill $SERVER || :) && \
(docker rm $SERVER || :) && \
docker run --name $SERVER -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=$USERNAME \
  -e MONGO_INITDB_ROOT_PASSWORD=$PASSWORD \
  -e MONGO_INITDB_DATABASE=$DB \
  -v $VOLUME_NAME:/data/db \
  -v ./addons/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro \
  -d mongo && \
echo "\033[1;35m =====> Done \033[0m"