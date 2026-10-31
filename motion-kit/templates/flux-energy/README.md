# FLUX / 街をめぐる電気

時間と天候で太陽光・需要・蓄電・系統電力の流れが変わる架空マイクログリッド。

`index.html` をブラウザーで開きます。ビルド不要。HTML/CSS/JavaScript独立、外部通信なし。文言・データは架空です。

## 編集と操作

`index.html`は文章と構造、`styles.css`は色・レイアウト、`script.js`はデータ・入力連動を編集します。Tabで操作へ移動、ボタンはEnter/Space、rangeは矢印キーで調整。減速設定では移動演出なし。Canvasが使えなくてもDOMの操作・情報を保持。実機iPhone未検証。

## 権利

コードとアートワークは独自制作。MIT。媒体: Original CSS and Canvas artwork; installed font stacks。外部サイトのブランド/原文/画像/コードを転用していません。参照調査の詳細はコレクションのライセンス台帳へ。

## この作例の使い方

時刻0–23時と晴れ/曇りで発電・需要・蓄電・受電送電・自家供給率を更新。正弦波日照と簡易需要曲線による架空モデル。発電予測や料金/投資の意思決定には使えません。Canvasは線の視覚表現のみで数値はDOMに保持。

## 構造研究の出典

[startbootstrap-sb-admin](https://github.com/StartBootstrap/startbootstrap-sb-admin)、commit `adde34b9616b9840c4da756323131f59ac445090`。[MITライセンスの固定版](https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/adde34b9616b9840c4da756323131f59ac445090/LICENSE)。WebCloneで取得した原本は非公開の作業証跡にのみ保管。参照した情報構造: 暗い縦ナビ、上部検索、4色のKPI、面/棒グラフ、表の順に密度を増す管理画面。

独自化: KPI/主副グラフの階層を電力需給・蓄電の架空コンソールへ。グラフ/表のデータ・コード・配色・依存は取り込まない。 本作に参照コード・画像・文言・書体を取り込んでいません。WebCloneツールのApache-2.0と取得対象のMITを別に確認しています。
