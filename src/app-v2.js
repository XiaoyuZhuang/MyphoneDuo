const html = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no" />
<meta name="theme-color" content="#05070a" />
<title>Myphone Duo</title>
<style>
:root{
  --angle:0deg;
  --soft-opacity:0;
  --deep-opacity:0;
  --bloom-opacity:0;
  --shade-opacity:0;
  --feather-start:98%;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#040609;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif}
body{overscroll-behavior:none;touch-action:pan-x}
.viewport{position:fixed;inset:0;overflow:hidden;background:#040609;perspective:920px;perspective-origin:50% 50%;isolation:isolate}
.space{position:absolute;inset:-15%;background:radial-gradient(circle at 50% 46%,#181d27 0%,#0a0d13 45%,#030405 73%);transform:translateZ(-180px) scale(1.24)}
.screen-plane{position:absolute;inset:0;z-index:3;transform-style:preserve-3d;backface-visibility:hidden;transform:rotateY(var(--angle));transform-origin:0% 50%;will-change:transform;transition:transform 54ms linear,transform-origin 0s;background:transparent;overflow:visible}
.screen-plane.pivot-left{transform-origin:0% 50%}.screen-plane.pivot-right{transform-origin:100% 50%}
.surface-layer{position:absolute;inset:0;pointer-events:none;transform:translateZ(0)}
.surface-layer .visual{position:absolute;inset:0}
.surface-sharp{z-index:4;overflow:hidden}
.surface-soft,.surface-deep,.surface-bloom{z-index:3;inset:-42px;overflow:visible;opacity:0;will-change:opacity,filter}
.surface-soft .visual,.surface-deep .visual,.surface-bloom .visual{inset:42px}
.surface-soft{filter:blur(4.5px) saturate(.98);opacity:var(--soft-opacity)}
.surface-deep{filter:blur(12px) saturate(.94) brightness(.96);opacity:var(--deep-opacity)}
.surface-bloom{filter:blur(25px) saturate(.9) brightness(.88);opacity:var(--bloom-opacity)}

/* The sharp surface itself feathers out at the raised edge, so there is no hard geometric seam. */
.screen-plane.lift-right .surface-sharp{-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 var(--feather-start),rgba(0,0,0,.88) 96.8%,rgba(0,0,0,.48) 98.6%,transparent 100%);mask-image:linear-gradient(90deg,#000 0%,#000 var(--feather-start),rgba(0,0,0,.88) 96.8%,rgba(0,0,0,.48) 98.6%,transparent 100%)}
.screen-plane.lift-left .surface-sharp{-webkit-mask-image:linear-gradient(270deg,#000 0%,#000 var(--feather-start),rgba(0,0,0,.88) 96.8%,rgba(0,0,0,.48) 98.6%,transparent 100%);mask-image:linear-gradient(270deg,#000 0%,#000 var(--feather-start),rgba(0,0,0,.88) 96.8%,rgba(0,0,0,.48) 98.6%,transparent 100%)}

/* Broad masks blend full-screen blurred copies. There are no rectangular backdrop-filter patches. */
.screen-plane.lift-right .surface-soft{-webkit-mask-image:linear-gradient(90deg,transparent 0%,transparent 50%,rgba(0,0,0,.08) 60%,rgba(0,0,0,.28) 70%,rgba(0,0,0,.62) 82%,#000 100%);mask-image:linear-gradient(90deg,transparent 0%,transparent 50%,rgba(0,0,0,.08) 60%,rgba(0,0,0,.28) 70%,rgba(0,0,0,.62) 82%,#000 100%)}
.screen-plane.lift-right .surface-deep{-webkit-mask-image:linear-gradient(90deg,transparent 0%,transparent 66%,rgba(0,0,0,.08) 72%,rgba(0,0,0,.38) 83%,rgba(0,0,0,.8) 93%,#000 100%);mask-image:linear-gradient(90deg,transparent 0%,transparent 66%,rgba(0,0,0,.08) 72%,rgba(0,0,0,.38) 83%,rgba(0,0,0,.8) 93%,#000 100%)}
.screen-plane.lift-right .surface-bloom{-webkit-mask-image:linear-gradient(90deg,transparent 0%,transparent 78%,rgba(0,0,0,.06) 83%,rgba(0,0,0,.42) 91%,#000 100%);mask-image:linear-gradient(90deg,transparent 0%,transparent 78%,rgba(0,0,0,.06) 83%,rgba(0,0,0,.42) 91%,#000 100%)}
.screen-plane.lift-left .surface-soft{-webkit-mask-image:linear-gradient(270deg,transparent 0%,transparent 50%,rgba(0,0,0,.08) 60%,rgba(0,0,0,.28) 70%,rgba(0,0,0,.62) 82%,#000 100%);mask-image:linear-gradient(270deg,transparent 0%,transparent 50%,rgba(0,0,0,.08) 60%,rgba(0,0,0,.28) 70%,rgba(0,0,0,.62) 82%,#000 100%)}
.screen-plane.lift-left .surface-deep{-webkit-mask-image:linear-gradient(270deg,transparent 0%,transparent 66%,rgba(0,0,0,.08) 72%,rgba(0,0,0,.38) 83%,rgba(0,0,0,.8) 93%,#000 100%);mask-image:linear-gradient(270deg,transparent 0%,transparent 66%,rgba(0,0,0,.08) 72%,rgba(0,0,0,.38) 83%,rgba(0,0,0,.8) 93%,#000 100%)}
.screen-plane.lift-left .surface-bloom{-webkit-mask-image:linear-gradient(270deg,transparent 0%,transparent 78%,rgba(0,0,0,.06) 83%,rgba(0,0,0,.42) 91%,#000 100%);mask-image:linear-gradient(270deg,transparent 0%,transparent 78%,rgba(0,0,0,.06) 83%,rgba(0,0,0,.42) 91%,#000 100%)}

.edge-shade{position:absolute;z-index:5;top:-4%;bottom:-4%;width:48%;pointer-events:none;opacity:var(--shade-opacity);filter:blur(12px)}
.screen-plane.lift-right .edge-shade{right:-7%;background:linear-gradient(270deg,rgba(0,0,0,.58) 0%,rgba(3,5,8,.27) 31%,rgba(3,5,8,.06) 63%,transparent 100%)}
.screen-plane.lift-left .edge-shade{left:-7%;background:linear-gradient(90deg,rgba(0,0,0,.58) 0%,rgba(3,5,8,.27) 31%,rgba(3,5,8,.06) 63%,transparent 100%)}

.wallpaper{position:absolute;inset:-5%;background:radial-gradient(circle at 18% 16%,rgba(94,185,255,.66),transparent 28%),radial-gradient(circle at 79% 18%,rgba(183,120,255,.5),transparent 30%),radial-gradient(circle at 72% 78%,rgba(255,108,172,.34),transparent 31%),linear-gradient(148deg,#0b1c30 0%,#23507c 37%,#443176 68%,#11172a 100%);filter:saturate(1.08)}
.desktop{position:absolute;inset:0;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.36);user-select:none}
.status{height:50px;padding:12px max(18px,env(safe-area-inset-left)) 0;display:flex;justify-content:space-between;align-items:flex-start;font-size:14px;font-weight:650}.status .right{display:flex;gap:9px;align-items:center;opacity:.95}
.pages-wrap{position:absolute;left:0;right:0;top:58px;bottom:112px;overflow:hidden}.pages{height:100%;display:flex;will-change:transform;transition:transform .36s cubic-bezier(.22,.86,.28,1)}
.page{min-width:100%;padding:11px 20px 16px;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:min-content;gap:22px 15px;align-content:start}
.app{display:flex;flex-direction:column;align-items:center;gap:7px;font-size:12px}.icon{width:min(15vw,66px);aspect-ratio:1;border-radius:22%;display:grid;place-items:center;font-size:min(8vw,34px);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 8px 22px rgba(0,0,0,.18);backdrop-filter:blur(5px)}
.i1{background:linear-gradient(145deg,#63c1ff,#3478f6)}.i2{background:linear-gradient(145deg,#78e79f,#24a957)}.i3{background:linear-gradient(145deg,#ff8299,#e73659)}.i4{background:linear-gradient(145deg,#ffd772,#f29b22)}.i5{background:linear-gradient(145deg,#9998ff,#5d5ee9)}.i6{background:linear-gradient(145deg,#48dde9,#1696b1)}.i7{background:linear-gradient(145deg,#fff,#c9ced4);color:#23272f}.i8{background:linear-gradient(145deg,#4b5363,#151a22)}
.dots{position:absolute;left:0;right:0;bottom:97px;display:flex;justify-content:center;gap:7px}.dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.42)}.dot.active{background:#fff}
.dock{position:absolute;left:14px;right:14px;bottom:max(12px,env(safe-area-inset-bottom));height:82px;border-radius:30px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(28px) saturate(1.45);display:flex;align-items:center;justify-content:space-around;padding:0 12px}.dock .icon{width:58px;max-width:16vw}
.permission{position:absolute;z-index:50;left:50%;top:50%;transform:translate(-50%,-50%);width:min(88vw,390px);padding:21px;border-radius:28px;background:rgba(12,17,25,.72);color:#fff;text-align:center;backdrop-filter:blur(30px) saturate(1.25);border:1px solid rgba(255,255,255,.16);box-shadow:0 24px 70px rgba(0,0,0,.38)}.permission h1{font-size:23px;margin:0 0 8px}.permission p{opacity:.8;font-size:14px;line-height:1.55;margin:0 0 16px}.permission button{border:0;border-radius:16px;padding:12px 18px;font-size:15px;font-weight:720;background:#fff;color:#111820}.hidden{display:none}
.recenter{position:absolute;z-index:40;left:50%;bottom:max(108px,calc(env(safe-area-inset-bottom) + 104px));transform:translateX(-50%);border:1px solid rgba(255,255,255,.14);background:rgba(9,13,19,.3);color:rgba(255,255,255,.72);font-size:11px;padding:7px 10px;border-radius:99px;backdrop-filter:blur(15px);opacity:0;pointer-events:none;transition:opacity .25s}.recenter.show{opacity:1;pointer-events:auto}
@media(prefers-reduced-motion:reduce){.screen-plane{transition:none}.pages{transition:none}}
</style>
</head>
<body>
<div class="viewport">
  <div class="space"></div>
  <div class="screen-plane pivot-left" id="screenPlane">
    <div class="surface-layer surface-bloom"><div class="visual"></div></div>
    <div class="surface-layer surface-deep"><div class="visual"></div></div>
    <div class="surface-layer surface-soft"><div class="visual"></div></div>
    <div class="surface-layer surface-sharp"><div class="visual" id="masterVisual">
      <div class="wallpaper"></div>
      <div class="desktop">
        <div class="status"><div class="clock">9:41</div><div class="right"><span>◔</span><span>⌁</span><span>▰</span></div></div>
        <div class="pages-wrap" id="pagesWrap"><div class="pages">
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
    </div></div>
    <div class="edge-shade"></div>
  </div>
  <button class="recenter" id="recenter">重新校准</button>
  <div class="permission" id="permission"><h1>Myphone Duo</h1><p>点击启用动作感应。画面使用连续景深式边缘过渡，倾斜的一侧会逐渐失焦，并把模糊自然延伸到屏幕轮廓之外。</p><button id="startMotion">启用动作感应</button></div>
</div>
<script>
(function(){
  var root=document.documentElement;
  var plane=document.getElementById('screenPlane');
  var master=document.getElementById('masterVisual');
  var copies=[].slice.call(document.querySelectorAll('.surface-soft .visual,.surface-deep .visual,.surface-bloom .visual'));
  copies.forEach(function(el){var c=master.cloneNode(true);c.removeAttribute('id');c.querySelectorAll('[id]').forEach(function(n){n.removeAttribute('id');});el.replaceWith(c);c.classList.add('visual');});

  var permission=document.getElementById('permission');
  var startButton=document.getElementById('startMotion');
  var recenter=document.getElementById('recenter');
  var wrap=document.getElementById('pagesWrap');
  var allPages=function(){return [].slice.call(document.querySelectorAll('.pages'));};
  var dots=[].slice.call(document.querySelectorAll('.surface-sharp .dot'));
  var baseline=null,smooth=0,page=0,touchStart=null,drag=0;

  function orientationAngle(){if(screen.orientation&&typeof screen.orientation.angle==='number')return screen.orientation.angle;if(typeof window.orientation==='number')return window.orientation;return 0;}
  function readRoll(e){var a=((orientationAngle()%360)+360)%360;if(a===90)return(e.beta||0);if(a===270)return-(e.beta||0);if(a===180)return(e.gamma||0);return-(e.gamma||0);}
  function resetVisual(){root.style.setProperty('--angle','0deg');root.style.setProperty('--soft-opacity','0');root.style.setProperty('--deep-opacity','0');root.style.setProperty('--bloom-opacity','0');root.style.setProperty('--shade-opacity','0');root.style.setProperty('--feather-start','98%');plane.classList.remove('lift-left','lift-right','pivot-left','pivot-right');plane.classList.add('pivot-left');}
  function applyRoll(raw){
    if(raw==null||Number.isNaN(raw))return;
    if(baseline===null)baseline=raw;
    var delta=raw-baseline;if(delta>38)delta=38;if(delta<-38)delta=-38;
    smooth+=(delta-smooth)*.22;
    var dead=Math.abs(smooth)<.55?0:smooth;
    if(dead===0){resetVisual();return;}
    var amount=Math.min(Math.abs(dead),34);
    var p=Math.min(amount/32,1);
    plane.classList.remove('lift-left','lift-right','pivot-left','pivot-right');
    if(dead>0){plane.classList.add('lift-right','pivot-left');root.style.setProperty('--angle',amount.toFixed(2)+'deg');}
    else{plane.classList.add('lift-left','pivot-right');root.style.setProperty('--angle',(-amount).toFixed(2)+'deg');}
    root.style.setProperty('--soft-opacity',Math.min(.78,p*.92).toFixed(3));
    root.style.setProperty('--deep-opacity',Math.min(.76,Math.max(0,(p-.18)/.82)*.82).toFixed(3));
    root.style.setProperty('--bloom-opacity',Math.min(.72,Math.max(0,(p-.4)/.6)*.78).toFixed(3));
    root.style.setProperty('--shade-opacity',(Math.pow(p,1.2)*.68).toFixed(3));
    root.style.setProperty('--feather-start',(98-Math.min(7,p*7)).toFixed(2)+'%');
  }
  function handler(e){applyRoll(readRoll(e));}
  async function enable(){try{if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){var s=await DeviceOrientationEvent.requestPermission();if(s!=='granted')throw new Error('permission denied');}window.addEventListener('deviceorientation',handler,true);permission.classList.add('hidden');recenter.classList.add('show');}catch(err){permission.querySelector('p').textContent='没有获得动作感应权限。请检查浏览器的运动与方向访问权限后重试。';}}
  startButton.addEventListener('click',enable);
  recenter.addEventListener('click',function(){baseline=null;smooth=0;resetVisual();});
  window.addEventListener('orientationchange',function(){baseline=null;smooth=0;resetVisual();});
  if(screen.orientation&&screen.orientation.addEventListener)screen.orientation.addEventListener('change',function(){baseline=null;smooth=0;resetVisual();});

  wrap.addEventListener('touchstart',function(e){touchStart=e.touches[0].clientX;drag=0;allPages().forEach(function(p){p.style.transition='none';});},{passive:true});
  wrap.addEventListener('touchmove',function(e){if(touchStart===null)return;drag=e.touches[0].clientX-touchStart;allPages().forEach(function(p){p.style.transform='translateX(calc('+(-page*100)+'% + '+drag+'px))';});},{passive:true});
  wrap.addEventListener('touchend',function(){if(Math.abs(drag)>innerWidth*.16)page=Math.max(0,Math.min(1,page+(drag<0?1:-1)));allPages().forEach(function(p){p.style.transition='transform .36s cubic-bezier(.22,.86,.28,1)';p.style.transform='translateX('+(-page*100)+'%)';});dots.forEach(function(d,i){d.classList.toggle('active',i===page);});touchStart=null;drag=0;});

  function updateClock(){var d=new Date();document.querySelectorAll('.clock').forEach(function(c){c.textContent=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});});}
  updateClock();setInterval(updateClock,30000);resetVisual();
})();
</script>
</body>
</html>`;

export default {async fetch(){return new Response(html,{headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-store','permissions-policy':'accelerometer=(self), gyroscope=(self)'}});}};
