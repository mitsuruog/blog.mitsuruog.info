---
layout: post
title: "Underscore.jsのtemplateについてのTips"
date: 2013-01-03 23:37:00 +0900
comments: true
categories: 
 - underscore
---

enja-ossにてUnderscore.jsのUtilityを翻訳した際に、template関数について少し深く知ることができましたので、フィードバックさせていただきます。
また、和訳で表現しきれない部分について少し補足します。
私が翻訳した文書が、エンジニアの皆さんの役に立ちますように・・・（-人-）

<!-- more -->

### このエントリでお伝えしたいこと。

1.  template関数の基本的な使い方について。
2.  sourceプロパティとプリコンパイルされたテンプレートについて。
3.  variableを設定することによる、レンダリングの高速化について。（少し微妙）

翻訳した文書はこちらです。

[https://github.com/enja-oss/Underscore/blob/master/docs/Utility.md](https://github.com/enja-oss/Underscore/blob/master/docs/Utility.md)

## まず、template基本的な使い方

書こうと思ったのですが、[@ahomu](https://twitter.com/ahomu)さんがいい感じまとめていましたので、こちらを参照してください。

（version1.3.3での内容ですが、翻訳時の1.4.3でも変わっていないと思います。）

[Underscore.jsのtemplate触ったメモ](http://havelog.ayumusato.com/develop/javascript/e490-underscore_js_template.html)
<div class="ennote">

## sourceプロパティについて

まず、template関数には、次の2通りの使い方があります。

1.  呼び出し時に即時レンダリングする。
2.  テンプレートをプリコンパイルしてレンダリング用関数と一緒に（変数などとして）キャッシュ。

この話の前提は「2.」の使い方の場合で、「プリコンパイルされたテンプレートはsourceプロパティに格納されているのでデバック等で使ってください。」といった内容の話です。
では早速、次のような最も単純なテンプレートをプリコンパイルしてsourceプロパティの中身をのぞいてみましょう。
（注）sourceプロパティの出力内容は見やすいよう、改行インデントしています。

{% gist 4413486 sample1.js %}

プリコンパイルされたテンプレートを確認することが出来ました。
「with(obj||{}){～」以下が、プリコンパイルされた内容です。
（with微妙・・・って思った方は特に最後方を重点的に読んでください。）

次に、`<%-%>`を使ってHTMLエスケープした場合は次のようになります。

{% gist 4413486 sample2.js %}

HTMLエスケープは内部でUnderscoreのescape()が使用されていることが分かりましたね。
最後は、テンプレートの中の`<%%>`で、ループ文を使った場合は次のようになります。

{% gist 4413486 sample3.js %}

ちなみに、プリコンパイルされた後のレンダリング用関数「function(obj){～」のobjですが、レンダリングする際に渡したJSONデータがそのまま渡されてきます。

sourceプロパティによってテンプレートのデバックが劇的にやりやすくなるかというと、そういう話ではないのですが、どのようにプリコンパイルされたが確認できることによって、原因の切り分けがしやすくなると思います。

## variableとレンダリングの高速化

これについては原文に書いてあったのでそう訳してますが、いろいろ調べていると本当に大幅に高速化するか疑問に感じてきました。

サイ本（5版）を読むとwith文は低速なので使用しない方が良いと書かれていましたので、そのように思っていた時期もあったのですが、次のエントリ（2008年でちょっと古いですが・・・）を読んでみると、現在はあまりパフォーマンス的なネックな存在しないような印象を受けています。

[[404 Blog Not Found]javascript - with(second.thought) // with再考](http://blog.livedoor.jp/dankogai/archives/51066288.html)

とは言っても、with文を使用した場合、グローバルスコープの変数が誤って参照され、見つけにくいバグが入り込む可能性があると感じています（上の「変数かプロパティが曖昧ではないか!」の部分です。）。
ですので、個人的にはtemplateはデフォルトでwith句を使用してしまうので、それを避けるためにvariableを設定するといった方が納得できました。

最初の最も単純なテンプレートにvariableを指定した場合は次のようにプリコンパイルされます。
（テンプレートの変数名とか少し変えてます。）

{% gist 4413486 sample4.js %}

変数の参照がobjからdataになってwith文が使用されなくなったと思います。
ちなみに、共通的に設定したい場合、次のようにも書けますので適宜使い分けてください。

```
_.templateSettings.variable = 'data';
```

variableについてはこちらも参考にさせていただきました。

[Using Underscore.js Templates To Render HTML Partials](http://www.bennadel.com/blog/2411-Using-Underscore-js-Templates-To-Render-HTML-Partials.htm)

with文の挙動を確認したコードはこちらです。（興味があったら参考にしてください。）

{% gist 4443959 with.js %}

このようにテンプレートがどのようにプリコンパイルされるか知っておくと、テンプレートに関連するデバック時間が短縮できると思います。困ったら思い出してください。