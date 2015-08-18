#!/bin/sh

export SJC_ROOT=$HOME/.sjc;
export SJC_CLI_ROOT=$SJC_ROOT/cli;

node --harmony $SJC_CLI_ROOT/src/cli.js $@;