---
layout: post
title: "Robloxで簡単なコイン拾いゲームを作る"
date: 2019-05-04 0:00:00 +900
comments: true
tags:
  - roblox
  - ロブロックス
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-money-logo.png
---

今日はコインを拾うだけの簡単なゲームを作ってみましょう。

「**Debris(デブリ)**」というビルトインサービスを使って、ゲームフィールド上のランダムな場所にコインを発生させます。
DebrisサービスはRobloxの中でも非常に有用なもので、これを使うことでゲームの中でアイテムやモンスターなどを自由に発生させることができます。

- [Roblox Developers: Debris](https://developer.roblox.com/api-reference/class/Debris)

完成形のプロジェクトはこちらです。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-money0.png 350 %}

## LeaderBoradを作成する

まず、今プレイヤーが持っているコインの総量を表示するためのLeaderBoardを作成します。作り方はこちらを参照してください。

- [Robloxのリーダーボードを作成する | I am mitsuruog](https://blog.mitsuruog.info/2019/04/roblox-setup-leaderboard)

Scriptの名前は`LeaderBoardScript`として、ServiceScriptServiceの中に入れておきます。LeaderBoardに表示する名前は`Money`としておきましょう。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-money1.png 350 %}

## コインを作る

コインを作りましょう。Partの名前は`Money`とします。形はCylinderかBallを使えばいいと思います。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-money3.gif 350 %}

一度、Workspace上でコインのPartを完成させてから、ServiceStorageに移動します。
ServiceStorageとは、Robloxのオブジェクトの格納庫のようなものです。注意点としてはServer以外からはアクセスできません。

## コインをゲームフィールド上に発生させる

では、コインをゲームフィールド上に発生させましょう。ServiceScriptServiceの中に`MoneyDropperScript`を作成します。

最初にコインのPartと`Debris`サービスを呼び出して使えるようにしておきます。

```lua
local money = game:GetService("ServerStorage").Money
local Debris = game:GetService("Debris")
```

続いて`while`ループの中でコインを複製してランダムな位置に配置させます。

```lua
...

while(1) do
  wait()
  -- コインを1つ複製する
  local clonedMoney = money:clone()

  -- マップの中の縦横-500〜500の中のランダムな位置に発生するようにする
  local positionX = math.random(-500, 500)
  local positionZ = math.random(-500, 500)
  -- 注意）y軸を100としているのは空から落ちてくるようにするため
  clonedMoney.Position = Vector3.new(positionX, 100, positionZ)
  clonedMoney.Parent = workspace

  -- Debrisサービスに追加することでマップ上に姿を表す
  Debris:AddItem(clonedMoney, 20)
end
```

`Debris:AddItem`の第1引数にはマップ上に出現させるオブジェクトを、第2引数にはオブジェクトの生存期間を設定します。上の例では**コインは20秒後に自動的に消えます。**

テスト実行するとコインが空から降ってくるようになりました。Debrisサービス、超便利です。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-money4.gif 350 %}

## コインに触れたらお金が増えるようにする

最後にコインに触れたらプレイヤーのお金が増えるようにしましょう。
コインのPart(`Money`)の中にScriptを作成します。名前は`MoneyScript`にしておきます。

基本的には、コインに何か触れたら実行されるイベントハンドラを作成し、触れたものがプレイヤー(`Humanoid`)だったら処理を続行させます。

```lua
local money = script.Parent

local function onTouched(part)
  local humanoid = part.Parent:FindFirstChild("Humanoid")
  if humanoid then 
    -- ここに処理を書く
  end
end

money.Touched:Connect(onTouched)
```

では、コインに触れたプレイヤーのお金を増やして、回収されたコインを消滅させます。
お金はLeaderBoardの`Money`に格納されるので、LeaderBoardの値を更新する必要があります。

```lua
...

local function onTouched(part)
  local humanoid = part.Parent:FindFirstChild("Humanoid")
  if humanoid then 
    -- プレイヤー名を取得する
    local playerName = part.Parent.Name
    local player = game.Players:FindFirstChild(playerName)

    -- LeaderBoardの値を更新する
    player.leaderstats["Money"].Value = player.leaderstats["Money"].Value + 5
    
    -- コインを消滅させる
    money:Destroy()
  end
end

...
```

テスト実行すると、コインに触れるとお金が増えていきます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-money5.gif 350 %}

## まとめ

簡単なRobloxゲームの作り方でした。

面白いゲームを作るには、さらに何か面白い仕掛けが必要ですが、基本的な作り方は今日紹介した通りです。例えば、コインの中にプレミアムコインや爆弾を混ぜたりしたり、集めたお金でアイテムを購入できるようにすることで、もう少しゲームっぽくなると思います。