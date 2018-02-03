---
layout: post
title: "Postmanの環境変数を使ってドメイン名を共通で管理する"
date: 2018-02-03 0:00:00 +900
comments: true
tags:
  - postman
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/postman-logo.png
---
いつもお世話になっている「Postman」についての小ネタです。

> 「Postman」とはAPIクライアントソフトと呼ばれるもので、Web開発時にAPIの動作検証を行う用途で使います。
> - Postman | API Development Environment https://www.getpostman.com/

自分の場合、実装が終了したAPIとフロントエンドを結合する前に、Postmanを使って動作検証を行うことにしています。

> Postmanには過去に呼び出した履歴を保存する機能があるので、動作検証の他に、後でAPIが壊れていないかのチェックのためにも使います。

開発途中はテスト用のAPIサーバーのドメインが変わることがあるのですが、そんな時にPostman「**環境変数**」を使っておくと変更が楽だよ。という話です。

## 環境変数の定義方法
環境変数はPostmanの右上の「設定」ボタンの「Manage environments」から設定用のダイアログを開くことができます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/postman1.png 500 %}

設定は普通に「Key - value」で設定すれば良いだけです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/postman4.png 500 %}

## 環境変数の利用方法
環境変数の利用方法は、定義した環境変数を `{% raw %}{{{% endraw %}` と `{% raw %}}}{% endraw %}` で囲うと利用できます。
マウスカーソルを当てると変数の内容が確認できるので、なかなか良いUIだと思います。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/postman3.png 500 %}

ちなみに環境変数の切り替えは、右上のプルダウンで行えるので、同じ変数名を使っていれば切り替えは簡単ですね。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/postman2.png 500 %}

## まとめ
知っていると得をするPostmanの小ネタでした。
