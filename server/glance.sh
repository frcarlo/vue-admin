#!/usr/bin/bash
FIFO_FILE="./glance"
if [ ! -p "${FIFO_FILE}" ]; then
  mkfifo $FIFO_FILE
fi
glances --stdout-json now,cpu,mem,load -t 10 | tee -a $FIFO_FILE
