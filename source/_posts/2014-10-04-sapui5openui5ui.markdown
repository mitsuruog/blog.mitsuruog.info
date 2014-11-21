---
layout: post
title: "[SAPUI5/OpenUI5]カスタムUIコントロールを作成する方法(後編)"
date: 2014-10-04 23:56:00 +0900
comments: true
categories: 
 - SAPUI5
 - OpenUI5
---

> How to create new own controls in OpenUI5(Part 2)

[前回](/2014/09/sapui5openui5ui)に引き続き、OpenUI5にてカスタムUIコントロールを作成する方法の後編です。今回のパートは「既存のUIを拡張する」方法についてです。

今回のデモはこちらで参照できます。
[http://mitsuruog.github.io/sapui5-showroom/#/controls](http://mitsuruog.github.io/sapui5-showroom/#/controls)

<!-- more -->

### 目次

1.  既存UIコントロールの継承
2.  新規機能の追加
3.  レンダラの変更
4.  配布、利用
5.  まとめ

こちらの公式ページの内容をもとに書いています。
[Developing UI5 Controls in JavaScript](https://openui5.hana.ondemand.com/#docs/guide/91f1703b6f4d1014b6dd926db0e91070.html)

## 1. 既存UIコントロールの継承

既存のUIコントロールを継承した新しいUIコントロールを作成していきます。基本的にはextendすることで継承が可能です。 
下の例は、sap.m.Inputを継承して「mitsuruog.NoisyInput」というUIコントロールを作成しています。

{% gist 0d78e15894940547077d 10.coffee %}

## 2. 新規機能の追加

継承したUIコントロールに対する新機能の追加は、新しいUIコントロールの追加と変わりません。
こちらは先ほどのmitsuruog.NoisyInput新しい機能を追加する例です。

NoisyInputは、focusinした際にUIコントロールを左右にアニメーションする新しいInputコントロールです。外部から`beQuiet=true`を受け取ることで静かになります。

{% gist 0d78e15894940547077d 11.coffee %}

既存UIコントロールの既存機能(イベントハンドラなどの関数)を上書きする場合は、同名のfunctionを宣言した上で継承元のprototype関数を呼び出します。

{% gist 0d78e15894940547077d 12.coffee %}

上の例は既存のinitとonBeforeRenderingに対して機能を追加する例です。この例では実際に機能を追加していませんが、雰囲気は掴めると思います。

## 3. レンダラの変更

新しいUIコントロールの新しいUIを作成します。基本的にはrendererを定義して、中で既存UIコントロールのrendererを呼び出しすれば良いです。

{% gist 0d78e15894940547077d 13.coffee %}

ただし、実態は既存UIコントロールのrendererがどのように実装されているかに依存している場合が多く、確実に実装するためにはOpenUI5側のソースを一度確認したほうがいいです。
OpenUI5のコンロールの場合は、コントロールクラスの近くに「`〜Renderer-dbg.js`」があるのでこれを見ます。(-dbg)が付いているものがminifyされていないものです。

例）
Input.js -> InputRenderer-dbg.js
Label.js -> LabelRenderer-dbg.js

既存のrendererを確認すると、外部からrendererのライフサイクルに対してフックするためのI/Fを備えているもの(sap.m.Inputなど)があります。
その場合は新しいUIコントロールのrenderer内からI/F名を指定して機能を追加していきます。

次の例では、既存のaddInnerStylesが実行される前に、Inputコントロールの外見を変更する指定をしています。
> (innerやouterがあるのは、OpenUI5のUIコントロールは外側をdivコンテナで囲う場合が多いからです。外側のコンテナをouter、内側のUIコントロールをinnerと表現しています。)

{% gist 0d78e15894940547077d 14.coffee %}

ただし、既存のrendererを変更することは良くありません。既存のrendererの前後に機能を追加するか、フック用のI/Fを利用するようにしてください。
既存のrendererを変更する必要な場合は、継承せず新規でUIコントロールを作成した方がいいと思います。

## 4. 配布、利用

配布方法は、新規UIコントロールを作成する場合と変わりありません。 

継承元のクラスがロードされていないケースを想定し、予防的に`jQuery.sap.require`にてクラスをロードする記述を書いておいた方がいいと思います。

## 5. まとめ

2回に分けてOpenUI5にて新しいUIコントロールを作成する方法を紹介しました。 
OpenUI5はフレームワーク側の仕組みが複雑であるために、正しい方法を理解せず、カスタムしようとすると必ず手痛い失敗をします。(経験談)

OpenUI5多くの優れたUIコントロールを持っているため、本来であれば無理にカスタムせず、OpenUI5のコンポーネントの機能の範囲内でUIを構築していく方がベストですが、カスタムの方法も知っておくと、一気に利用の幅が広がると思います。