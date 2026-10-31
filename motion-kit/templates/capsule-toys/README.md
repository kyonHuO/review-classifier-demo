# CAPSULE / FORM

ハンドルを回して、独自の幾何玩具を集めるローカル抽選展示。

## 使う

フォルダを丸ごとコピーし `index.html` をブラウザーで開きます。ビルド・APIキー・外部サービスは不要です。推奨確認はローカルHTTPサーバー（例: `python -m http.server 8000`）。

## 編集

- `index.html`: ブランド名、本文、操作ラベル。
- `style.css`: 先頭の配色と個別レイアウト、末尾の共通focus/reduced-motion。
- `app.js`: デモデータと状態更新。実送信・課金はありません。
- ローカルPNG: この作品のためにPillowで独自描画した図版。コードと同じMITで配布。画像生成ソースは制作証跡build-b.pyに保管。

## 権利と参照

コード・文章・図版は独自制作、MIT（LICENSE）。参考構造: StartBootstrap/startbootstrap-portfolio-item（MIT、実取得記録は今回reference-dossier.md）。取得したコード・写真・ブランド・文言は転用していません。OS搭載フォントのみ、フォントファイルは同梱していません。

## 検証範囲

390/768/1440pxで主workerが画面・操作を検証します。対応状況の最終記録は今回worker-result.md。iPhone等実機は未確認。reduced-motion設定で移動アニメーションを抑制。キーボードで各ボタン・入力を利用可能。

## 固定参照記録

- 参照リポジトリ: https://github.com/StartBootstrap/startbootstrap-portfolio-item
- 固定commit: `26b9b7c965c6f0cf1612486981dfeea0177b46ec`
- ライセンス根拠: https://github.com/StartBootstrap/startbootstrap-portfolio-item/blob/26b9b7c965c6f0cf1612486981dfeea0177b46ec/LICENSE
- 独自化: 単品/仕様/関連シリーズの関係をカプセルトイのシリーズと画面内抽選へ。参照の二分割画像配置をコピーせず円形の機構を主役にする。
- 取得原本は制作証跡のみ。コード・画像・原文は商品に含めていません。
