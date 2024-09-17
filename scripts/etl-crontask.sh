#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

CONTAINER_NAME="etl-$(date '+%Y%m%dT%H%M')"

LOCK_FILE=$SCRIPT_DIR/../deployement/locks/etl-crontask.lock

mkdir -p $SCRIPT_DIR/../deployement/logs
mkdir -p $SCRIPT_DIR/../deployement/locks

cd $SCRIPT_DIR/../

# TODO repalce by http call to admin API 
flock -n $LOCK_FILE docker compose run --name $CONTAINER_NAME webserver pnpm start:etl 2>&1 | ts '[%Y-%m-%d %H:%M:%S]' >> $SCRIPT_DIR/../deployement/logs/automation/etl-crontask.log
