#!/bin/bash

node scripts/download-arena-images.js
node scripts/download-arena-words.js
node scripts/parse-poems.js 