#!/usr/bin/bash

cd client && npm run build && cd - || exit

cd server && npm run build && cd - || exit