# FRESCO / WALL

壁画のピンを選び、架空の街の散歩ルートを組み立てる体験。

## 使う

フォルダを丸ごとコピーし `index.html` をブラウザーで開きます。ビルド・APIキー・外部サービスは不要です。推奨確認はローカルHTTPサーバー（例: `python -m http.server 8000`）。

## 編集

- `index.html`: ブランド名、本文、操作ラベル。
- `style.css`: 先頭の配色と個別レイアウト、末尾の共通focus/reduced-motion。
- `app.js`: デモデータと状態更新。実送信・課金はありません。
- ローカルPNG: この作品のためにPillowで独自描画した図版。コードと同じMITで配布。画像生成ソースは制作証跡build-b.pyに保管。

## 権利と参照

コード・文章・図版は独自制作、MIT（LICENSE）。参考構造: StartBootstrap/startbootstrap-bare（MIT、実取得記録は今回reference-dossier.md）。取得したコード・写真・ブランド・文言は転用していません。OS搭載フォントのみ、フォントファイルは同梱していません。

## 検証範囲

390/768/1440pxで主workerが画面・操作を検証します。対応状況の最終記録は今回worker-result.md。iPhone等実機は未確認。reduced-motion設定で移動アニメーションを抑制。キーボードで各ボタン・入力を利用可能。

## 固定参照記録

- 参照リポジトリ: https://github.com/StartBootstrap/startbootstrap-bare
- 固定commit: `9e17b3746e253e04eef809c9b5c8a303cb98ca13`
- ライセンス根拠: https://github.com/StartBootstrap/startbootstrap-bare/blob/9e17b3746e253e04eef809c9b5c8a303cb98ca13/LICENSE
- 独自化: 最小の外枠だけ参考に、架空の街の独自地図/壁画4点/選択pin/散歩ルートの画面へ全面的に変更。作品選択と重複なしルート追加が入力で、元の白い中央見出し構図は用いない。
- 取得原本は制作証跡のみ。コード・画像・原文は商品に含めていません。
