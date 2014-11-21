---
layout: post
title: "nodejitsuでカスタムドメインを使う方法"
date: 2012-10-31 22:16:00 +0900
comments: true
categories: 
 - nodejitsu
 - nodejs
---

nodejitsuでホスティングした場合、ドメインは「_hoehoe_.jit.su」か「_hoehoe_.nodejitsu.com」（_hoehoe_は自分で決めれる。）となります。  
やっぱり自分で持ってるカスタムドメインで使いたいなと思ったので、やってみました。

<!-- more -->

とは言っても･･･
基本的に日本人でnodejitsuを使おうと思っているような人は、英語に抵抗がない部類の人だと思いますので、[ここのページ](http://dns.jit.su/)に書いている手順に沿ってサクッとやってしまうと思うのですが、nodejitsuの敷居を下げるために頑張ります。

## 1.nodejitsu.comのIPを調べる。

まず、nodejitsu.comのIPを調べます。私はwindowsユーザーなので、黒い画面でpingコマンドを使います。

```
ping nodejitsu.com
```

おそらく、次のIPのうちのどれかが帰ってくると思いますので、メモしておきます。

```
165.225.129.253
165.225.130.235
165.225.130.237
165.225.130.238
165.225.130.239
165.225.130.240
165.225.130.241
165.225.131.4
165.225.131.5
```

## 2.ドメインを管理しているプロバイダのDNSを変更する。

私の場合は[GoDaddy](http://www.godaddy.com/)でドメイン持っているので、ここでの説明はGoDaddyをベースに行いますが他のプロバイダでも基本的にはやることは同じだと思います。

手順はGoDaddyの「DNS　Manager」にて「Aレコード」を変更します。

例えば、カスタムドメインが「mitsuruog.com」だったとして、

「mitsuruog.com」をnodejitsuのトップドメインとして使いたい場合は、次のような設定をします。

```
Host　=　@
Points to　=　1.で調べたIP（165.225.129.253とか）
```

カスタムドメインのサブドメイン（node.mitsuruog.comとか）をnodejitsuのトップドメインとして使いたい場合は、次のような設定をします。

```
Host　=　node
Points to　=　1.で調べたIP（165.225.129.253とか）
```

「TTL」は特に必要がなければそのままで、変更する必要はないと思います。

ちなみに、DNSを変更した場合、反映されるまで48時間くらい掛かります、気長に待ちましょう。
DNSが反映された場合、上のドメイン（`http://mitsuruog.com`とか）をブラウザで開くと、nodejitsuの404ページが表示されるようになりますので、目安にしてください。

## 3.package.jsonの変更

nodejitsu側の設定はすべてpackage.jsonにて指定します。（さすがPaas！）

手順はpackage.jsonに上で指定したカスタムドメインを追加するだけです。

```
{
  "name": "mitsuruog",
  "subdomain": "mitsuruog",
  "domains": [
    "node.mitsuruog.com"
  ],
  "scripts": {
    "start": "./server.js"
  },
 
 
・・・（中略）・・・
 
 
  "engines": {
    "node": "v0.8.x"
  }
}
```

## 4.nodejitsu上にデプロイ

最後はnodejitsuにデプロイして完了です。
黒い画面で操作してください。

```
jitsu login
jitsu deploy
```

以上の手順でカスタムドメインで運用できると思いますので、頑張ってみてください。