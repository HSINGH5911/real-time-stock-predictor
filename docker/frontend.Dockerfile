FROM node:22-alpine

WORKDIR /app

COPY ../stockpulse-ai/frontend/package*.json ./
RUN npm install

COPY ../stockpulse-ai/frontend .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
