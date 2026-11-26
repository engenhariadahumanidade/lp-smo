FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html style.css main.js /usr/share/nginx/html/
COPY img/edh /usr/share/nginx/html/img/edh
EXPOSE 80
