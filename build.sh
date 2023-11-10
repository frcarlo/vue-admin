#!/usr/bin/bash

cd client && npm i && npm run build && cd - || exit

cd server && npm i && npm run build && cd - || exit