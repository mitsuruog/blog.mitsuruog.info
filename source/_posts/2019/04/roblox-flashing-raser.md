---
layout: post
title: "Robloxで点滅する罠を作る"
date: 2019-04-27 0:00:00 +900
comments: true
tags:
  - roblox
thumbnail: https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-flashing-raser-logo.png
---

Robloxで罠を作る方法です。
「罠」とはRobloxゲームの中でよく出てくるもので、これにプレイヤーが触れるとプレイヤーは死にます。

今回の罠は「レーザー」にします。

通常のレーザーの作り方と、点滅するレーザーの作り方を紹介します。

## レーザーを作成する

通常の罠の作り方は至ってシンプルです。Robloxの公式ページにチュートリアルがあるので、その通りやってみれば作れると思います。

- [Roblox: Coding Traps and Pickups](https://developer.roblox.com/articles/Creating-Traps-and-Pickups)

コードが次のようなものになります。`Laser`というPartを作成して、その中にScriptを作成してください。

```lua
local Laser = script.Parent

local function onPartTouch(otherPart)
  local touchObject = otherPart.Parent
  local humanoid = touchObject:FindFirstChildWhichIsA("Humanoid")
  if humanoid then
    humanoid.Health = 0
  end
end

Laser.Touched:Connect(onPartTouch)
```

`Laser.Touched`のイベントハンドラの中で、触れたものがプレイヤー(`Humanoid`)である場合、`Health`を0にします。
これが基本的な罠の作成方法です。

## レーザーを点滅させる

ではレーザーを点滅させてみましょう。

レーザーを点滅させるには`while`ループを作成して、この中で`Laser.Transparency`を使い、レーザーを見えたり隠れたりします。

```lua
local Laser = script.Parent

...

Laser.Touched:Connect(onPartTouch)

while true do
  Laser.Transparency = 1
  wait(3)
  Laser.Transparency = 0
  wait(3)
end
```

> `Laser.Touched`を`while`ループの後ろに移動しないでください。`while`ループは無限ループとなるため、ループの後ろのコードは実行されません。

今回は3秒間隔で点滅するようにしました。
ただし、今のままではレーザーが消灯している場合も作動してしまい、プレヤーが触れると死んでしまいます。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-flashing-raser1.gif 350 %}

うーん。なんでだろう。。。

## レーザーが点灯している時だけ罠が作動するようにする

レーザーが点灯している時だけ罠が作動するようにするためには、まず消灯時にレーザーとプレーヤーが衝突しないようにする必要があります。

`Laser.CanCollide`を使って、レーザーが消灯時にはプレイヤーが触れても通り抜けるようにする必要があります。`CanCollide = false`にした場合、プレイヤーが触れても通り抜けるようになります。

```lua
local Laser = script.Parent

...

Laser.Touched:Connect(onPartTouch)

while true do
  Laser.Transparency = 1
  Laser.CanCollide = false
  wait(3)
  Laser.Transparency = 0
  Laser.CanCollide = true
  wait(3)
end
```

しかし、このままではまだレーザーが消灯時にも罠が作動しています。
これは`Laser.Touched`イベントが`Laser.CanCollide = false`の場合でも発火してしまうためです。

これを避けるためには、イベントハンドラの中でレーザーの`CanCollide`の状態を判定して、点灯中の場合のみ作動させる必要があります。

```lua
local Laser = script.Parent

local function onPartTouch(otherPart)
  -- 点灯中のみ罠が作動するようにする
  if Laser.CanCollide == true then 
    local touchObject = otherPart.Parent
    local humanoid = touchObject:FindFirstChildWhichIsA("Humanoid")
    if humanoid then
      humanoid.Health = 0
    end
  end
end

Laser.Touched:Connect(onPartTouch)

...
```

これで罠が完成しました。

{% img https://s3-ap-northeast-1.amazonaws.com/blog-mitsuruog/images/2019/roblox-flashing-raser2.gif 350 %}

## まとめ

通常の罠の作り方と、点滅する罠の作り方でした。
少しカスタマイズしようとすると途端にわからなくなりますが、Robloxの公式サイトのAPIリファレンスはかなり親切に書いてあるので、こまったらAPIリファレンス読むようにします。

- [Roblox API REFERENCE: BasePart.CanCollide](https://developer.roblox.com/api-reference/property/BasePart/CanCollide)
