'use strict';
// Synthetic examples only. No model, classifier, API request, analytics, or storage.
const SAMPLES = Object.freeze([
  {id:1, text:'音が静かで、毎日使いやすいです。', language:'ja', category:'positive'},
  {id:2, text:'届いた日に壊れてしまいました。', language:'ja', category:'negative'},
  {id:3, text:'使いやすいですが、電池がすぐ切れます。', language:'ja', category:'mixed'},
  {id:4, text:'例の件、あれはちょっと。', language:'ja', category:'hold'},
  {id:5, text:'Simple, quiet, and easy to use.', language:'en', category:'positive'},
  {id:6, text:'The item arrived broken.', language:'en', category:'negative'},
  {id:7, text:'Beautiful design, but the battery runs out fast.', language:'en', category:'mixed'},
  {id:8, text:'It arrived on Tuesday.', language:'en', category:'hold'}
]);
const LABELS = {positive:'好意的', negative:'否定的', mixed:'賛否混在', hold:'判定保留'};
const SYMBOLS = {positive:'＋', negative:'−', mixed:'±', hold:'?'};
const $ = (selector, scope=document) => scope.querySelector(selector);
const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let loadedCount = 0;
let selectedFilter = 'all';
let loadTimer = null;
let inputRows = [];
let topWindow = 15;

function announce(message) { $('#global-status').textContent = message; }
function pad(value) { return String(value).padStart(2,'0'); }
function textElement(tag,text,className) { const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el; }

SAMPLES.forEach(sample => {
  const row=textElement('div','','source-row');
  row.append(textElement('span',pad(sample.id),'mono'),textElement('span',sample.text));
  $('#sample-source-list').append(row);
});

function renderResults() {
  const available=SAMPLES.slice(0,loadedCount);
  const shown=available.filter(sample => selectedFilter==='all'||sample.category===selectedFilter);
  $('#results-list').replaceChildren();
  if (!shown.length) {
    const empty=textElement('div','','empty-state');
    empty.append(textElement('p',loadedCount?'この分類のサンプルはまだ表示されていません':'まずは、サンプルを開こう。'));
    empty.append(textElement('span',loadedCount?'表示完了までお待ちください。':'「サンプル結果を表示」から確認できます。'));
    $('#results-list').append(empty);
  }
  shown.forEach(sample => {
    const row=textElement('div','','result-row');
    row.dataset.sampleId=sample.id;
    row.append(textElement('span',pad(sample.id),'mono'),textElement('p',sample.text),textElement('span',`${SYMBOLS[sample.category]} ${LABELS[sample.category]}`,`label ${sample.category}`));
    $('#results-list').append(row);
  });
  $$('[data-filter]').forEach(button => {
    const filter=button.dataset.filter;
    $('span',button).textContent=available.filter(sample=>filter==='all'||sample.category===filter).length;
    button.classList.toggle('selected',filter===selectedFilter);
    button.setAttribute('aria-pressed',String(filter===selectedFilter));
  });
  $('#result-loaded').textContent=`${pad(loadedCount)} / 08`;
  $('#result-count').textContent=loadedCount===8?'8 SAMPLE ROWS':`LOADING ${loadedCount}/8`;
  $('.sample-progress').setAttribute('aria-valuenow',loadedCount);
  $('#progress-fill').style.width=`${loadedCount/8*100}%`;
  $('#export-csv').disabled=loadedCount!==8;
}

function loadSamples() {
  if(loadTimer) clearInterval(loadTimer);
  selectedFilter='all';loadedCount=0;
  const button=$('#load-samples');button.disabled=true;
  button.replaceChildren(textElement('span','サンプル行を表示中…'));
  const finish=()=>{
    clearInterval(loadTimer);loadTimer=null;button.disabled=false;
    button.replaceChildren(document.createTextNode('もう一度サンプルを見る '),textElement('span','↗'));
    announce('8件の固定サンプル結果を表示しました。AIによる分類ではありません。');
  };
  if(reducedMotion.matches){loadedCount=8;renderResults();finish();return;}
  renderResults();
  loadTimer=setInterval(()=>{loadedCount+=1;renderResults();if(loadedCount===SAMPLES.length)finish();},95);
}
$('#load-samples').addEventListener('click',loadSamples);
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{selectedFilter=button.dataset.filter;renderResults();announce(`${button.textContent.trim()}の固定サンプルを表示しています。`);}));

function csvCell(value) {let text=String(value);if(/^[=+@\-\t\r]/.test(text))text="'"+text;return `"${text.replaceAll('"','""')}"`;}
$('#export-csv').addEventListener('click',()=>{
  if(loadedCount!==8)return;
  const rows=[['sample_id','review','language','sample_label','notice'],...SAMPLES.map(s=>[s.id,s.text,s.language,LABELS[s.category],'架空データ・固定表示例（AI分類結果ではありません）'])];
  const blob=new Blob(['\ufeff'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='review-sample-results.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('8件の固定サンプルCSVを作成しました。');
});

function activateTab(button,buttons,controls=true){
  buttons.forEach(tab=>{const active=tab===button;tab.classList.toggle('selected',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(controls){const panel=document.getElementById(tab.getAttribute('aria-controls'));if(panel)panel.hidden=!active;}});
}
function keyboardTabs(buttons,callback){buttons.forEach(button=>button.addEventListener('keydown',event=>{let index=buttons.indexOf(button);if(event.key==='ArrowRight'||event.key==='ArrowDown')index=(index+1)%buttons.length;else if(event.key==='ArrowLeft'||event.key==='ArrowUp')index=(index+buttons.length-1)%buttons.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=buttons.length-1;else return;event.preventDefault();buttons[index].focus();callback(buttons[index]);}));}
const modeTabs=$$('.mode-tabs [role=tab]');modeTabs.forEach(button=>button.addEventListener('click',()=>activateTab(button,modeTabs)));keyboardTabs(modeTabs,button=>activateTab(button,modeTabs));

function updateCounter(){
  $('#input-counter').textContent=`${inputRows.length} / 100 件`;
  $('#input-counter').style.color=inputRows.length>100?'#a32d51':'';
  $('#input-feedback').textContent=inputRows.length>100?`${inputRows.length}件あります。プレビューは先頭100件までです。`:'';
}
function readTextInput(){inputRows=$('#review-input').value.split(/\r?\n/).map(text=>text.trim()).filter(Boolean);updateCounter();$('#input-preview').hidden=true;}
$('#review-input').addEventListener('input',readTextInput);
$('#clear-input').addEventListener('click',()=>{fileReadVersion++;$('#review-input').value='';$('#csv-file').value='';inputRows=[];updateCounter();$('#input-preview').replaceChildren();$('#input-preview').hidden=true;$('#review-input').focus();});
function previewInput(){
  const preview=$('#input-preview');preview.replaceChildren();
  if(!inputRows.length){$('#input-feedback').textContent='文章を入力するか、本文1列のCSVを選んでください。';preview.hidden=true;return;}
  inputRows.slice(0,100).forEach((text,index)=>preview.append(textElement('p',`${pad(index+1)}　${text}`)));
  preview.hidden=false;$('#input-feedback').textContent=`${Math.min(inputRows.length,100)}件の本文を表示しています。分類は実行していません。`;announce($('#input-feedback').textContent);
}
$('#preview-input').addEventListener('click',previewInput);
// RFC 4180-style quoted CSV parsing; one column only. No evaluation of cell contents.
function parseCsv(text){
  text=text.replace(/^\ufeff/,'');const rows=[];let row=[],cell='',quoted=false,closedQuote=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closedQuote=true;}}else cell+=c;continue;}
    if(c==='"'){if(cell.length||closedQuote)throw Error('引用符の形式を確認してください。');quoted=true;}
    else if(c===','){row.push(cell);cell='';closedQuote=false;}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';closedQuote=false;}
    else {if(closedQuote&&!/\s/.test(c))throw Error('引用符の後の区切りを確認してください。');if(!closedQuote)cell+=c;}
  }
  if(quoted)throw Error('閉じられていない引用符があります。');row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
  if(rows.some(r=>r.length!==1))throw Error('本文1列のCSVを選んでください。複数列のCSVにはまだ対応していません。');
  let result=rows.map(r=>r[0].trim()).filter(Boolean);
  if(result.length&&/^(review|reviews|text|本文|レビュー|レビュー本文|口コミ)$/i.test(result[0]))result.shift();
  return result;
}
let fileReadVersion=0;
$('#csv-file').addEventListener('change',async(event)=>{
  const file=event.target.files[0];if(!file)return;const version=++fileReadVersion;
  if(!/\.csv$/i.test(file.name)){event.target.value='';$('#input-feedback').textContent='拡張子.csvのファイルを選んでください。';return;}
  if(file.size>1024*1024){event.target.value='';$('#input-feedback').textContent='1MB以下のCSVを選んでください。';return;}
  try{const raw=await file.arrayBuffer();if(version!==fileReadVersion)return;const text=new TextDecoder('utf-8',{fatal:true}).decode(raw);inputRows=parseCsv(text);$('#review-input').value=inputRows.map(line=>line.replace(/[\r\n]+/g,' ')).join('\n');updateCounter();previewInput();$('#input-feedback').textContent=`CSVから${inputRows.length}件を読み込みました。先頭${Math.min(inputRows.length,100)}件を表示しています。分類は実行していません。`;}catch(error){if(version!==fileReadVersion)return;event.target.value='';$('#input-feedback').textContent=error instanceof TypeError?'UTF-8形式のCSVを選んでください。':error.message;}
});
$('#review-input').addEventListener('input',()=>{fileReadVersion++;});
const dialog=$('#pending-dialog');$('#classify-input').addEventListener('click',()=>dialog.showModal());$('#close-dialog').addEventListener('click',()=>dialog.close());$('#dismiss-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});

const CATEGORIES={
positive:{number:'01',word:'POSITIVE',title:'うれしい声を、<br>見つける。',description:'使い心地や対応への満足など、肯定的な評価を含む声。伝わっている価値を見つける手がかりに。',example:'例「音が静かで、毎日使いやすいです。」',color:'var(--cyan)'},
negative:{number:'02',word:'NEGATIVE',title:'困っている声を、<br>見落とさない。',description:'不具合や期待とのずれなど、否定的な評価を含む声。まず読み返したい箇所を探す手がかりに。',example:'例「届いた日に壊れてしまいました。」',color:'var(--pink)'},
mixed:{number:'03',word:'MIXED',title:'「いいけれど」を、<br>そのまま残す。',description:'満足と不満が同じ文章に含まれる声。良い・悪いのどちらか一方に押し込めず、両方の評価を見直します。',example:'例「使いやすいですが、電池がすぐ切れます。」',color:'var(--purple)'},
hold:{number:'04',word:'ON HOLD',title:'わからない声を、<br>決めつけない。',description:'文脈不足や評価を含まない事実の記述。無理に判断せず、人が読み直すための保留にします。',example:'例「例の件、あれはちょっと。」',color:'var(--muted)'}
};
const categoryTabs=$$('.category-menu [role=tab]');
function selectCategory(button){const category=button.dataset.category,data=CATEGORIES[category];activateTab(button,categoryTabs,false);$('#category-panel').setAttribute('aria-labelledby',button.id);$('#guide').style.setProperty('--category-color',data.color);$('.category-glyph').textContent=SYMBOLS[category];$('.category-word').textContent=data.word;$('.category-number').textContent=`${data.number} / ${data.word}`;$('#category-filename').textContent=`category_${data.number}.txt`;$('#category-title').innerHTML=data.title;$('#category-description').textContent=data.description;$('#category-example').textContent=data.example;}
categoryTabs.forEach(button=>button.addEventListener('click',()=>selectCategory(button)));keyboardTabs(categoryTabs,selectCategory);
$('#contact-details').addEventListener('click',event=>{const button=event.currentTarget,open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',open);$('#contact-note').hidden=!open;$('span',button).textContent=open?'−':'＋';});
$('#theme-toggle').addEventListener('click',()=>{const isLight=document.documentElement.dataset.theme!=='light';document.documentElement.dataset.theme=isLight?'light':'dark';$('#theme-toggle').setAttribute('aria-pressed',isLight);$('#theme-toggle').setAttribute('aria-label',isLight?'ダークテーマに切り替える':'ライトテーマに切り替える');$('.theme-word').textContent=isLight?'LIGHT':'DARK';$('meta[name=theme-color]').content=isLight?'#e9e4f2':'#111116';});
const menuButton=$('.mobile-menu');function closeMenu(){menuButton.setAttribute('aria-expanded','false');$('#site-nav').classList.remove('open');$('span',menuButton).textContent='＋';}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',open);$('#site-nav').classList.toggle('open',open);$('span',menuButton).textContent=open?'−':'＋';});
$$('#site-nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-nav,.mobile-menu'))closeMenu();});
const sections=$$('.page-section');const navLinks=$$('#site-nav a');
const sectionObserver=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(!visible.length)return;const hash='#'+visible[0].target.id;navLinks.forEach(a=>{const current=a.getAttribute('href')===hash;a.classList.toggle('active',current);if(current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-15% 0px -60% 0px',threshold:0});sections.forEach(section=>sectionObserver.observe(section));

// Windows can move inside their section. No motion, drag, or stored positions on mobile.
const desktop=matchMedia('(min-width: 761px)');
const moveState=new Map();
function setPosition(win,x,y){win.style.translate=`${x}px ${y}px`;moveState.set(win,{x,y});}
function constrain(win,dx,dy){const section=win.closest('section'),r=win.getBoundingClientRect(),s=section.getBoundingClientRect();const padding=18;return {dx:Math.max(s.left+padding-r.left,Math.min(dx,s.right-padding-r.right)),dy:Math.max(s.top+85-r.top,Math.min(dy,s.bottom-70-r.bottom))};}
$$('.draggable').forEach(win=>{
  const handle=$('.drag-handle',win);let drag=null;
  handle.addEventListener('pointerdown',event=>{if(!desktop.matches||event.button!==0)return;const pos=moveState.get(win)||{x:0,y:0};drag={clientX:event.clientX,clientY:event.clientY,pos};handle.setPointerCapture(event.pointerId);win.style.zIndex=++topWindow;});
  handle.addEventListener('pointermove',event=>{if(!drag)return;const current=moveState.get(win)||{x:0,y:0};const targetX=drag.pos.x+event.clientX-drag.clientX,targetY=drag.pos.y+event.clientY-drag.clientY;const delta=constrain(win,targetX-current.x,targetY-current.y);setPosition(win,current.x+delta.dx,current.y+delta.dy);});
  const end=()=>{drag=null;};handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);
  handle.addEventListener('keydown',event=>{if(!desktop.matches)return;let dx=0,dy=0;const step=event.shiftKey?40:10;if(event.key==='ArrowLeft')dx=-step;else if(event.key==='ArrowRight')dx=step;else if(event.key==='ArrowUp')dy=-step;else if(event.key==='ArrowDown')dy=step;else if(event.key==='Home'){event.preventDefault();setPosition(win,0,0);return;}else return;event.preventDefault();win.style.zIndex=++topWindow;const pos=moveState.get(win)||{x:0,y:0};const delta=constrain(win,dx,dy);setPosition(win,pos.x+delta.dx,pos.y+delta.dy);});
});
function resetWindows(){moveState.clear();$$('.draggable').forEach(win=>{win.style.translate='';win.style.zIndex='';});}
$('#reset-windows').addEventListener('click',()=>{resetWindows();announce('ウィンドウの位置をリセットしました。');});
window.addEventListener('resize',resetWindows);
