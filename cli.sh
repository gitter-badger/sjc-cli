#!/bin/bash

export SJC_ROOT=$HOME/.sjc;
export SJC_CLI_ROOT=$SJC_ROOT/cli;
export SJC_ORCHESTRA_VESRION=0.0.1

node --harmony $SJC_CLI_ROOT/src/cli.js $@;
