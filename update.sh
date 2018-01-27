#!/bin/bash

# update repository
git pull
# install deps
yarn
# build code
npm run build
# restart
pm2 restart ./pm2.json
