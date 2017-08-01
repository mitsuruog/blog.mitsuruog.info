---
layout: post
title: "[SAPUI5/OpenUI5]複数のプロパティをバインドする"
date: 2014-07-11 00:16:00 +0900
comments: true
tags:
 - javascript
 - OpenUI5
 - SAPUI5
---

SAPUI5/OpenUI5関連の小ネタです。
複数のプロパティをデータバインドする方法についてです。

<!-- more -->

XMLViewの場合、複数プロパティは以下のように割と簡単に実現できるのですが、JSViewの場合はどうすればいいのでしょうか？

```html
<text text="{Width} x {Depth} x {Height} {DimUnit}"></text>
```

答えはこちらです。

```coffee
new sap.m.Text({
    text: {
        parts: [
            {path: "Width"},
            {path: "Depth"},
            {path: "Height"},
            {path: "DimUnit"}
        ],
        formatter: function(width, depth, height, dimUnit){
            return width + " x " + depth  + " x "  + height + " " + dimUnit;
        }
    }
});
```

通常のformatterを使ったデータバインドは`path`と`formatter`プロパティをセットすればいいのですが、複数プロパティの場合は`path`を`parts`の中に含めればできます。

最近、公式のサンプルを見る限りViewはXMLViewを使って書くべきみたいな流れになっていて、JSViewのサンプルが減ってきていますね。。。

こちらに載っていた情報です。

[javascript - SAPUI5: How to directly bind two data properties into one control property using OData model? - Stack Overflow](http://stackoverflow.com/questions/22320475/sapui5-how-to-directly-bind-two-data-properties-into-one-control-property-using)
