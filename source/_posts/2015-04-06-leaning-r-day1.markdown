---
layout: post
title: "とあるフロントエンド屋のR事始め その1"
date: 2015-04-06 16:25:03 +0900
comments: true
categories:
 - r
 - 統計
---


4月に少しまとまった時間があるということもあり、以前から興味があったのRの統計解析について、せっかくなので勉強してみる。

この記事は自分のための学習記録なので、特に有用な情報などありません。  
あしからず。

学習はこちらのサイトをベースに行います。とある弁当屋の統計技師様感謝です！

[とある弁当屋の統計技師（データサイエンティスト）](http://rmecab.jp/ranko/)

<!-- more -->

## 導入など

Rをインストールしてから、こちらのコマンドで学習用のパッケージをインストールします。

```
install.packages ("Ranko", repos = "http://rmecab.jp/R")
```

なお、プロキシ通す場合はこうする。

```
Sys.setenv("http_proxy"="http://<プロキシサーバー>:<ポート>/")
```

## 利用するデータ

チュートリアルで扱うデータは以下の通り。`Ranko`パッケージに入っているデータを利用します。

```
# 店別の売上個数
> bento
   売上個数     お店
1       181   正規屋
2       194   正規屋
3       265   正規屋
4       206   正規屋
5       208   正規屋
6       272   正規屋
...(省略)

# 弁当別の売上個数
> omu
   売上個数         弁当名
1        10 オムライス弁当
2        15 オムライス弁当
3        17 オムライス弁当
4         7 オムライス弁当
5        15 オムライス弁当
...(省略)

> bento7
 月  火  水  木  金  土  日
181 194 265 206 208 272 221
```

## 基本操作

### 変数代入(<-)

```
> x <- 8
> x
[1] 8
```

### ベクトル(c)

とある数値の集合を表したもの

```
> x2 <- c(1,2,4,5,6)
> x2
[1] 1 2 4 5 6
```

### データフレーム

R上で操作するデータの塊のこと。(Excelの計算シートっぽい)  
添字を指定して任意のデータ集合を作成できる  
(チュートリアルではデフォルトでcarsのデータセットが設定してある。)

```
> cars
   speed dist
1      4    2
2      4   10
3      7    4
4      7   22

...(省略)


# 任意の行を取得するには[]で添字をつける。
# `,`の後ろに取得する列数を設定するが、通常はいらないと思う。
> cars[1,]
  speed dist
1     4    2

# 範囲は[start:end]で指定する
> cars[1:5,]
  speed dist
1     4    2
2     4   10
3     7    4
4     7   22
5     8   16

# $をつけることで特定の列を取得
> cars$speed
 [1]  4  4  7  7  8  9 10 10 10 11 11 12 12 12 12 13 13 13 13 14 14 14 14 15 15 15 16 16 17 17 17
[32] 18 18 18 18 19 19 19 20 20 20 20 20 22 23 24 24 24 24 25

# 添字を[]をつけることで任意の行列を取得
> cars$speed [2]
[1] 4

# 範囲指定も可能
> cars$speed [2:5]
[1] 4 7 7 8
```

## 関数

### 平均(mean)

```
> mean(bento7)
[1] 221
```

### 中央値(median)

```
> median(bento7)
[1] 208
>
```

### 条件指定(==)

`==`で条件していできる。普通に演算するよと各データがマッチするがが評価される。

```
# 条件を指定する
> bento$お店=="正規屋"
 [1]  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE
[13]  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE
[25]  TRUE  TRUE  TRUE  TRUE  TRUE  TRUE FALSE FALSE FALSE FALSE FALSE FALSE
[37] FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE
[49] FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE FALSE
```

データセットの範囲に指定することで、データセットに対する条件指定ができる。

```
# お店=="正規屋のデータを全件取得
> bento[bento$お店=="正規屋",]
   売上個数   お店
1       181 正規屋
2       194 正規屋
3       265 正規屋
...(省略)
```

### 先頭(head)

```
> head(bento[bento$お店=="正規屋",],5)
  売上個数   お店
1      181 正規屋
2      194 正規屋
3      265 正規屋
4      206 正規屋
5      208 正規屋
```

### 末尾(tail)

```
> tail(bento[bento$お店=="正規屋",],5)
   売上個数   お店
26      136 正規屋
27      237 正規屋
28      209 正規屋
29      157 正規屋
30      253 正規屋
```

### うーんなんて表現すればいいんでしょう。。。(by)

> by？うーん。便利関数？？

指定したデータセットのサブセットに対して何かの関数処理をさせて結果を表示する。

[by関数について質問を受けたのでまとめてみた - 日々のつれづれ、良かった探し](http://d.hatena.ne.jp/myopomme/20120708/1341740574)

`summary`は要約統計量を算出する便利関数みたい。

[R-Source 59. 基本統計量の算出](http://cse.naro.affrc.go.jp/takezawa/r-tips/r/59.html)

[Rで統計: データ集合中の最大、最小、平均、中央値 ? summary()関数](http://www.yukun.info/blog/2008/09/r-summary-mean-median.html)

 summary関数の戻り値

 - Min(最小値)
 - 1st Qu(第一四分位数：小さいほうから1/4の値)
 - Median(中央値)
 - Mean(平均値)
 - 3rd Qu(第三四分位数：大きいほうから1/4の値)
 - Max(最大値)

```
# この例だと売上個数のデータセットにサブセットのお店を渡して`summary`した結果を取得。。。といったとこでしょうか
> by(bento$売上個数, bento$お店, summary)
bento$お店: がんま亭
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
  197.0   203.2   205.5   205.9   208.8   216.0
---------------------------------------------------------
bento$お店: 正規屋
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
  124.0   176.5   200.0   201.1   222.5   274.0
```


## グラフ表示

`ggplot2`を使ってグラフを表示。

### 箱ひげ図(boxplot)

[ボックスプロット | Rのboxplot関数の使い方](http://stat.biopapyrus.net/graph/boxplot.html)

```
# 売上個数をお店ごと(水準)に箱ひげ図化
> boxplot(売上個数~お店, data=bento)
```

{% img https://dl.dropboxusercontent.com/u/77670774/blog.mitsuruog.info/2015/leaning-r-1-1.png 400 %}

```
# 売上個数を弁当名ごと(水準)に箱ひげ図化
> boxplot(売上個数~弁当名, data=omu)
```

{% img https://dl.dropboxusercontent.com/u/77670774/blog.mitsuruog.info/2015/leaning-r-1-2.png 400 %}

外にある○は外れ値みたい。

## 最後に

なんとなくグラフ表示までできましたが、まだ全然わかりません。  
まだわからないのでやらさせてる感が半端ないですw。早く自分の道具として扱えるようにしたいですね。  
いつまで続くかわかりませんが、頑張ります。
