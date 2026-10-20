import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = f => readFileSync(new URL('../'+f, import.meta.url),'utf8');
const pages = ['index.html','services.html','sns.html','try.html','faq.html','flow.html','data-policy.html','usecases.html'];
test('public pages no longer offer browser classification or load its runtime',()=>{
 for(const p of pages){const s=html(p);assert.doesNotMatch(s,/href=["'](?:\.\/)?try\.html["']/i,p);assert.doesNotMatch(s,/<script[^>]+(?:app\.js|inference\.worker\.js|model-config\.js)/i,p);assert.doesNotMatch(s,/分類を試す|ブラウザで試す|今すぐ利用できます|1回あたり100行|CSVは1MB/i,p);}
});
test('retired trial page is static and cannot initialize a model',()=>{const s=html('try.html');assert.doesNotMatch(s,/<script|<input|<textarea|<form|<video|<canvas/i);assert.match(s,/公開を終了/);});
test('opening keeps only one visible arrow control and an accessible name',()=>{const s=html('index.html').match(/<section class="nagi-intro"[\s\S]*?<\/section>/)[0];assert.equal((s.match(/<button/g)||[]).length,1);assert.match(s,/data-intro-skip[^>]*aria-label="本文へ進む"/);assert.doesNotMatch(s,/data-intro-pause|まもなく本文へ|nagi-intro-top|nagi-intro-bottom|nagi-intro-progress/);assert.equal((s.match(/data-intro-scene=/g)||[]).length,4);});
test('SNS preparation asks for two grouped items only',()=>{const s=html('sns.html').match(/<section aria-labelledby="sns-prep-title">([\s\S]*?)<\/section>/)[1];assert.equal((s.match(/<article/g)||[]).length,2);assert.match(s,/お店の情報/);assert.match(s,/調査条件/);assert.match(s,/期間/);assert.match(s,/SNS/);});
test('customer pages avoid acquisition implementation jargon and Bluesky-first copy',()=>{for(const p of ['index.html','services.html','sns.html','faq.html'])assert.doesNotMatch(html(p),/API|スクレイピング|Bluesky/,p);});

test('SNS candidates contain only the four requested major platforms',()=>{const s=html('sns.html').match(/<section aria-labelledby="sns-sources-title">([\s\S]*?)<\/section>/)[1];assert.equal((s.match(/<article/g)||[]).length,4);for(const name of ['X（旧Twitter）','Instagram','TikTok','YouTube'])assert.ok(s.includes(name));assert.doesNotMatch(s,/食べログ|Bluesky/);});
