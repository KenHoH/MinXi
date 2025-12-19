FROM nginx:alpine

# Copy frontend build output
COPY --from=kenhoh/frontend-static:1.0.0 /app/dist /usr/share/nginx/html

# Copy nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
