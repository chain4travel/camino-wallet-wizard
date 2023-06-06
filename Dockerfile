# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:18 as build-stage
WORKDIR /app
COPY ./ /app/
RUN yarn install
RUN yarn build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.18
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY /nginx.conf /etc/nginx/conf.d/default.conf
