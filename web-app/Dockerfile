# build
FROM node:alpine

# set working directory
WORKDIR '/app'

# install and cache app dependencies
COPY package.json .
RUN yarn
COPY . .

EXPOSE 3000
# start app
CMD ["yarn", "start"]
