#!/bin/bash


cd /home/ubuntu/drcloud-deploy

npm install

npm install class-validator class-transformer mysql2 bcrypt @types/bcrypt axios @types/axios

npm run build

sudo pm2 kill

sudo NODE_ENV=ci pm2 start dist/apps/moinda-pd-api/main.js
