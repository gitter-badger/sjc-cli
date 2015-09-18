#!/bin/bash

mkdir -p ~/.sjc/cli
rm -rvf ~/.sjc/cli

cd ~/.sjc

git clone https://github.com/stjosephcontent/sjc-cli.git cli

npm install n
n latest

npm install
npm link

echo "ok, i think orchestra is up and running. try 'sjc up'"


