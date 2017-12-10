---
layout: post
title: "Heroku ConnectのConfigurationファイルが辛いので美しくするモジュールを書いた"
date: 2016-02-05 00:00:00 +900
comments: true
tags:
  - heroku
  - heroku connect
  - nodejs
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2016/heroku-connect.png
---
[Heroku Connect](https://www.heroku.com/connect)は、SalesforceとHeroku上のpostgresとを接続するアドオンです。

Heroku Connectを使うことで、ほぼリアルタイムにSalesforceとHerokuのデータを同期させることができます。
これにより、Heroku上でSalesforceのデータを利用することができ、これまでのSalesforceの常識にとらわれない新しいSaleforceの使い方が可能になります。

Heroku Connectを実際に利用して、Configurationファイル仕様が辛かったので、うまく付き合うためのnpmモジュールを作りました。

<!-- more -->

 ## モチベーション

ここでのConfigurationとは、Salesforce上のオブジェクトとHerokuのpostgres上のカラムを紐付けているMapping定義のことです。
ConfigurationはHeroku Connectのダッシュボードや[herokuコマンドのプラグイン](https://github.com/heroku/heroku-connect-plugin)をインストールすることで、JSONとしてエクスポートすることができます。

こちらがエクスポートしたものです。

```json
{
  "mappings": [
    {
      "config": {
        "sf_max_daily_api_calls": 30000,
        "sf_notify_enabled": false,
        "fields": {
          "Email": {},
          "LastName": {},
          "Id": {},
          "IsDeleted": {},
          "Title": {},
          "Rating": {},
          "Status": {},
          "Name": {},
          "SystemModstamp": {},
          "IsConverted": {},
          "CreatedDate": {},
          "Company": {},
          "FirstName": {}
        },
        "access": "read_only",
        "sf_polling_seconds": 600
      },
      "object_name": "Lead"
    },
    {
      "config": {
        "sf_max_daily_api_calls": 30000,
        "sf_notify_enabled": false,
        "fields": {
          "Description": {},
          "ContactId": {},
          "CaseNumber": {},
          "Id": {},
          "Subject": {},
          "ClosedDate": {},
          "Status": {},
          "SystemModstamp": {},
          "Reason": {},
          "Type": {},
          "IsClosed": {},
          "CreatedDate": {},
          "IsDeleted": {},
          "IsEscalated": {},
          "Priority": {}
        },
        "access": "read_only",
        "sf_polling_seconds": 600
      },
      "object_name": "Case"
    }
  ],
  "version": 1,
  "connection": {
    "organization_id": "00DE0000000L6REMA",
    "app_name": "heroku-connect-mitsuruog-dev",
    "exported_at": "2016-02-04T08:25:16.681265+00:00"
  }
}
```

もう一度、エクスポートしてみますね。

```json
{
  "connection": {
    "organization_id": "00DE0000000L6REMA",
    "exported_at": "2016-02-04T08:26:20.736598+00:00",
    "app_name": "heroku-connect-mitsuruog-dev"
  },
  "version": 1,
  "mappings": [
    {
      "config": {
        "sf_polling_seconds": 600,
        "sf_max_daily_api_calls": 30000,
        "fields": {
          "Email": {},
          "SystemModstamp": {},
          "CreatedDate": {},
          "LastName": {},
          "Status": {},
          "Rating": {},
          "IsDeleted": {},
          "IsConverted": {},
          "Title": {},
          "Id": {},
          "Company": {},
          "Name": {},
          "FirstName": {}
        },
        "sf_notify_enabled": false,
        "access": "read_only"
      },
      "object_name": "Lead"
    },
    {
      "config": {
        "sf_polling_seconds": 600,
        "sf_max_daily_api_calls": 30000,
        "fields": {
          "Description": {},
          "SystemModstamp": {},
          "CreatedDate": {},
          "Subject": {},
          "Status": {},
          "Reason": {},
          "IsEscalated": {},
          "IsDeleted": {},
          "ClosedDate": {},
          "Type": {},
          "Priority": {},
          "CaseNumber": {},
          "IsClosed": {},
          "Id": {},
          "ContactId": {}
        },
        "sf_notify_enabled": false,
        "access": "read_only"
      },
      "object_name": "Case"
    }
  ]
}
```

....え！？

Mappingを変更していないにも関わらず、エクスポートするたびに(気まぐれで)順序がバラバラになります。

システム開発を行う過程でMappingの変更はそれなりの頻度があり、Configurationファイルにて変更点を管理したいのですが、これでは変更点がわかりません。
そこで、アルファベット順でソートするnodeモジュールを書きました。

[mitsuruog/heroku-connect-configuration-comb: Makes your Heroku Connect Configuration beautiful](https://github.com/mitsuruog/heroku-connect-configuration-comb)

## 使い方

使い方は簡単です。
`input.json`にエクスポートしたConfigurationファイルを指定してください。

```
npm install --g heroku-connect-configuration-comb
heroku-connect-configuration-comb input.json output.json
```

これでConfigurationファイルが見れるものになりました。

## 最後に

そのうち本家で改善されるでしょう。。。
(中の人が気づいたら、リポジトリにstarしてくれたらいいな。)

Heroku Connectのコンセプトは非常にいいのですが、プロダクトの完成度としてやや利用者視点に欠けた部分が多い印象を持っています。
今後のアップデートに期待したいです。
