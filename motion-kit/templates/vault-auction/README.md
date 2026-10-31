# VAULT / 古いものの新しい時間

架空の古道具ロットを切り替え、端末内ウォッチリストに保存する内覧室。

`index.html` をブラウザーで開きます。ビルド不要。HTML/CSS/JavaScript独立、外部通信なし。文言・データは架空です。

## 編集と操作

`index.html`は文章と構造、`styles.css`は色・レイアウト、`script.js`はデータ・入力連動を編集します。Tabで操作へ移動、ボタンはEnter/Space、rangeは矢印キーで調整。減速設定では移動演出なし。Canvasが使えなくてもDOMの操作・情報を保持。実機iPhone未検証。

## 権利

コードとアートワークは独自制作。MIT。媒体: Original Pillow raster clock/radio/vase illustrations in assets/*.png, no external sources。外部サイトのブランド/原文/画像/コードを転用していません。参照調査の詳細はコレクションのライセンス台帳へ。

## この作例の使い方

LOT01–03を選択して静物・名称・素材・年代・参考評価額を表示。ウォッチボタンでlocalStorageの `vault-watches` にロット番号だけ保存し、WATCHEDで一覧。保存拒否時も現在の画面内で操作継続。削除は各品のウォッチ解除かブラウザサイトデータ削除。氏名等は扱わず外部送信なし。入札・購入不可。

## 構造研究の出典

[startbootstrap-shop-homepage](https://github.com/StartBootstrap/startbootstrap-shop-homepage)、commit `fb3a49020b840cdbcb0a588fdbda8fc019710a6f`。[MITライセンスの固定版](https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/fb3a49020b840cdbcb0a588fdbda8fc019710a6f/LICENSE)。WebCloneで取得した原本は非公開の作業証跡にのみ保管。参照した情報構造: 短い中央題字の下に均等な商品棚。価格、値引き、評価、選択ボタンを同じ位置に配置。

独自化: 静的な商品棚を競売ロットの比較とロット詳細へ変更。値引き/星をコピーせず、架空の見積・時刻・選択状態で密度を作る。 本作に参照コード・画像・文言・書体を取り込んでいません。WebCloneツールのApache-2.0と取得対象のMITを別に確認しています。
