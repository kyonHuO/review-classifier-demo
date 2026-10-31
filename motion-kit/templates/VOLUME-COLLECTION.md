# Motion Kit Volume Collection 1.0.0

既存20作を保ち、用途・構図・操作が異なる新規20作を追加しました。各フォルダは独立HTML/CSS/JS、ローカル素材、編集README、MIT Licenseを含みます。ビルド、外部CDN、APIキー、サーバーAPIは不要です。

|名称|用途|直接公開URL|
|---|---|---|
|VECTOR AIR|航空運航シミュレーター|[vector-air](https://kyonhuo.github.io/nagiport-motion-kit/templates/vector-air/)|
|LOOM / 色を織る|織物配色ラボ|[loom-textile](https://kyonhuo.github.io/nagiport-motion-kit/templates/loom-textile/)|
|VAULT / 古いものの新しい時間|ヴィンテージ内覧室|[vault-auction](https://kyonhuo.github.io/nagiport-motion-kit/templates/vault-auction/)|
|RALLY CLUB|卓球スコアボード|[rally-club](https://kyonhuo.github.io/nagiport-motion-kit/templates/rally-club/)|
|PLATFORM / 次の列車で|鉄道出発案内|[platform-rail](https://kyonhuo.github.io/nagiport-motion-kit/templates/platform-rail/)|
|PRISM / 光のかたち|ガラス彫刻展|[prism-glass](https://kyonhuo.github.io/nagiport-motion-kit/templates/prism-glass/)|
|SWITCH / その一打を、自分らしく|キーボード構成ラボ|[switch-keyboard](https://kyonhuo.github.io/nagiport-motion-kit/templates/switch-keyboard/)|
|BLOOM / 花を、束ねる|花束構成ラボ|[bloom-florist](https://kyonhuo.github.io/nagiport-motion-kit/templates/bloom-florist/)|
|FLUX / 街をめぐる電気|地域電力シミュレーター|[flux-energy](https://kyonhuo.github.io/nagiport-motion-kit/templates/flux-energy/)|
|DOCKET / 話すための時間|相談日程プレビュー|[docket-court](https://kyonhuo.github.io/nagiport-motion-kit/templates/docket-court/)|
|ATLAS / DIG|考古学・発掘区画の閲覧|[atlas-dig](https://kyonhuo.github.io/nagiport-motion-kit/templates/atlas-dig/)|
|CAPSULE / FORM|幾何玩具・コレクション|[capsule-toys](https://kyonhuo.github.io/nagiport-motion-kit/templates/capsule-toys/)|
|NEON / ARCADE|ゲーム・スコア記録|[neon-arcade](https://kyonhuo.github.io/nagiport-motion-kit/templates/neon-arcade/)|
|TESSERA|住空間・タイルパターン設計|[tessera-mosaic](https://kyonhuo.github.io/nagiport-motion-kit/templates/tessera-mosaic/)|
|FRESCO / WALL|アート・架空の街の壁画ルート|[fresco-wall](https://kyonhuo.github.io/nagiport-motion-kit/templates/fresco-wall/)|
|FOLIO / COMICS|出版・オリジナルコミック読書|[folio-comics](https://kyonhuo.github.io/nagiport-motion-kit/templates/folio-comics/)|
|PARCEL / WORKS|物流・倉庫オペレーション|[parcel-logistics](https://kyonhuo.github.io/nagiport-motion-kit/templates/parcel-logistics/)|
|DELTA / KITCHEN|食・人数で変わる共同キッチンのレシピ|[delta-kitchen](https://kyonhuo.github.io/nagiport-motion-kit/templates/delta-kitchen/)|
|MERCURY / LAB|教育・元素の展示室|[mercury-lab](https://kyonhuo.github.io/nagiport-motion-kit/templates/mercury-lab/)|
|TEMPO / DANCE|ダンス・スタジオ時間割|[tempo-dance](https://kyonhuo.github.io/nagiport-motion-kit/templates/tempo-dance/)|

## 導入・編集

使うフォルダ全体を複製しindex.htmlを開きます。HTTPでは `python -m http.server 8080 --bind 127.0.0.1`。本文はHTML、配色・構図はstyles.cssまたはstyle.css、操作と架空データはscript.jsまたはapp.js、素材は各PNG/assetsを編集。ライセンスファイルはLICENSE.txtまたはLICENSEです。

すべて架空のブランドとサンプルデータのデモ。実送信・実予約・注文・決済は行いません。VAULTのウォッチとFOLIOのしおりだけは端末内localStorageに保存し、外部へ送信しません。削除方法は個別READMEを参照。他の選択は再読込で初期化されます。

## 権利・素材

独自コード・文章・手続き図版・CSS/Canvasアートは各フォルダのMITで商用利用・改変・再配布・再販売できます。著作権表示とMIT全文を保持してください。端末搭載書体を参照し、フォントファイルは配布しません。ATLASのexcavation-generated.pngとBLOOMのbouquet-generated.pngは本作向けの生成画像で、実在の発掘現場や受注商品写真ではありません。外部写真、取得サイトのコード/素材、ライブラリは同梱しません。

WebCloneのApache-2.0は取得サイトの素材再販売許諾を与えるものではありません。WebClone公式commit a70b7e02eae3bae6f5e0b3d1c124e219c05c2741の隔離環境でCLI/APIを実利用。20参照の固定commitとMITを確認し、20ページ・81素材を調査取得しました。8つの非送信操作を実測し、残りはソースも調査。原本・写真・文言・ロゴ・外部フォント・依存コードは商品へ取り込んでいません。取得原本は公開repo外に保管します。

|新作|研究参照|固定commit / MIT根拠|
|---|---|---|
|VECTOR AIR|StartBootstrap/startbootstrap-full-slider|[42b95133b847](https://github.com/StartBootstrap/startbootstrap-full-slider/blob/42b95133b847d25ac5d4418e5ca6ab3955f94280/LICENSE)|
|LOOM / 色を織る|StartBootstrap/startbootstrap-stylish-portfolio|[a658eb7130db](https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/a658eb7130db599f69572384ef2dd6221757f028/LICENSE)|
|VAULT / 古いものの新しい時間|StartBootstrap/startbootstrap-shop-homepage|[fb3a49020b84](https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/fb3a49020b840cdbcb0a588fdbda8fc019710a6f/LICENSE)|
|RALLY CLUB|StartBootstrap/startbootstrap-one-page-wonder|[4a2712c4601d](https://github.com/StartBootstrap/startbootstrap-one-page-wonder/blob/4a2712c4601d9f5209e97e2b4229d39d55beca84/LICENSE)|
|PLATFORM / 次の列車で|StartBootstrap/startbootstrap-scrolling-nav|[45ee8f6a5503](https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/45ee8f6a5503ec6d4b41ec86cf5be2c930b606df/LICENSE)|
|PRISM / 光のかたち|StartBootstrap/startbootstrap-shop-item|[7eee6160f796](https://github.com/StartBootstrap/startbootstrap-shop-item/blob/7eee6160f7960c64d91431deeec7cac2457e689f/LICENSE)|
|SWITCH / その一打を、自分らしく|StartBootstrap/startbootstrap-simple-sidebar|[72f0de1eda03](https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/72f0de1eda0350496100c8a077795fe93752d419/LICENSE)|
|BLOOM / 花を、束ねる|StartBootstrap/startbootstrap-business-casual|[b6f928934386](https://github.com/StartBootstrap/startbootstrap-business-casual/blob/b6f928934386a54e08c2e7f40ebd9e4d7510bba4/LICENSE)|
|FLUX / 街をめぐる電気|StartBootstrap/startbootstrap-sb-admin|[adde34b9616b](https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/adde34b9616b9840c4da756323131f59ac445090/LICENSE)|
|DOCKET / 話すための時間|StartBootstrap/startbootstrap-modern-business|[7d297106cbda](https://github.com/StartBootstrap/startbootstrap-modern-business/blob/7d297106cbda2f04db4696752fcdb5b4dc9cd936/LICENSE)|
|ATLAS / DIG|StartBootstrap/startbootstrap-resume|[c6fbe5ef4316](https://github.com/StartBootstrap/startbootstrap-resume/blob/c6fbe5ef431642984d0f17960194632f20cf67bc/LICENSE)|
|CAPSULE / FORM|StartBootstrap/startbootstrap-portfolio-item|[26b9b7c965c6](https://github.com/StartBootstrap/startbootstrap-portfolio-item/blob/26b9b7c965c6f0cf1612486981dfeea0177b46ec/LICENSE)|
|NEON / ARCADE|StartBootstrap/startbootstrap-full-width-pics|[899a83c22d3b](https://github.com/StartBootstrap/startbootstrap-full-width-pics/blob/899a83c22d3bdb80f0fe50baad6b4ceb1bae3a42/LICENSE)|
|TESSERA|StartBootstrap/startbootstrap-creative|[b1762d8c690a](https://github.com/StartBootstrap/startbootstrap-creative/blob/b1762d8c690a2379c078c776dc0830bdd81c6f55/LICENSE)|
|FRESCO / WALL|StartBootstrap/startbootstrap-bare|[9e17b3746e25](https://github.com/StartBootstrap/startbootstrap-bare/blob/9e17b3746e253e04eef809c9b5c8a303cb98ca13/LICENSE)|
|FOLIO / COMICS|StartBootstrap/startbootstrap-blog-home|[422704554a5a](https://github.com/StartBootstrap/startbootstrap-blog-home/blob/422704554a5a0c62d8818a247f3a741cf6831ff3/LICENSE)|
|PARCEL / WORKS|StartBootstrap/startbootstrap-business-frontpage|[b330ff68d31f](https://github.com/StartBootstrap/startbootstrap-business-frontpage/blob/b330ff68d31fca0950dcce5687796d71432fbd5f/LICENSE)|
|DELTA / KITCHEN|StartBootstrap/startbootstrap-small-business|[9c5ef57a25c2](https://github.com/StartBootstrap/startbootstrap-small-business/blob/9c5ef57a25c2c8e1223b274ef7312375925e281c/LICENSE)|
|MERCURY / LAB|StartBootstrap/startbootstrap-clean-blog-jekyll|[1f8996f010af](https://github.com/StartBootstrap/startbootstrap-clean-blog-jekyll/blob/1f8996f010afdbdebfbb36c27858e62e3373f34a/LICENSE)|
|TEMPO / DANCE|StartBootstrap/startbootstrap-blog-post|[85c4c8d10116](https://github.com/StartBootstrap/startbootstrap-blog-post/blob/85c4c8d10116d67b8c8af8c11970bb0cafd93be4/LICENSE)|

## 制作時の確認範囲

2026-10-30、WindowsのChrome 156.0.8078.48で確認。

- 20作×390/768/1440pxの60条件を撮影し主workerが画像を目視。最初のVECTORを改善後、5作ずつ確認し、文字重なり・横はみ出し・図版・操作領域を修正して再撮影。
- 4モード（mouse、Tab/実キー、表示中のreduced motion切替、初期reduced motion）×3幅×20作=240条件、4911項目を通過。初期/操作後の横はみ出し、画像エラー、JavaScript例外、console.error、失敗リクエスト、外部通信、GET以外のリクエストは0件。
- 縮減設定では継続requestAnimationFrameと実行中のtransform animationがないことを検査。必要な静的transformや短い色変化は保持。
- Canvas無効、JavaScript無効、端末保存拒否、file://、通常リンク確認の5条件×20作=100条件、952項目を通過。Canvas/保存拒否時は主要操作も再確認。JavaScript無効時は静的本文と画像が読める確認であり、操作可能という意味ではありません。
- 一覧/トップへのリンク、READMEとMITファイル、アンカーを実取得確認。公開後のURL/同梱ファイルの照合記録は別の制作証跡に保存。

Moli 1.1.14はCanvas createRadialGradientが未実装のため、最終画面確認はインストール済みChromeの直接自動操作を利用。OpenBot browserはこの実行環境に利用可能なtoolがなく、他のブラウザープラグインは使用していません。Three.js/GSAP/WebGPU/HTML-in-Canvasには依存しません。

実機iPhone/Safari/Android、スクリーンリーダー実機、端末FPS/消費電力は未確認です。全端末互換性・アクセシビリティ認証を宣言しません。

販売・価格・支援・返金条件、事業者情報は未確定。MIT公開の許諾を取り消す条件は設けません。配布候補ZIPと事業資料をローカルで準備し、販売開始・法務完了・課金接続は行っていません。
