---
layout: post
title: "Web Components ハンズオンをやってみた"
date: 2014-09-14 23:37:00 +0900
comments: true
tags: 
 - HTML5
 - Web Components
 - ハンズオン
---

2014/09/09に美人で有名なおだんみつさんのいる[21cafe](http://www.ni-ichicafe.com/)で「[エンタープライヤーのためのWeb Componentsハンズオン](https://atnd.org/events/55761)」を開催しました。内容は「Web名刺」をWeb Componentsで作るというものです。

Web Componentsについての解説記事はそこそこ出てきましたが、ハンズオンだと国内初の試みかと思います。それなりに難しい技術に関するハンズオンでしたが、なかなか好評だったようですので少し振り返ってみます。

<!-- more -->

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/wc_handson1.png %}

1.  Web Componentsとは
2.  苦労したポイント
3.  成功したポイント
4.  さいごに

## Web Componentsとは

UI部品がコンポーネント化して再利用しやすくすることが出来る技術です。詳細はGoogleのえーじさんが[なぜ Web Components はウェブ開発に革命を起こすのか](http://blog.agektmr.com/2014/05/web-components.html)で書いている記事が分かりやすいかと思います。とにかく将来のWeb開発に革命を起こすと言われる技術です。

## 苦労したポイント

2時間のハンズオンコースですので、その限られた時間内で結果を出さなければなりません。 
今回苦労したポイントは2つです。

1.  Web Componentsのメリットを感じつつ、作ってて面白く、参加者が本気になる題材はなにか。
2.  Web Componentsの複雑に絡み合った仕様を最短で理解してもらうためには、どうすればいいか。

「題材」については自分のカスタムタグが作れて気軽に配布できると嬉しい「Web名刺」にしました。 
最短で理解してもらうための構成とコンテンツ作りには難儀しましたが、Web Componentsのコンセプトについては「花の種」を例えて、コンテンツの方は、講師がいなくても出来るように[Github](https://github.com/html5bizj/x-business-card)上に作りました。 
(Githubのコンテンツについてはかなり試行錯誤して悩んだのは事実です。)

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/wc_handson2.png 554 393 %}

<blockquote class="twitter-tweet" lang="ja"><p>エンタープライズな<a href="https://twitter.com/mitsuruog">@mitsuruog</a> さんならではの「Web Componentsは花の種で理解しよう」論いいねっ∩( ・ω・)∩ <a href="https://twitter.com/hashtag/html5biz?src=hash">#html5biz</a></p>&mdash; 21cafe管理人おだんみつ (@21cafe_shibuya) <a href="https://twitter.com/21cafe_shibuya/status/509291557111885825">2014, 9月 9</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

参加者からは嬉しい反応もいただけたので、なかなかハンズオンとしては成功だったようです。主催としてはホッとしています。

こちらが当日の様子です。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/wc_handson3.JPG 554 415 %}

<blockquote class="twitter-tweet" lang="ja"><p><a href="https://twitter.com/hashtag/html5biz?src=hash">#html5biz</a> 昨日はWebComponentsハンズオンありがとうございました。信じがたいことにあの2時間だけでかなり自在にWebComponentが書けるようになりました。(^^;;;</p>&mdash; Shunji Konishi (@shunjikonishi) <a href="https://twitter.com/shunjikonishi/status/509540957809692672">2014, 9月 10</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" lang="ja"><p>Web Componentsすごい　<a href="https://twitter.com/hashtag/html5biz?src=hash">#html5biz</a></p>&mdash; いと (@ab_lave) <a href="https://twitter.com/ab_lave/status/509320071731109888">2014, 9月 9</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

発表資料はこちらです。

<iframe allowfullscreen="" height="356" scrolling="no" src="//www.slideshare.net/slideshow/embed_code/38850199" width="427"> </iframe> 
<div>
<strong> <a href="https://www.slideshare.net/mitsuruogawa33/webcompoents" target="_blank" title="エンタープライヤーのためのWeb Componentsハンズオン">エンタープライヤーのためのWeb Componentsハンズオン</a> </strong> from <strong><a href="http://www.slideshare.net/mitsuruogawa33" target="_blank">Mitsuru Ogawa</a></strong> 


ハンズオンの内容についてはこちらにあります。

[html5bizj/x-business-card](https://github.com/html5bizj/x-business-card)

## 成功したポイント


成功したポイントはいくつかあるのですが、簡単に言うと[@kara_dさん](https://twitter.com/kara_d)のこの一言、「企画」なのかなと思います。

<blockquote class="twitter-tweet" data-cards="hidden" lang="ja"><p>今日はhtml5えんぷら部にてweb componentsハンズオンに参加〜 名刺を作るって企画いいなあ。 <a href="https://twitter.com/hashtag/html5biz?src=hash">#html5biz</a>&#10;<a href="http://t.co/yL6wrcF7tb">http://t.co/yL6wrcF7tb</a> <a href="http://t.co/WjqPQowRmU">pic.twitter.com/WjqPQowRmU</a></p>&mdash; Kazuhiro Hara. (@kara_d) <a href="https://twitter.com/kara_d/status/509314331154980864">2014, 9月 9</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

「企画」が最も大事なのは事実なのですが、裏でハンズオンを成功させるための運営的な小細工をいろいろやっていたので、機会があったらノウハウまとめたいと思います。

## さいごに

今回、[エンタープライヤーのためのWeb Componentsハンズオン](https://atnd.org/events/55761)を開催しました。2時間で参加者が満足できるハンズオンができるか不安でしたが、なんとか成功させることができたようです。

お忙しい中、参加していただいた皆さんありがとうございました。チューターの[@albatrosaryさん](https://twitter.com/albatrosary)、[@can_i_do_web](https://twitter.com/can_i_do_web)さんありがとう！あなた達のフォローがなかったら成功しなかったです。会場提供の[21cafe](http://www.ni-ichicafe.com/)さんもありがとうございました。

作成したWeb名刺

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/wc_handson4.JPG 554 415 %}

最後は参加者で記念撮影

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2014/wc_handson5.JPG 554 415 %}
