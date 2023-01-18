#!/bin/bash


cd /home/ubuntu/drcloud-deploy

npm install

npm install class-validator class-transformer mysql2 bcrypt @types/bcrypt

sudo pm2 kill

sudo pm2 start dist/apps/moinda-pd-api/main.js
