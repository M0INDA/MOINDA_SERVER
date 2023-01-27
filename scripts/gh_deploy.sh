cd /home/ubuntu/github_action

npm install

npm install class-validator class-transformer mysql2 bcrypt @types/bcrypt

npm run build

sudo pm2 kill

sudo NODE_ENV=ci pm2 start dist/apps/moinda-pd-api/main.js

