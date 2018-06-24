---
layout: post
title: "親子でマイクラ ー HerokuにMincraftのプライベートサーバーを立てる"
date: 2018-06-05 0:00:00 +900
comments: true
tags:
  - heroku
  - minecraft
  - aws
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/minecraft01.png
---
「お父さんと2人だけで[マイクラ](https://minecraft.net/ja-jp/)やりたい！」

GWに娘がそんなこと言い出したので、お父さん、ちょっと頑張ってプライベートサーバーを立ててみたよ！

> 注意：
> この方法で立てたサーバーには、Minecraft pocket editionからはアクセスできません。Minecraft pocket editionで子供を一緒に遊びたい方は、こちらの記事を参考にしてください。
>  [【親子でマイクラPE】自宅Wi\-Fiで同時プレイ！ 2つのiPhoneで同じ世界に入って遊ぶ方法 \| Minecraft（マインクラフト） \| できるネット](https://dekiru.net/article/15596/)

## 下調べ

少し調べていると、Mincraftは[サーバーがソフトウェアにて配布されていて](https://minecraft.net/en-us/download/server)これを実行するとプライベートサーバーになるようです。

これをダウンロードして、自分のローカルPCで動かすとプライベートサーバーが作れるのですが、仕事に行っている間も自宅のPCでMincraftを動かしているのは抵抗があったので、クラウド上にホスティングすることにしました。

サーバー代あまりかけたくないし、常時動かす必要はないので、こういう場合は「[Heroku](https://jp.heroku.com/home)」一択ですね。

## 構築手順

基本的にはこの[heroku-buildpack-minecraft](https://github.com/jkutner/heroku-buildpack-minecraft)にある通りに設定すると大丈夫です。

### ngrokのtokenを取得する

[ngrok](https://ngrok.com/)という、ローカルPCにトンネルを作ってInternetに接続できるようにするサービスがあるので、無料のアカウントを取得してtokenを取得します。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/minecraft02.png 550 %}

### gitプロジェクトを作成してeula.txtを作成する

新しくgitプロジェクトを作成して、中に`eula.txt`をおきます。
```sh
echo 'eula=true' > eula.txt
git init
git add eula.txt
git commit -m "Add eula.txt"
```

`eula.txt`の中身は次のなっています。

```sh
eula=true
```

### Herokuアプリケーションを作成する

[Heroku toolbelt](https://toolbelt.heroku.com/)をインストールしてHerokuアプリケーションを作成します。
途中でbuildpackと環境変数(ngrokのtoken)の指定をします。

```sh
heroku create
heroku buildpacks:add heroku/jvm
heroku buildpacks:add https://github.com/jkutner/heroku-buildpack-minecraft
heroku config:set NGROK_API_TOKEN="xxxxx"
git push heroku master
```

> 環境変数の指定はGUIの設定ページからも行えます。

### 接続用アドレスを取得してMincraftから接続する

Herokuのアプリケーションが正常に作成できた後に、実際にHerokuのプライベートサーバーにアクセスして接続用のアドレスを取得します。

```sh
heroku open
```

プライベートサーバーにアクセスすると、次のようなアドレスが画面上に表示されます。

`Server available at: 0.tcp.ngrok.io:XXXXX`

これをMincraftで接続先のサーバーに指定すると、プライベートサーバーにアクセスできるようになります。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/minecraft03.png 550 %}

## セーブデータをS3に保存する
MincraftのセーブデータはHerokuの中に保存されます。
しかし、Herokuのサーバーは24時間に1回再起動してしまうので、その度にセーブデータがなくなってしまいます。そこでセーブデータをS3へ転送します。

AWSのコンソールでS3バケットとIAMを作成して、アクセスキーとシークレットキーを取得します。
これをHerokuの環境変数に設定します。

```sh
heroku config:set AWS_BUCKET=your-bucket-name
heroku config:set AWS_ACCESS_KEY=xxx
heroku config:set AWS_SECRET_KEY=xxx
```

> AWSのIAM設定はこのあたりの記事を参考にしてください。
> [特定のS3バケットにだけアクセスできるIAMユーザーを作る \| I am mitsuruog](https://blog.mitsuruog.info/2017/11/way-to-api-key-access-s3)


これで60秒に一回、セーブデータが転送されるようになりました。

## まとめ
Herokuでプライベートサーバーを立てる方法でした。HerokuとAWSを扱ったことがあるイケメンなら、そこまで難しくない手順だと思います。

> とはいえプライベートサーバーを立てたあとに、Minecraftにeditionの違いがあることを知り、結局自分用のpocker editionを買って遊ぶことになったのですが。。。
> 娘がもう少し大きくなってPC使えるようになったら、使いたいと思いますw
