---
layout: post
title: "load-grunt-tasksやload-grunt-configでタスクがロードされない場合の対処法"
date: 2015-07-01 01:43:19 +0900
comments: true
categories:
 - grunt
 - npm
---

最近、`Gruntfile.js`が長くて辛いので、楽をするため次のnpmモジュールをほぼ利用しています。

- [sindresorhus/load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks)
- [firstandthird/load-grunt-config](https://github.com/firstandthird/load-grunt-config)

ただ、内部のタスクロードの仕組みを知らないと、意外なところでつまづくものです。
今日は、その辺りのハマりポイントについて紹介します。

<!-- more -->

## 特定のタスクが実行できない！！なぜ！？

`npm install`でタスクをインストールしているにも関わらず、タスクが見つからないとのエラーが発生する場合は、
以下のコマンドで、実行可能なタスクを確認してみてください。

```
grunt -h
```

コマンドを実行すると`Available tasks`に実行可能なタスクの一覧が表示されます。

```
Available tasks
             copy  Copy files. *
           coffee  Compile CoffeeScript files into JavaScript *
           concat  Concatenate files. *
           jshint  Validate files with JSHint. *
          connect  Start a connect web server. *
            clean  Clean files and folders. *
            watch  Run predefined tasks whenever watched files change.
             open  Open urls and files from a grunt task *
 configureProxies  Configure any specified connect proxies.
           server  Custom task.
          default  Alias for "server" task.  
```

この一覧にタスクが存在しない場合、なんらかの理由でロード対象から漏れている可能性があります。

## load-grunt-tasksでのロードタスクの選択

`load-grunt-tasks`内部では次のようなパターンマッチングでロードするファイルを選択しています。

```js
// require('load-grunt-tasks')(grunt); と同じ意味です
require('load-grunt-tasks')(grunt, {
  pattern: ['grunt-*', '@*/grunt-*']
});
```

つまり、`grunt-`で始まらないタスクについては、デフォルトではロードされない仕組みになっています。
上記のパターンに一致しないタスクについては、`pattern`に追加することでロードすることが可能です。

```js
require('load-grunt-tasks')(grunt, {
  pattern: ['grunt-*', '@*/grunt-*', 'oreore-task']
});
```

これで、`grunt-`に一致しないタスクも無事ロードすることができます。

## load-grunt-configでのロードタスクの指定方法

内部で`load-grunt-tasks`を呼び出しているので、次のようにします。

```js
require('load-grunt-config')(grunt, {
   loadGruntTasks: {
     pattern: ['grunt-*', '@*/grunt-*', 'oreore-task']
   }
 });
```

> 参考
[Grunt --help does not show loaded tasks. · Issue #124 · firstandthird/load-grunt-config](https://github.com/firstandthird/load-grunt-config/issues/124)

これで、`load-grunt-tasks`でも`grunt-`に一致しないタスクを無事ロードすることができます。

## まとめ

最近手放せない`load-grunt-tasks`と`load-grunt-config`についての小ネタでした。

Gruntタスクは、`grunt-`という名前で始まるものが多いので、少し気にはなっていたのですが、
背後にはこのようなエコシステムがあったのですね。
