#!/bin/sh

export SJC_ROOT=$HOME/.sjc;
export SJC_CLI_ROOT=$SJC_ROOT/cli;

env_vars=""

#   pick up SJC environment variables
if [ -f ~/.sjc/env ]; then
    env_vars="$env_vars $(cat ~/.sjc/env)"
fi
if [ -f ~/.sjc/reverseproxy/env ]; then
    env_vars="$env_vars $(cat ~/.sjc/reverseproxy/env)"
fi
#   convert newlines to spaces, and trim
env_vars="$(echo $env_vars | tr '\n' ' ' | sed -e 's/\s*$//' | sed -e 's/^\s*//' | sed -e 's/\s{2,}/ /')"

eval "$env_vars node $SJC_CLI_ROOT/src/cli.js $@"

