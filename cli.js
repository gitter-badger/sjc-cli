#!/usr/bin/env nodeES6

"use strict";

var SJC_CLI_SUBDIR = process.env.SJC_CLI_SUBDIR || "src";
require('./'+SJC_CLI_SUBDIR+'/cli.js');		
