#!/bin/bash
res=`git status --porcelain`
if [[ -n $res ]];
then
  echo $res;
  echo 'Err: There are changed files after web.js built.'
  echo 'Please run `yarn build-web`'
  exit 1;
fi
