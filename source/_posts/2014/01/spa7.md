---
layout: post
title: "SPAを構築するときに知っておいた方がいい7つの課題"
date: 2014-01-07 01:29:00 +0900
comments: true
tags: 
 - SPA 
---

ブラウザでのJavascriptの高速化とBackboneやAngularのようなJavascriptMVCフレームワークの登場により、以前よりSPA（Single page application）が構築しやすくなりました。

さらに、Yeomanに代表されるSPAを作成するするためのscaffold（土台）が整備されてきましたので、結構さくっとSPAが作れるようになったのも事実です。

さくっと作ったSPAがさくさく動かない・・・作ったけど使えない・・・なんてことにならないように、SPAを構築する前に知っておいた方がいい課題について調べてたり考えてみました。

<!-- more -->

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/spa.png %}

### 目次

1.  パフォーマンス
2.  メモリリーク
3.  セキュリティ
4.  フレームワークロックイン
5.  画面設計からUIコンポーネント設計への思想転換
6.  フロントエンジニア不足
7.  番外編
 
## 1. パフォーマンス

クライアント側でDOMを作成するため、DOMが大きい場合、DOM生成に時間がかかりレンダリングが遅くなります。また、フレームワークを使っている関係上、Javascriptのライブラリ、ビジネスロジック、テンプレートなど、ダウンロードするファイルサイズが大きくなりがちです。

デスクトップなどネットワークが安定していてCPUパワーがある場合は問題とならないのですが、モバイル端末の場合に致命的となりかねません。これらは、開発時は気づかないが、システムテストなど、実際の端末や環境下で動作させた場合に初めて顕著になる場合があります。

## 2. メモリリーク

リフレッシュを一切行わないため、Javascriptのメモリリークがおきやすい。フロント側でDOMを生成するため、View構築時にメモリを消費していきます。また、使用しなくなったViewを破棄する場合は、フレームワークの作法に則ってViewを破棄してメモリを開放する必要があります。

それでも、フレームワークの不具合などでメモリが開放されないケースがあります。  
_(画面数が多い場合、適度に画面遷移してリフレッシュさせましょう。)_

## 3. セキュリティ

ビジネスロジックをJavascriptにて実装した場合、誰でもダウンロードして読むことができます。

Webシステムでは基本的にフロント側の入力を信用してはいけないので、極力フロント側にビジネスロジックを持たないようにするべきです。フロント側に返すデータはサーバ側で生成し、フロント側はDOM構築に徹しましょう。
 
## 4. フレームワークロックイン

SPAで構築する際は、なんらかのJavascriptMVCフレームワークは必須です。JavascriptMVCフレームワーク同士に互換性などほとんどありませんので、確実にフレームワークにロックインされます。これはある意味仕方がないことです。

フレームワーク選定時に、後々廃れてしまってもフレームワークで学習した知識が他に持ち出せるという基準で選定するのも、人材育成ポリシー的にはありだと思います。

業務系だったらBackboneとかAngularとかやってれば大丈夫だと思います。  
_(とはいえ、作り捨てるくらい割り切ったほうがいいかもしれません。すごい癖のあるベンダー製フレームワークってのも、それはそれでニッチな市場があると思います。それと心中する気があればですが。)_

> (2014/11/06 追記)  
> [OpenUI5](http://sap.github.io/openui5/)のことです。当時扱いに困っていたので毒吐いていたようですw

## 5. 画面設計からUIコンポーネント設計への思想転換

SPAで作る場合、いままでの行ってきた画面単位の設計思想から脱却しなければなりません。SPAはURIをベースにAjax非同期通信を行い画面を部分更新していくという点で、静的ではありません、動的で生きています。

まず、`FullREST API（GET/POST/PUT/DELETE）`にする必要はありませんが、URIとリソース設計をする必要があります。

今まで画面単位で設計していたものを、URIをベースとしたリソースとリソースを表示するためのコンポーネントという単位で設計する必要があります。画面はコンポーネントを組み合わせて作るようなイメージになります。

また、（Backboneなど）フレームワークによっては、デフォルトでサーバ側へ要求するURLを生成するものもあり、書き換えるのが面倒な場合、そのURLををベースに設計する必要があります。
 
## 6. フロントエンジニア不足

SPAで作成する場合、Javascriptの実装量が増えるため、本格的にフロントエンジニアの参画が必須となります。

Javascriptを使えるWeb技術者はそれなりに多いと思いますが、SPAで構築する際は、フレームワークの理解は必須ですし、ブラウザのメモリ利用状況や細かなキャッシュ制御、ネットワーク、固有デバイスの問題など総合的にフロント周りのトラブルシュートができるエンジニアが欲しいです。  
_(これはSPAに限ったことではありませんが・・・そこまでできる人少なすぎます。)_

> (2014/11/06 追記)  
> SIでは今現在も状況変わったいないように思えます。育成にも苦労してます。

これは開発時だけではなく、保守・運用フェーズに移行したあとの方が問題となります。
Strutsなどで作られている従来のWebアプリケーションは、いわゆるサーバサイドエンジニアのみでサイトを保守・運用できるのに対して、SPAはフロントエンジニア＋サーバサイドエンジニアが必須です。

中小規模の業務系システムにおいて、1人保守など少ない人員体制を敷いた場合、保守するエンジニアの技術的負担がかなり大きくなると思われます。
SIの場合、できるフロントエンジニアの外部調達はほとんど事実上不可能な状況ですので、開発フェーズからフロントエンジニア育成の視点をしっかり持って計画しないと、後から泣きを見ます。
 
## 7. 番外編

### 7.1 SEO

通常SPAは、クライアント側で画面を生成するため、プレーンなHTMLを返します。

そのため、Webクローラからは、あたかもプレーンなページのように見えます。

当然、JavascriptがOFFの環境ではまったく動作しません。  
_(トップページのページランクがサイト全体に適用され結果的にSEO的に優位となるという意見もあったり、ちょっとまだ判断するには情報不足。)_

> (2014/11/06 追記)  
> `sitemap.xml`にサイトのページ構造(記事中では`AJAX indexed`と言ってる)を書き出すのがいいようです。
> [AngularJS and SEO - yearofmoo.com](http://www.yearofmoo.com/2012/11/angularjs-and-seo.html)

### 7.2 認証・セッション管理

認証、セッションなど業務アプリケーションに必要な機能について、Javascriptフレームワークと組み合わせた場合のノウハウが蓄積されていない。  
_(これは自分の調査不足かも。SPAはRESTだし、RESTはStatelessって話もあるけど、じゃStatelessで作る場合、サーバ側はどうセキュアに作るのって議論が別にあるはず。)_

> (2014/11/06 追記)  
> 重要なAjax通信時はCSRF対策のため1回ワンタイムトークンを取得してから、そのcallbackで本当のリクエストを行うようにしています。
> また、認証、セッションについては従来のWeb開発のノウハウが使えると感じています。WebAPIアクセスの正当性については`JWT`を使うことが増えました。
> こちらに記事書いたので読んでみてください。[JWT(Json Web Token)を利用したWebAPIでのCredentialの受け渡しについて](/2014/08/jwtjson-web-tokenwebapicredential.html)

## まとめ

SPAを導入した場合の課題をいくつか挙げてみました。少し否定的なことばかり書いて来ましたが、私自身、フロントエンジニアとしてSPAやJavascriptMVCフレームワーク非常に好きです。

サーバ側のWebAPI（ビジネスロジック）の再利用性、テストの容易性やフロント側UIの大胆な着せ替えが可能になるなど、SPAのメリットは計り知れないものがあります。新規のシステムだけではなく、既存システムの外部API追加などで部分的に導入するなど、SPAのメリットを生かす戦略の元での導入であれば大賛成です。

しかし、SIの現場で大規模導入する場合、どうしてもエンジニアのスキルや企業文化的に慎重にならざるを得ないのも事実です。正直、ショッピングカートのようなStatefullなWebアプリケーションをJavaで作ったとしたら、SPAで頑張って作るよりJSFで作ったほうがよほど効率的でメンテナンスも楽です。

今後、業務系WebアプリケーションにてSPAで構築するかどうか検討するシーンが増えると思いますが、SPA使い方次第では、毒にも薬にもなるということお忘れなきよう。

### p.s

一部の技術好きなエンジニアの声で安易に導入して保守とかで苦労しないよう、自戒の念も込めて書きました。巷では、フロントとサーバの中間層にNode.jsを配置するハイブリッドなアプローチもあるようです。こちらも注目していきたいと思います。

こちらに、素晴らしいReply記事がありますので、興味のあるかたは一緒にお読みください。

[「SPAを構築するときに知っておいた方がいい7つの課題」は課題ではない](http://albatrosary.hateblo.jp/entry/2014/01/15/121608)

**あわせて読むといいかも**

* [2013年はSPAの年・・・になるといいなぁ - new takyam();](http://new.takyam.com/entry/2012/12/30/2013%E5%B9%B4%E3%81%AFSPA%E3%81%AE%E5%B9%B4%E3%83%BB%E3%83%BB%E3%83%BB%E3%81%AB%E3%81%AA%E3%82%8B%E3%81%A8%E3%81%84%E3%81%84%E3%81%AA%E3%81%81)
* [Pros and Cons of Having a Single Page Website – Professional Dubai Web Design Blog by Insight Soft in UAE](http://blog.insightsoft.ae/a-single-page-website/)
* [Isomorphic JavaScript: The Future of Web Apps - Airbnb Engineering](http://nerds.airbnb.com/wp-content/files_mf/1384225374isomorphicjs.png)
* [Advantages and disadvantages of building a single page web application - Programmers Stack Exchange](http://programmers.stackexchange.com/questions/144717/advantages-and-disadvantages-of-building-a-single-page-web-application)

今となってはほとんど役に立たないかもしれないけど、これらの書籍でbackbone.jsを学びながら今後のJavaScript開発で必要なテクニックを学んでいきました。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=mitsuruog-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=4873116589&linkId=eb8b9ed1789b5db87ee86c4416036d24&bc1=000000&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>
    
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=mitsuruog-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=487311554X&linkId=f7183373522c9a2b985891d8767af2c8&bc1=000000&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>