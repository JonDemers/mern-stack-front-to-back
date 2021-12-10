#!/bin/bash

set -e

if [ "$(git status -s)" != "" ]; then
  git status
  echo
  echo "***** You have local changes. Make sure to commit or revert them before deploying. *****"
  exit 1
fi

rm -rf ./client/build
npm run build --prefix client

rm -rf ./docs
mv ./client/build docs
cp ./docs/index.html ./docs/404.html

git checkout ./docs/CNAME
git add ./docs
git commit -m "Deploy frontent to gh-pages"
git push origin HEAD

git push heroku HEAD

echo
echo "***** Deployment succeeded *****"
