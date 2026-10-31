/* One entrance clock, native scroll progress, and no scroll lock.
   ?motion-time=0 / 1 / 2 freezes the entrance for visual comparison. */
(() => {
  const hero=document.querySelector('.home-hero');
  if(!hero)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const grid=hero.querySelector('.home-hero__cards');
  const cards=[...hero.querySelectorAll('.home-hero__card')];
  const heading=hero.querySelector('.home-hero__heading');
  const rows=[...hero.querySelectorAll('.home-hero-heading__row')];
  const tagline=hero.querySelector('.home-hero__tagline');
  const floatSection=document.querySelector('.floating-cards');
  const holders=[...document.querySelectorAll('.floating-cards__card-holder')];
  const movingText=document.querySelector('.moving-type span');
  const cta=document.querySelector('.floating-cta');
  const clockValue=new URLSearchParams(location.search).get('motion-time');
  const frozen=clockValue===null?null:Math.max(0,Math.min(2,Number(clockValue)||0));
  let start=performance.now(),raf=0,geometry=null;
  const clamp=n=>Math.max(0,Math.min(1,n));
  function measure(){
    const y=scrollY;
    geometry={heroTop:hero.getBoundingClientRect().top+y,heroEnd:grid.getBoundingClientRect().bottom+y,
      floatTop:floatSection.getBoundingClientRect().top+y,floatHeight:floatSection.offsetHeight,
      rows:rows.map(r=>Math.max(0,(hero.clientWidth*.91667-r.offsetWidth)/2)),
      holders:holders.map(h=>({top:h.getBoundingClientRect().top+y,height:h.offsetHeight})),
      textWidth:movingText?.offsetWidth||0};
    schedule();
  }
  function frame(now){
    raf=0;if(!geometry)return;
    const desktop=matchMedia('(min-width:768px)').matches,full=matchMedia('(min-width:1024px)').matches,reduced=reduce.matches;
    const seconds=frozen===null?(now-start)/1000:frozen;
    const entrance=reduced||!desktop?1:1-Math.pow(1-clamp(seconds/2),5);
    const remaining=1-entrance;
    const scrollP=clamp((scrollY-geometry.heroTop)/Math.max(1,geometry.heroEnd-geometry.heroTop));
    const rowP=clamp((scrollY-geometry.heroTop)/Math.max(1,heading.offsetTop+heading.offsetHeight));
    hero.style.opacity=reduced?'1':String(.25+.75*entrance);
    heading.style.transform=`translate3d(0,${reduced?0:300*remaining}px,0)`;
    tagline.style.transform=`translate3d(0,${reduced?0:400*remaining}px,0)`;
    rows.forEach((r,i)=>r.style.transform=`translate3d(${reduced||!full?0:(i?-1:1)*-geometry.rows[i]*rowP}px,0,0)`);
    cards.forEach((c,i)=>{
      const dir=i===0?-1:1;
      const sideProgress=clamp(i===2?(scrollP-1/6)*1.2:scrollP*1.2);
      const sideEase=1-Math.pow(1-sideProgress,2);
      const rise=desktop&&!reduced&&i!==1?-160*sideEase:0;
      c.style.transform=reduced||!desktop?'none':`translate(${dir*100*remaining}%,${-100*remaining}%) translate3d(0,${rise}px,0) rotate(${dir*30*remaining}deg)`;
    });
    holders.forEach((h,i)=>{
      const item=geometry.holders[i];
      const p=clamp((scrollY+innerHeight-item.top)/(innerHeight+item.height));
      const sign=i===1?1:-1;
      const initial=full?15+i:5+i;
      const target=full?15+i:5+i;
      const ease=1-Math.pow(1-p,2);
      const xy=sign*initial*(1-2*ease);
      const z=sign*(full?20:10)*(1-ease)-sign*target*ease;
      h.querySelector('.floating-card').style.transform=reduced?'none':`rotateZ(${z}deg) rotateY(${xy}deg) rotateX(${xy}deg)`;
    });
    if(movingText){
      const p=clamp((scrollY+innerHeight-geometry.floatTop)/(innerHeight+geometry.floatHeight));
      movingText.style.transform=`translate3d(${innerWidth-(innerWidth+geometry.textWidth)*p}px,0,0)`;
    }
    cta?.classList.toggle('is-visible',cta.getBoundingClientRect().bottom<innerHeight+50);
    hero.dataset.motionReady='true';
    hero.dataset.entrance=entrance.toFixed(3);
    if(entrance<1&&frozen===null&&!reduced)raf=requestAnimationFrame(frame);
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(frame);}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',measure,{passive:true});
  reduce.addEventListener('change',()=>{start=performance.now()-2000;measure();});
  document.querySelectorAll('.replay-motion').forEach(b=>b.addEventListener('click',()=>{
    start=performance.now();hero.scrollIntoView({behavior:'instant',block:'start'});schedule();
  }));
  document.fonts.ready.then(measure);
  addEventListener('load',measure,{once:true});
  measure();
  // Native scroll-snap rail supports touch, keyboard and buttons, no autoplay.
  const track=document.querySelector('.rail-track');
  if(track){
    const controls=[...document.querySelectorAll('[data-rail]')];
    const update=()=>controls.forEach(b=>b.disabled=Number(b.dataset.rail)<0?track.scrollLeft<2:track.scrollLeft+track.clientWidth>=track.scrollWidth-2);
    controls.forEach(b=>b.addEventListener('click',()=>track.scrollBy({left:Number(b.dataset.rail)*(track.firstElementChild.offsetWidth+24),behavior:reduce.matches?'instant':'smooth'})));
    track.addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
  }
})();
