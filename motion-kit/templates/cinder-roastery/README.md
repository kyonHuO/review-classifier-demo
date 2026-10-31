# CINDER / 火と豆の観測

焙煎の境目を探すコーヒーの展示。温度ダイヤル、自作の豆、焙煎曲線と味指数がスライダーに応答します。

フォルダ単体利用。index.htmlを直接開くか静的HTTPサーバーで配信。ビルド・外部依存・ネット接続不要。コード、図形、同梱ラスタは本作のオリジナル。フォント非同梱、システムフォントを利用。MIT License。

架空デモ。送信・決済・注文・予約契約は未実装、ページ内プレビューのみ。Tab/Enter/Space、range矢印、dialog Escape・フォーカス復帰対応。動的reduced motion対応、?reduce=1で縮減経路、?t=0.15で操作fade固定。390/768/1440pxが検証対象。実機iPhone未確認。

編集箇所: script.jsのupdate/draw関数が焙煎度から温度・時間・味指数・曲線を作る簡略モデル。assets/beans.pngは自作の陰影豆。styles.cssのroast-dialで計器構成を編集。
