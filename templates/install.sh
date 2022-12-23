#!/usr/bin/env bash

echo "Install app crawler service"

cp app-crawler.service /etc/systemd/system

systemctl enable app-crawler.service
systemctl daemon-reload
systemctl start app-crawler.service
