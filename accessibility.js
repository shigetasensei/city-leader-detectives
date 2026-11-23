/* Display options: Light / Dark / Auto and an easy-to-read font. Saved on this device. */
(function(){
  var root=document.documentElement,KT='cld-theme',KF='cld-font';
  function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  var qs=(location.search.match(/[?&]theme=(light|dark)/)||[])[1];
  var KE='cld-easy';
  var theme=qs||get(KT)||'auto', font=get(KF)==='on', easy=(/[?&]level=easy/.test(location.search))||get(KE)==='on';
  var mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
  function apply(){
    var dark=theme==='dark'||(theme==='auto'&&mq&&mq.matches);
    root.classList.toggle('a11y-dark',dark);
    root.classList.toggle('a11y-font',font);
    if(font&&!document.getElementById('a11y-fontlink')){
      var l=document.createElement('link');l.id='a11y-fontlink';l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap';
      document.head.appendChild(l);
    }
  }
  apply();
  if(mq&&mq.addEventListener)mq.addEventListener('change',apply);
  if(!document.querySelector('link[href$="accessibility.css"]')){
    var c=document.createElement('link');c.rel='stylesheet';c.href='accessibility.css';document.head.appendChild(c);
  }

  /* ---- Reading level: swap text for Easy English ---- */
  var SEL='p,li,h1,h2,h3,summary,span.rt,.fb,.msg',obs=null,timer=null;
  function nrm(t){return t.replace(/\s+/g,' ').trim()}
  function swapAll(root){
    var M=window.CLD_EASY;if(!M)return;
    if(obs)obs.disconnect();
    (root||document).querySelectorAll(SEL).forEach(function(el){
      if(el.__easy!==undefined){if(el.innerHTML===el.__out)return;delete el.__easy;delete el.__out}
      if(el.closest('.a11y-fab'))return;
      if(el.querySelector('button,input,textarea,select'))return;
      var k=nrm(el.textContent),h=M[k];if(h===undefined)return;
      var as=[].map.call(el.querySelectorAll('a'),function(a){return a.outerHTML});
      el.__easy=el.innerHTML;
      el.innerHTML=h.replace(/\{a(\d)\}/g,function(_,n){return as[n-1]||''});
      el.__out=el.innerHTML;
    });
    watch();
  }
  function restoreAll(){
    if(obs)obs.disconnect();
    document.querySelectorAll(SEL).forEach(function(el){if(el.__easy!==undefined){if(el.innerHTML===el.__out)el.innerHTML=el.__easy;delete el.__easy;delete el.__out;}});
  }
  function watch(){
    if(!window.MutationObserver)return;
    if(!obs)obs=new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(function(){if(easy)swapAll()},120)});
    obs.observe(document.body,{childList:true,subtree:true});
  }
  function loadEasy(cb){
    if(window.CLD_EASY)return cb();
    var s=document.createElement('script');s.src='easy-english.js';s.onload=cb;document.head.appendChild(s);
  }
  function applyLevel(){
    document.documentElement.classList.toggle('a11y-easy',easy);
    if(easy)loadEasy(function(){swapAll()});else restoreAll();
  }
  function build(){
    var box=document.createElement('div');box.className='a11y-fab';
    box.innerHTML='<button type="button" aria-expanded="false" aria-controls="a11yPanel">🎨 Display</button>'+
    '<div class="a11y-panel" id="a11yPanel" role="dialog" aria-label="Display options" hidden>'+
    '<h2>Display options</h2>'+
    '<div class="grp"><p class="lab">Colors</p><div class="opts" data-g="theme">'+
    '<button type="button" data-v="auto">🖥️ Auto</button><button type="button" data-v="light">☀️ Light</button><button type="button" data-v="dark">🌙 Dark</button></div></div>'+
    '<div class="grp"><p class="lab">Reading level</p><div class="opts" data-g="level">'+
    '<button type="button" data-v="off">Standard</button><button type="button" data-v="on">Easy English</button></div></div>'+
    '<div class="grp"><p class="lab">Font</p><div class="opts" data-g="font">'+
    '<button type="button" data-v="off">Normal</button><button type="button" data-v="on">Easy to read</button></div></div>'+
    '<button type="button" class="x">Close</button></div>';
    document.body.appendChild(box);
    var btn=box.querySelector('.a11y-fab>button'),panel=box.querySelector('.a11y-panel');
    function sync(){
      box.querySelectorAll('[data-g=theme] button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.v===theme))});
      box.querySelectorAll('[data-g=font] button').forEach(function(b){b.setAttribute('aria-pressed',String((b.dataset.v==='on')===font))});
      box.querySelectorAll('[data-g=level] button').forEach(function(b){b.setAttribute('aria-pressed',String((b.dataset.v==='on')===easy))});
    }
    function toggle(open){panel.hidden=!open;btn.setAttribute('aria-expanded',String(open));}
    btn.addEventListener('click',function(){toggle(panel.hidden)});
    box.querySelector('.x').addEventListener('click',function(){toggle(false);btn.focus()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){toggle(false);btn.focus()}});
    box.querySelectorAll('[data-g=theme] button').forEach(function(b){b.addEventListener('click',function(){theme=b.dataset.v;set(KT,theme);apply();sync()})});
    box.querySelectorAll('[data-g=font] button').forEach(function(b){b.addEventListener('click',function(){font=b.dataset.v==='on';set(KF,font?'on':'off');apply();sync()})});
    box.querySelectorAll('[data-g=level] button').forEach(function(b){b.addEventListener('click',function(){easy=b.dataset.v==='on';set(KE,easy?'on':'off');applyLevel();sync()})});
    sync();
    if(easy)applyLevel();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();

/* Stop & Think card before "Back to the main page" */
(function(){
  var OPTS=[
    ['🔊','Audio','A voice read the words to me, so I could listen.'],
    ['👀','Pictures & colors','AI helped make pictures, maps and colors that make ideas easier to see.'],
    ['🌏','Auto translation','AI can change words into another language so I can understand.'],
    ['✂️','Chosen texts','AI helped pick or shorten the important facts for me.'],
    ['📖','Easy-to-read words','The words were made simpler, or the font was easier to read.']
  ];
  function build(){
    if(document.getElementById('aithink'))return;
    if(!/\/(ashiya|nishinomiya|kobe)\.html$/.test(location.pathname))return;
    var links=[].slice.call(document.querySelectorAll('a[href="index.html"]')).filter(function(a){return /back to (the )?main/i.test(a.textContent)});
    if(!links.length)return;
    var a=links[links.length-1];
    var anchor=(a.parentNode&&a.parentNode.tagName==='P'&&a.parentNode.children.length<=2)?a.parentNode:a;
    var d=document.createElement('section');d.id='aithink';d.className='aithink';d.setAttribute('aria-label','Stop and think about AI');
    var h='<h3>🛑 Stop &amp; think: how did AI help you here?</h3><p>Pick the one that helped you most on this page.</p><div class="ai-opts" role="group" aria-label="AI help choices">';
    OPTS.forEach(function(o,i){h+='<button type="button" aria-pressed="false" data-i="'+i+'">'+o[0]+' '+o[1]+'</button>'});
    h+='</div><p class="ai-say" aria-live="polite"></p>';
    d.innerHTML=h;
    anchor.parentNode.insertBefore(d,anchor);
    var say=d.querySelector('.ai-say');
    d.addEventListener('click',function(e){
      var b=e.target.closest('button[data-i]');if(!b)return;
      d.querySelectorAll('button[data-i]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      var o=OPTS[+b.getAttribute('data-i')];
      say.textContent='⭐ '+o[2]+' Tell a partner: Was it helpful? Was it always right?';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
