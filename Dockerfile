FROM node:16-alpine as build-stage

WORKDIR /opt/app

COPY . .

# install dependencies
RUN npm install \
  && npm run build \
  && rm -rf node_modules

FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /opt/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

# Сборка образа
# sudo docker build -t broshotter-frontend .

# Запуск образа
# sudo docker run -p 8082:8082 broshotter-frontend
