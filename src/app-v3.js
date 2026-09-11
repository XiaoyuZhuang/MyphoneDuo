const html = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
<meta name="theme-color" content="#05070a" />
<title>Myphone Duo</title>
<style>
:root{
  --angle:0deg;
  --pivot:0%;
  --blur:0px;
  --blur-opacity:0;
  --halo-blur:18px;
  --halo-opacity:0;
  --edge-fade:.98;
  --edge-dim:0;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#030405;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif}
body{overscroll-behavior:none;touch-action:pan-x;background:#030405}
.viewport{position:fixed;inset:0;overflow:hidden;background:radial-gradient(circle at 50% 45%,#171b24 0%,#090b10 55%,#020304 100%);perspective:850px;perspective-origin:50% 50%;isolation:isolate}
.stage{position:absolute;inset:0;transform-style:preserve-3d}

/* The halo is a separate 3D plane behind the screen. It is never clipped by the screen rectangle. */
.halo-plane,.screen-plane{position:absolute;inset:0;transform-style:preserve-3d;transform-origin:var(--pivot) 50%;transform:rotateY(var(--angle));will-change:transform;transition:transform 52ms linear,transform-origin 0s}
.halo-plane{z-index:1;overflow:visible;pointer-events:none}
.halo-bleed{position:absolute;inset:-58px;overflow:visible;filter:blur(var(--halo-blur)) saturate(1.08);opacity:var(--halo-opacity);will-change:filter,opacity;transform:translateZ(-1px) scale(1.015)}
.halo-source{position:absolute;left:58px;right:58px;top:58px;bottom:58px;overflow:hidden}
.halo-plane.lift-right .halo-bleed{-webkit-mask-image:linear-gradient(90deg,transparent 0%,transparent 43%,rgba(0,0,0,.08) 57%,rgba(0,0,0,.34) 70%,rgba(0,0,0,.74) 84%,#000 100%);mask-image:linear-gradient(90deg,transparent 0%,transparent 43%,rgba(0,0,0,.08) 57%,rgba(0,0,0,.34) 70%,rgba(0,0,0,.74) 84%,#000 100%)}
.halo-plane.lift-left .halo-bleed{-webkit-mask-image:linear-gradient(270deg,transparent 0%,transparent 43%,rgba(0,0,0,.08) 57%,rgba(0,0,0,.34) 70%,rgba(0,0,0,.74) 84%,#000 100%);mask-image:linear-gradient(270deg,transparent 0%,transparent 43%,rgba(0,0,0,.08) 57%,rgba(0,0,0,.34) 70%,rgba(0,0,0,.74) 84%,#000 100%)}

.screen-plane{z-index:2;background:#112039;box-shadow:0 20px 70px rgba(0,0,0,.42);backface-visibility:hidden}
.screen-clip{position:absolute;inset:0;overflow:hidden;background:#112039}
.screen-plane.lift-right .screen-clip{-webkit-mask-image:linear-gradient(90deg,#000 0%,#000 78%,rgba(0,0,0,.995) 84%,rgba(0,0,0,.985) 90%,rgba(0,0,0,var(--edge-fade)) 100%);mask-image:linear-gradient(90deg,#000 0%,#000 78%,rgba(0,0,0,.995) 84%,rgba(0,0,0,.985) 90%,rgba(0,0,0,var(--edge-fade)) 100%)}
.screen-plane.lift-left .screen-clip{-webkit-mask-image:linear-gradient(270deg,#000 0%,#000 78%,rgba(0,0,0,.995) 84%,rgba(0,0,0,.985) 90%,rgba(0,0,0,var(--edge-fade)) 100%);mask-image:linear-gradient(270deg,#000 0%,#000 78%,rgba(0,0,0,.995) 84%,rgba(0,0,0,.985) 90%,rgba(0,0,0,var(--edge-fade)) 100%)}

.surface{position:absolute;inset:0;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.35);user-select:none}
.wallpaper{position:absolute;inset:-5%;background:radial-gradient(circle at 18% 16%,rgba(94,185,255,.68),transparent 28%),radial-gradient(circle at 79% 18%,rgba(183,120,255,.5),transparent 30%),radial-gradient(circle at 72% 78%,rgba(255,108,172,.34),transparent 31%),linear-gradient(148deg,#0b1c30 0%,#23507c 37%,#443176 68%,#11172a 100%);filter:saturate(1.08)}
.status{height:50px;padding:12px max(18px,env(safe-area-inset-left)) 0;display:flex;justify-content:space-between;align-items:flex-start;font-size:14px;font-weight:650;position:relative;z-index:2}.status .right{display:flex;gap:9px;align-items:center;opacity:.95}
.pages-wrap{position:absolute;left:0;right:0;top:58px;bottom:112px;overflow:hidden}.pages{height:100%;display:flex;will-change:transform;transition:transform .34s cubic-bezier(.22,.86,.28,1)}
.page{min-width:100%;padding:11px 20px 16px;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:min-content;gap:22px 15px;align-content:start}.app{display:flex;flex-direction:column;align-items:center;gap:7px;font-size:12px}.icon{width:min(15vw,66px);aspect-ratio:1;border-radius:22%;display:grid;place-items:center;font-size:min(8vw,34px);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 8px 22px rgba(0,0,0,.18);backdrop-filter:blur(5px)}
.i1{background:linear-gradient(145deg,#63c1ff,#3478f6)}.i2{background:linear-gradient(145deg,#78e79f,#24a957)}.i3{background:linear-gradient(145deg,#ff8299,#e73659)}.i4{background:linear-gradient(145deg,#ffd772,#f29b22)}.i5{background:linear-gradient(145deg,#9998ff,#5d5ee9)}.i6{background:linear-gradient(145deg,#48dde9,#1696b1)}.i7{background:linear-gradient(145deg,#fff,#c9ced4);color:#23272f}.i8{background:linear-gradient(145deg,#4b5363,#151a22)}
.dots{position:absolute;left:0;right:0;bottom:97px;display:flex;justify-content:center;gap:7px}.dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.42)}.dot.active{background:#fff}.dock{position:absolute;left:14px;right:14px;bottom:max(12px,env(safe-area-inset-bottom));height:82px;border-radius:30px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(28px) saturate(1.45);display:flex;align-items:center;justify-content:space-around;padding:0 12px}.dock .icon{width:58px;max-width:16vw}

/* One continuous in-screen blur field. No rectangular blur bands. */
.blur-overlay{position:absolute;inset:-28px;z-index:8;pointer-events:none;opacity:var(--blur-opacity);filter:blur(var(--blur)) saturate(.96) brightness(.95);will-change:filter,opacity;transform:scale(1.01)}
.blur-overlay .surface{left:28px;right:28px;top:28px;bottom:28px}
.screen-plane.lift-right .blur-overlay{-webkit-mask-image:linear-gradient(90deg,transparent 0%,transparent 48%,rgba(0,0,0,.03) 57%,rgba(0,0,0,.12) 66%,rgba(0,0,0,.3) 75%,rgba(0,0,0,.58) 86%,rgba(0,0,0,.86) 95%,#000 100%);mask-image:linear-gradient(90deg,transparent 0%,transparent 48%,rgba(0,0,0,.03) 57%,rgba(0,0,0,.12) 66%,rgba(0,0,0,.3) 75%,rgba(0,0,0,.58) 86%,rgba(0,0,0,.86) 95%,#000 100%)}
.screen-plane.lift-left .blur-overlay{-webkit-mask-image:linear-gradient(270deg,transparent 0%,transparent 48%,rgba(0,0,0,.03) 57%,rgba(0,0,0,.12) 66%,rgba(0,0,0,.3) 75%,rgba(0,0,0,.58) 86%,rgba(0,0,0,.86) 95%,#000 100%);mask-image:linear-gradient(270deg,transparent 0%,transparent 48%,rgba(0,0,0,.03) 57%,rgba(0,0,0,.12) 66%,rgba(0,0,0,.3) 75%,rgba(0,0,0,.58) 86%,rgba(0,0,0,.86) 95%,#000 100%)}
.edge-dim{position:absolute;inset:0;z-index:9;pointer-events:none;opacity:var(--edge-dim)}
.screen-plane.lift-right .edge-dim{background:linear-gradient(90deg,transparent 0%,transparent 55%,rgba(2,4,7,.025) 66%,rgba(2,4,7,.08) 78%,rgba(2,4,7,.2) 90%,rgba(2,4,7,.38) 100%)}
.screen-plane.lift-left .edge-dim{background:linear-gradient(270deg,transparent 0%,transparent 55%,rgba(2,4,7,.025) 66%,rgba(2,4,7,.08) 78%,rgba(2,4,7,.2) 90%,rgba(2,4,7,.38) 100%)}
.glass{position:absolute;inset:0;z-index:10;pointer-events:none;background:linear-gradient(118deg,rgba(255,255,255,.07),transparent 28%,transparent 68%,rgba(255,255,255,.035));mix-blend-mode:screen}

.permission{position:absolute;z-index:50;left:50%;top:50%;transform:translate(-50%,-50%);width:min(88vw,390px);padding:21px;border-radius:28px;background:rgba(12,17,25,.72);color:#fff;text-align:center;backdrop-filter:blur(30px) saturate(1.25);border:1px solid rgba(255,255,255,.16);box-shadow:0 24px 70px rgba(0,0,0,.38)}
.permission h1{font-size:23px;margin:0 0 8px}.permission p{opacity:.8;font-size:14px;line-height:1.55;margin:0 0 16px}.permission button{border:0;border-radius:16px;padding:12px 18px;font-size:15px;font-weight:720;background:#fff;color:#111820}.hidden{display:none}
.recenter{position:absolute;z-index:40;left:50%;bottom:max(108px,calc(env(safe-area-inset-bottom) + 104px));transform:translateX(-50%);border:1px solid rgba(255,255,255,.16);background:rgba(9,13,19,.36);color:rgba(255,255,255,.76);font-size:11px;padding:7px 10px;border-radius:99px;backdrop-filter:blur(15px);opacity:0;pointer-events:none;transition:opacity .25s}.recenter.show{opacity:1;pointer-events:auto}
@media (prefers-reduced-motion:reduce){.halo-plane,.screen-plane,.pages{transition:none}}
</style>
</head>
<body>
<div class="viewport">
  <div class="stage">
    <div class="halo-plane" id="haloPlane"><div class="halo-bleed"><div class="halo-source" id="haloSource"></div></div></div>
    <div class="screen-plane" id="screenPlane">
      <div class="screen-clip">
        <div id="liveSurface"></div>
        <div class="blur-overlay" id="blurOverlay"></div>
        <div class="edge-dim"></div><div class="glass"></div>
      </div>
    </div>
  </div>
  <button class="recenter" id="recenter">重新校准</button>
  <div class="permission" id="permission"><h1>Myphone Duo</h1><p>点击启用动作感应。页面会按手机真实倾角近似 1:1 旋转；抬起的一侧从清晰连续过渡到失焦，并让模糊画面越过屏幕边缘延伸到黑色背景中。</p><button id="startMotion">启用动作感应</button></div>
</div>
<template id="surfaceTemplate">
<div class="surface">
  <div class="wallpaper"></div>
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
  var template=document.getElementById('surfaceTemplate');
  var live=document.getElementById('liveSurface');
  var blur=document.getElementById('blurOverlay');
  var halo=document.getElementById('haloSource');
  live.appendChild(template.content.cloneNode(true));
  blur.appendChild(template.content.cloneNode(true));
  halo.appendChild(template.content.cloneNode(true));

  var screenPlane=document.getElementById('screenPlane');
  var haloPlane=document.getElementById('haloPlane');
  var permission=document.getElementById('permission');
  var startButton=document.getElementById('startMotion');
  var recenter=document.getElementById('recenter');
  var liveWrap=live.querySelector('.pages-wrap');
  var baseline=null,smooth=0,page=0,touchStart=null,drag=0;

  function orientationAngle(){
    if(screen.orientation&&typeof screen.orientation.angle==='number')return screen.orientation.angle;
    if(typeof window.orientation==='number')return window.orientation;
    return 0;
  }
  function readRoll(e){
    var a=((orientationAngle()%360)+360)%360;
    if(a===90)return(e.beta||0);
    if(a===270)return-(e.beta||0);
    if(a===180)return(e.gamma||0);
    return-(e.gamma||0);
  }
  function setPageTransform(value,transition){
    document.querySelectorAll('.pages').forEach(function(p){p.style.transition=transition;p.style.transform=value;});
  }
  function updateDots(){
    document.querySelectorAll('.dots').forEach(function(group){
      var ds=group.querySelectorAll('.dot');
      ds.forEach(function(d,i){d.classList.toggle('active',i===page);});
    });
  }
  function setClasses(side){
    screenPlane.classList.remove('lift-left','lift-right');
    haloPlane.classList.remove('lift-left','lift-right');
    if(side){screenPlane.classList.add(side);haloPlane.classList.add(side);}
  }
  function resetVisual(){
    root.style.setProperty('--angle','0deg');
    root.style.setProperty('--pivot','0%');
    root.style.setProperty('--blur','0px');
    root.style.setProperty('--blur-opacity','0');
    root.style.setProperty('--halo-opacity','0');
    root.style.setProperty('--halo-blur','18px');
    root.style.setProperty('--edge-fade','.98');
    root.style.setProperty('--edge-dim','0');
    setClasses(null);
  }
  function applyRoll(raw){
    if(raw==null||Number.isNaN(raw))return;
    if(baseline===null)baseline=raw;
    var delta=raw-baseline;
    if(delta>38)delta=38;if(delta<-38)delta=-38;
    smooth+=(delta-smooth)*0.28;
    var dead=Math.abs(smooth)<0.55?0:smooth;
    if(dead===0){resetVisual();return;}

    var mag=Math.min(Math.abs(dead),34);
    var p=Math.min(mag/30,1);
    if(dead>0){
      root.style.setProperty('--pivot','0%');
      root.style.setProperty('--angle',mag.toFixed(2)+'deg');
      setClasses('lift-right');
    }else{
      root.style.setProperty('--pivot','100%');
      root.style.setProperty('--angle',(-mag).toFixed(2)+'deg');
      setClasses('lift-left');
    }

    var blurRadius=1.5+Math.pow(p,1.1)*16;
    root.style.setProperty('--blur',blurRadius.toFixed(2)+'px');
    root.style.setProperty('--blur-opacity',Math.min(.94,p*.92).toFixed(3));
    root.style.setProperty('--halo-blur',(18+p*17).toFixed(1)+'px');
    root.style.setProperty('--halo-opacity',(Math.pow(p,.82)*.92).toFixed(3));
    root.style.setProperty('--edge-fade',(Math.max(.08,1-p*.9)).toFixed(3));
    root.style.setProperty('--edge-dim',(Math.pow(p,1.15)*.72).toFixed(3));
  }
  function motionHandler(e){applyRoll(readRoll(e));}
  async function enableMotion(){
    try{
      if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
        var state=await DeviceOrientationEvent.requestPermission();
        if(state!=='granted')throw new Error('permission denied');
      }
      window.addEventListener('deviceorientation',motionHandler,true);
      permission.classList.add('hidden');recenter.classList.add('show');
    }catch(err){permission.querySelector('p').textContent='没有获得动作感应权限。请检查浏览器的运动与方向访问权限后重试。';}
  }
  startButton.addEventListener('click',enableMotion);
  recenter.addEventListener('click',function(){baseline=null;smooth=0;resetVisual();});
  window.addEventListener('orientationchange',function(){baseline=null;smooth=0;resetVisual();});
  if(screen.orientation&&screen.orientation.addEventListener){screen.orientation.addEventListener('change',function(){baseline=null;smooth=0;resetVisual();});}

  liveWrap.addEventListener('touchstart',function(e){touchStart=e.touches[0].clientX;drag=0;setPageTransform('translateX('+(-page*100)+'%)','none');},{passive:true});
  liveWrap.addEventListener('touchmove',function(e){if(touchStart===null)return;drag=e.touches[0].clientX-touchStart;setPageTransform('translateX(calc('+(-page*100)+'% + '+drag+'px))','none');},{passive:true});
  liveWrap.addEventListener('touchend',function(){if(Math.abs(drag)>innerWidth*.16)page=Math.max(0,Math.min(1,page+(drag<0?1:-1)));setPageTransform('translateX('+(-page*100)+'%)','transform .34s cubic-bezier(.22,.86,.28,1)');updateDots();touchStart=null;drag=0;});

  function updateClock(){var t=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});document.querySelectorAll('.clock').forEach(function(c){c.textContent=t;});}
  updateClock();setInterval(updateClock,30000);updateDots();resetVisual();
})();
</script>
</body>
</html>`;

export default {
  async fetch(){
    return new Response(html,{headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-store','permissions-policy':'accelerometer=(self), gyroscope=(self)'}});
  }
};
