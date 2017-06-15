---
layout: post
title: "HerokuConnect Configurationファイルの差分を出すモジュールを書いた"
date: 2016-02-09 01:00:00 +900
comments: true
tags:
  - heroku
  - heroku connect
  - nodejs
---

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/heroku-connect.png %}

前回、[Heroku ConnectのConfigurationファイルが辛いので美しくするモジュールを書いた](http://blog.mitsuruog.info/2016/02/heroku-connect-configuration-comb.html)の続きっぽいもの。

通常のシステム開発では、開発、ステージング、本番など複数環境を利用することが多いので、複数環境間でConfigurationファイルの差分を出すモジュールを書いてみました。

<!-- more -->

## モチベーション

ここでのConfigurationとは、Salesforce上のオブジェクトとHerokuのpostgres上のカラムを紐付けているMapping定義のことです。

Mapping定義から項目のMappingが消えると、その項目がHeroku上のpostgresから消えます。
つまり、リリースなどでMapping定義がリグレッションすると、今まで動作していたアプリケーションが動かなくなります。

リリース時にMapping定義が正しくリリースされていることを証明するためには、Mapping定義をConfigurationファイルに定義して各環境にimportし、適用結果の差分を比べることが最も良い方法だと考えました。

> 適用 => 抽出 => 比較

そこで前回、作成したConfigurationファイルを整形するモジュールを利用して、Configurationファイルの差分を抽出するモジュールを書きました。

[mitsuruog/heroku-connect-configuration-compare: Fetch two Heroku Connect Configuration and Compare together](https://github.com/mitsuruog/heroku-connect-configuration-compare)

## 使い方

使い方は簡単です。
npmモジュールをインストールして、比較したいHerokuアプリ名を指定してください。

```
npm install --global heroku-connect-configuration-compare
heroku-connect-configuration-compare one-heroku-appname other-heroku-appname
```

差分がDiffとして参照できます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/heroku-connect-diff.png %}

> 注）[ Heroku Toolbelt](https://toolbelt.heroku.com/)と[heroku-connect-plugin](https://github.com/heroku/heroku-connect-plugin)がインストールしていることが前提です。

## TODO

現在、次の改善点があります。モチベーションが続いたら改善したいです。

-  比較する対象にgit remoteのalias名を利用する
- 比較除外プロパティの追加
	- applied_at, exported_atあたりは比較不要かと

## 最後に

HerokuConnectの利用者が増えると、もっと開発や運用する上での課題が明らかになりそうですね。
こんなのまだ、氷山の一角だと思います。
