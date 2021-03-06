FROM node:5

ENV NODE_ENV production
ENV PORT 80
ENV TZ Asia/Shanghai

COPY . /src

RUN cd /src;npm install

WORKDIR /src

EXPOSE 80

CMD ["npm", "start"]