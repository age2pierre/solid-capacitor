#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

mkdir -p $SCRIPT_DIR/../deployement/logs
mkdir -p $SCRIPT_DIR/../deployement/locks

LOCK_FILE="$SCRIPT_DIR/../deployment/locks/deploy-crontask.lock"

flock -n $LOCK_FILE $SCRIPT_DIR/deploy-onchange.sh 2>&1 | ts '[%Y-%m-%d %H:%M:%S]' >> $REPO_PATH/deployment/logs/deploy-crontask.log
