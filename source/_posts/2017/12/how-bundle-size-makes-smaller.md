---
layout: post
title: "highlight.jsを小さくバンドルする方法"
date: 2017-12-21 0:00:00 +900
comments: true
tags:
  - webpack
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/bundle.png
---
プロジェクトのwebpackのバンドルサイズを計測して見たところ、[highlight.js](https://highlightjs.org/)が結構な割合を占めていたので、サイズを小さくする方法を試してみました。

## はじめに

この辺りの記事を参考にしています。

- [Reducing bundle size of Highlight\.js with Webpack \| Brian Jacobel](https://bjacobel.com/2016/12/04/highlight-bundle-size/)
- [Reducing bundle size of Highlight\.js with Webpack 2 \| Iris Schaffer](https://irisschaffer.com/reducing-bundle-size-of-highlight.js-with-webpack2)

## import文の書き方でサイズが小さくなる

結論からいうと、面倒でも利用する言語ファイルを`import`した方がサイズが小さくなります。

通常のやり方。

```js
// 750.01KB
import highlight from "highlight.js";
```

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/bundle-before.png %}

**750.01KB**。うーん。でかい。。。
なんだか全ての言語ファイルがバンドルされている気がする。。。

次は使う言語だけ`import`した場合。

```js
// 36.36KB
import highlight from "highlight.js/lib/highlight";

import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import xml from "highlight.js/lib/languages/xml";

highlight.registerLanguage("javascript", javascript);
highlight.registerLanguage("css", css);
highlight.registerLanguage("java", java);
highlight.registerLanguage("xml", xml);
```

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2017/bundle-after.png %}

**36.36KB**！！
かなりスリムになりました。

## なぜサイズが小さくなったのか？

npm installしたhighlight.jsの中身を見ると、全ての言語ファイルを呼び出していました。
そのため、`import highlight from "highlight.js`しただけの場合、自動的に全ての言語ファイルもバンドルされてしまいます。

```js
var hljs = require('./highlight');

hljs.registerLanguage('1c', require('./languages/1c'));
hljs.registerLanguage('abnf', require('./languages/abnf'));
hljs.registerLanguage('accesslog', require('./languages/accesslog'));
hljs.registerLanguage('actionscript', require('./languages/actionscript'));

...

module.exports = hljs;
```

なるほど、面倒でも一つ一つ`import`した方が良さそうですね。

## まとめ
こんな単純なことでバンドルサイズが減らせるとは。恐ろしや。。。

> サイズの測定は一度webpackでビルドしてから[danvk/source\-map\-explorer](https://github.com/danvk/source-map-explorer)を使って測定しました。

作業していたらこんな記事を見つけました。アプローチは同じです。

- RxJSを小さくバンドルする方法。import文の書き方で容量が変わる - Qiita https://qiita.com/clockmaker/items/5e2207b14dac97c4ede1
