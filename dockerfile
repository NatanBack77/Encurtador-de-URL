FROM node:20-slim

RUN mkdir /home/node/api

WORKDIR /home/node/api

RUN mkdir /home/node/api/node_modules

CMD [ "/home/node/api/.docker/dev.sh" ]