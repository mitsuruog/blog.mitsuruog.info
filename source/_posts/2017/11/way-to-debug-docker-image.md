---
layout: post
title: "docker imageの中身をデバックする方法"
date: 2017-11-09 0:00:00 +900
comments: true
tags:
  - docker
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/docker.png
---
docker imageを作る際のデバック方法についての小ネタです。

<!-- more -->

お仕事でdocker imageを作成する必要があったのですが、docker imageのコンテナ中に入ってデバックする方法をよく知らなかったので、同僚のdocker得意なエンジニアに教えてもらいました。

## dockerコンテナへの入り方

デバックするためにdocker imageのコンテナの中に入る必要があるので、次の`docker run`コマンドを実行します。

```
docker run --rm -it [image name] /bin/bash
```

それぞれのオプションは次の通りです。

`--rm`: docker run終了時にrunで起動したdockerコンテナを削除します。これをしない場合、コンテナが残ってしまうため、デバック目的であれば付けておいた方がいいと思います。

`-it`: `i`はインタラクティブモード、`t`は**tty**と呼ばれるもので(あまり詳しくわかってない)両方のオプションを設定するといい感じのコマンド入力インターフェースになるので、基本は付けておいた方が良さそうです。

`[image name]`: デバックしたいdocker image名を指定します。

`/bin/bash`: docker runで実行するアプリケーション。この例では**bash**が起動します。特にデバック目的であれば変える必要がないかと。。。

> imageによっては**bash**がない場合があるので、その場合は`/bin/sh`に変えてください。

## コンテナからの脱出方法

このコマンドを実行します。

```
exit
```

## まとめ

今までよく分からなかったdocker imageの中のデバック方法について知る事ができたので、本当によかったです。
