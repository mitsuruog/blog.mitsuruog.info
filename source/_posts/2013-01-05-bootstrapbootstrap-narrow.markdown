---
layout: post
title: "bootstrapテーマ「bootstrap narrow」を作りました"
date: 2013-01-05 00:40:00 +0900
comments: true
tags: 
 - bootstrap
 - CSS
---

いつも非常にお世話になっている[bootstrap](http://twitter.github.com/bootstrap/)ですが、（業務系システムなど）画面の項目が多い場合、どうしても余白が多すぎると感じることが多くあります。
その都度、リセットするCSSを作っていたのですが、同じ悩みを抱える人が結構いるのではと思い公開してみました。

> (2014/11/15 追記)
> メンテしてないので使わないほうがいいです。3系も対応してませんし...

<!-- more -->

### このエントリでお伝えしたいこと。

1.  良かったら使ってください。
2.  Cloud9とgrunt.jsでどこでも快適ビルド生活。

## bootstrap narrowとは

項目数が多い画面向けに、余白を必要最低限にとどめたbootstrapテーマです。

素の部分はbootstrapをそのまま使用しています。
（つまりbootstrapに依存しています。）

ソースコード一式はGithubにあります。
[https://github.com/mitsuruog/bootstrap-narrow](https://github.com/mitsuruog/bootstrap-narrow)

## ダウンロード

[CSSO](https://github.com/css/csso)にてminifyしたものも準備していますので、用途に応じて利用してください。

[Development Version](https://raw.github.com/mitsuruog/bootstrap-narrow/master/bootstrap-narrow.css)　Full code

[Production Version](https://raw.github.com/mitsuruog/bootstrap-narrow/master/bootstrap-narrow.min.css)　CSSOminify

## 使い方

HTML上に次のようにマークアップしてください。

```html
<head>
 
  <!-- 省略 -->
 
  <!-- styles (./cssがcssのrootフォルダの場合) -->
  <link href="./css/bootstrap.css" rel="stylesheet">
  <link href="./css/bootstrap-responsive.css" rel="stylesheet">
  <link href="./css/bootstrap-narrow.css" rel="stylesheet">
  
  <!-- 省略 -->
  
</head>
```

## 不具合・問い合わせ・要望など

Githubにて運営してますので、[Issue](https://github.com/mitsuruog/bootstrap-narrow/issues)にてお願いします。

## その他

開発環境は[Cloud9](https://c9.io/)上で構築しています。

lessを使っているのでBuildは[grunt.js](http://gruntjs.com/)で自動化しています。非常に快適です。

また、CSSについては本業ではないので、色々勉強しながら作っています。
コードスタイルに関しては、こちらのエントリに準拠できるよう努力しています。

一貫性のあるCSSらしいCSSを書くための原則

[https://github.com/necolas/idiomatic-css/tree/master/translations/ja-JP](https://github.com/necolas/idiomatic-css/tree/master/translations/ja-JP)

他に良いネタありましたら教えて下さい。