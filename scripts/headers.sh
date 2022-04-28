#!/bin/bash

dist="dist"
output=$dist"/headers.js"

generate tampermonkey \
    -o $output \
    -m meta all https://domain/questions/* \
    -g "get" "set" "list" "delete" \
    --collapse \
    --pretty

userscript=$dist"/$(ls $dist -1 | grep -e ".*\.user\.js")"

sed -i -e "{1e cat $output; echo; echo" -e "; N}" $userscript
