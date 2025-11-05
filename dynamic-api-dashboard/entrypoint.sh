#!/bin/sh
# Generate runtime config.js dynamically
echo "window._env_ = {" > /usr/share/nginx/html/config.js
echo "  VITE_API_URL: \"$VITE_API_URL\"" >> /usr/share/nginx/html/config.js
echo "};" >> /usr/share/nginx/html/config.js

# Start nginx
exec nginx -g 'daemon off;'
