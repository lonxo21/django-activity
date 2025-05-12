# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /code
COPY . .
ENV NODE_ENV=development
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev"]