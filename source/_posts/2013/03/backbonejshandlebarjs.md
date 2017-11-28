---
layout: post
title: "Backbone.jsとHandlebars.jsを組み合わせる"
date: 2013-03-04 00:21:00 +0900
comments: true
tags: 
 - backbone
 - handlebars.js
 - grunt
---

Backbone.jsでアプリケーションを作る場合、ついつい手軽さを求めて[Underscore.jsのtemplate()](http://underscorejs.org/#template)を使うことが多いのですが、少し凝った造りのページを作る場合、より専門的なテンプレートエンジンを使いたくなります。

そこで今回は、最近マイブームの[Handlebars.js](http://handlebarsjs.com/)をBackboneと組み合わせて使ってみました。

<!-- more -->

### このエントリでお伝えしたいこと。

1.  Backbone.js with Handlebars.js!!
2.  ここでもやっぱりGrunt最高

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2013/handlebar.png %}
 
## Handlebars.jsとは

詳細はGoogle先生の方が詳しいです（ごめんなさい）。  
数あるクライアントサイドのテンプレートエンジンの1つです。個人的にはプリコンパイルすることでパフォーマンス的に優位なところを注目しています。

[[jsperf]Precompiled Templates](http://jsperf.com/precompiled-hogan-handlebars-ejs)

最近話題のtwitterの[Horgan.js](http://twitter.github.com/hogan.js/)ともいい感じに渡り合ってます。

> とは言っても、プリコンパイル前は激遅なんですが。。。
 
## アプリケーション構成

まず、アプリケーションの構成は次のようなものだと仮定して話を進めます。

{% gist 5076060 app %}

namespace.js

{% gist 5076060 namespace.js %}
 
## なにはともあれ最初はGrunt!!

まず、なにか新しいことを始めるためには準備と計画が大事です。  
特にHandlebars.jsの場合は、プリコンパイルしない事には使い物にならないので、ビルドプロセスが必須です。
ということでGruntのタスクを使います。

[grunt-contrib-handlebars](https://github.com/gruntjs/grunt-contrib-handlebars)

Gruntfile.jsは次のように書きます。

{% gist 5076060 Gruntfile.js %}

普段Grunt使っている人だったら、さっと見ただけで分かると思うので、compileオプションの大事な所だけ補足します。

#### namespace
プリコンパイルされたテンプレート関数が割り当てられます。デフォルトだと`JST`となるので必要な場合、設定してください。

#### processName
processNameとは、（上の）namespaseオブジェクトに格納された、プリコンパイル済みテンプレート関数を取り出すためのキーです。デフォルトではファイルパスが設定されるようになっており、次のように取り出すようになっています。`var tmpl = MyApp.Templates["app/hbs/partial.hbs"];`  
個人的には`var tmpl = MyApp.Templates.partial;`とbackbone側から利用したいので、overrideしています。

これでGruntのwatchタスクと組み合わせることで、hbsファイルに変更があった際にtemplate.jsとして自動でプリコンパルされます。Gruntってほんと便利！
 
## Backboneと使う

さて本題です。
今回は、Backboneでありがちな、render()でCollectionの中身を出力する場合を例に説明します。

まずは、Handlebars.jsのテンプレート部分

{% gist 5076060 partial.hbs %}

BackboneのViewからは次のように呼び出します。

{% gist 5076060 partial.js %}

Handlebars.jsのテンプレート関数にデータを渡す際に、1回オブジェクトにラップして名前を付ける手間がありますが、これで`BackboneでHandlebars.js`を使うことができました。
Handlebars.jsには他にも色々なExpressionsがあるのですが、同じ原理で大丈夫なはずです。
