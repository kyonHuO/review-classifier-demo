(() => {
  const input=document.getElementById('work-search');
  const cards=[...document.querySelectorAll('.work')];
  const buttons=[...document.querySelectorAll('[data-filter]')];
  let category='all';
  function filter(){
    const q=input.value.trim().toLocaleLowerCase('ja');
    let count=0;
    cards.forEach(c=>{const match=(category==='all'||c.dataset.category===category)&&c.textContent.toLocaleLowerCase('ja').includes(q);c.hidden=!match;if(match)count++;});
    document.querySelector('.result-count').textContent=count+'作品';
    document.getElementById('no-results').hidden=count>0;
  }
  buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter();}));
  input.addEventListener('input',filter);
  const menu=document.querySelector('.mobile-nav');
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
})();
