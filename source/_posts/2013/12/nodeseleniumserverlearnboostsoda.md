---
layout: post
title: "NodeからSeleniumServerを動かすLearnBoost製クライアントがあるsoda"
date: 2013-12-19 23:44:00 +0900
comments: true
tags: 
 - nodejs
 - Selenium
---

socket.ioで有名なLearnBoostが公開しているNode製SeleniumServerクライアントをさくっと紹介します。
だって、フロントエンドエンジニアはJavascriptでSelenium動かしたいんだもん。

この記事は[Selenium Advent Calendar 2013](http://www.adventar.org/calendars/128)の19日目の記事です。

前の記事は[[hinac0さん]Selenium vs Mercury](http://0dan5.wordpress.com/2013/12/18/1-3/)

次の記事は[[らんさぶさん]Selenium Tips - つれづれなるままに。](http://dolias2010.hatenablog.com/entry/2013/12/20/012714)

<!-- more -->

1.  sodaとは
2.  sodaを使ってみる
3.  sodaの注意点
4.  まとめ

## 1. sodaとは

[soda](https://github.com/LearnBoost/soda)とはsocket.ioで有名なLearnBoostが公開している、Node製SeleniumServerクライアントです。
簡単に言うと、Seleniumの実行コードをJavascriptで書いて、Nodejsで実行するためのモジュールです。
公式では「**Selenium Node Adapter.**」と謳ってます。

# 2. sodaを使ってみる。

（ちなみに、私の環境はMacです。一応、会社のwindows7も動作してます。）

まず、SeleniumServerをインストールします。Macの場合はbrewで一発インストールです。
本当にbrew偉大。

```
brew install selenium-server-standalone
```

公式サイトからダウンロードしても、もちろん構いません。
[http://www.seleniumhq.org/download/](http://www.seleniumhq.org/download/)

brewでインストールすると起動用のコマンドが表示されまうので、一旦覚えておきます。
面倒なかたはailas張った方がいいでしょう。

```
java -jar /usr/local/opt/selenium-server-standalone/selenium-server-standalone-2.37.0.jar -p 4444
```

sodaを動かす際は、事前にSeleniumServerを起動させておきます。

まさか、SeleniumやるのにFirefoxインストールしていない方はいないと思いますが、インストールしていない方はインストールしましょう。(自分がそうでしたw)


それでは、サンプルのプロジェクトを作成してsodaを動かしてみます。

適当なフォルダにsodaをnpmからインストールします。

```
mkdir soda-sample
cd soda-sample
npm init
npm install --save soda
```

プロジェクト直下に「google.js」ファイルを作成して、次のようなテストコードを書きます。

{% gist 8039638 google.js %}

後はnodeコマンドから起動してみます。

```
node google.js
```

そうすると、横でFirefoxが勝手に起動してテストしてくれます。
正常にテストが行われた場合、ターミナルにはこのように表示されます。

{% gist 8039638 test.sh %}

## 3. sodaの注意点

このように簡単にNodeからSeleniumを呼び出せるsodaですがいくつか注意点があります。

まず、「http.createClient is deprecated. Use `http.request` instead.」が象徴しているように、ここ１年くらいメンテナンスされていません。また、Chromeなど他のWebDriverには対応してないようです。つまり「Firefox only」です。

## 4. まとめ

NodeでSeleniumを起動できるDriverモジュールsodaいかがだったでしょうか。

機能限定ながらフロントエンジニアがJavascriptでテストコードを書けてNodeで実行できるというのは、ハマればメリットがあると思いました。

また、NodeからSeleniumを起動できるものは他にも[wd（https://github.com/admc/wd/）](https://github.com/admc/wd/)というものがあり、他のWebDriverをサポートしているなど、機能が豊富でなかなか強力です。

機会があれば、こちらも紹介したいですね。
