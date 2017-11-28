---
layout: post
title: "[SAPUI5/OpenUI5]ODataとOpenUI5でWebシステムを作るチュートリアルをつくりました"
date: 2014-07-26 22:28:29 +0900
comments: true
tags: 
 - Northwind
 - OData
 - ODataService
 - OpenUI5
 - SAPUI5
---

国内でのOpenUI5の注目度の低さに涙が出そうです。でも頑張ります。  
今回は「OpenUI5とODataを使ってどのようにWebシステムを作成するか」というチュートリアルを作って見ました。

内容はこちらです。  
[http://mitsuruog.github.io/Openui5-with-OdataService/](http://mitsuruog.github.io/Openui5-with-OdataService/)

Gtihub：  
[https://github.com/mitsuruog/Openui5-with-OdataService](https://github.com/mitsuruog/Openui5-with-OdataService)  
良かったらGithubでStar付けたり、SNSでシェアしてくださいね。

<!-- more -->

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/openui5odata1.png 580 326 %}

1.  ODataとは？
2.  なぜODataとOpenUi5なのか？
3.  注目度が低いOData
4.  OData＋OpenUI5の可能性
5.  まとめ

>(2014/11/13 追記)  
> このネタで[HTML5Experts.jp](http://html5experts.jp)に寄稿しました。こちらの方が分かりやすく書いてあると思います。  
>[実例から考える、HTML5時代のエンタープライズ・アーキテクチャ | HTML5Experts.jp](http://html5experts.jp/mitsuruog/9518/)
> {% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/exjp_odata.png 483　246 %}

## 1. ODataとは？

ODataとは、  
「Webシステムにおける、フロントエンドとバックエンドとの面倒なAjax問い合わせの手続きを標準化したプロトコル」

皆さん、Webシステムを構築する際にWebAPIに渡すパラメータを独自設計していると思いますが、パラメータを含めたバックエンドへのデータアクセスの手順を標準化しているものです。

Web版、ODBCと例えるとイメージしやすいと思います。


## 2. なぜODataとOpenUI5なのか？

なぜ、ODataとOpenUI5なのかという背景についてです。

OpenUI5はSAPUI5というSAP社が作成したHTML5ベースのUIフレームワークです。  
OpenUI5はオープンソースですが、SAPUI5は「SAP Netweaver Gateway（以下、Gateway）」のUIアドオンとして配布されています。元々、GatewayはERPに代表されるSAP Suiteと呼ばれるバックエンドのSAP製品群と接続し、WebAPIのインターフェースを簡単に作成するための製品（ミドルウェア）です。

SAP自体がODataの業界標準化に向けて力を入れていることもあり、Gatewayは元々ODataサポートしてました、SAPUI5はGateway上で動作する前提で作られている関係で
ODataを標準でサポートしています。  
このような経緯もあり、SAPUI5の流れを組むOpenUI5はODataと非常に親和性が高いのです。

## 3. 注目度が低いOData



ところでOData知ってましたか？




私はOpenUI5を触るまでODataの存在を全く知りませんでした。検索してもWCFなど.Net系の情報が少しヒットするくらいで、フロントエンドを絡めた日本語の情報はほとんどヒットしません。



ODataの仕様は一見非常に難解です。ODataの仕様に則ったデータアクセスのURLを見てみましょう。


こちらは「CompanyName」を「Alfr」で前方一致検索するためのクエリです。


```
http://services.odata.org/Northwind/Northwind.svc/Customers?$filter=startswith(CompanyName, ‘Alfr’) eq true
```

こんなものもあります。

```
http://services.odata.org/OData/OData.svc/Categories?$select=Name,Products&$expand=Products
```

`$select`とか`$expand`とは一体どんな意味があるのでしょうか。。。（詳しくはチュートリアルの中で触れています。）


ODataはデータアクセスの方法を標準化することにより、様々なデータアクセスの要求に対して柔軟に対応できます。

昨今のアジャイル的な開発スタイルが増える中で、バックンドへのデータアクセス要求の変更が与える影響がURLパラメータで吸収できるポテンシャルがあることは、非常に興味深い仕様です。

しかし、このOData独特のクエリをフロント側で生成することが非常に骨が折れるため、あまり普及しなかったように思います。


## 4. OData＋OpenUI5の可能性


そこで現れたのがOpenUI5というUIフレームワークです。


ここで言うUIフレームワークとはUIコンポーネントも持つもので、WebAPIから取得したデータを元に自動でUIを構築し、UI側の操作をダイレクトURLへ変換してバックエンドに連携できる機能を持っています。（以下、双方向データバインディング）


ODataが持つデータアクセス方法の標準化とUIフレームワークの双方向データバインディングが組合わせることで、フロント部分の多くがフレームワークで隠蔽できます。


従来のオープンソースを組み合わせた場合と比べ、データアクセスに関わる非常にセンシティブで難易度が高い部分実装がかなり省け、大規模なシステム開発においても比較的管理しやすく、安全に開発ができる可能性があり、非常に惹かれるものがあります。


{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/openui5odata2.png %}


## 5. まとめ

ODataとOpenUI5について少し関心を持っていただけたでしょうか？

昨今は、AngularJSが最も注目されるJavascriptフレームワークです。私も非常に大好きです。

しかし、企業向けWebシステムとして見た場合、様々なオープンソースを組み合わせて構築するより、様々な機能を統合した「エンタープライズUIフレームワーク」の方が、向いているのではないかと思っています。

そう考えると、フロントエンド開発の一般的な事例と我々エンタープライズでは少し評価の観点が違いますね。

非常に興味深いです。
