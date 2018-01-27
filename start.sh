#!/bin/bash

npm run build
pm2 stop ./pm2.json && pm2 start ./pm2.json
