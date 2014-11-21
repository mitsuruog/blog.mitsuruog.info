---
layout: post
title: "Fiddler2でリバースプロキシしてNorthWindのOdataサービスをテストで使う"
date: 2014-04-02 00:47:00 +0900
comments: true
categories: 
 - Fiddler2
 - OpenUI5
 - ReverseProxy
 - SAPUI5
---

様々なWebサービスをフロント側で組み合わせて1つのアプリケーションを作成することを「クライアントマッシュアップ」と言います。クライアントマッシュアップを行う上で避けて通れないのが、様々なドメインのリソースをフロント側で利用する場合の同一生成元ポリシー違反です。

同一生成元ポリシー違反の回避方法は色々あるのですが、今回はFiddler2を用いたリバースプロキシで回避する方法を紹介します。

<!-- more -->

{% img https://dl.dropboxusercontent.com/u/77670774/blog.mitsuruog.info/2014/fiddler2.png %}

1.  背景
2.  grunt-connect-proxyを使う
3.  Fiddler2のリバースプロキシ機能を使う

## 1.背景

最近、SAPUI5というSAP製のUIフレームワークをよく使っています。バックエンドはSAP Netweaver Gatewayが提供するODataServiceを使うのですが、SAP環境が手元に無い場合は、ODataのMockサーバの様なもので代替えする必要があります。ところが、無料で使えるODataのMockサーバって意外と無いんですよね。

という訳で、行き着いたのがNorthWindの無料ODataServiceでした。

[http://services.odata.org/Northwind/Northwind.svc/](http://services.odata.org/Northwind/Northwind.svc/)

正攻法で攻めるとlocalhostで実行しているWebアプリケーションに対して、services.odata.orgのドメインから取得したデータをマッシュアップするので、立派な同一生成元ポリシー違反が成立します。

そこで今回はリバースプロキシサーバーを立てて、サーバーで受け取ったリクエストの中で、特定のURLの一部（例えば「`http://localhost/Northwind`」の「`/Northwind/`」）にマッチしたリクエストを、NorthWindのOdataServiceに代わりに要求します。そして結果をフロント側に返します。

{% img https://dl.dropboxusercontent.com/u/77670774/blog.mitsuruog.info/2014/fiddler2.png %}

異なるドメインへのリクエストを裏でプロキシサーバーが代替わりしてくれるため、フロント側から見ると、サーバーはlocalhostしか見えないようになり、同一生成元ポリシー違反にならないのです。


## 2.grunt-connect-proxyを使う 

まず最初に試したことは、使い慣れたGruntタスクを使うことでした。幸い、「grunt-contrib-connect」の兄弟分で「grunt-connect-proxy」というリバースプロキシが使えそうでしたので、試してみました。

* [gruntjs/grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect)
* [drewzboto/grunt-connect-proxy](https://github.com/drewzboto/grunt-connect-proxy)

ところが、何度も試行錯誤したのですがうまく行きません。調べて見るとこんなIssueがw。（まじ、windowsで動かないってなんなのー！orz）

[Can't get proxy working with a basic test odata service: ECONNREFUSED · Issue #46 · drewzboto/grunt-connect-proxy](https://github.com/drewzboto/grunt-connect-proxy/issues/46)

という訳で違う方法を試すことにしました。

## 3.Fiddler2のリバースプロキシ機能を使う

WindowsにはWindowsの作法がある！早速、Microsoft謹製のデバック用プロキシツール「Fiddler」を使う事にしました。
Fiddler2でのリバースプロキシ作成方法の公式ドキュメントはこちらです。

[Use Fiddler as a Reverse Proxy](http://docs.telerik.com/fiddler/configure-fiddler/tasks/usefiddlerasreverseproxy)

レジストリを変更する方法と、直接ルールを変更する方法の2種類あるのですが、今回はURLに対する細かい指定を行いたいので、直接ルールを書き換える方法にしました。

Fiddlerのメニューから「Rules > Customize Rules.」を選択すると、ルールを定義している設定ファイルが開くので、OnBeforeRequestの部分を書き換えます。書き換えるとFiddlerにて自動的に新しいルールを読み込んでくれます。

ルール定義は次のように書きます。

{% gist 9916184 setting.js %}

これで、Webアプリケーションから「`http://localhost/Northwind/Northwind.svc/Categories`」にリクエストを投げた場合、プロキシサーバにて「`http://services.odata.org/Northwind/Northwind.svc/Categories`」のリソースを取得してくれます。

こちらの記事も参考になりました。

[Using Fiddler as a Reverse Proxy - Stack Overflow](http://stackoverflow.com/questions/9831044/using-fiddler-as-a-reverse-proxy)

ルールファイルの細かな設定方法はこちら。（ちょっと読みにくいです。）

[Fiddler Web Debugger - Script Samples](http://fiddlerbook.com/Fiddler/dev/ScriptSamples.asp)

リバースプロキシって素敵。

## 補足

ちなみに、SAPUI5のeclipseプラグインには「SimpleProxyServlet」と呼ばれるリバースプロキシが内包されているので、Fiddler2にてわざわざリバースプロキシを作成する必要はありません。これについても機会があれば紹介します。