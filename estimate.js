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
  const count=document.getElementById('count');
  const price=document.getElementById('price');
  const error=document.getElementById('price-error');
  function showPrice(){
    try {const p=priceFor(count.value);price.textContent=p.count===0?'対象なし':money(p.total);error.textContent='';}
    catch(e){price.textContent='—';error.textContent=e.message;}
  }
  count.addEventListener('input',showPrice);
  showPrice();
}
