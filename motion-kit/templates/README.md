# Nagiport Motion Kit — 20 site templates

既存10サイトにField Collectionの独立10サイトを追加しました。新規10件の用途・操作・ライセンス・検証範囲は[FIELD-COLLECTION.md](./FIELD-COLLECTION.md)をご覧ください。

## 既存10サイト（前回制作分）

2026-10-30に全面再制作した、独立型HTML/CSS/JavaScriptサイト集です。Nagiport本体の口コミ・SNS分類サービスとは別の商品です。

[プレビュー一覧](https://kyonhuo.github.io/nagiport-motion-kit/templates/)

| テンプレート                                | 用途                         | 画面と主な操作                                                                                             |
| ------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [EMBER TABLE](./ember-table/README.md)      | 飲食・レストラン             | [薪火のCanvasとコース選択](https://kyonhuo.github.io/nagiport-motion-kit/templates/ember-table/)           |
| [lune ritual](./lune-ritual/README.md)      | 美容・スパ                   | [真珠色の立体と施術の選択](https://kyonhuo.github.io/nagiport-motion-kit/templates/lune-ritual/)           |
| [STILLWATER](./stillwater-lodge/README.md)  | 宿泊・自然のロッジ           | [朝夕が変わる湖と滞在選択](https://kyonhuo.github.io/nagiport-motion-kit/templates/stillwater-lodge/)      |
| [FORM / atelier](./form-atelier/README.md)  | 建築・設計事務所             | [建築模型、作品と平面・透視の切替](https://kyonhuo.github.io/nagiport-motion-kit/templates/form-atelier/)  |
| [habitat.](./habitat-living/README.md)      | 不動産・住まい探し           | [立体間取り、条件とお気に入り](https://kyonhuo.github.io/nagiport-motion-kit/templates/habitat-living/)    |
| [ORBIT](./orbit-bottle/README.md)           | EC・プロダクト             | [ボトルの色・構造・数量と合計](https://kyonhuo.github.io/nagiport-motion-kit/templates/orbit-bottle/)      |
| [pulse](./pulse-workspace/README.md)        | SaaS・チーム業務ツール       | [タスクと円形メーターの連動](https://kyonhuo.github.io/nagiport-motion-kit/templates/pulse-workspace/)     |
| [MIO / OBJECTS](./mio-objects/README.md)    | クリエイター・ポートフォリオ | [3つの立体作品を選ぶ展示](https://kyonhuo.github.io/nagiport-motion-kit/templates/mio-objects/)            |
| [SIGNAL / 27](./signal-festival/README.md)  | イベント・カンファレンス     | [周波数に応答する波形と日程切替](https://kyonhuo.github.io/nagiport-motion-kit/templates/signal-festival/) |
| [fieldnotes](./fieldnotes-school/README.md) | 教育・クリエイティブスクール | [形・色・構図の実験と講座選択](https://kyonhuo.github.io/nagiport-motion-kit/templates/fieldnotes-school/) |

## 利用・編集

各フォルダを丸ごと複製し、`index.html`を開いてください。HTTPプレビューなら `python -m http.server 8080`。ビルド、外部CDN、外部フォント、サーバーAPI、npmは不要です。

- `index.html`：本文とセマンティックな操作要素。
- `styles.css`：配色変数、基本UI、そのサイト独自の構図とレスポンシブ設定。
- `script.js`：メニュー・dialogと、サイト固有のデータと状態処理。
- `assets/preview.webp`：今回の実画面から作成した一覧用プレビュー。
- `assets/illustration.svg`：互換性とfaviconのため保持した旧作の自作素材。新しいヒーローには使いません。
- `README.md`、`LICENSE.txt`：個別の編集ガイドとMIT License。

## 素材・出典・ライセンス

新しいコード、文章、CSS立体表現、Canvas描画は各テンプレート用のオリジナルです。写真・動画・外部ライブラリ・フォントファイルは同梱していません。端末内のImpact、Arial Black、Georgia、システムの日本語書体などを使用するため、端末による書体差はあります。

新作10サイトのコード・文章・自作素材は同梱のMIT Licenseで商用利用、改変、再配布、再販売が可能です。ライセンスを同梱してください。既存作品や別ブランチの作品にこのライセンスを適用するものではありません。

## デモと検証

すべて架空のブランド、施設、人物、商品、価格です。送信、予約、注文、問い合わせ受付、決済は行いません。お気に入りやタスクの状態はメモリ内に留まり、再読込で初期化されます。

2026-10-30、ローカルのChrome 156.0.8078.48で確認しました。

- 390 / 768 / 1440pxの全30条件でスクリーンショットを取得し、実画像を視認。ページ全体の横はみ出し、JavaScriptエラー、壊れた画像は0件。
- 主要な選択状態、数量・料金計算、タスク、物件の絞り込み、生成作品の変化を検証。
- キーボード操作、メニューのEscape、dialogのクリック・Enter・Escape、閉じた後のフォーカス復帰を確認。
- reduced motionを表示中に切り替え、全30条件で操作を再確認。大きな移動・回転の補間を止め、短い色と透明度のフィードバックは保持。
- Canvasを無効にした4サイトでも本文・選択・デモ操作を維持。描画は初期表示、操作、サイズ変更時だけで、継続的な自動描画はありません。
- 884項目のブラウザー検証を通過。操作中の外部通信・送信は0件。

実機Safari / iPhone / Android、スクリーンリーダーによる認証、実機でのFPS・消費電力の測定は未実施です。標準DOM・CSS・Canvas 2Dで構成し、WebGPUやHTML-in-Canvasなどの実験機能には依存しません。

Moli 1.1.14は標準Canvas APIの`createRadialGradient`が未実装だったため、最終検証はインストール済みChromeへ切り替えました。OpenBot browserは今回の実行環境で利用できず、他のブラウザープラグインは使用していません。

GitHub Pagesの既存方式`main /docs`と、10サイトすべてのURLを維持しています。既存7作例、variantsの15案、別ブランチの作品は変更していません。


<!-- VOLUME START -->

## 追加20作 — Volume Collection 1.0.0

既存20作品を保持し、新たに20の用途・構図・操作を追加しました。全40作品は[index.html](index.html)、今回分の個別URL・権利・確認範囲は[VOLUME-COLLECTION.md](VOLUME-COLLECTION.md)を参照してください。
<!-- VOLUME END -->
