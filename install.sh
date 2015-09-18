#!/bin/bash

mkdir -p ~/.sjc/cli
cd ~/.sjc/cli

git init
git remote add origin https://github.com/stjosephcontent/sjc-cli/.git
git pull origin master

npm install n
n latest

npm install
npm link

echo "ok, i think orchestra is up and running. try 'sjc up'"


