#!/bin/bash
READ_PIPE=./vueadmin-in
WRITE_PIPE=./vueadmin-out
#while true; do eval "$(cat $READ_PIPE)" > $WRITE_PIPE 2>&1 ; done
while true; do eval "$(cat $READ_PIPE)" | tee $WRITE_PIPE ; done
