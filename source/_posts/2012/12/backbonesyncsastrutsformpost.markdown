---
layout: post
title: "Backbone.SyncでSAStrutsにFormをPOSTする方法"
date: 2012-12-07 23:13:00 +0900
comments: true
tags:
 - backbone
 - SAStruts
 - Seaser2
---

[Backbone.js Advent Calendar 2012](http://www.adventar.org/calendars/15)と[青森アドベントカレンダー](http://aomori-web-advent-calendar-2012.blogspot.jp/2012/12/aomori-web-adevent-calendar-2012.html)17日目の記事です。青森ネタは最後のほうに気持ち程度あります。
SAStruts+Seaser2構成のバックエンドに対して、Backbone.SyncからFormをPOSTしてActionFormで受け取る方法です。  
（青森とは関係ありませんのであしからず。。。）

<!-- more -->

### このエントリでお伝えしたいこと。

1.  Backbone.SyncのPOSTはemulateJSONを知らないとちょっとハマる。
2.  SAStrutsはJSP切り離しても、Goodなフレームワークだ。
3.  そろそろSAStrutsの中の人とお友達になりたい。
4.  青森はいいところだ。

## はじめに

きっかけは仕事で久しぶりにSAStrutsを使うことになったことです。

現在、新しいプロジェクトのアプリケーションアーキテクトっぽいことをやっているます。  
それなりに画面数があり、タブが多く複雑な画面が結構あったので、JSP使った場合の世紀末的な光景を思い浮かべ、思い切ってサーバ側のロジックをWebAPI化して、Backboneと組み合わせてみようかと考えています。  
さらに、SAStrutsの恩恵を最大限享受したいので、いろいろ試行錯誤しながら現在プロトタイプを作っています。

## SAStruts -> Backbone.Sync GETの場合

BackboneのCollectionやModelにてfatchを呼び出すと、Backbone.Syncがサーバに対してGETでURLリソースを取得します。この部分は比較的簡単で、以下のようにSAStrutsのAction側の実装を少し変えるのみでJSONでレスポンスを返すことができます。
（ちなみに、JSONのライブラリは[jsonic](http://jsonic.sourceforge.jp/)を使用しています。）

サーバ側(IndexAction.get.java)
```java
public class IndexAction {

  @Execute(validator = false)
  public String index() {

    List<Model> models = new LinkedList<Model>();
    models.add(new Model("aomori", "good place"));

    //JSONでレスポンスを返す
    ResponseUtil.write(JSON.encode(models), "application/json");
    return null;
  }
}
```

フロント側(Backbone.Sync.get.js)
```js
PROTO.Views.view = Backbone.View.extend({

//中略

  read: function(){
    this.collection.fetch({
      success : this.render
    });
  },

//中略

});
```

## Backbone.Sync -> SAStruts POSTの場合

今度はBackboneからFormの内容をPOSTでサーバ側へ送信する場合ですが、これは一筋縄ではいきませんでした。

結論から言うと、SAStruts側でBackbone.SyncのForm内容をPOSTで受け取るためには、AjaxリクエストをあたかもFormをSubmitしたリクエストかのように偽装する必要があります。

そう、**backbone.emulateJSON = true**の出番です。（本当に[このパート](https://github.com/enja-oss/Backbone/blob/master/docs/Sync.md)翻訳しといて良かったなw。）

これでContent-Typeを「`application/x-www-form-urlencoded`」にすることは出来たのですが、リクエストパラメータはAjax.optionsのdata属性で渡さないと受け取れません。結果、次のようなコードとなります。

フロント側(Backbone.Sync.post.js)
```js
PROTO.Views.view = Backbone.View.extend({

//中略

  create: function(){
    var param = {};
    _.each($('form').serializeArray(), function(v){
      param[v.name] = v.value;
    });

    //Content-Typeを偽装
    Backbone.emulateJSON = true;
    var model = new PROTO.Models.model(param);
    //リクエストパラメータはAjaxのdata属性で渡す
    this.collection.create(model, { data: param, success : this.render });
  },

//中略

});
```

サーバ側(IndexAction.post.java)
```java
public class IndexAction {

  //TODO ActionForm
  //ActionFormでリクエストパラメータを受け渡し
  @Required
  public String name;
  @Required
  public String age;

  //TODO エラーの戻りをJSON化
  @Execute(validator = true, input="index.html")
  public String index() {

    List<Model> models = new LinkedList<Model>();
    models.add(new Model(name, age));

    ResponseUtil.write(JSON.encode(models), "application/json");
    return null;
  }
}
```

これで、サーバ側でBackbone.SyncのPOST値を受け取ることができました。

さらに、ActionFormも受け取れるだけではなく、アノテーションによるvalidationも効きます。ここでエラーがJSONで帰ってくると理想的なのですが、今日時点ではそこまで作れてません。
作っている最中のコードはこちらです。気力が続けば少しずつブラッシュしてくかも。

[https://github.com/mitsuruog/SAStruts-Backbone](https://github.com/mitsuruog/SAStruts-Backbone)

ちなみに本題とは別件なんですが、同じ仕事でBootstrapのカスタムもやっていて、なかなかLessも面白いなと思っています。世の中にはBootstrapのテーマを公開している人も多いので、青森ゆかりのデザイナーさん、青森っぽいテーマ一緒に作ってみませんか？  
（と、無理やり青森アドベントカレンダーネタにしてみたw。）

**Backbone.js Advent Calendar 2012**

* ← 前日　[Node.js + WebSocket + Backbone.jsのすすめ](http://takesy.cocolog-nifty.com/atico/2012/12/nodejs-websocke.html)[](http://www.blogger.com/)（@takeshy）
* → 後日　[おさわり。backboneのajax周りの処理とか。](http://1000ch.net/2012/12/18/AjaxOfBackbone/)（@1000ch）

**Aomori Advent Calendar 2012**

* ←前日　[茄子的　今年一番ヒットしたツールは・・・](http://nasunoblog.blogspot.jp/2012/12/blog-post.html)（@nasunotw）
* →後日　[なぜFacebookは僕の中で今年一番ヒットしたのか？](http://aomori-web-advent-calendar-2012.blogspot.jp/2012/12/facebook.html)（@kzki）
