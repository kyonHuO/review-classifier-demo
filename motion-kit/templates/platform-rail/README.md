# PLATFORM / 次の列車で

路線と出発時刻で列車を絞り込む、タイポグラフィ中心の架空時刻板。

`index.html` をブラウザーで開きます。ビルド不要。HTML/CSS/JavaScript独立、外部通信なし。文言・データは架空です。

## 編集と操作

`index.html`は文章と構造、`styles.css`は色・レイアウト、`script.js`はデータ・入力連動を編集します。Tabで操作へ移動、ボタンはEnter/Space、rangeは矢印キーで調整。減速設定では移動演出なし。Canvasが使えなくてもDOMの操作・情報を保持。実機iPhone未検証。

## 権利

コードとアートワークは独自制作。MIT。媒体: Original CSS and Canvas artwork; installed font stacks。外部サイトのブランド/原文/画像/コードを転用していません。参照調査の詳細はコレクションのライセンス台帳へ。

## この作例の使い方

全路線/海岸/丘陵/環状で絞り込み、時刻selectで出発時刻の下限を変更。各行が詳細dialogへのボタン。9時以降は空状態を表示。すべて架空の時刻と路線、実際の旅行には使えません。

## 構造研究の出典

[startbootstrap-scrolling-nav](https://github.com/StartBootstrap/startbootstrap-scrolling-nav)、commit `45ee8f6a5503ec6d4b41ec86cf5be2c930b606df`。[MITライセンスの固定版](https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/45ee8f6a5503ec6d4b41ec86cf5be2c930b606df/LICENSE)。WebCloneで取得した原本は非公開の作業証跡にのみ保管。参照した情報構造: 固定上ナビ、色の強い短い導入、背景色を変えた縦3節。

独自化: 節の位置と現在地の関係を鉄道の路線/駅/発車案内に変換。青いヒーローや説明段落の列を再利用しない。 本作に参照コード・画像・文言・書体を取り込んでいません。WebCloneツールのApache-2.0と取得対象のMITを別に確認しています。
