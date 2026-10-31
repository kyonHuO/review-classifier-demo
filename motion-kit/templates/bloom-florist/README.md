# BLOOM / 花を、束ねる

独自花束イラストと数量・配色が連動する架空フローリストの構成ラボ。

`index.html` をブラウザーで開きます。ビルド不要。HTML/CSS/JavaScript独立、外部通信なし。文言・データは架空です。

## 編集と操作

`index.html`は文章と構造、`styles.css`は色・レイアウト、`script.js`はデータ・入力連動を編集します。Tabで操作へ移動、ボタンはEnter/Space、rangeは矢印キーで調整。減速設定では移動演出なし。Canvasが使えなくてもDOMの操作・情報を保持。実機iPhone未検証。

## 権利

コードとアートワークは独自制作。MIT。媒体: Original Pillow layered petal bouquet illustrations, assets/bouquet-0.png through bouquet-2.png。外部サイトのブランド/原文/画像/コードを転用していません。参照調査の詳細はコレクションのライセンス台帳へ。

## この作例の使い方

ROSE / SUN / MAUVEの配色、3品種の本数を各0–12本で増減。仮単価の参考合計と本数を更新。画像は本数に一致する写真ではなく構成イメージ。全0本では画像を薄く表示。注文・税込料金の提示や決済はありません。

## 構造研究の出典

[startbootstrap-business-casual](https://github.com/StartBootstrap/startbootstrap-business-casual)、commit `b6f928934386a54e08c2e7f40ebd9e4d7510bba4`。[MITライセンスの固定版](https://github.com/StartBootstrap/startbootstrap-business-casual/blob/b6f928934386a54e08c2e7f40ebd9e4d7510bba4/LICENSE)。WebCloneで取得した原本は非公開の作業証跡にのみ保管。参照した情報構造: 写真の前へクリーム色の説明枠を重ね、上部に広い題字と横ナビ。下段は色面内の約束文。

独自化: 写真枠と説明枠の重層という関係だけを使い、花の組み合わせ・花束の編集へ。茶系/コーヒー写真/文言を転用しない。 本作に参照コード・画像・文言・書体を取り込んでいません。WebCloneツールのApache-2.0と取得対象のMITを別に確認しています。

## 主図の仕上げ

assets/bouquet-generated.pngはこの架空ブランド向けに画像生成ツールで作成した透明背景の花束です。色選択ではCSS hue-rotateで色調を変えます。花の本数に一致した商品写真や実際の受注見本ではありません。旧bouquet-0/1/2.pngは初稿の独自手続き図版として同梱。新画像も本フォルダMITで利用可能です。
