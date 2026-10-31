# ATLAS / DIG

発掘区画を選び、土の下に眠る架空の遺物を読み解く展示。

## 使う

フォルダを丸ごとコピーし `index.html` をブラウザーで開きます。ビルド・APIキー・外部サービスは不要です。推奨確認はローカルHTTPサーバー（例: `python -m http.server 8000`）。

## 編集

- `index.html`: ブランド名、本文、操作ラベル。
- `style.css`: 先頭の配色と個別レイアウト、末尾の共通focus/reduced-motion。
- `app.js`: デモデータと状態更新。実送信・課金はありません。
- 初稿art.png: この作品のためにPillowで独自描画した図版。コードと同じMITで配布。画像生成ソースは制作証跡build-b.pyに保管。

## 権利と参照

コード・文章・図版は独自制作、MIT（LICENSE）。参考構造: StartBootstrap/startbootstrap-resume（MIT、実取得記録は今回reference-dossier.md）。取得したコード・写真・ブランド・文言は転用していません。OS搭載フォントのみ、フォントファイルは同梱していません。

## 検証範囲

390/768/1440pxで主workerが画面・操作を検証します。対応状況の最終記録は今回worker-result.md。iPhone等実機は未確認。reduced-motion設定で移動アニメーションを抑制。キーボードで各ボタン・入力を利用可能。

主図 excavation-generated.png は本作向けに画像生成ツールで作成した架空の発掘現場です。実在の出土品の写真や考古学的記録ではありません。art.pngは初稿の独自手続き図版です。どちらも本フォルダのMITで利用できます。

## 固定参照記録

- 参照リポジトリ: https://github.com/StartBootstrap/startbootstrap-resume
- 固定commit: `c6fbe5ef431642984d0f17960194632f20cf67bc`
- ライセンス根拠: https://github.com/StartBootstrap/startbootstrap-resume/blob/c6fbe5ef431642984d0f17960194632f20cf67bc/LICENSE
- 独自化: 経歴の索引/記録階層を、架空発掘現場の3×3区画と遺物記録へ転換。独自の俯瞰発掘図に座標ボタンを重ね、選択で遺物/深さ/時代を更新、再発掘で記録数を増やす。人物写真や左ナビは使わない。
- 取得原本は制作証跡のみ。コード・画像・原文は商品に含めていません。
