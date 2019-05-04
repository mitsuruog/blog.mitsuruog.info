---
layout: post
title: "Robloxのリーダーボードを作成する"
date: 2019-04-20 0:00:00 +900
comments: true
tags:
  - roblox
  - ロブロックス
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox.png
---

今日は唐突に[Roblox](https://www.roblox.com)でのゲームプログラミングの話です。

## Roblox!?

> 子供たちがレゴブロックのような感覚で自作のゲームを作り、公開できるプラットフォームが「Roblox（ロブロックス）」だ。
> - [5000万人の子供が遊ぶゲーム開発プラットフォーム「Roblox」](https://forbesjapan.com/articles/detail/20288)

娘と週末にRobloxで遊ぶことがあり、遊んでいる時にふっと「自分でゲームを作って公開できる」と言ったことがありました。
その時、あまり娘は理解していなかったようだったので、ちょっとどういうことか理解させて驚かせてやろうかと思い、試しに1つ作って娘に見せてみたら、目玉が飛び出るくらい興奮して、早速自分も作りたいという話になりました。
(たぶん、お父さんですら作れるなら、自分にもできると思っている。。。)

自分もそこまでくわしくないので、それ以来こっそり教えられるようにRobloxでのプログラミングについて調べているという次第です。

ちなみにRobloxでは、[Lua](https://www.lua.org/start.html)言語と、[Roblox Studio](https://www.roblox.com/create)を使って、Robloxが提供するAPIを使いながらゲームを作成します。

今回はリーダーボードを作成方法についての紹介です。

## リーダーボードとは

リーダーボード(LeaderBoard)とは、ゲームの中でプレイヤーの名前や得点などを表示するものです。
画面の一番見やすい場所に置いてあり、ロブロックスでは画面の右上に表示されています。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-leaderboard1.png 350 %}


## リーダーボードの作成

ではリーダーボードを作成します。
まず最初にRoblox Studioで新しいプロジェクトを作成してきます。

### リーダーボードのセットアップ

まず、右側のExplorerの中の**ServerScriptService**の中に新しいScriptを作成します。名前は`PlayerSetup`としておきます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-leaderboard2.png 350 %}

そのScriptの中に`onPlayerJoin`という関数を作成します。この関数は`player`というパラメータを受け取ります。

```lua
local function onPlayerJoin(player)

end
```

次に`onPlayerJoin`の中に`leaderStats`という名前の変数を作成して、`Folder`のインスタンスを設定しておきます。このフォルダーの中に全てのプレイヤーの情報が保存されます。

```lua
local function onPlayerJoin(player)
  local leaderStats = Instance.new("Folder")
end
```

先ほどの変数`leaderStats`に`Name`を設定します。`Name`は「**leaderstats**」としてください。
間違えるとリーダーボードは作成されません。そして`leaderStats`の`Parent`に`player`を設定します。

```lua
local function onPlayerJoin(player)
  local leaderStats = Instance.new("Folder")
  leaderStats.Name = "leaderstats"
  leaderStats.Parent = player
end
```

最後に`onPlayerJoin`をこのゲームと接続します。これで誰かがこのゲームに参加してきた時に、`onPlayerJoin`が実行されます。

```lua
local function onPlayerJoin(player)
  local leaderStats = Instance.new("Folder")
  leaderStats.Name = "leaderstats"
  leaderStats.Parent = player
end

game.Players.PlayerAdded:Connect(onPlayerJoin)
```

これでリーダーボードのセットアップは完了です。

### リーダーボードにプレイヤーの情報を表示する

次に、リーダーボードにプレイヤーが持っているお金(Gold)を表示してみます。

このお金を記憶するために`IntValue`という数値を記録するための変数を使います。
`onPlayerJoin`関数の中で、`gold`という名前の変数を作成し、`IntValue`のインスタンスを設定しておきます。

```lua
local function onPlayerJoin(player)
  local leaderStats = Instance.new("Folder")
  leaderStats.Name = "leaderstats"
  leaderStats.Parent = player
  
  local gold = Instance.new("IntValue")
end
```

リーダーボードに表示する名前を`Name`に設定します。今回の例では、「**Gold**」と表示されるはずです。

```lua
local function onPlayerJoin(player)
  local leaderStats = Instance.new("Folder")
  leaderStats.Name = "leaderstats"
  leaderStats.Parent = player
  
  local gold = Instance.new("IntValue")
  gold.Name = "Gold"
end
```

次に最初に持っているお金を`Value`に設定します。最初は「0Gold」にしておきましょう。

```lua
local function onPlayerJoin(player)
  local leaderStats = Instance.new("Folder")
  leaderStats.Name = "leaderstats"
  leaderStats.Parent = player
  
  local gold = Instance.new("IntValue")
  gold.Name = "Gold"
  gold.Value = 0
end
```

最後にgoldの`Parent`を`leaderStats`に設定します。

```lua
local function onPlayerJoin(player)
  local leaderStats = Instance.new("Folder")
  leaderStats.Name = "leaderstats"
  leaderStats.Parent = player
  
  local gold = Instance.new("IntValue")
  gold.Name = "Gold"
  gold.Value = 0
  gold.Parent = leaderStats
end
```

これで画面の右上にリーダーボードが表示されるようになりました。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-leaderboard3.png 350 %}

## まとめ

ほぼ、ここの内容の翻訳です。

- [In-Game Leaderboards](https://developer.roblox.com/articles/Leaderboards)

Robloxのプログラミング情報は英語でもほとんど手に入らないので辛いですね。。。

まだ、わからないことが多いですが、娘に教えられるよう頑張って情報集めてみます。