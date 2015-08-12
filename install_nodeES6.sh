#!/bin/bash

echo 'installing nodeES6 in /usr/local/bin/'

#	node --harmony
sudo -H cp nodeES6 /usr/local/bin/
sudo -H chmod +x /usr/local/bin/nodeES6
sudo -H npm install --global n
sudo -H n 0.12.7
