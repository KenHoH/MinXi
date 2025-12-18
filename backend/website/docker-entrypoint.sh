#!/bin/sh
set -e

if [ "$SERVICE" = "user-service" ]; then
  npx prisma migrate deploy --schema=./prisma/user/schema.prisma
  exec node dist/apps/user/main.js
elif [ "$SERVICE" = "social-service" ]; then
  npx prisma migrate deploy --schema=./prisma/social/schema.prisma
  npx prisma migrate deploy --schema=./prisma/message/schema.prisma
  exec node dist/apps/social-app/main.js
elif [ "$SERVICE" = "algorithm-service" ]; then
  npx prisma migrate deploy --schema=./prisma/content/schema.prisma
  exec node dist/apps/algorithm-app/main.js
elif [ "$SERVICE" = "auth-service" ]; then
  exec node dist/apps/auth/main.js
elif [ "$SERVICE" = "board-service" ]; then
  exec node dist/apps/board-app/main.js
elif [ "$SERVICE" = "comment-service" ]; then
  exec node dist/apps/comment-app/main.js
elif [ "$SERVICE" = "connect-service" ]; then
  exec node dist/apps/connection-app/main.js
elif [ "$SERVICE" = "content-service" ]; then
  exec node dist/apps/content-app/main.js
elif [ "$SERVICE" = "history-service" ]; then
  exec node dist/apps/history-app/main.js
elif [ "$SERVICE" = "log-service" ]; then
  npx prisma migrate deploy --schema=./prisma/log/schema.prisma
  exec node dist/apps/log-app/main.js
elif [ "$SERVICE" = "notification-service" ]; then
  exec node dist/apps/notification-app/main.js
elif [ "$SERVICE" = "report-service" ]; then
  exec node dist/apps/report-app/main.js
elif [ "$SERVICE" = "website-api-gateway" ]; then
  exec node dist/apps/website-api-gateway/main.js
else
  echo "Unknown service: $SERVICE"
  exit 1
fi
