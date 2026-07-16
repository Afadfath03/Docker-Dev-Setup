FROM node:20-alpine
RUN npm install -g json-server@0.17.4
WORKDIR /data
EXPOSE 3000
CMD ["json-server", "--watch", "/data/db.json", "--port", "3000", "--host", "0.0.0.0"]
