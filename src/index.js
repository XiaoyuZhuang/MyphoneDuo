const html = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
<meta name="theme-color" content="#05070a" />
<title>Myphone Duo</title>
<style>
  :root{
    --screen-angle:0deg;
    --soft-blur:0;
    --mid-blur:0;
    --strong-blur:0;
    --edge-dark:0;
    --edge-line:.12;
  }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#05070a;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif}
  body{overscroll-behavior:none;touch-action:pan-x}

  .viewport{
    position:fixed;inset:0;overflow:hidden;background:#05070a;
    perspective:820px;perspective-origin:50% 50%;isolation:isolate;
  }
  .space{
    position:absolute;inset:-12%;
    background:
      radial-gradient(circle at 50% 45%,rgba(52,59,72,.55),transparent 34%),
      radial-gradient(circle at 50% 50%,#151922 0%,#090b10 56%,#030405 100%);
    transform:translateZ(-160px) scale(1.22);
  }
  .screen-plane{
    position:absolute;inset:0;z-index:2;overflow:hidden;
    transform-style:preserve-3d;backface-visibility:hidden;
    transform:rotateY(var(--screen-angle));
    transform-origin:0% 50%;
    will-change:transform;
    transition:transform 60ms linear,transform-origin 0s;
    background:#102038;
    box-shadow:0 0 0 1px rgba(255,255,255,.035) inset,0 18px 70px rgba(0,0,0,.42);
  }
  .screen-plane.pivot-right{transform-origin:100% 50%}
  .screen-plane.pivot-left{transform-origin:0% 50%}

  .wallpaper{
    position:absolute;inset:-5%;
    background:
      radial-gradient(circle at 18% 16%,rgba(94,185,255,.66),transparent 28%),
      radial-gradient(circle at 79% 18%,rgba(183,120,255,.5),transparent 30%),
      radial-gradient(circle at 72% 78%,rgba(255,108,172,.34),transparent 31%),
      linear-gradient(148deg,#0b1c30 0%,#23507c 37%,#443176 68%,#11172a 100%);
    filter:saturate(1.08);
  }
  .desktop{position:absolute;inset:0;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.36);user-select:none}
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

  .edge-effects{position:absolute;inset:0;z-index:20;pointer-events:none}
  .edge-soft,.edge-mid,.edge-strong,.edge-shadow,.edge-metal{position:absolute;top:-4%;bottom:-4%;pointer-events:none;opacity:0}
  .edge-soft{width:56%;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
  .edge-mid{width:32%;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
  .edge-strong{width:15%;backdrop-filter:blur(17px);-webkit-backdrop-filter:blur(17px)}
  .edge-shadow{width:48%;}
  .edge-metal{top:0;bottom:0;width:3px;background:linear-gradient(90deg,#090a0d,#c3c7cf 45%,#3a3d43 72%,#08090b);box-shadow:0 0 12px rgba(255,255,255,.15),0 0 22px rgba(0,0,0,.55)}

  .screen-plane.lift-right .edge-soft{right:-2%;opacity:var(--soft-blur);-webkit-mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.82) 38%,transparent 100%);mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.82) 38%,transparent 100%)}
  .screen-plane.lift-right .edge-mid{right:-2%;opacity:var(--mid-blur);-webkit-mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.9) 48%,transparent 100%);mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.9) 48%,transparent 100%)}
  .screen-plane.lift-right .edge-strong{right:-1%;opacity:var(--strong-blur);-webkit-mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.98) 58%,transparent 100%);mask-image:linear-gradient(270deg,#000 0%,rgba(0,0,0,.98) 58%,transparent 100%)}
  .screen-plane.lift-right .edge-shadow{right:0;opacity:var(--edge-dark);background:linear-gradient(270deg,rgba(2,4,8,.72) 0%,rgba(5,8,13,.38) 26%,rgba(6,9,15,.12) 56%,transparent 100%)}
  .screen-plane.lift-right .edge-metal{right:0;opacity:var(--edge-line)}

  .screen-plane.lift-left .edge-soft{left:-2%;opacity:var(--soft-blur);-webkit-mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.82) 38%,transparent 100%);mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.82) 38%,transparent 100%)}
  .screen-plane.lift-left .edge-mid{left:-2%;opacity:var(--mid-blur);-webkit-mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.9) 48%,transparent 100%);mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.9) 48%,transparent 100%)}
  .screen-plane.lift-left .edge-strong{left:-1%;opacity:var(--strong-blur);-webkit-mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.98) 58%,transparent 100%);mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.98) 58%,transparent 100%)}
  .screen-plane.lift-left .edge-shadow{left:0;opacity:var(--edge-dark);background:linear-gradient(90deg,rgba(2,4,8,.72) 0%,rgba(5,8,13,.38) 26%,rgba(6,9,15,.12) 56%,transparent 100%)}
  .screen-plane.lift-left .edge-metal{left:0;opacity:var(--edge-line)}

  .glass{position:absolute;inset:0;z-index:19;pointer-events:none;background:linear-gradient(118deg,rgba(255,255,255,.085),transparent 28%,transparent 68%,rgba(255,255,255,.045));mix-blend-mode:screen}

  .permission{position:absolute;z-index:50;left:50%;top:50%;transform:translate(-50%,-50%);width:min(88vw,390px);padding:21px;border-radius:28px;background:rgba(12,17,25,.72);color:#fff;text-align:center;backdrop-filter:blur(30px) saturate(1.25);border:1px solid rgba(255,255,255,.16);box-shadow:0 24px 70px rgba(0,0,0,.38)}
  .permission h1{font-size:23px;margin:0 0 8px}.permission p{opacity:.8;font-size:14px;line-height:1.55;margin:0 0 16px}.permission button{border:0;border-radius:16px;padding:12px 18px;font-size:15px;font-weight:720;background:#fff;color:#111820}.hidden{display:none}
  .recenter{position:absolute;z-index:40;left:50%;bottom:max(108px,calc(env(safe-area-inset-bottom) + 104px));transform:translateX(-50%);border:1px solid rgba(255,255,255,.16);background:rgba(9,13,19,.34);color:rgba(255,255,255,.74);font-size:11px;padding:7px 10px;border-radius:99px;backdrop-filter:blur(15px);opacity:0;pointer-events:none;transition:opacity .25s}.recenter.show{opacity:1;pointer-events:auto}
  @media (prefers-reduced-motion:reduce){.screen-plane{transition:none}.pages{transition:none}}
</style>
</head>
<body>
<div class="viewport">
  <div class="space"></div>
  <div class="screen-plane pivot-left" id="screenPlane">
    <div class="wallpaper"></div>
    <div class="desktop">
      <div class="status"><div id="clock">9:41</div><div class="right"><span>◔</span><span>⌁</span><span>▰</span></div></div>
      <div class="pages-wrap" id="pagesWrap"><div class="pages" id="pages">
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
    <div class="glass"></div>
    <div class="edge-effects">
      <div class="edge-soft"></div><div class="edge-mid"></div><div class="edge-strong"></div><div class="edge-shadow"></div><div class="edge-metal"></div>
    </div>
  </div>
  <button class="recenter" id="recenter">重新校准</button>
  <div class="permission" id="permission"><h1>Myphone Duo</h1><p>点击启用动作感应。整块桌面始终保持为一个完整平面；抬起右侧时以左边缘为转轴产生 3D 透视，右侧越靠边越模糊并逐渐隐去，左侧抬起时方向相反。</p><button id="startMotion">启用动作感应</button></div>
</div>
<script>
(function(){
  var root=document.documentElement;
  var plane=document.getElementById('screenPlane');
  var permission=document.getElementById('permission');
  var startButton=document.getElementById('startMotion');
  var recenter=document.getElementById('recenter');
  var pages=document.getElementById('pages');
  var wrap=document.getElementById('pagesWrap');
  var dots=[].slice.call(document.querySelectorAll('.dot'));
  var baseline=null;
  var smooth=0;
  var page=0;
  var touchStart=null;
  var drag=0;

  function orientationAngle(){
    if(screen.orientation && typeof screen.orientation.angle==='number') return screen.orientation.angle;
    if(typeof window.orientation==='number') return window.orientation;
    return 0;
  }

  function readRoll(e){
    var a=((orientationAngle()%360)+360)%360;
    if(a===90) return -(e.beta||0);
    if(a===270) return (e.beta||0);
    if(a===180) return -(e.gamma||0);
    return e.gamma||0;
  }

  function resetVisual(){
    root.style.setProperty('--screen-angle','0deg');
    root.style.setProperty('--soft-blur','0');
    root.style.setProperty('--mid-blur','0');
    root.style.setProperty('--strong-blur','0');
    root.style.setProperty('--edge-dark','0');
    root.style.setProperty('--edge-line','.12');
    plane.classList.remove('lift-left','lift-right','pivot-left','pivot-right');
    plane.classList.add('pivot-left');
  }

  function applyRoll(raw){
    if(raw==null || Number.isNaN(raw)) return;
    if(baseline===null) baseline=raw;
    var delta=raw-baseline;
    if(delta>30) delta=30;
    if(delta<-30) delta=-30;
    smooth+=(delta-smooth)*0.14;
    var dead=Math.abs(smooth)<1.1?0:smooth;
    var p=Math.min(Math.abs(dead)/24,1);
    var eased=1-Math.pow(1-p,1.65);
    var visualAngle=eased*56;

    if(dead===0){
      resetVisual();
      return;
    }

    plane.classList.remove('lift-left','lift-right','pivot-left','pivot-right');
    if(dead>0){
      plane.classList.add('lift-right','pivot-left');
      root.style.setProperty('--screen-angle',visualAngle.toFixed(2)+'deg');
    }else{
      plane.classList.add('lift-left','pivot-right');
      root.style.setProperty('--screen-angle',(-visualAngle).toFixed(2)+'deg');
    }

    root.style.setProperty('--soft-blur',Math.min(1,p*1.15).toFixed(3));
    root.style.setProperty('--mid-blur',Math.min(1,Math.max(0,(p-.12)/.72)).toFixed(3));
    root.style.setProperty('--strong-blur',Math.min(1,Math.max(0,(p-.28)/.58)).toFixed(3));
    root.style.setProperty('--edge-dark',(Math.pow(p,.78)*.92).toFixed(3));
    root.style.setProperty('--edge-line',(.12+p*.72).toFixed(3));
  }

  function motionHandler(e){applyRoll(readRoll(e));}

  async function enableMotion(){
    try{
      if(typeof DeviceOrientationEvent!=='undefined' && typeof DeviceOrientationEvent.requestPermission==='function'){
        var state=await DeviceOrientationEvent.requestPermission();
        if(state!=='granted') throw new Error('permission denied');
      }
      window.addEventListener('deviceorientation',motionHandler,true);
      permission.classList.add('hidden');
      recenter.classList.add('show');
    }catch(err){
      permission.querySelector('p').textContent='没有获得动作感应权限。请检查浏览器的运动与方向访问权限后重试。';
    }
  }

  startButton.addEventListener('click',enableMotion);
  recenter.addEventListener('click',function(){baseline=null;smooth=0;resetVisual();});
  window.addEventListener('orientationchange',function(){baseline=null;smooth=0;resetVisual();});
  if(screen.orientation && screen.orientation.addEventListener){
    screen.orientation.addEventListener('change',function(){baseline=null;smooth=0;resetVisual();});
  }

  wrap.addEventListener('touchstart',function(e){touchStart=e.touches[0].clientX;drag=0;pages.style.transition='none';},{passive:true});
  wrap.addEventListener('touchmove',function(e){
    if(touchStart===null)return;
    drag=e.touches[0].clientX-touchStart;
    pages.style.transform='translateX(calc('+(-page*100)+'% + '+drag+'px))';
  },{passive:true});
  wrap.addEventListener('touchend',function(){
    pages.style.transition='transform .36s cubic-bezier(.22,.86,.28,1)';
    if(Math.abs(drag)>innerWidth*.16) page=Math.max(0,Math.min(1,page+(drag<0?1:-1)));
    pages.style.transform='translateX('+(-page*100)+'%)';
    dots.forEach(function(d,i){d.classList.toggle('active',i===page);});
    touchStart=null;drag=0;
  });

  var clock=document.getElementById('clock');
  function updateClock(){var d=new Date();clock.textContent=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});}
  updateClock();setInterval(updateClock,30000);
  resetVisual();
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
