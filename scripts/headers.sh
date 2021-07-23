#!/bin/bash

dist="dist"
output=$dist"/headers.js"

generate tampermonkey \
    -o $output \
    -m $(cat .matches) \
    -g "get" "set" "list" "delete"

userscript=$dist"/$(ls $dist -1 | grep -e ".*\.user\.js")"

sed -i -e "{1e cat $output; echo; echo" -e "; N}" $userscript
