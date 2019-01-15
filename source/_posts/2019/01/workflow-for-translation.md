---
layout: post
title: "翻訳プロジェクトのアップデートワークフロー"
date: 2019-01-15 0:00:00 +900
comments: true
tags:
  - その他
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/translations-logo.png
---

（完全に自分用のメモです。）

いくつか翻訳のプロジェクトをGitHub持っているのですが、更新が年単位の間隔が開くことも珍しくないので、自分のために作業のワークフローを残しておこう。

- AirbnbのJavaScriptスタイルガイド
  - https://github.com/mitsuruog/javascript-style-guide
- Clean Code For JavaScript
  - https://github.com/mitsuruog/clean-code-javascript

## アップデートのワークフロー

## 1. 翻訳する本家のコミットのスナップショットを記録する

まず、翻訳する本家のコミットのスナップショットを記録します。

本家のコミットは翻訳用のリポジトリに`upstream`と言う名前でリモートリポジトリを追加します。

```sh
git remote add upstream <リポジトリURL>
```

  > `upstream`が慣例のような気がする。

結局のところ、文書のフォーマットがMarkdownなので、オリジナル文書と翻訳したものが混在してしまいます。うまくDiffを取ることが難しいため、オリジナル文書の差分を手動でコピーして、翻訳を追加していきます。

## 2. 以前のスナップショットとの差分を抽出する

さて、前回の作業から数ヶ月が経ちました。やっと重い腰をあげて翻訳をアップデートするとします。

翻訳用のリポジトリの`upstream`と、本家の差分を抽出します。

これはGitHub上のGUIで作業できるので、翻訳用のリポジトリ「New pull request」画面に移動して「compare accoss forks」の画面へ移動します。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/translations1.png 550 %}

ここで本家から翻訳用のリポジトリの`upstream`へpull requestを作ります。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/translations2.png 550 %}

(左側に翻訳用リポジトリ。右側に本家です。)

  > 実際のpull request:
  > 
  > - https://github.com/mitsuruog/clean-code-javascript/pull/4

これでファイルの差分がわかるので、地道に文書をアップデートしていきます。ちなみにここでマージした`upstream`が次回アップデートするためのスナップショットです。

## まとめ
以上が簡単なワークフローのまとめでした。

スクリプトとか組めばもっと格好のいい形になるのかもしれませんが、それほど頻繁にやる作業ではないので、これくらいゆるい感じがちょうどいいのです。