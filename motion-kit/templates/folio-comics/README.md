# FOLIO / COMICS

赤い立方体の小さな旅を読む、章切替としおりのある抽象コミック。

## 使う

フォルダを丸ごとコピーし `index.html` をブラウザーで開きます。ビルド・APIキー・外部サービスは不要です。推奨確認はローカルHTTPサーバー（例: `python -m http.server 8000`）。

## 編集

- `index.html`: ブランド名、本文、操作ラベル。
- `style.css`: 先頭の配色と個別レイアウト、末尾の共通focus/reduced-motion。
- `app.js`: デモデータと状態更新。実送信・課金はありません。
- ローカルPNG: この作品のためにPillowで独自描画した図版。コードと同じMITで配布。画像生成ソースは制作証跡build-b.pyに保管。

## 権利と参照

コード・文章・図版は独自制作、MIT（LICENSE）。参考構造: StartBootstrap/startbootstrap-blog-home（MIT、実取得記録は今回reference-dossier.md）。取得したコード・写真・ブランド・文言は転用していません。OS搭載フォントのみ、フォントファイルは同梱していません。

## 検証範囲

390/768/1440pxで主workerが画面・操作を検証します。対応状況の最終記録は今回worker-result.md。iPhone等実機は未確認。reduced-motion設定で移動アニメーションを抑制。キーボードで各ボタン・入力を利用可能。

## 固定参照記録

- 参照リポジトリ: https://github.com/StartBootstrap/startbootstrap-blog-home
- 固定commit: `422704554a5a0c62d8818a247f3a741cf6831ff3`
- ライセンス根拠: https://github.com/StartBootstrap/startbootstrap-blog-home/blob/422704554a5a0c62d8818a247f3a741cf6831ff3/LICENSE
- 独自化: 注目/連載/号の階層を漫画の閲覧棚へ。独自のコマと強い吹き出し組版、画面内での3章の切替の選択を追加する。
- 取得原本は制作証跡のみ。コード・画像・原文は商品に含めていません。

## しおりの保存と削除

しおりボタンは端末内の localStorage キー folio-volume-chapter に章番号（0〜2）だけを保存します。氏名・閲覧履歴・時刻・作品本文は保存せず、外部に送信しません。同じブラウザーで再び開くと保存した章から表示します。保存できない環境でも読書・章切替は動作します。

削除するにはブラウザーのこのサイトの保存データを削除するか、開発者ツールの Application / Storage / Local Storage で folio-volume-chapter を削除します。他のサイトデータを保ちたい場合はこのキーだけを削除してください。削除後にページを再読込すると第1章から始まります。
