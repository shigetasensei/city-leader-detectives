/* Display options: Light / Dark / Auto and an easy-to-read font. Saved on this device. */
(function(){
  var root=document.documentElement,KT='cld-theme',KF='cld-font';
  function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  var qs=(location.search.match(/[?&]theme=(light|dark)/)||[])[1];
  var theme=qs||get(KT)||'auto', font=get(KF)==='on';
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
  function build(){
    var box=document.createElement('div');box.className='a11y-fab';
    box.innerHTML='<button type="button" aria-expanded="false" aria-controls="a11yPanel">🎨 Display</button>'+
    '<div class="a11y-panel" id="a11yPanel" role="dialog" aria-label="Display options" hidden>'+
    '<h2>Display options</h2>'+
    '<div class="grp"><p class="lab">Colors</p><div class="opts" data-g="theme">'+
    '<button type="button" data-v="auto">🖥️ Auto</button><button type="button" data-v="light">☀️ Light</button><button type="button" data-v="dark">🌙 Dark</button></div></div>'+
    '<div class="grp"><p class="lab">Font</p><div class="opts" data-g="font">'+
    '<button type="button" data-v="off">Normal</button><button type="button" data-v="on">Easy to read</button></div></div>'+
    '<button type="button" class="x">Close</button></div>';
    document.body.appendChild(box);
    var btn=box.querySelector('.a11y-fab>button'),panel=box.querySelector('.a11y-panel');
    function sync(){
      box.querySelectorAll('[data-g=theme] button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.v===theme))});
      box.querySelectorAll('[data-g=font] button').forEach(function(b){b.setAttribute('aria-pressed',String((b.dataset.v==='on')===font))});
    }
    function toggle(open){panel.hidden=!open;btn.setAttribute('aria-expanded',String(open));}
    btn.addEventListener('click',function(){toggle(panel.hidden)});
    box.querySelector('.x').addEventListener('click',function(){toggle(false);btn.focus()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){toggle(false);btn.focus()}});
    box.querySelectorAll('[data-g=theme] button').forEach(function(b){b.addEventListener('click',function(){theme=b.dataset.v;set(KT,theme);apply();sync()})});
    box.querySelectorAll('[data-g=font] button').forEach(function(b){b.addEventListener('click',function(){font=b.dataset.v==='on';set(KF,font?'on':'off');apply();sync()})});
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
