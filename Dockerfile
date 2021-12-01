# Here we are getting our node as Base image
FROM node:lts-alpine

# create user in the docker image
USER node

# setting working directory in the container
WORKDIR /usr/src/app

COPY package*.json ./

# installing the dependencies into the container
RUN yarn install --only=development

COPY . .

# container exposed network port number
EXPOSE 3000

# grant permission of node project directory 
RUN chown -R node /usr/src/app

CMD ["yarn", "start:dev"]
