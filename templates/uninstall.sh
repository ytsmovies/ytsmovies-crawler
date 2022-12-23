#!/usr/bin/env bash

echo "Uninstalling app crawler"

systemctl stop app-crawler.service
systemctl disable app-crawler.service
systemctl daemon-reload

rm /etc/systemd/system/app-crawler.service
