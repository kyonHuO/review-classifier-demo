import test from 'node:test';
import assert from 'node:assert/strict';
import {priceFor} from '../estimate.js';
import {parseCsv,csvRows} from '../core.js';
import {readFileSync} from 'node:fs';
test('progressive tax-inclusive reference pricing and minimum',()=>{
  for(const [count,total] of [[0,0],[1,500],[249,500],[250,500],[251,502],[1000,2000],[1001,2001],[2000,3000],[10000,11000],[10001,11000.5],[20000,16000],[1000000,506000]])assert.equal(priceFor(count).total,total);
});
test('reject malformed or unsafe counts without rounding',()=>{
  for(const value of ['', '-1','1.5','1e3','Infinity','NaN','１２','1,000','<script>','9007199254740992'])assert.throws(()=>priceFor(value));
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
