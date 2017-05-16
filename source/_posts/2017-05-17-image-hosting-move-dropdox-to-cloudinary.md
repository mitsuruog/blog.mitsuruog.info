---
layout: post
title: "Dropboxのpublicフォルダが使えなくなったので、Cloudinaryに移行してみた"
date: 2017-05-17 0:00:00 +900
comments: true
tags:
  - その他
---

{% img https://res.cloudinary.com/blog-mitsuruog/image/upload/v1494943978/2017/dropbox2cloudinary.png %}

当ブログで使っている画像をDropboxのpublicフォルダから、Cloudinaryに移行した話です。
画像に限った話では、Dropboxの代替先としてCloudinaryは結構いいんじゃないかと思います。

<!-- more -->

## はじめに

当ブログの画像はDropboxのpublicフォルダを使っていたのですが、2017年3月から有料化しないとそのままでは使えなくなってしまいました。
長らく代替先を検討していたのですが、この度Cloudinaryを使ってみることにしました。

Cloudinaryとは、画像/動画専門のクラウドホスティングサービスで、画像をアップロードしてブログなどで使うために利用できます。

> フリーでも75,000枚の画像や動画を保存できるので、まぁ普通に使っている内は大丈夫でしょう。。。

- [Cloudinary](http://cloudinary.com/)

## 移行方法

移行方法は至ってシンプルで、Dropboxの画像URLをCloudinaryのものに置き換えて行きます。

```
// Dropbox
https://dl.dropboxusercontent.com/u/<YOUR_ID>

// Cloudinary
https://res.cloudinary.com/<YOUR_COULD_NAME>/image/upload/<YOUR_ID>
```

### 画像URLの一括置換

手作業では面倒なので、次のスクリプトでフォルダの中のファイルを一括置換します。(あ、ちなみにMacの場合です)

```
find . -name "*.ext" | xargs sed -i "" 's/置換前/置換後/g'
```

### 移行時のURLに関する注意点

URLに関しては、ファイル名に空白が含まれる場合は注意が必要です。Cloudinary上にアップロードしたタイミングで空白が`_`に置き換わるようです。

```
// 元ファイル
Image 01.png

// Dropbox
Image%2001.png

// Cloudinary
Image_01.png

```

## まとめ

普通に画像読めているし、httpsも使えるので、Dropboxの代替先としてCloudinaryは結構いいんじゃないかと思いました。
