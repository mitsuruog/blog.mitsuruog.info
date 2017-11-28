---
layout: post
title: "Azure Machine Learningをやってみた"
date: 2015-04-16 15:18:50 +0900
comments: true
tags:
 - azure
 - 統計
 - Machine Learning
---

機械学習(以下、ML)についてもそろそろやったおかないといけないので、Azure Machine Learning(以下、AzureML)を試してみました。
内容はこちらにあるチュートリアルです。

[Create a simple experiment in Machine Learning Studio | Azure](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-create-experiment/)

<!-- more -->

こちらが上の日本語版です。

[Machine Learning Studio での簡単な実験の作成 | Azure](http://azure.microsoft.com/ja-jp/documentation/articles/machine-learning-create-experiment/)

AzureMLの中では、一連のMLの流れを`experiment(実験)`と呼んでいるようです。  
このチュートリアルでは、自動車の価格データを元に分析モデルを機械学習で構築するものです。  
実験の手順を整理するとこちらの通りです。

 1. モデルの作成
	 2. データを準備する
	 2. データの前処理をする
 3. モデルのトレーニング
	 4. トレーニングとテストへモデルを分配
	 3. 学習アルゴリズムを選択して分析モデルを構築
 4. モデルへのスコア付けとテスト
	 4. 分析モデルを元に、新しいデータについての予測を行う
	 5. 結果を評価

ではやってみましょう。

## 1. モデルの作成

### 1.1. データを準備する

まず、学習するためのデータを準備します。今回は、AzureMLにビルトインされている`Automobile price data (Raw)`データを利用します。

実験キャンバスの左側の「データセットとモジュールのパレット(以下、パレット)」からAutomobile price data (Raw)を選択して、実験キャンバスにDrag&Dropします。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-1.png %}

データの表示は、データセットの下の出力ポートを右クリックして`Visualize`を選択するとできます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-2.png %}

これでデータの準備はOKです。

### 1.2. データの前処理をする

分析を行うためにデータ前処理(加工)を行います。ここでは歯抜けになっている列や行を削除します。

**`normalized-losses`行を削除する。**

データの前処理は`Project Columns`モジュールを利用して行います。パレットから選択してください。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-3.png %}

`Project Columns`モジュールを選択すると、右のプロパティウィンドウで内容を参照できます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-4.png %}

`Launch column selector`ボタンをクリックすると編集ダイアログが表示されます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-5.png %}

内容を変更するとプロパティウィンドウで内容を参照できます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-6.png %}

**歯抜けになっている行の除去**

歯抜けデータ除去は、`Missing Values Scrubber`モジュールを利用して行います。パレットから選択してください。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-7.png %}

プロパティウィンドウで内容を変更します。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-8.png %}

下部メニューの`RUN`をクリックすると、実験を実行できますので、ここまでで実行してみてください。
結果の表示はモジュールの下の出力ポートを右クリックして`Visualize`を選択するとできます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-9.png %}

なんとなくですが、歯抜けデータの間引きができているようです。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-10.png 500 %}

**分析対象列のフィルタリング**

最後に分析するデータをフィルタリングします。フィルタリングは`Project Columns`モジュールを利用して行います。パレットから選択してください。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-11.png %}

プロパティウィンドウで内容を変更します。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-12.png %}

実験を`RUN`してみると、データが正しくフィルタリングできていることが確認できます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-13.png 500 %}

ここまでで、データの作成部分が終わりました。  
情報処理の世界にある、「ガーベジイン・ガーベジアウト」という言葉について、MLの世界では特に大事な気がします。

[GIGO](http://www.itmedia.co.jp/im/articles/0609/11/news088.html)

## 2. モデルのトレーニング

続いて、作成したデータに特定の学習アルゴリズムを適用して分析モデルを構築していきます。

>
データが準備できると、分析モデルの構築に必要なのは、トレーニングとテストになります。分類と回帰は、2 種類の管理された機械学習の手法です。  
* 分類(Classification)は、色 (赤、青、または緑) のような定義された一連の値から予測するために使用します。  
* 回帰(Regression)は、人の年齢のような連続した一連の値から予測するために使用します。  
> > [Machine Learning Studio での簡単な実験の作成 | Azure](http://azure.microsoft.com/ja-jp/documentation/articles/machine-learning-create-experiment/)より

今回予測する自動車の価格は、連続した値をとると予測できるので、最も単純な`線形回帰`を用いて学習させていきます。

### 2.1. トレーニングとテストへモデルを分配

作成したモデルをトレーニングとテストへ分配します。今回は75%をトレーニング、残りの25%をテストに割り振ります。

分配は、`Split`モジュールを利用して行います。パレットから選択してプロパティウィンドウで内容を変更します。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-14.png %}

プロパティウィンドウで内容を変更します。

### 2.2. 学習アルゴリズムを選択して分析モデルを構築

線形回帰は、`Linear Regression`モジュールを利用して行います。トレーニングは、`Train Model`モジュールを利用して行います。

ぞれぞれパレットから選択してください。

先ほどの`Split`モジュールの左の出力ポートと`Linear Regression`モジュールの出力ポートを`Train Model`モジュールに接続します。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-15.png %}

`Train Model`モジュールのプロパティウィンドウで分析するカラムを選択します。今回は`price`を選択します。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-16.png %}

## 3. モデルへのスコア付けとテスト

最後に、モデル分割で残っている25%のデータについて、先ほど学習した分析モデルを元に結果の予測を行います。

### 3.1. 分析モデルを元に、新しいデータについての予測を行う

線形回帰は、`Score Model`モジュールを利用して行います。パレットから選択してください。

`Split`モジュールの右の出力ポートと`Train Model`モジュールの出力ポートを`Score Model`モジュールに接続します。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-17.png %}

ここまでで`RUN`すると実験を開始できます。`Score Model`モジュールにて`Visualize`すると統計分析の結果がみることでできます。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-18.png %}

今回は価格での分析でしたので`Price`列を選択した後に、右の`Visualizations`にある、`compare to 〜`の部分を選択します。

例えば、**メーカー対価格**  
volvoが突出して高いですね。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-21.png 500 %}

**車種対価格**  
セダンはピンキリですが、全体的に中心より下の価格対が多いようです。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-22.png 500 %}

**エンジンサイズ対価格**  
エンジンサイズと価格は正比例のようです。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-23.png 500 %}

**馬力対価格**  
正比例のようですが、うーんちょっとわかりませんね。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-24.png 500 %}

ここまででも、結構楽しいです。

### 3.2. 結果を評価

最後に、分析モデルの予測結果に対する評価を行います。評価は、`Evaluate Model`モジュールを利用して行います。パレットから選択してください。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-30.png %}

`RUN`して`Evaluate Model`モジュールの結果を`Visualize`すると次のような結果になります。

{% img https://blog-mitsuruog.s3.amazonaws.com/images/2015/azureML-learning-31.png %}

各統計値は以下の通りです。

>
* 平均絶対誤差(Mean Absolute Error)  
　* 絶対誤差の平均です (誤差とは、予測された値と実際の値との差です)。  
* 二乗平均平方根誤差(Root Mean Squared Error)  
　* テスト データセットに対して実行した予測の二乗誤差平均の平方根です。  
* 相対絶対誤差(Relative Absolute Error)  
　* 実際の値とすべての実際の値の平均との絶対差を基準にした絶対誤差の平均です。  
* 相対二乗誤差(Relative Squared Error)  
　* 実際の値とすべての実際の値の平均との二乗差を基準にした二乗誤差の平均です。  
* 決定係数(Coefficient of Determination)  
　* `R squared value`ともいいます。どの程度モデルが高い精度でデータと適合するかを示す統計指標です。  

> 各誤差の統計値は、小さいほど優れています。つまり値が小さくなるほど、予測が実際の値に近くなることを意味します。
決定係数では、値が 1 (1.0) に近づくほど、予測の精度が高くなります。  
> [Machine Learning Studio での簡単な実験の作成 | Azure](http://azure.microsoft.com/ja-jp/documentation/articles/machine-learning-create-experiment/)より

す、すみません。まったくわかりません。

今回の分析モデルに関しては決定係数が1に近いので、精度としては良いという評価なんでしょうかね？

## 最後に

やってみた系の記事でした。まだ全体像がよくわかっていないのでなんとも・・・うーん。

とっかかり難しそうなMLですが、AzureMLを利用すると一連の実験の流れについては準備されているので、わりとカジュアルに入門できそうです。

MLを行う上で大事な事は「分析モデル」だなと感じました。分析モデルを構築する上で、留意するべきことは次のような部分ですかね。

* データの準備と前処理
* 分析モデルを構築する上での学習アルゴリズムの選定
* 分析モデルの評価方法

まだ、表面的に触っただけなので、この辺りに足を踏み入れるとMLの深淵に触れられそうです。

既に面白いことやられている方もいるようで、目的に応じてカジュアルに使いこなせるようになるといいなと思います。

[Azure Machine LearningとIoTを駆使して室温予測システムを構築してみた - がりらぼ](http://garicchi.hatenablog.jp/entry/2015/03/01/155845)
