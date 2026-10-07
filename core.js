// Pure local parsing and similarity math. No network, storage, or keyword classifier.
export const LIMITS = Object.freeze({rows:100, charactersPerRow:2000, totalCharacters:100000, fileBytes:1048576, tokens:512});
export const LABELS = Object.freeze({positive:'好意的',negative:'否定的',mixed:'賛否混在',hold:'判定保留',skipped:'未分類'});
export const THRESHOLDS = Object.freeze({similarity:0.35,margin:0.025});
export const PREFIX = 'task: classification | query: ';
export const PROTOTYPES = Object.freeze([
  {category:'positive',text:'とても満足しています。使いやすく、買ってよかったです。'},
  {category:'positive',text:'品質が良く、対応も丁寧でした。また利用したいです。'},
  {category:'positive',text:'I am very happy with this purchase. It works well and is easy to use.'},
  {category:'positive',text:'Excellent quality and helpful service. I would recommend it.'},
  {category:'negative',text:'すぐ壊れて使えませんでした。品質が悪く、がっかりです。'},
  {category:'negative',text:'対応が悪く、使いづらいです。もう利用したくありません。'},
  {category:'negative',text:'Very disappointing. It broke quickly and did not work as expected.'},
  {category:'negative',text:'Poor quality and unhelpful service. I would not recommend it.'},
  {category:'mixed',text:'使いやすくて気に入りましたが、電池の持ちが悪いのが残念です。'},
  {category:'mixed',text:'品質には満足しています。一方で価格が高く、対応も遅かったです。'},
  {category:'mixed',text:'I like the design and it works well, but the battery life is disappointing.'},
  {category:'mixed',text:'The service was friendly, although delivery was slow and the price was high.'},
  {category:'hold',text:'商品は火曜日に届きました。箱の中に説明書が入っていました。'},
  {category:'hold',text:'まだ使っていないので、良いか悪いかはわかりません。例の件はあれです。'},
  {category:'hold',text:'The package arrived on Tuesday. It contains one item and an instruction manual.'},
  {category:'hold',text:'I have not used it yet and cannot judge. There is not enough context to tell.'}
]);
export function textRows(value){return value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);}
export function validateRows(rows){
  if(!rows.length)throw Error('文章を入力するか、CSVを選んでください。');
  if(rows.length>LIMITS.rows)throw Error(`${rows.length}件あります。100件以内に分けてください。先頭だけを勝手に分類することはありません。`);
  if(rows.reduce((n,x)=>n+x.length,0)>LIMITS.totalCharacters)throw Error('合計10万文字以内にしてください。');
  const long=rows.findIndex(x=>x.length>LIMITS.charactersPerRow);
  if(long!==-1)throw Error(`${long+1}件目が2,000文字を超えています。短くしてから再実行してください。`);
  return rows;
}
export function parseCsv(text){
  text=text.replace(/^\ufeff/,'');const rows=[];let row=[],cell='',quoted=false,closed=false;
  const finish=()=>{row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';closed=false;};
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;continue;}
    if(c==='"'){if(cell.length||closed)throw Error('CSVの引用符の形式を確認してください。');quoted=true;}
    else if(c===','){row.push(cell);cell='';closed=false;}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;finish();}
    else{if(closed&&!/[ \t]/.test(c))throw Error('CSVの引用符の後に区切りがありません。');if(!closed)cell+=c;}
  }
  if(quoted)throw Error('CSVに閉じられていない引用符があります。');finish();
  if(!rows.length)throw Error('CSVに読み込める本文がありません。');
  if(rows.some(x=>x.length!==rows[0].length))throw Error('CSVの列数が行によって異なります。形式を確認してください。');
  if(rows[0].length>100)throw Error('CSVは100列以内にしてください。');
  return rows;
}
export function inferCsvLayout(table){const index=table[0].findIndex(x=>/^(reviews?|text|content|body|本文|レビュー|レビュー本文|口コミ|口コミ本文)$/i.test(x.trim()));return {header:index>=0,column:Math.max(0,index)};}
export function csvRows(table,column,header){return table.slice(header?1:0).map(row=>(row[column]??'').trim()).filter(Boolean);}
export function normalized(vector){const norm=Math.sqrt(vector.reduce((n,x)=>n+x*x,0));if(!Number.isFinite(norm)||norm<1e-12)throw Error('Invalid embedding');return vector.map(x=>x/norm);}
export function cosine(a,b){if(a.length!==b.length)throw Error('Embedding dimension mismatch');return a.reduce((n,x,i)=>n+x*b[i],0);}
export function buildCentroids(vectors){if(vectors.length!==PROTOTYPES.length)throw Error('Missing prototypes');return Object.keys(LABELS).filter(x=>x!=='skipped').map(category=>{const items=vectors.filter((_,i)=>PROTOTYPES[i].category===category);return {category,vector:normalized(items[0].map((_,j)=>items.reduce((n,v)=>n+v[j],0)/items.length))};});}
export function classifyEmbedding(vector,centroids,prototypeVectors){
  const v=normalized(vector);const ranked=centroids.map(x=>({category:x.category,score:cosine(v,x.vector)})).sort((a,b)=>b.score-a.score);
  const best=ranked[0],margin=best.score-ranked[1].score;
  const reason=best.score<THRESHOLDS.similarity?'similarity':margin<THRESHOLDS.margin?'margin':best.category==='hold'?'neutral':null;
  const category=reason?'hold':best.category;
  let nearestIndex=0,nearestScore=-Infinity;prototypeVectors.forEach((p,i)=>{const score=cosine(v,p);if(score>nearestScore){nearestScore=score;nearestIndex=i;}});
  return {category,candidate:best.category,score:best.score,margin,reason,scores:ranked,nearest:PROTOTYPES[nearestIndex].text};
}
// Escape formula-like strings, including leading whitespace, for spreadsheet exports.
export function csvCell(value){let text=String(value??'');if(/^[\s\uFEFF]*[=+@\-]/.test(text)||/^[\t\r]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';}
export function resultsCsv(results){
 const header=['row','review','label','top_candidate','cosine_similarity','margin','reason','nearest_example','method'];
 const rows=results.map(r=>[r.id,r.text,LABELS[r.category],LABELS[r.candidate]??'',r.score?.toFixed(6)??'',r.margin?.toFixed(6)??'',r.reason??'',r.nearest??'','Bilingual prototype centroids; uncalibrated similarity, not probability']);
 return '\ufeff'+[header,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
}
