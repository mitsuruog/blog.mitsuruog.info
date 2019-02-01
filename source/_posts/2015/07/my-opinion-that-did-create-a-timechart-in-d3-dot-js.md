---
layout: post
title: "D3.jsでタイムチャートを作ってみたので、苦労した点など振り返ってみる"
date: 2015-07-05 22:38:00 +0900
comments: true
tags:
  - d3.js
  - javascript
  - chart
---

D3.jsを使ってタイムチャートを作成してみました。  
初めて実践投入したこともあり、いろいろ苦労した点などあるので、振り返ってまとめてみます。  
D3.jsまだまだ奥が深いので、私が紹介する以外にもっといい方法があると思います。あくまで自分用のメモだと思ってください。

> 利用しているD3.jsはv3系です。

<!-- more -->

## サンプル

Codepenにサンプル作りました。

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="result" data-user="mitsuruog" data-slug-hash="bzqgKG" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="TimeChart">
  <span>See the Pen <a href="https://codepen.io/mitsuruog/pen/bzqgKG/">
  TimeChart</a> by mitsuruog (<a href="https://codepen.io/mitsuruog">@mitsuruog</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 苦労したこと

 1. 一定期間の時間軸を作成したい
 2. 時間軸のラベルを一定間隔にしたい
 3. 時間軸のラベルフォーマットしたい
 4. 軸のメモリ線(？)を消したい
 5. 画面サイズに応じて軸ラベルを回転させたい
 6. カテゴライズされた軸を作りたい
 7. カテゴライズされた軸のラベルを別なものにしたい
 8. ラベルの文字が長い場合に改行したい
 9. 軸のdomain範囲を超えたデータがある場合に表示させない
 10. windowがリサイズしたらChartを再描画したい
 11. 描画したSVGオブジェクトを全てクリアしたい

### 一定期間の時間軸を作成したい

`d3.time.scale`の`domain`に開始日時と終了日時を設定する。

```js
var xScale = d3.time.scale()
  .domain([
    new Date('2015-07-01 0:00:00'), // 開始日時
    new Date('2015-07-02 0:00:00')  // 終了日時
  ])
  .range([0, width]); // 実際の出力サイズ
```

### 時間軸のラベルを一定間隔にしたい

`d3.svg.axis()`の`ticks`に間隔を指定する。

```js
var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('top')
  .ticks(d3.time.minute, 60); // 60分間隔
```

細かな単位の指定などはこちら
(Intervalsを指定すればいいと思われる。)

[Time Intervals · mbostock/d3 Wiki](https://github.com/mbostock/d3/wiki/Time-Intervals)

### 時間軸のラベルフォーマットしたい

`tickFormat` を使おう。

```js
var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(d3.time.format('%H:00'));
```

フォーマット書式はこちら

[Time Formatting · mbostock/d3 Wiki](https://github.com/mbostock/d3/wiki/Time-Formatting)

よく使いそうなもの

```txt
%Y - year
%m - month[01,12]
%d - zero-padded day[01,31]
%H - hour[00-23]
%M - minute[00,59]
%S - second as a decimal number [00,61].
```

[javascript - how to format time on xAxis use d3.js - Stack Overflow](http://stackoverflow.com/questions/15471224/how-to-format-time-on-xaxis-use-d3-js)

### 軸のメモリ線(？)を消したい

`innerTickSize`, `outerTickSize`, `tickPadding`あたりを使う。

```js
var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('top')
  .innerTickSize(0)
  .outerTickSize(0)
  .tickPadding(10);
```

ここの記事がわかりやすかったので、これを見れば十分。

[D3.jsの折れ線グラフにグリッド線を追加する | Qaramell Blog](http://blog.qaramell.com/?p=12911)

### 画面サイズに応じて軸ラベルを回転させたい

ラベルを描画する際に、画面サイズに応じて`rotate`させる。

```js
svg.append('g')
  .call(xAxis)
  .selectAll('text')
  .attr('transform', function() {
    if (w < 1000 && w > 689) {
      return 'translate(20, -5) rotate(-45)';
    } else if (w <= 689) {
      return 'translate(20, -15) rotate(-90)';
    } else {
      return null;
    }
  });
```

### カテゴライズされた軸を作りたい

例えば、システム的なIdではなくで、なんらかの文字列のラベルなど。

`d3.scale.ordinal`を使って`domain`にラベルとしたい値の配列を渡す。

```js
var labels = [
  {id: 1, name:'ばなな'},
  {id: 2, name:'りんご'},
  {id: 3, name:'ぶどう'},
];
var yScale = d3.scale.ordinal()
  .domain(labels.map(function(d) {
    return d.name;
  }))
  .rangeRoundBands([0, height], 0.5); // 0.5はラベルの間隔
```

### カテゴライズされた軸のラベルを別なものにしたい

`d3.svg.axis`にて`tickFormat`を使って別の値に変換する。

```js
var mapper = ['ばなな', 'りんご', 'ぶどう'];
var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('top')
  .tickFormat(function(d, i) {
    // d, i をうまく使ってマッピングリストから値を取得するように設計する
    return mapper[i];
  });
```

[javascript - Give d3 ordinal axis labels different from scale names - Stack Overflow](http://stackoverflow.com/questions/19994328/give-d3-ordinal-axis-labels-different-from-scale-names)

### ラベルの文字が長い場合に改行したい

ラベルのテキストを抽出して、親のエレメントを指定して`<p>`タグなどで置き換える。
(もっとスマートなやり方はないのか)

```js
var mapper = ['ばなな', 'りんご', 'ぶどう'];
svg.append('g')
  .call(yAxis)
  .selectAll('text')
  .each(function(d, i) {
    var el = d3.select(this);
    var parent = d3.select(this.parentNode);
    parent.append('foreignObject')
      .attr() // テキストラベルラッパーの設定 ex)表示位置など
      .append('xhtml:p')
      .attr() // テキストラベルの属性 ex)classなど
      .html(function(d, i) {
        return mapper[i]; // 設定するラベルを返却
      });
    el.remove(); // 元のtextを消す
  });
```

あとはcssでスタイリングしていきます。

```css
.y-axis-label {
  word-wrap: break-word;
  text-align: center;  
}
```

[nvd3.js - How to do wordwrap for chart labels using d3.js - Stack Overflow](http://stackoverflow.com/questions/16039693/how-to-do-wordwrap-for-chart-labels-using-d3-js)

### 軸のdomain範囲を超えたデータがある場合に表示させない

`.clamp(true)`を使おう。これでdomain範囲を超えるデータは自動的にカットされて表示される。

```js
var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('top')
  .clamp(true);
```

### windowがリサイズしたらChartを再描画したい

`resize`イベントを使おう。そのままだとイベント発火回数が多いので、`throttle`(間引き)の仕組みを使う。

```js
 var timer = false;
 window.addEventListener('resize', function() {
   if (timer !== false) {
     clearTimeout(timer);
   }
   timer = setTimeout(function() {
     redraw(); // 何かの再描画関数
   }, 200); // リサイズ終わってから200msec経過して再描画する
 });
```

### 描画したSVGオブジェクトを全てクリアしたい

```js
d3.select('svg').selectAll('*').remove();
```
[d3.js - how do I remove all children elements from a node and them apply them again with different color and size? - Stack Overflow](http://stackoverflow.com/questions/14422198/how-do-i-remove-all-children-elements-from-a-node-and-them-apply-them-again-with)


### 雑感

D3.jsでタイムチャートで作ってみましたが、1点ものの作品を作っている感が非常に強いです。  
再利用とか部品化など考えるとD3が提供しているAPIとの境界でそこまでコストを掛けてするべきか、正直悩みました。

学習コストは結構高い方の部類に入りますので、その辺り本腰を入れて学習するか一度天秤に掛けた方がいいと思います。  
ただ、一度覚えると比較的自由に扱えるようになると思います。  
要件的にに満たすのであれば、既存のライブラリを利用した方が楽でいいですね。

このあたりが有名どこでしょうか。簡単なチャートであれば積極的に使っていきたいです。

- [C3.js | D3-based reusable chart library](http://c3js.org/)
- [Epoch by Fastly](http://fastly.github.io/epoch/)
- [Angular-charts](http://chinmaymk.github.io/angular-charts/#)

D3.jsじゃないけど、気になってるやつ

- [Chart.js | Documentation](http://www.chartjs.org/docs/#radar-chart)

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=mitsuruog-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=4774163260&linkId=2d5a40a1cd37936b85c54bb68e0898d8&bc1=000000&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>
    
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=mitsuruog-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=4873117461&linkId=f1102c173b373b8f4f7e861a5f990c6f&bc1=000000&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>
    
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=mitsuruog-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=B00LBLX46Y&linkId=fc2789d898447fe41decf7b2fbb96908&bc1=000000&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>