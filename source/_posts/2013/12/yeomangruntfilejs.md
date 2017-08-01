---
layout: post
title: "Yeomanに学ぶモテるGruntfile.jsの書き方"
date: 2013-12-24 00:56:00 +0900
comments: true
tags:
 - grunt
 - yeoman
---

私が担当するエンタープライズのフロント開発では、1年ほど前からGruntによるビルドプロセスを導入していて、自分でもプロジェクトの特性に応じてGruntfile.jsのタスクをデザインする機会が多いのですが、最近流行のYeomanが吐き出すGruntfile.jsを見るとなかなか参考になる点があったので、いくつか紹介したいと思います。

<!-- more -->

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2013/yeoman-logo.png %}

### 目次

1.  load-grunt-tasks
2.  テンプレート
3.  ファイル指定方法あれこれ
4.  外部パラメータによるタスクの分岐処理
5.  外部定義ファイルインポート

## 1. load-grunt-tasks

[load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks)とはpackage.jsonに定義されているGruntタスクを見て、タスク起動時にロードしてくれるモジュールです。これでタスクを変更するたびにGruntfile.jsを変更する必要がなくなりました。

```js
/**
 * before
 */
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-recess');
grunt.loadNpmTasks('grunt-sizediff');
grunt.loadNpmTasks('grunt-svgmin');
grunt.loadNpmTasks('grunt-styl');
grunt.loadNpmTasks('grunt-php');
grunt.loadNpmTasks('grunt-eslint');
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-bower-requirejs');

/**
 * after
 */
require('load-grunt-tasks')(grunt);
```

## 2. テンプレート

Gruntには[Underscore.js](http://underscorejs.org/#template)ライクなテンプレートエンジンが内包されています。

`<%=%>`とすることで、中のプロパティが純粋なJavascriptとして評価され、Gruntfile.js内に展開されます。

また、`<%=%>`とすることで、任意のJavascriptコードを実行させることも可能です。


Yoemanの中では、開発用のディレクトリとビルド用のディレクトリパスを使い分けてます。こちらも、タスク内でよく使う定義情報などはファイルの先頭で定義しておいて、テンプレートで挿入すると後々メンテナンスし易いですね。

```js

grunt.initConfig({

  yeoman: {
    // Configurable paths
    app: 'app',
    dist: 'dist'
  },

  copy: {
    dist: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%= yeoman.app %>', // <- ここ
        dest: '<%= yeoman.dist %>', // <- ここ
        src: [
          '*.{ico,png,txt}'
        ]
      }]
    }
  }

});
```

## 3. ファイル指定方法あれこれ

Gruntfile.jsでタスクを書いていると、ファイルのマッチング指定を書く部分がほとんどだと思います。

内部的にファイルのマッチングにはGlobと呼ばれる仕組みを使っており、[node-glob](https://github.com/isaacs/node-glob)と[minimatch](https://github.com/isaacs/minimatch)のライブラリが使われています。本当に様々なマッチング機能を提供しているのライブラリなのですが、今回はYeomanでよく使っている範囲で紹介します。

### 「*」

「/」パス以外の任意の文字列と一致します。次のように使われることがよくあります。

* フォルダ以下一致「vender/*」
* 任意のファイル一致「*.js」
* 任意のファイル名一致「.git*」

### 「{}」

中の文字をカンマ区切りで指定してor条件とします。次のように使われることがよくあります。

* 拡張子のor条件「*.{gif,jpeg,jpg,png,svg,webp}」

### 「`{,*/}`」って何？

YeomanのGruntfile.jsでよく見る「`{,*/}`」ですが、任意のフォルダ以下の1階層のみ一致という意味です。  
サブフォルダ指定する場合は通常「`**`」でいいのですが、パフォーマンス的な理由で1階層に止めたい場合は、「`{,*/}`」を使います。

この当たりも、使いこなすことで余計なファイルマッチングを書く必要がなくなります。（Glob形式が読めない人がいるという別の問題があるとは思いますがw）


## 4. 外部パラメータによるタスク分岐

Gruntタスクを呼び出す場合の次のように「`:`」以降の文字列をパラメータとして渡すことができ、Gruntタスク内で分岐処理を行うことができます。

```
grunt serve:dist
```

通常は`grunt.registerTask`の第2引数にタスクの文字列を配列で渡すのですが、ここにコールバック用のfunctionを渡すことで、タスク呼び出し時の処理をある程度柔軟に書くことができます。
とはいえ、可読性という観点では使いどころ微妙かな。。。と

```js
// 普通はこんな感じ
grunt.registerTask('serve', [
    'clean:server',
    'concurrent:server',
    'autoprefixer',
    'connect:livereload',
    'watch'
]);

// grunt serve:distと呼ぶことタスクの中で分岐ができる
grunt.registerTask('serve', function (target) {
  if (target === 'dist') {
    return grunt.task.run(['build', 'connect:dist:keepalive']);
  }

  grunt.task.run([
    'clean:server',
    'concurrent:server',
    'autoprefixer',
    'connect:livereload',
    'watch'
  ]);
});
```

## 5. 外部定義ファイルのインポート

Yoemanのgenerator界隈ではあまり見かけないのですが、知っていると便利な機能です。

GruntではjsonとYAMLの外部定義ファイルをインポートする機能が内包されています。次の例Grunt公式の例ですが、package.jsonから定義情報をインポートしています。

```js

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  uglify: {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    dist: {
      src: 'src/<%= pkg.name %>.js',
      dest: 'dist/<%= pkg.name %>.min.js'
    }
  }
});
```

## まとめ

Yeomanに学ぶモテるGruntfile.jsの書き方いかがだったでしょうか。

いままでオレオレGruntfile.jsを書いている方も、モテ期を謳歌しているYeomanが作るGruntfile.jsを読んで、もっとモテるGruntタスクを書いてみましょう！

**p.s**

いつの間にかgenerato-webappの`grunt server`がdeprecatedになっていることだし、時代の流れは早いものですね。  
こんな記事書いておいて、流行に流されるのも注意しないとなーっと思う今日この頃です。
