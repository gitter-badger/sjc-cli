#!/bin/sh

DIR="$(git rev-parse --show-toplevel)"

#if [ ! -d ~/.sjc/cli ]; then
#    mkdir -p ~/.sjc/;
#    cd ~/.sjc/;
#    git clone https://github.com/stjosephcontent/sjc-cli cli
#fi

node --harmony $DIR/src/cli.js $@