---
layout: post
title: "CSSができる人とできない人では何が違うのか？(コンテナ編)"
date: 2018-04-04 0:00:00 +900
comments: true
tags:
  - css
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout-logo.png
---
前回の「[CSSができる人とできない人では何が違うのか？\(レイアウト編\)](https://blog.mitsuruog.info/2018/03/how-to-learn-css-1)」の続きです。

今回は「コンテナ」について。

## はじめに
今回は前回作成したコメントボックスに、次のようなアイコンを追加するケースを例にします。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container1.png 550 %}

> コードはこちらで全て見ることができます。
> https://codepen.io/mitsuruog/pen/NYwJWd?editors=1100

このようにワンポイントでアイコンなどを追加するケースは割とよくあると思いますが、「コンテナ」という概念を理解していないと、なかなかうまくレイアウトすることができません。

今回は、この「コンテナ」という概念の捉え方について説明します。

## 要素の相対位置指定
前回はCSSのレイアウトは基本的なルールに従っていること説明しました。簡単なレイアウトであれば、このルールの中でレイアウトできると思います。

しかし、今回のように**このルールの中では移動できない位置**に要素をレイアウトしなければならない場合、「**相対位置指定**」というテクニックを使います。

> 「相対」とは
> １ 向かい合うこと。向き合っていること。また、対立すること。「難題に相対する」
> ２ 他との関係の上に存在あるいは成立していること。
> - [相対（そうたい）の意味 \- goo国語辞書](https://dictionary.goo.ne.jp/jn/129028/meaning/m0u/)

つまり「相対位置」とは、**何かの基準点を設けてそこから位置を指定すること**です。

そして、この基準点が「**コンテナ**」です。

## コンテナの理解にはレイアー構造を意識することが必要

相対位置指定とコンテナの関係を理解するためには、**DOM構造の中から「コンテナ」としての役割をするレイアー**を特定し、このレイアー構造を意識することが必要です。

> レイアウトがx-y軸の概念とすると、コンテナはz軸の概念です。
> Webページは平面の2D空間をしていますが、コンテナを意識して3D空間として認識することが大事です。

### 要素を相対位置指定する

では、コメントボックスの中に閉じるアイコンを追加します。

```html
<div class="comment">
  <i class="fa fa-times comment-close"></i> <!-- 閉じるアイコン -->
  <div class="comment-left">
    <img src="画像のURL" class="comment-avatar">   
  </div>
  <div class="comment-right">
    <a href="" class="comment-name"><strong>mitsuruog</strong></a>
    <p class="comment-text">テキストテキストテキスト...</p>
    <div class="comment-buttons">
      <a class="comment-button"><i class="fa fa-pencil"></i>編集</a>
      <a class="comment-button"><i class="fa fa-trash"></i>削除</a>   
    </div>
  </div>
</div>
```

結果はこのようになります。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container2.png 550 %}

アバターが画像の手前に配置したので、隣に表示されています。
これからこれを相対位置指定して、コメントボックスの右上あたりに配置しましょう。相対位置指定にはCSSの`position: absolute;`を使います。

```css
.comment-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
```

結果はこのようになります。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container3.png 550 %}

アイコンがコメントボックスではなく、画面の右上に配置されてしまいました。これはなぜでしょう？

###

この時のレイアー構造と、相対位置指定されたアイコンがどのように移動するか順に見ていきましょう。

まずアイコンに`position: absolute`を指定したことで、アイコンは元々あったコンテナから浮いて自由に動かせるようになります。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container4.png 550 %}

そして相対位置を`top: 1rem; right: 1rem;`しているので、右上に移動します。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container5.png 550 %}

しかし、移動を遮るものがなにもないので、画面の右上まで移動します。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container6.png 550 %}

そのため、アイコンは画面の右上に移動してしまったのです。

### コンテナを定義する
ではコンテナを定義していきましょう。

今回は、アイコンをコメントボックスに対して相対位置指定したいため、コメントボックスが「コンテナ」になります。
要素をコンテナに指定するには`position: relative;`を指定します。

```css
.comment {
  display: flex;
  width: 35rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 6px;

  position: relative;
}
```

結果はこのようになります。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container7.png 550 %}

上の青い枠線の部分がコンテナとしての役割をするようになったため、アイコンはこの外側へは移動しません。

### 抵当なコンテナがない場合はコンテナを作る

続いてハートアイコンをアバター画像の上に重ねます。

よく見ると、アバター画像の周りにはコンテナになりそうな要素がありません。このような場合は、新しくコンテナとなる要素(`.comment-avatar-container`)を新しく追加します。
そして、コンテナの中にハートアイコンを追加します。

> `.comment-left`の要素をコンテナとして見立てても良いのですが、アバター画像に対してではなく、コメントボックスを左右に分けるためのものなので、今回はふさわしくないとしました。

```html
<div class="comment">
  <i class="fa fa-times comment-close"></i>
  <div class="comment-left">
    <div class="comment-avatar-container"> <!-- 新しく作成したコンテナ -->
      <i class="fa fa-heart comment-like"></i>
      <img src="画像のURL" class="comment-avatar">
    </div>  
  </div>
  <div class="comment-right">
    <a href="" class="comment-name"><strong>mitsuruog</strong></a>
    <p class="comment-text">テキストテキストテキスト...</p>
    <div class="comment-buttons">
      <a class="comment-button"><i class="fa fa-pencil"></i>編集</a>
      <a class="comment-button"><i class="fa fa-trash"></i>削除</a>   
    </div>
  </div>
</div>
```

ハートアイコンはアバター画像の外側`-0.25rem`の位置に配置することにします。

```css
.comment-like {
  position: absolute;
  color: red;
  top: -0.25rem;
  left: -0.25rem;
}
```

結果はこのようになります。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container8.png 550 %}

アバターの周りに追加したコンテナにコンテナ用のスタイルが適用されていないため、コメントボックスの外側に配置されてしまいました。

では、コンテナにスタイルを適用してみます。

```css
.comment-avatar-container {
  position: relative;
}
```

結果はこのようになります。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container9.png 550 %}

新しくアバター画像のコンテナ(青い枠線の部分)がコンテナとしての役割をするようになったので、ハートアイコンはコメントボックスの方まで移動しません。

ちなみにこの時のコンテナのレイアーはこのようになっています。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-container10.png 550 %}

## まとめ
今回は「コンテナ」について、できる人とできない人の視点の違いについて紹介しました。

このコンテナの構造を意識できるようになると、正しいスタイリングができるようになります。

さて、次はなににしようかな。
