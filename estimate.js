import {parseCsv, inferCsvLayout, csvRows} from './core.js';
export function priceFor(value) {
  const raw=String(value);
  if(!/^[0-9]+$/.test(raw)) throw Error('件数は0以上の整数で入力してください。');
  const count=Number(raw);
  if(!Number.isSafeInteger(count) || count>Math.floor(Number.MAX_SAFE_INTEGER/4)) throw Error('この見積り画面で扱える数値を超えています。件数を添えてご相談ください。');
  const first=Math.min(count,1000)*2;
  const second=Math.min(Math.max(count-1000,0),9000);
  const third=Math.max(count-10000,0)*0.5;
  return {count,first,second,third,subtotal:first+second+third,total:count===0?0:Math.max(500,first+second+third)};
}
const money=n=>n.toLocaleString('ja-JP',{maximumFractionDigits:1})+'円';
if(typeof document!=='undefined') {
  let table=null, revision=0;
  const $=id=>document.getElementById(id);
  const status=$('csv-status'), column=$('csv-column'), header=$('csv-header');
  function showPrice(){
    try {const p=priceFor($('count').value); $('price').textContent=p.count===0?'対象なし':money(p.total); $('breakdown').textContent=p.count===0?'口コミが0件のため、料金の見積り対象はありません。':`最初の1,000件部分 ${money(p.first)} ＋ 次の9,000件部分 ${money(p.second)} ＋ 10,001件以上部分 ${money(p.third)}。${p.subtotal<500?'最低料金500円を適用。':'段階料金の合計です。'}`;$('price-error').textContent='';}
    catch(e){$('price').textContent='—';$('breakdown').textContent='';$('price-error').textContent=e.message;}
  }
  function clearCsv(){table=null; column.replaceChildren(); column.disabled=true; header.disabled=true; $('csv-summary').textContent=''; $('csv-preview').textContent='';}
  function updateCsv(){
    if(!table)return;
    const rows=csvRows(table,Number(column.value),header.checked);
    const all=table.length-(header.checked?1:0);
    $('csv-summary').textContent=`本文あり ${rows.length.toLocaleString('ja-JP')}件 / データ行 ${all.toLocaleString('ja-JP')}行（本文が空の ${all-rows.length}行は見積りから除外）。`;
    $('csv-preview').textContent=rows.slice(0,3).map((x,i)=>`${i+1}. ${x.slice(0,160)}`).join('\n');
    $('count').value=String(rows.length);showPrice();
    status.textContent=rows.length?'検証完了。列と先頭行の扱いを確認してください。':'選択した列に本文がありません。列・先頭行の設定を確認してください。';
  }
  $('count').addEventListener('input',showPrice);
  column.addEventListener('change',updateCsv);header.addEventListener('change',updateCsv);
  $('csv-file').addEventListener('change',async event=>{
    const token=++revision;clearCsv();status.textContent='';$('count').value='';showPrice();
    const file=event.target.files[0];if(!file)return;
    try {
      if(!/\.csv$/i.test(file.name))throw Error('CSVファイルを選んでください。');
      if(file.size>20*1024*1024)throw Error('このブラウザ見積りは20MBまでです。受付件数の上限ではありません。大きなCSVは件数を手入力し、ご相談ください。');
      const buffer=await file.arrayBuffer();if(token!==revision)return;
      const text=new TextDecoder('utf-8',{fatal:true}).decode(buffer);
      if(text.includes('\0'))throw Error('CSVに不正な文字があります。UTF-8のCSVを選んでください。');
      table=parseCsv(text); const layout=inferCsvLayout(table);
      header.checked=layout.header;header.disabled=false;column.disabled=false;
      table[0].forEach((label,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=`列${i+1}: ${label.slice(0,60) || '（空欄）'}`;column.append(option);});
      column.value=String(layout.column);updateCsv();
    }catch(e){if(token!==revision)return;clearCsv();status.textContent=e instanceof TypeError?'UTF-8として読み込めません。UTF-8のCSVに変換してください。':e.message;}
  });
  $('csv-reset').addEventListener('click',()=>{++revision;$('csv-file').value='';clearCsv();status.textContent='選択を解除しました。';$('count').value='1000';showPrice();});
  showPrice();
}
