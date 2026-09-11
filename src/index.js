const html = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
<meta name="theme-color" content="#090b11" />
<title>Myphone Duo</title>
<style>
  :root{
    --left-angle:0deg;
    --right-angle:0deg;
    --left-fold:0;
    --right-fold:0;
    --hinge-glow:0;
  }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#05070a;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif}
  body{overscroll-behavior:none;touch-action:pan-x}
  .viewport{position:fixed;inset:0;overflow:hidden;background:#05070a;perspective:760px;perspective-origin:50% 50%;isolation:isolate}
  .world-bg{position:absolute;inset:-14%;background:radial-gradient(circle at 50% 44%,#30343d 0%,#141820 33%,#080a0f 61%,#030405 100%);transform:translateZ(-120px) scale(1.2)}
  .rear-glass{position:absolute;inset:0;background:linear-gradient(100deg,#080b10 0%,#10141b 43%,#06080c 49%,#171b22 54%,#080b10 100%);opacity:.86}
  .hinge-core{position:absolute;z-index:1;left:50%;top:-3%;bottom:-3%;width:9px;transform:translateX(-50%) translateZ(-4px);border-radius:10px;background:linear-gradient(90deg,#090a0d,#565c67 42%,#14171d 58%,#030405);box-shadow:0 0 24px rgba(0,0,0,.8),0 0 14px rgba(255,255,255,.08);opacity:calc(.18 + var(--hinge-glow) * .72)}
  .fold-stage{position:absolute;inset:0;transform-style:preserve-3d;z-index:2}
  .panel{position:absolute;top:0;bottom:0;width:50%;overflow:hidden;transform-style:preserve-3d;backface-visibility:hidden;will-change:transform;transition:transform 62ms linear,filter 62ms linear;box-shadow:0 0 0 1px rgba(255,255,255,.04) inset}
  .panel.left{left:0;transform-origin:100% 50%;transform:rotateY(var(--left-angle));filter:brightness(calc(1 - var(--left-fold) * .16)) saturate(calc(1 - var(--left-fold) * .08));box-shadow:inset -1px 0 rgba(255,255,255,.09),-20px 0 44px rgba(0,0,0,.22)}
  .panel.right{right:0;transform-origin:0 50%;transform:rotateY(var(--right-angle));filter:brightness(calc(1 - var(--right-fold) * .16)) saturate(calc(1 - var(--right-fold) * .08));box-shadow:inset 1px 0 rgba(255,255,255,.09),20px 0 44px rgba(0,0,0,.22)}
  .screen{position:absolute;top:0;width:200%;height:100%;overflow:hidden;background:#15233a;transform:translateZ(1px)}
  .panel.left .screen{left:0}
  .panel.right .screen{left:-100%}
  .wallpaper{position:absolute;inset:-6%;background:radial-gradient(circle at 20% 15%,rgba(102,186,255,.64),transparent 28%),radial-gradient(circle at 78% 19%,rgba(183,123,255,.47),transparent 29%),radial-gradient(circle at 72% 76%,rgba(255,109,174,.32),transparent 31%),linear-gradient(148deg,#0c1c30 0%,#244f79 38%,#433176 68%,#11172a 100%);filter:saturate(1.08)}
  .desktop{position:absolute;inset:0;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.34);user-select:none}
  .status{height:50px;padding:12px max(18px,env(safe-area-inset-left)) 0;display:flex;justify-content:space-between;align-items:flex-start;font-size:14px;font-weight:650}
  .status .right{display:flex;gap:9px;align-items:center;opacity:.95}
  .pages-wrap{position:absolute;left:0;right:0;top:58px;bottom:112px;overflow:hidden}
  .pages{height:100%;display:flex;will-change:transform;transition:transform .36s cubic-bezier(.22,.86,.28,1)}
  .page{min-width:100%;padding:11px 20px 16px;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:min-content;gap:22px 15px;align-content:start}
  .app{display:flex;flex-direction:column;align-items:center;gap:7px;font-size:12px}
  .icon{width:min(15vw,66px);aspect-ratio:1;border-radius:22%;display:grid;place-items:center;font-size:min(8vw,34px);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 8px 22px rgba(0,0,0,.18);backdrop-filter:blur(5px)}
  .i1{background:linear-gradient(145deg,#63c1ff,#3478f6)}.i2{background:linear-gradient(145deg,#78e79f,#24a957)}.i3{background:linear-gradient(145deg,#ff8299,#e73659)}.i4{background:linear-gradient(145deg,#ffd772,#f29b22)}.i5{background:linear-gradient(145deg,#9998ff,#5d5ee9)}.i6{background:linear-gradient(145deg,#48dde9,#1696b1)}.i7{background:linear-gradient(145deg,#fff,#c9ced4);color:#23272f}.i8{background:linear-gradient(145deg,#4b5363,#151a22)}
  .dots{position:absolute;left:0;right:0;bottom:97px;display:flex;justify-content:center;gap:7px}.dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.42)}.dot.active{background:#fff}
  .dock{position:absolute;left:14px;right:14px;bottom:max(12px,env(safe-area-inset-bottom));height:82px;border-radius:30px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(28px) saturate(1.45);display:flex;align-items:center;justify-content:space-around;padding:0 12px}.dock .icon{width:58px;max-width:16vw}
  .surface-falloff,.surface-blur,.surface-blur-strong,.surface-gloss,.edge-frame{position:absolute;pointer-events:none;z-index:20}
  .surface-falloff{inset:0;opacity:0;transition:opacity 62ms linear}
  .panel.left .surface-falloff{opacity:var(--left-fold);background:linear-gradient(90deg,rgba(0,0,0,.72) 0%,rgba(4,7,12,.43) 16%,rgba(12,17,25,.15) 42%,rgba(0,0,0,0) 83%)}
  .panel.right .surface-falloff{opacity:var(--right-fold);background:linear-gradient(270deg,rgba(0,0,0,.72) 0%,rgba(4,7,12,.43) 16%,rgba(12,17,25,.15) 42%,rgba(0,0,0,0) 83%)}
  .surface-blur{top:-4%;bottom:-4%;width:60%;opacity:0;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);transition:opacity 62ms linear}
  .surface-blur-strong{top:-4%;bottom:-4%;width:27%;opacity:0;backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px);transition:opacity 62ms linear}
  .panel.left .surface-blur{left:-2%;opacity:calc(var(--left-fold) * .8);-webkit-mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.86) 35%,transparent 100%);mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.86) 35%,transparent 100%)}
  .panel.left .surface-blur-strong{left:-2%;opacity:calc(var(--left-fold) * .95);-webkit-mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.94) 52%,transparent 100%);mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.94) 52%,transparent 100%)}
  .panel.right .surface-blur{right:-2%;opacity:calc(var(--right-fold) * .8);-webkit-mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.86) 35%,transparent 100%);mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.86) 35%,transparent 100%)}
  .panel.right .surface-blur-strong{right:-2%;opacity:calc(var(--right-fold) * .95);-webkit-mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.94) 52%,transparent 100%);mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.94) 52%,transparent 100%)}
  .surface-gloss{inset:0;opacity:.18;mix-blend-mode:screen;background:linear-gradient(112deg,rgba(255,255,255,.16),transparent 28%,transparent 67%,rgba(255,255,255,.08))}
  .edge-frame{top:0;bottom:0;width:4px;background:linear-gradient(90deg,#08090b,#b7bbc3 46%,#34373d 72%,#090a0c);box-shadow:0 0 10px rgba(255,255,255,.16),0 0 18px rgba(0,0,0,.5)}
  .panel.left .edge-frame{left:0;opacity:calc(.12 + var(--left-fold) * .88)}
  .panel.right .edge-frame{right:0;opacity:calc(.12 + var(--right-fold) * .88)}
  .hinge-shade{position:absolute;top:0;bottom:0;width:12%;z-index:22;pointer-events:none;opacity:0;transition:opacity 62ms linear}
  .panel.left .hinge-shade{right:0;opacity:calc(var(--left-fold) * .72);background:linear-gradient(270deg,rgba(0,0,0,.48),transparent)}
  .panel.right .hinge-shade{left:0;opacity:calc(var(--right-fold) * .72);background:linear-gradient(90deg,rgba(0,0,0,.48),transparent)}
  .permission{position:absolute;z-index:50;left:50%;top:50%;transform:translate(-50%,-50%);width:min(88vw,390px);padding:21px;border-radius:28px;background:rgba(12,17,25,.7);color:#fff;text-align:center;backdrop-filter:blur(30px) saturate(1.25);border:1px solid rgba(255,255,255,.16);box-shadow:0 24px 70px rgba(0,0,0,.38)}
  .permission h1{font-size:23px;margin:0 0 8px}.permission p{opacity:.78;font-size:14px;line-height:1.55;margin:0 0 16px}.permission button{border:0;border-radius:16px;padding:12px 18px;font-size:15px;font-weight:720;background:#fff;color:#111820}.hidden{display:none}
  .recenter{position:absolute;z-index:40;left:50%;bottom:max(108px,calc(env(safe-area-inset-bottom) + 104px));transform:translateX(-50%);border:1px solid rgba(255,255,255,.16);background:rgba(9,13,19,.34);color:rgba(255,255,255,.72);font-size:11px;padding:7px 10px;border-radius:99px;backdrop-filter:blur(15px);opacity:0;pointer-events:none;transition:opacity .25s}.recenter.show{opacity:1;pointer-events:auto}
  @media (prefers-reduced-motion:reduce){.panel,.surface-falloff,.surface-blur,.surface-blur-strong,.hinge-shade{transition:none}.pages{transition:none}}
</style>
</head>
<body>
<div class="viewport" id="viewport">
  <div class="world-bg"></div><div class="rear-glass"></div><div class="hinge-core"></div>
  <div class="fold-stage" id="foldStage">
    <div class="panel left">
      <div class="screen screen-copy"></div>
      <div class="surface-falloff"></div><div class="surface-blur"></div><div class="surface-blur-strong"></div><div class="surface-gloss"></div><div class="hinge-shade"></div><div class="edge-frame"></div>
    </div>
    <div class="panel right">
      <div class="screen screen-copy"></div>
      <div class="surface-falloff"></div><div class="surface-blur"></div><div class="surface-blur-strong"></div><div class="surface-gloss"></div><div class="hinge-shade"></div><div class="edge-frame"></div>
    </div>
  </div>
  <button class="recenter" id="recenter">重新校准</button>
  <div class="permission" id="permission"><h1>Myphone Duo</h1><p>点击启用动作感应。左右倾斜会被映射成“折叠角”：界面仍连续铺在屏幕上，但左右两半不再处于同一平面，外缘会随角度逐渐失焦与隐去。</p><button id="startMotion">启用动作感应</button></div>
</div>
<template id="desktopTemplate">
  <div class="wallpaper"></div>
  <div class="desktop">
    <div class="status"><div class="clock">9:41</div><div class="right"><span>◔</span><span>⌁</span><span>▰</span></div></div>
    <div class="pages-wrap"><div class="pages">
      <section class="page">
        <div class="app"><div class="icon i1">☁</div><span>天气</span></div><div class="app"><div class="icon i2">✆</div><span>电话</span></div><div class="app"><div class="icon i3">♥</div><span>健康</span></div><div class="app"><div class="icon i4">☀</div><span>照片</span></div>
        <div class="app"><div class="icon i5">✦</div><span>音乐</span></div><div class="app"><div class="icon i6">◎</div><span>浏览器</span></div><div class="app"><div class="icon i7">◷</div><span>时钟</span></div><div class="app"><div class="icon i8">⚙</div><span>设置</span></div>
        <div class="app"><div class="icon i2">✉</div><span>信息</span></div><div class="app"><div class="icon i4">◫</div><span>日历</span></div><div class="app"><div class="icon i1">⌖</div><span>地图</span></div><div class="app"><div class="icon i5">◉</div><span>相机</span></div>
      </section>
      <section class="page">
        <div class="app"><div class="icon i6">⌁</div><span>文件</span></div><div class="app"><div class="icon i3">♫</div><span>播客</span></div><div class="app"><div class="icon i1">↻</div><span>同步</span></div><div class="app"><div class="icon i8">◈</div><span>工具</span></div>
        <div class="app"><div class="icon i4">✎</div><span>备忘录</span></div><div class="app"><div class="icon i2">✓</div><span>提醒</span></div><div class="app"><div class="icon i5">★</div><span>收藏</span></div><div class="app"><div class="icon i7">☰</div><span>阅读</span></div>
      </section>
    </div></div>
    <div class="dots"><span class="dot active"></span><span class="dot"></span></div>
    <div class="dock"><div class="icon i2">✆</div><div class="icon i6">◎</div><div class="icon i3">♫</div><div class="icon i1">✉</div></div>
  </div>
</template>
<script>
(function(){
  var root=document.documentElement;
  var permission=document.getElementById('permission');
  var startBtn=document.getElementById('startMotion');
  var recenter=document.getElementById('recenter');
  var viewport=document.getElementById('viewport');
  var tpl=document.getElementById('desktopTemplate');
  document.querySelectorAll('.screen-copy').forEach(function(el){el.appendChild(tpl.content.cloneNode(true));});

  var page=0,startX=null,drag=0;
  var baseline=null,smooth=0,target=0,raf=0,lastRaw=0;
  var motionEnabled=false;

  function setPagesTransform(value,animate){
    document.querySelectorAll('.pages').forEach(function(el){
      el.style.transition=animate?'transform .36s cubic-bezier(.22,.86,.28,1)':'none';
      el.style.transform=value;
    });
  }
  function syncDots(){
    document.querySelectorAll('.dots').forEach(function(group){
      group.querySelectorAll('.dot').forEach(function(dot,i){dot.classList.toggle('active',i===page);});
    });
  }

  viewport.addEventListener('touchstart',function(e){
    if(!permission.classList.contains('hidden')) return;
    startX=e.touches[0].clientX;drag=0;setPagesTransform('translateX(' + (-page*100) + '%)',false);
  },{passive:true});
  viewport.addEventListener('touchmove',function(e){
    if(startX===null) return;
    drag=e.touches[0].clientX-startX;
    setPagesTransform('translateX(calc(' + (-page*100) + '% + ' + drag + 'px))',false);
  },{passive:true});
  viewport.addEventListener('touchend',function(){
    if(startX===null) return;
    if(Math.abs(drag)>innerWidth*.16) page=Math.max(0,Math.min(1,page+(drag<0?1:-1)));
    setPagesTransform('translateX(' + (-page*100) + '%)',true);syncDots();startX=null;drag=0;
  },{passive:true});

  function lateralAngle(e){
    var a=0;
    if(screen.orientation && typeof screen.orientation.angle==='number') a=screen.orientation.angle;
    else if(typeof window.orientation==='number') a=window.orientation;
    if(a===90) return e.beta==null?0:e.beta;
    if(a===270 || a===-90) return e.beta==null?0:-e.beta;
    if(a===180) return e.gamma==null?0:-e.gamma;
    return e.gamma==null?0:e.gamma;
  }

  function renderFold(v){
    var dead=Math.abs(v)<1.1?0:v;
    var p=Math.min(Math.abs(dead)/24,1);
    var eased=Math.pow(p,.86);
    var maxFold=72;
    var angle=eased*maxFold;
    var left=0,right=0,leftP=0,rightP=0;
    if(dead<0){left=angle;leftP=eased;right=-Math.min(4,eased*4);}
    if(dead>0){right=-angle;rightP=eased;left=Math.min(4,eased*4);}
    root.style.setProperty('--left-angle',left.toFixed(2)+'deg');
    root.style.setProperty('--right-angle',right.toFixed(2)+'deg');
    root.style.setProperty('--left-fold',leftP.toFixed(3));
    root.style.setProperty('--right-fold',rightP.toFixed(3));
    root.style.setProperty('--hinge-glow',eased.toFixed(3));
  }

  function tick(){
    smooth+=(target-smooth)*.115;
    renderFold(smooth);
    if(Math.abs(target-smooth)>.01) raf=requestAnimationFrame(tick); else raf=0;
  }
  function setTarget(v){target=Math.max(-35,Math.min(35,v));if(!raf) raf=requestAnimationFrame(tick);}

  function motionHandler(e){
    var raw=lateralAngle(e);lastRaw=raw;
    if(baseline===null) baseline=raw;
    setTarget(raw-baseline);
  }

  function calibrate(){baseline=lastRaw;smooth=0;target=0;renderFold(0);}
  recenter.addEventListener('click',calibrate);

  async function enableMotion(){
    try{
      if(typeof DeviceOrientationEvent!=='undefined' && typeof DeviceOrientationEvent.requestPermission==='function'){
        var state=await DeviceOrientationEvent.requestPermission();
        if(state!=='granted') throw new Error('permission denied');
      }
      window.addEventListener('deviceorientation',motionHandler,true);
      permission.classList.add('hidden');recenter.classList.add('show');motionEnabled=true;
      setTimeout(function(){recenter.classList.remove('show');},2800);
    }catch(err){
      permission.querySelector('p').textContent='没有获得动作感应权限。请检查浏览器的运动与方向访问权限后重试。';
    }
  }
  startBtn.addEventListener('click',enableMotion);

  viewport.addEventListener('dblclick',function(){if(motionEnabled) calibrate();});
  window.addEventListener('orientationchange',function(){setTimeout(function(){baseline=null;smooth=0;target=0;renderFold(0);},220);});

  function updateClock(){
    var d=new Date();var t=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    document.querySelectorAll('.clock').forEach(function(el){el.textContent=t;});
  }
  updateClock();setInterval(updateClock,30000);renderFold(0);
})();
</script>
</body>
</html>`;

export default {
  async fetch(){
    return new Response(html,{
      headers:{
        'content-type':'text/html; charset=UTF-8',
        'cache-control':'no-store',
        'permissions-policy':'accelerometer=(self), gyroscope=(self)'
      }
    });
  }
};
