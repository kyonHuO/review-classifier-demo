# Motion Kit Field Collection 1.0.0

既存10作品に追加した、用途と操作が異なる新規10サイトです。各フォルダは単独のHTML/CSS/JavaScript、独自素材、個別編集README、MIT LICENSEを含みます。

| サイト | 用途・操作 | 公開デモ |
| --- | --- | --- |
| TIDAL | 海洋観測。地点・深度・再走査と点群/水塊データ | [潮間観測室](https://kyonhuo.github.io/nagiport-motion-kit/templates/tidal-console/) |
| GROOVE CELLAR | レコード。ジャンル絞込、盤と曲目の選択 | [音の棚](https://kyonhuo.github.io/nagiport-motion-kit/templates/groove-cellar/) |
| RIDGE EXPEDITION | 遠征計画。全面地形、経路・進行地点 | [稜線の遠征図](https://kyonhuo.github.io/nagiport-motion-kit/templates/ridge-expedition/) |
| MARGIN PRESS | 出版。号ごとの表紙・目次、記事閲覧 | [余白の雑誌](https://kyonhuo.github.io/nagiport-motion-kit/templates/margin-press/) |
| NOCTURNE | 映画。作品・日付・上映時刻、座席プレビュー | [夜の上映室](https://kyonhuo.github.io/nagiport-motion-kit/templates/nocturne-cinema/) |
| TORQUE | 自転車。サイズ・色・身長と仕様表示 | [フレーム設計室](https://kyonhuo.github.io/nagiport-motion-kit/templates/torque-cycle/) |
| HERBARIUM | 植物。葉脈標本・観察光・観測記録 | [葉の観測室](https://kyonhuo.github.io/nagiport-motion-kit/templates/herbarium-lab/) |
| CINDER | 焙煎。温度ダイヤル・曲線・味指数 | [火と豆の観測](https://kyonhuo.github.io/nagiport-motion-kit/templates/cinder-roastery/) |
| GLYPH | 文字展示。入力・太さ・字間・CSS表示 | [文字の鋳造室](https://kyonhuo.github.io/nagiport-motion-kit/templates/glyph-foundry/) |
| APERTURE ORBIT | 光学。9レンズから焦点へ、波長・焦点距離 | [光の焦点室](https://kyonhuo.github.io/nagiport-motion-kit/templates/aperture-orbit/) |

## 開く・編集する

使うフォルダを丸ごと複製し、index.htmlを開きます。HTTPなら `python -m http.server 8080 --bind 127.0.0.1`。ビルド、APIキー、外部CDN、外部フォント、npm、サーバーAPIは不要です。

HTMLは文章・ラベル・本文構造、CSSは色・書体・構図・レスポンシブ、JavaScriptは固有データと入力状態です。個別READMEにデータ配列・素材名などの編集箇所を記載しています。assets/preview.webpは実画面からの一覧用画像です。

すべて架空のブランド・データ・作品・価格等を使います。取引、送信、予約、決済、外部データ保存は行いません。観測値や設計値はサンプルで、実用の海洋/登山/光学/焙煎/車体適合の助言ではありません。表示内の状態は再読込で初期化されます。

## 権利と出典

独自コード、文章、手続き生成したラスター、CSSアート、Canvas描画は各フォルダのMIT Licenseで商用利用・改変・再配布・再販売できます。著作権表示と許諾文を保持してください。フォントバイナリ、写真素材、第三者ライブラリは同梱せず、端末のシステムフォントを参照します。端末で書体と字形に差があります。

[WebClone](https://github.com/ruslanmv/webclone) commit `a70b7e02eae3bae6f5e0b3d1c124e219c05c2741`（Apache-2.0）を隔離環境に導入し、CLIとPython APIで調査取得に利用しました。StartBootstrapのAgency / Creative / Freelancer / Grayscale / SB Admin 2 / Clean Blog / Landing Pageと、CodropsのGridLayoutAnimation / ScrollBasedLayoutAnimations / OnScrollTypographyAnimationsの固定コミットMITを確認し、情報階層・一覧から詳細への遷移・文字の扱い等を研究しました。

WebCloneは7ページ・72アセットの取得に成功。Codropsの3デモはHTTP 403のため回避せず、公式GitHubの公開ソースを代替取得しました。原本、ロゴ、写真、文言、外部フォント、依存コードは本作品へ転用していません。ツールのライセンスは取得サイトの素材の再販売権を付与しません。研究用の原本と取得記録は公開repo・商品ZIPに含めていません。

## 制作時の確認範囲

2026-10-30、インストール済みChrome 156.0.8078.48のヘッドレス実描画で確認しました。

- 390/768/1440px×10サイトの全30条件をスクリーンショット取得・主workerが目視。重なり、読みにくい注記、モバイルヘッダー、字形の入力幅等を修正して該当条件を再確認。
- 1086項目の主要操作・計算/状態・内部リンク・画像・キーボード・dialog/Escape/フォーカス復帰・表示中のreduced motion切替を確認。
- 全30条件でページの横はみ出し、JavaScriptエラー、失敗リクエスト、壊れた画像、外部通信、GET以外のリクエストは0件。
- Canvas無効とJavaScript無効を各10件で確認。Canvasが使えなくても本文・入力状態を保持し、JavaScript無効では静的本文と素材を読める状態を確認。JS無効で対話操作が動くという意味ではありません。
- GLYPHの空文字、2文字、24文字、日本語/英数、HTMLに似た入力、クリップボード拒否時の手動コピーと、全10フォルダのfile://起動を追加確認。
- 継続的な自動描画や長い自動再生は使わず、入力やサイズ変更時に反応。大きな移動を必要とせず、縮減設定では120ms等の短い透明度の反応を残します。

Moli 1.1.14はCanvasのcreateRadialGradientが未実装だったため、描画検証はChromeのローカルCLIへ切り替えました。OpenBot browserはこの実行環境では利用できず、他のブラウザープラグインは使用していません。Three.js/GSAP/WebGPU/HTML-in-Canvasには依存しません。

実機Safari/iPhone/Android、スクリーンリーダーの実機確認、アクセシビリティ適合認証、端末FPS/消費電力の測定は未実施です。全端末互換性や実機性能を保証するものではありません。

販売条件と支援条件は未確定。MIT公開の利用権を取り消す販売条件は設けません。販売用ZIP、導入ガイド、FAQ、法的草案、未決事項はローカルの販売準備資料として別に整理し、注文/決済を開始していません。
