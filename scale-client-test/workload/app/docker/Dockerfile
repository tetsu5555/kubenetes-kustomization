FROM node:12.16.1-alpine

WORKDIR /usr/src/app
COPY ./ /usr/src/app

RUN npm install
RUN npm run build

# command上書き前提
CMD ["tail", "-f", "/dev/null"]
