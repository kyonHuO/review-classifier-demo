import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const pages = ['404.html','index.html','services.html','sns.html','estimate.html','usecases.html','flow.html','faq.html','data-policy.html','about.html','contact.html','demo.html','try.html'];

test('preparation and development labels are confined to the email service', () => {
  for (const file of pages.filter(x=>x!=='demo.html')) {
    assert.doesNotMatch(read(file), /準備中|開発中|準備しています|開発しています|サービス提供に向けた準備段階/);
  }
  const demo = read('demo.html');
  assert.match(demo, /メールを、用件ごとにまとめる（準備中）/);
  assert.match(demo, /メールの用件分類（準備中）/);
  assert.match(demo, /メール整理は準備中です/);
  assert.doesNotMatch(demo, /開発中|サービス・準備状況/);
});

test('review and social pages describe consultation rather than transaction intake', () => {
  for (const file of ['index.html','services.html','faq.html']) {
    assert.match(read(file), /口コミ分類・SNS分析のご相談を受け付けています/);
    assert.match(read(file), /このサイトでは注文・決済・実データの受付を行っていません/);
    assert.match(read(file), /実データ・個人情報は添付しないでください/);
  }
  assert.match(read('sns.html'), /SOCIAL LISTENING \/ 相談受付中/);
  assert.match(read('sns.html'), /自動取得機能は提供していません/);
  assert.match(read('sns.html'), /投稿や分類結果の受付・保管は行っていません/);
  assert.match(read('data-policy.html'), /アカウント情報や分類結果の保存機能を提供していません/);
});

test('customer preparation guidance and reference pricing remain', () => {
  for (const file of ['index.html','services.html','faq.html']) {
    assert.match(read(file), /ご準備いただくのは、お店の情報と調査条件/);
  }
  assert.match(read('sns.html'), /準備していただくものは、2つです/);
  assert.match(read('estimate.html'), /この画面では注文・決済を行いません/);
  assert.match(read('estimate.html'), /SNS分析の料金は未決定です/);
});

test('SNS flow and videos retain fictional or illustrative labeling', () => {
  assert.match(read('sns.html'), /相談から報告までの進め方（想定例）/);
  assert.match(read('sns.html'), /架空の例/);
  assert.match(read('demo.html'), /分類精度・処理速度・顧客実績を示す映像ではありません/);
  assert.match(read('demo.html'), /メール分類サービスの提供・直接連携は未対応です/);
});

test('homepage consultation hover foreground overrides the light theme', () => {
  assert.match(read('light.css'), /body\.light \.home-actions \.home-contact:hover\s*\{\s*color:\s*#e6d7ef;\s*\}/);
  assert.match(read('index.html'), /href="light\.css\?v=consultation-20261020a"/);
  const luminance = h => h.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
  const light = luminance('#e6d7ef'), dark = luminance('#282032');
  assert.ok((light+.05)/(dark+.05)>=4.5);
});
