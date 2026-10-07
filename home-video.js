'use strict';
(() => {
  const video=document.getElementById('review-demo-video');
  if(!video)return;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection=navigator.connection;
  let wantedPlaying=!reduceMotion.matches&&!connection?.saveData;
  let inView=false;
  let autoPausing=false;
  video.muted=true;
  const pauseAutomatically=()=>{
    if(!video.paused){autoPausing=true;video.pause();}
  };
  const update=()=>{
    if(!inView||document.hidden){pauseAutomatically();return;}
    if(wantedPlaying)video.play().catch(()=>{/* Native controls remain available if autoplay is blocked. */});
  };
  video.addEventListener('pause',()=>{if(!autoPausing)wantedPlaying=false;autoPausing=false;});
  video.addEventListener('play',()=>{wantedPlaying=true;});
  const preferenceChanged=()=>{
    if(reduceMotion.matches||connection?.saveData){wantedPlaying=false;pauseAutomatically();}
  };
  reduceMotion.addEventListener('change',preferenceChanged);
  connection?.addEventListener?.('change',preferenceChanged);
  document.addEventListener('visibilitychange',update);
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{inView=entries[0].isIntersecting&&entries[0].intersectionRatio>=0.15;update();},{threshold:0.15}).observe(video);
  }else{inView=true;update();}
  window.addEventListener('pagehide',pauseAutomatically);
  window.addEventListener('pageshow',update);
})();
