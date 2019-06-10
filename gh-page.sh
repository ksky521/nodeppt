#! /bin/sh
set -e
rm -rf publish
cd site

node ../packages/nodeppt/bin/nodeppt build index.md
node ../packages/nodeppt/bin/nodeppt build animation.md
node ../packages/nodeppt/bin/nodeppt build component.md
node ../packages/nodeppt/bin/nodeppt build layout.md
node ../packages/nodeppt/bin/nodeppt build media.md
node ../packages/nodeppt/bin/nodeppt build background.md
node ../packages/nodeppt/bin/nodeppt build classes.md

cd dist

echo 'nodeppt.js.org' > CNAME
git init
git add -A
date_str=`date "+DATE: %m/%d/%Y%nTIME: %H:%M:%S"`
git commit -m "build with nodeppt on $date_str"
#exit
echo 'push remote github'
git push -u git@github.com:ksky521/nodeppt.git master:gh-pages --force
