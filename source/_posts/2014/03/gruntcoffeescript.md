---
layout: post
title: "Gruntを使ってCoffeeScriptをいろいろコンパイルする"
date: 2014-03-07 01:29:00 +0900
comments: true
tags: 
 - CoffeeScript
 - Grunt
---

最近、Javascriptの実装なるべく楽したいので、CoffeeScriptを書いています。
当然、ブラウザはCoffeeScriptを解釈できないため、Javascriptにコンパイルする必要があるのですが、やっぱここでもGruntです。
GruntでのCoffeeScriptのコンパイル方法について、個人的に調べたので少しまとめます。

<!-- more -->

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/coffee1.png %}

1.  シンプル（1->1またはn->1）
2.  マルチ（n->n）
3.  マルチ（n->n）＋ちょっとカスタム
4.  まとめ


最初に、CoffeeScriptをコンパイルするGruntプラグインですが、こちらを使います。
[https://github.com/gruntjs/grunt-contrib-coffee](http://gruntjs/grunt-contrib-coffee)

node.jsがインストールされている環境で、次のコマンドを実行してください。

```
npm install grunt-contrib-coffee --save-dev
```

インストールしたら、Gruntfile.jsにてプラグインを有効化します。

```
grunt.loadNpmTasks('grunt-contrib-coffee');
```

## 1.シンプル（1->1またはn->1）

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/coffee2.png %}

まずは、最も単純なタスクです。1つの「.coffee」ファイルを「.js」にコンパイルしたり、複数の「.coffee」を1つの「.js」にまとめます。コンパイルしたJavascriptは後続のUglifyタスクでminifyしたり難読化したりします。

良く使われるケースだと思います。Gruntタスクはこんな感じで書きます。

{% gist 9392519 Gruntfile1.js %}

## 2.マルチ（n->n）
 
{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/coffee3.png %}

次は、コンパイル時に1つのJavascriptとせず、フォルダ構成などを維持したままCoffeeScriptをコンパイルする方法です。JavascriptMV＊系フレームワークを使っていると割と遭遇するケースです。
Gruntタスクはこんな感じです。

{% gist 9392519 Gruntfile2.js %}
Gruntでは、ファイルの指定を動的に行うためのDynamicMappingという仕組みを持っていて、今回はこれを使ってます。詳しくは本家のページをどうぞ。

Configuring tasks - Grunt: The JavaScript Task Runner
[ http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically)

## 3.　マルチ（n->n）＋ちょっとカスタム

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2014/coffee4.png %}

最後は、ちょっと特殊（？）です。「.」が2つ以上あるファイルのコンパイルです。
上の方法で普通にコンパイルすると「hoge.view.coffee」が「hoge.js」になってしまいます。

これはGruntでは最初の「.」の所までがファイル名で、それ以降は拡張子と扱う仕様となっているからです。そこでコンパイル時の拡張子を判定する処理をカスタムすることにしました。Gruntタスクはこんな感じです。

{% gist 9392519 Gruntfile3.js %}

## 4.まとめ 

CoffeeScriptのコンパイル環境を1から作ってみたので、いろいろ試行錯誤した点をまとめてました。
ただ、最近はIDEの方で自動コンパイルするものが多いので、ちょこっと書く分には無理にGrunt使う必要はないと思います。

結構、UIコンポーネントを持つJavascriptMV*系フレームワークだと、View部分をJavascriptでガリガリ書くことになるので、CoffeeScriptが重宝しています。
まだまだCoffeeScript使いこなせてないのですが、しっかり味見してエンタープライズで使えるか評価していきたいですね。








