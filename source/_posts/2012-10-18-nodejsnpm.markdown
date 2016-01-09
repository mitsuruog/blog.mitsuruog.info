---
layout: post
title: "nodejsでよく使うnpmコマンド"
date: 2012-10-18 22:45:00 +0900
comments: true
tags:
 - nodejs
 - npm
---

いまいちnpm使えてないなと思ったので、いろいろ調べてみました。  
内容は俺得仕様です。

<!-- more -->

### このエントリでお伝えしたいこと。

1.  nodejsを普通に使っていく上で困らない程度のnpmコマンドの知識。

## では行きます。

まず、基本のインストール関係から。

```
npm install module_name
```

「-g」か「-global」オプションを付けるとグローバルインストールできます。
私は「node-inspector」をグローバルインストールしてますが、基本ローカルインストールで充分だと思います。

```
npm -g install module_name
```

次は、特定のバージョンをインストールしたい場合です。

```
npm install module_name@0.0.1
```

まだnpmにないとか、自分でForkしたモジュールをインストールしたい場合は、直接Githubのリポジトリを指定してもいいです。

```
npm install https://github.com/mitsuruog/socket.io/tarball/master
```

「GithubのURL/tarball/ブランチ名」となってます。
tarballはリポジトリをtarでダウンロードするおまじないだと思ってください。
（ちなみにzipだとzipballです。）

モジュールをアンインストールしたい場合は。

```
npm uninstall module_name
```

モジュールをアップデートしたい場合は。

```
npm update module_name
```

続いてインストールされているモジュールや依存関係を見たいとき。

```
npm ls
```

ちなみに「la」「ll」でもいけます。（こちらの方が詳細な情報が見れます。）

次はインストールされているモジュールが古くなってないか確認。

```
npm outdated
```

古くなっていれば次のように差分が出ます。

```
jade@0.27.6 node_modules\jade current=0.22.0
mime@1.2.7 node_modules\express\node_modules\mime current=1.2.5
connect@1.9.2 node_modules\express\node_modules\connect current=1.8.6
qs@0.5.1 node_modules\express\node_modules\qs current=0.4.2
```

ちなみにどのコマンドも「-g」オプションを付けることで、グローバルインストールされたモジュールについても同じことが行えます。

最後は環境まわりの設定。

設定の一覧を取得。

```
npm config list
```

ちなみにgetで狙い打てます。

```
npm config get keyname
```

設定の追加と削除。

```
npm config set keyname value
npm config delete keyname
```

よくやるのがproxyの設定で次のようにやればうまくいきます。

```
npm config set proxy http://localhost:8080
```

proxy以外の設定は恐ろしいので手を出していません。

おまけ  
キャッシュのクリア

```
npm cache clear
```

以上です。  
このあたりのコマンド押さえれば、そうnpmで困らないはず。
