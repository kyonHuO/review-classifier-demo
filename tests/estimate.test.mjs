import test from 'node:test';
import assert from 'node:assert/strict';
import {priceFor,PLANS} from '../estimate.js';
import {parseCsv,csvRows} from '../core.js';
import {readFileSync} from 'node:fs';
test('progressive tax-inclusive reference pricing, minimum, and 1-yen rounding up',()=>{
  for(const [count,total] of [[0,0],[1,500],[249,500],[250,500],[251,502],[1000,2000],[1001,2001],[2000,3000],[10000,11000],[10001,11001],[10002,11001],[10003,11002],[11000,11500],[20000,16000],[20001,16001],[100000,56000],[1000000,506000]])assert.equal(priceFor(count).total,total);
});
test('reject malformed or unsafe counts without rounding',()=>{
  for(const value of ['', '-1','1.5','1e3','Infinity','NaN','１２','1,000','<script>','9007199254740992'])assert.throws(()=>priceFor(value));
});
test('monthly plan covers the count and is recommended only when cheaper than metered',()=>{
  assert.deepEqual(PLANS.map(plan=>[plan.name,plan.price,plan.limit]),[['ライト',3000,5000],['スタンダード',10000,20000],['プロ',30000,100000]]);
  const recommended=count=>{const price=priceFor(count);return price.planCheaper?price.plan.name:null;};
  // break-even boundaries: equal or metered-cheaper -> no recommendation
  assert.equal(recommended(2000),null);   // 3000 metered equals ライト 3000
  assert.equal(recommended(1999),null);   // 2999 metered beats ライト
  assert.equal(recommended(9000),null);   // 10000 metered equals スタンダード 10000
  assert.equal(recommended(8999),null);   // 9999 metered beats スタンダード
  assert.equal(recommended(48000),null);  // 30000 metered equals プロ 30000
  assert.equal(recommended(47000),null);  // 29500 metered beats プロ
  // just above break-even -> subscription recommended
  assert.equal(recommended(2001),'ライト');
  assert.equal(recommended(5000),'ライト');
  assert.equal(recommended(9001),'スタンダード');
  assert.equal(recommended(11000),'スタンダード');
  assert.equal(recommended(48001),'プロ');
  assert.equal(recommended(100000),'プロ');
  // covering-plan candidate vs recommendation at the ライト/スタンダード/プロ boundaries
  const candidate=count=>{const price=priceFor(count);return price.plan?price.plan.name:null;};
  assert.equal(candidate(5001),'スタンダード'); assert.equal(recommended(5001),null);   // metered 6001 beats スタンダード
  assert.equal(candidate(20000),'スタンダード'); assert.equal(recommended(20000),'スタンダード'); // metered 16000 > スタンダード 10000
  assert.equal(candidate(20001),'プロ'); assert.equal(recommended(20001),null);          // metered 16001 beats プロ
  // no covering plan -> consult (no recommendation)
  const over=priceFor(100001);
  assert.equal(over.plan,null);
  assert.equal(over.planCheaper,false);
  assert.equal(recommended(150000),null);
});
test('fictional sample, quoted comma and multiline, blank body',()=>{
  const table=parseCsv(readFileSync(new URL('../assets/sample-reviews.csv',import.meta.url),'utf8'));
  assert.equal(table.length,5);assert.equal(csvRows(table,1,true).length,3);assert.equal(csvRows(table,0,true).length,4);assert.equal(csvRows(table,1,false).length,4);
  assert.match(table[3][1],/\n/);
});
test('malformed CSV rejection and no service row cap in estimator',()=>{
  for(const csv of ['','a,b\n1','a,b\n"bad,x','a,b\nx"y,z'])assert.throws(()=>parseCsv(csv));
  assert.equal(csvRows(parseCsv('口コミ本文\n'+Array(10001).fill('架空の口コミ').join('\n')),0,true).length,10001);
});
