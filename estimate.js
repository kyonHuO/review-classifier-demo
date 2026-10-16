export const PLANS = Object.freeze([
  {name:'ライト',price:3000,limit:5000},
  {name:'スタンダード',price:10000,limit:20000},
  {name:'プロ',price:30000,limit:100000}
]);
export function priceFor(value) {
  const raw=String(value);
  if(!/^[0-9]+$/.test(raw)) throw Error('件数は0以上の整数で入力してください。');
  const count=Number(raw);
  if(!Number.isSafeInteger(count) || count>Math.floor(Number.MAX_SAFE_INTEGER/4)) throw Error('この見積り画面で扱える数値を超えています。件数を添えてご相談ください。');
  const first=Math.min(count,1000)*2;
  const second=Math.min(Math.max(count-1000,0),9000);
  const third=Math.max(count-10000,0)*0.5;
  const subtotal=first+second+third;
  const total=count===0?0:Math.max(500,Math.ceil(subtotal));
  let plan=null;
  for(const candidate of PLANS){if(count>0&&count<=candidate.limit&&(!plan||candidate.price<plan.price))plan=candidate;}
  const planCheaper=!!(plan&&count>0&&plan.price<total);
  return {count,first,second,third,subtotal,total,plan,planCheaper};
}
const money=n=>n.toLocaleString('ja-JP',{maximumFractionDigits:1})+'円';
if(typeof document!=='undefined') {
  const count=document.getElementById('count');
  const price=document.getElementById('price');
  const error=document.getElementById('price-error');
  const hint=document.getElementById('plan-hint');
  function showPrice(){
    try {
      const p=priceFor(count.value);
      price.textContent=p.count===0?'対象なし':money(p.total);
      error.textContent='';
      if(hint){
        if(p.planCheaper) hint.textContent='1か月あたり'+p.count.toLocaleString('ja-JP')+'件なら、月額プラン「'+p.plan.name+'」（月'+p.plan.limit.toLocaleString('ja-JP')+'行まで・月'+money(p.plan.price)+'）のほうが安くなります。従量課金より'+(p.total-p.plan.price).toLocaleString('ja-JP')+'円お得です。';
        else if(p.count>0&&!p.plan) hint.textContent='1か月あたり100,000行を超える件数は、用途とあわせて個別にご相談ください。';
        else hint.textContent='';
      }
    }
    catch(e){price.textContent='—';error.textContent=e.message;if(hint)hint.textContent='';}
  }
  count.addEventListener('input',showPrice);
  showPrice();
}
