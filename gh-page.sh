#! /bin/sh

rm -rf publish
node ./bin/nodeppt release ppts/demo.md -a

cd publish
mv demo.html index.html

git init
git add -A
date_str=`date "+DATE: %m/%d/%Y%nTIME: %H:%M:%S"`
git commit -m "build with nodeppt on $date_str"
#exit
echo 'push remote github'
git push -u git@github.com:ksky521/nodeppt.git master:gh-pages --force
