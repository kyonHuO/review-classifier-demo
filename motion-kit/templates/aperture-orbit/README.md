# APERTURE / 光の焦点室

光の道筋に触れる架空の光学展示。9つのレンズ一覧から焦点へ入り、波長と焦点距離を操作して光路を変えます。

フォルダ単体利用。index.htmlを直接開くか静的HTTPサーバーで配信。ビルド・外部依存・ネット接続不要。コード、図形、同梱ラスタは本作のオリジナル。フォント非同梱、システムフォントを利用。MIT License。

架空デモ。送信・決済・注文・予約契約は未実装、ページ内プレビューのみ。Tab/Enter/Space、range矢印、dialog Escape・フォーカス復帰対応。動的reduced motion対応、?reduce=1で縮減経路、?t=0.15で操作fade固定。390/768/1440pxが検証対象。実機iPhone未確認。

編集箇所: script.jsのlenses配列で9標本名・色・透過率を変更。draw関数は簡略な光路。styles.cssのmajor-lens/mini-lensが自作レンズ、index.htmlのlens-gridが一覧。
