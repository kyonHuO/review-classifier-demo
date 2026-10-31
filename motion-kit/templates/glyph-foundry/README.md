# GLYPH / 文字の鋳造室

文字自体を主役にする書体の実験台。入力、太さ、字間を試し、組見本から自分の一行へ切り替えられます。

フォルダ単体利用。index.htmlを直接開くか静的HTTPサーバーで配信。ビルド・外部依存・ネット接続不要。コード、図形、同梱ラスタは本作のオリジナル。フォント非同梱、システムフォントを利用。MIT License。

架空デモ。送信・決済・注文・予約契約は未実装、ページ内プレビューのみ。Tab/Enter/Space、range矢印、dialog Escape・フォーカス復帰対応。動的reduced motion対応、?reduce=1で縮減経路、?t=0.15で操作fade固定。390/768/1440pxが検証対象。実機iPhone未確認。

編集箇所: index.htmlのdata-text/data-sampleで組見本を編集。script.jsのupdateで入力とウェイト/字間の反映、CSS出力を変更。styles.cssのletter-display/ghost-letterが字形の展示舞台。
