# SJC cli

A command-line utility for SJC

## Quick install

    git clone https://github.com/stjosephcontent/sjc-cli.git
    cd sjc-cli
    bash install.sh

## Slow Install

    node --version (should be 4.x)
    mkdir -p ~/.sjc/cli
    rm -rvf ~/.sjc/cli
    cd ~/.sjc
    git clone https://github.com/stjosephcontent/sjc-cli.git cli
    cd cli
    npm install (might need sudo)
    npm link (might need sudo)
    # now test your installation
    sjc up

