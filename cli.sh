#!/bin/sh

export SJC_ROOT=$HOME/.sjc;
export SJC_CLI_ROOT=$SJC_ROOT/cli;

#   pick up SJC environment variables
env_vars=""
if [ -e ~/.sjc/env ]; then
    env_vars+="$(cat ~/.sjc/env)" 
fi
if [ -e ~/.sjc/reverseproxy/env ]; then
    env_vars+="$(cat ~/.sjc/reverseproxy/env)"
fi
env_vars="$(echo "$env_vars" | sed -e 's/#.*//' | tr '\n' ' ' | sed -e 's/\s*$//' | sed -e 's/^\s*//' | sed -e 's/\s{2,}/ /')"

eval "$env_vars node $SJC_CLI_ROOT/src/cli.js $@"
