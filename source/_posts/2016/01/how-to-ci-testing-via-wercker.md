---
layout: post
title: "werckerでフロントエンドをCIテストする"
date: 2016-01-18 00:00:00 +0900
comments: true
tags:
  - wercker
  - ci
  - unit test
---

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2016/wercker-frontend.png %}

github private repositoryも無料でCIテストできるので[wercker](http://wercker.com/)を使うことが多いです。  
プロジェクト立ち上げ時に設定した後、安定すると放置になる設定周り。ついつい忘れてしまうので、自分用メモ。  
フロントエンドエンジニアでもCIテストできる最小構成です。

<!-- more -->

##  ベースはNode用の基本構成

まず、自動テストはNode.jsで行うようにしていると思うので、Node用の基本設定をベースにするのがいいと思います。  

[wercker - docs - Nodejs](http://devcenter.wercker.com/docs/languages/nodejs.html)

```yml
box: nodesource/trusty
# Build definition
build:
  # The steps that will be executed on build
  steps:
    # A step that executes `npm install` command
    - npm-install
    # A step that executes `npm test` command
    - npm-test

    # A custom script step, name value is used in the UI
    # and the code value contains the command that get executed
    - script:
        name: echo nodejs information
        code: |
          echo "node version $(node -v) running"
          echo "npm version $(npm -v) running"
```

## Nodeバージョン指定

Nodeのバージョンを指定したい場合の設定方法。  
`box`で指定できます。Docker hubのコンテナを指定できるので、[Docker hub上のNodeのOFFICIAL REPOSITORY](https://hub.docker.com/_/node/)を指定しておきます。バージョン指定はよく間違えるのですが、`node:4.2.2`とします。`@`じゃないです。

```yml
box: node:4.2.2
```

## bowerを使うには

フロント側のライブラリをbowerから取得しているプロジェクトは、テストの前に`bower install`しておく必要があります。  
`build`フェーズにてbowerをグローバルインストールして、`bower install`できるようにしておきます。permissionで怒られるので`--allow-root`を忘れずに。  
(このあたりは独自でbox作成しておくと不要になりそうです。)

```yml
build:
  steps:
    #  npm install -g でbowerをインストールする
    - script:
      name: install npm -g
      code: sudo npm install -g grunt-cli bower

    # bower install
    - script:
      name: install bower
      code: bower install --allow-root
```

これで`package.json`のscriptのtestにテスト用のコマンドが指定されている場合は`- npm-test`すればOKです。

## おまけ

### CIテストはヘッドレスブラウザを使いましょう

ローカルは実ブラウザを使ったテストしている場合は、ヘッドレスブラウザを使いましょう。  
ヘッドレスブラウザは[PhantomJS](http://phantomjs.org/)が代表的です。だた、v1.0系はモダンブラウザとのcompatibilityの問題があるため、v2.0以降を使った方がいいです。

CIでも実ブラウザを使いたい場合は、werckerで頑張るより、お金を払って[Sauce Labs](https://saucelabs.com/)使った方がいいと思います。

### テスト結果をhipchatで通知する

テスト結果をhipchatなどで通知したい場合は、`build`フェーズの`after-steps`で行います。  
hipchatのintegrationの例は公式サイトにあります。

[wercker - docs - Hipchat notifications](http://devcenter.wercker.com/docs/notifications/hipchat.html)

例）
```yml
build:

  # 省略。。。

  after-steps:
    - install-packages:
        packages: sudo gawk
    - hipchat-notify:
        token: $HIPCHAT_TOKEN
        room-id: $HIPCHAT_ROOM
        from-name: wercker
        on: failed
```

(※)`$HIPCHAT_TOKEN`と`$HIPCHAT_ROOM`はweckerで定義した環境変数です。

## まとめ

これで最低限のCIテストができるようになりました。  
初めてだと少し苦労する点があるので、まとめてみました。

### 実際のwercker.yml

`wercker.yml`はこちらに置いておきます。

https://gist.github.com/mitsuruog/ee724841d81c6ecab5e9

### 参考資料

もっと頑張りたい人向け。

- [Werckerの仕組み，独自のboxとstepのつくりかた | SOTA](http://deeeet.com/writing/2014/10/16/wercker/)
- [Githubのプライベートリポジトリでも無料で使えるCI、Werckerを使ってrails newからHerokuのデプロイまでやってみる | mah365](http://blog.mah-lab.com/2014/01/08/rails-wercker-heroku-deploy/)
