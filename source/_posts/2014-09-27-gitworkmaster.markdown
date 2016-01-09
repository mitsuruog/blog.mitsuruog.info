---
layout: post
title: "[Git]workブランチの内容をmasterへ強制マージ"
date: 2014-09-27 00:23:00 +0900
comments: true
tags: 
 - git
---

自分用メモです。

```
git reset --hard origin/work
git push -f origin master
```

workブランチで作業していて、コミットログをきれいにしようとしてrebaseするのですが、ぶっちゃけ個人用リポジトリ(※)なので、masterの中途半端なコミットログも最初までrebaseして、masterに強制マージ&プッシュする場合の手順。

<!-- more -->

> (※)公開リポジトリの場合は、コミットのハッシュが変わってしまい、阿鼻叫喚となるので禁じ手。