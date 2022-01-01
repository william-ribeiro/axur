#!/bin/bash

echo '####################################################'
echo '#            Installing dependencies...            #'
echo '####################################################'
echo ' '
yarn install
echo ' '
echo '####################################################'
echo '#               Starting services...               #'
echo '####################################################'
echo ' '
yarn start:server
