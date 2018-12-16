---
layout: post
title: "CSSができる人とできない人では何が違うのか？(レイアウト編)"
date: 2018-03-28 0:00:00 +900
comments: true
tags:
  - css
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout-logo.png
---
プライベートでCSSを教える機会があるのですが、CSSに関しては特に苦手にしている人が多く、「どうやったらそうなれますか？」という質問をよくもらいます。

そこで普段あまり考えたことがなかったので、ちょっと考えてみました。
その中で感じたことは、**自分には見えているものが、他の人には見えていない**ということでした。

いくつかキーとなる視点がありそうなので、シリーズ化してみます。

今回は「レイアウト」について。

## はじめに
今回は次のような、コメントフィード風のUIを作るケースを想定して順に説明していきます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout1.png 550 %}

> ちなみに自分の場合、作成時間は15分くらいでした。
> コードはこちらで全て見ることができます。
> https://codepen.io/mitsuruog/pen/dmZBLM?editors=1100

CSSが苦手な人にやらせた場合、自分が期待した通りにはならないケースが多いと思います。
ブラウザはスクリーンのサイズが大きく変化するため、絶対位置でレイアウトしても崩れてしまいます。
そのような条件の中でこれらの要素を正しく配置レイアウトするためには、レイアウトを設計するための新しい「視点」が必要です。

## 正しいレイアウトには正しいHTML構造が必要
実は、レイアウトには**CSSの知識よりもHTML構造の設計の知識の方が重要**です。

自分がレイアウトするために大切にしている「視点」とは、**UIのデザインを見て、どのようなHTML構造をするべきかをイメージする**ことです。これをするためには、HTMLのブロックレベル要素、インラインレベル要素の特性についての理解と、これらを正しく入れ子状に設計できる必要があります。

よくあるケースとして、デザインを見てHTML構造の設計について熟考せず、すぐスタイリングしてしまうパターン。
この場合、レイアウトするために過剰にCSSを使ってしまうことが多いような気がします。これを見ると、HTML構造を変えるだけでもっとシンプルに作れるのに、と残念に思います。

では、自分がどのように設計していくか順に見ていきましょう。

### 大枠のブロックを設計する
今回のUIをレイアウトする場合は、まず外枠のブロックと、アバター画像とコメントエリアの2つのブロックをイメージします。
ブロックレベル要素は横幅全体に広がる特徴があるので、最初アバター画像とコメントエリアは縦に並べておいて、後でCSSで横並びにしていきます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout2.png 550 %}

大枠のブロックを設計する上で大事なことは、まず大きな要素を抽出して、**一度縦に並べてから後でCSSを使って横並びにするプロセス**をイメージすることです。

ちなみに、横並びのレイアウトを考える上でのコツは、**一緒の列にしたい要素をグループ化して、その外側をブロックレベル要素で囲う**ことです。
このブロックのことを「**コンテナ**」と呼び、CSSを理解する上で重要な概念です。どこかで取り上げようかと思います。

```html
<div class="comment">
  <div class="comment-left">
    <img src="画像のURL" class="comment-avatar">   
  </div>
  <div class="comment-right">
    テキスト
  </div>
</div>
```

結果はこのようになります。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout3.png 550 %}

### 各ブロックの中身を設計する
次に着目する部分は、コメントエリアの構造です。
コメントエリアの中の要素は、コメントエリア横幅いっぱいのブロックで良さそうなので、単純に縦に並ます。
したがって次のようにブロックを設計します。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout4.png 550 %}

```html
<div class="comment">
  <div class="comment-left">
    <img src="画像のURL" class="comment-avatar">   
  </div>
  <div class="comment-right">
    <a href="" class="comment-name"><strong>mitsuruog</strong></a>
    <p class="comment-text">テキストテキストテキスト...</p>
    <div class="comment-buttons">
      ここにボタン
    </div>
  </div>
</div>
```

結果はこのようになります。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout5.png 550 %}

ボタンは横並びに配置すればいいので、インライン要素を使います。

```html
<div class="comment">
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
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout6.png 550 %}

これで基本的なHTMLの構造が完成しました。

### CSSで横並びにする
正しいHTML構造が完成したら、はじめてCSSのスタイリングに入ります。
横並びにしたいグループのコンテナ(今回は`.comment`)をFlexコンテナに指定します。

```css
.comment {
  display: flex;

  // borderとかwidthとか設定する
}
```

その後は、細かなスタイルを指定すると、最終的な結果はこのようになります。
{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout1.png 550 %}

レイアウトで大事なことは、まず正しいHTML構造を意識することですが、これをプロセスに変換すると次のようになります。

- 必要な要素をまず縦に並べてみる。(配置する)
- 横並びにする要素を見つけてグループにする。(コンテナを作る)
- 横並びにするグループに対してCSSを設定する。(横並びにする)
- 細かなスタイルを追加する。(スタイリング)

## ちょっと発展系
これまでは非常に単純な例でしたので、この中に「日時」を追加する場合、追加する場所でどのようにHTML構造を設計するべきかみてみましょう。

### 既存のブロック構造が利用できるケース
次のような位置に日時を追加する場合です。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout7.png 550 %}

よく見ると右側のエリアのブロックの中に収まりそうです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout7-1.png 550 %}

そのため、右側のブロックの最下層のブロックをコンテナにして、その中に2つのブロックを横並びに配置します。
(青の部分が新しく追加するブロック)

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout8.png 550 %}

### 既存のブロック構造が利用できないケース
次は、下の位置に日時を追加する場合です。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout9.png 550 %}

日時は右側のブロックの最下層のブロックの左側を突き破っています。
この場合、既存のブロック構造を上下に分けて再設計します。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout9-1.png 550 %}

右側のブロック最下層のボタンと日時を合わせて新しいブロックを構築して、次のように上下にコンテナを再配置します。
(青の部分が新しく追加するブロック)

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2018/css-layout10.png 550 %}

> 実は上の大枠を設計する時に、このような拡張を予測して最初から上下に設計することも可能でした。HTML構造に対するアプローチの仕方は様々です。

このように変更内容によってはHTML構造を再構成した方が、良い場合があります。

> UIの変更を依頼する側は、このあたりの事情について全く知らないので、結構軽い気持ちで変更を依頼してくることがありますね。。。

## まとめ
今回は「レイアウト」について、できる人とできない人の視点の違いについて紹介しました。
デザインを見てHTML構造をイメージできるのは、一種の「千里眼」っぽいなと感じますが、訓練で誰でもできるようになります。

> ちなみに、自分が作っていた[CODEPREP](https://codeprep.jp/tracks/UI%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E5%AE%9F%E8%B7%B5)のコンテンツは、ほぼ最初の章がHTML構造の設計になっています。

さて、次はなににしようかな。

CSSの実用的な本についてはあまりいい書籍がなのですが、この本は割といいです。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=mitsuruog-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=B00M0ESXUI&linkId=f4b2639fd5927037c954d8367b3ce79f&bc1=000000&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>