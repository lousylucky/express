FROM node:22.11.0
RUN adduser app 
USER app
WORKDIR /app/
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]