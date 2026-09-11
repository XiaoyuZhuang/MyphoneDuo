const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="theme-color" content="#101827">
<title>Myphone Duo</title>
<style>
:root{--shift:0px;--left:0;--right:0}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#07111d;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}body{touch-action:pan-x}.v{position:fixed;inset:0;overflow:hidden;background:#091522}.wall{position:absolute;inset:-8%;background:radial-gradient(circle at 18% 20%,#5aaeff77,transparent 28%),radial-gradient(circle at 82% 22%,#b772ff66,transparent 31%),radial-gradient(circle at 68% 82%,#ff77bb44,transparent 30%),linear-gradient(145deg,#09182a,#173a61 40%,#382564 72%,#141727);transform:translate3d(calc(var(--shift)*.2),0,0) scale(1.08);will-change:transform}.desk{position:absolute;inset:0;transform:translate3d(var(--shift),0,0);transition:transform 70ms linear;will-change:transform}.status{height:48px;padding:12px 18px 0;display:flex;justify-content:space-between;color:#fff;font-size:14px;font-weight:650;text-shadow:0 1px 8px #0007}.pagesWrap{position:absolute;left:0;right:0;top:54px;bottom:108px;overflow:hidden}.pages{height:100%;display:flex;transition:transform .36s cubic-bezier(.22,.86,.28,1);will-change:transform}.page{min-width:100%;padding:12px 20px;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:min-content;gap:22px 15px;align-content:start}.app{display:flex;flex-direction:column;align-items:center;gap:7px;color:#fff;font-size:12px;text-shadow:0 2px 8px #0008;pointer-events:none;user-select:none}.icon{width:min(15vw,66px);aspect-ratio:1;border-radius:22%;display:grid;place-items:center;font-size:min(8vw,34px);box-shadow:inset 0 1px 0 #ffffff55,0 8px 22px #0004}.b{background:linear-gradient(145deg,#58b8ff,#3478f6)}.g{background:linear-gradient(145deg,#71e29a,#24a957)}.r{background:linear-gradient(145deg,#ff7992,#e73659)}.y{background:linear-gradient(145deg,#ffd266,#f29b22)}.p{background:linear-gradient(145deg,#9c91ff,#5d5ee9)}.c{background:linear-gradient(145deg,#3fd7e7,#1696b1)}.k{background:linear-gradient(145deg,#3c4555,#121821)}.w{background:linear-gradient(145deg,#fff,#bcc4cc);color:#222}.dock{position:absolute;left:14px;right:14px;bottom:max(12px,env(safe-area-inset-bottom));height:82px;border-radius:30px;background:#ffffff29;border:1px solid #ffffff38;backdrop-filter:blur(26px) saturate(1.4);display:flex;align-items:center;justify-content:space-around;padding:0 12px}.dock .icon{width:58px;max-width:16vw}.dots{position:absolute;bottom:93px;left:0;right:0;display:flex;justify-content:center;gap:7px}.dot{width:6px;height:6px;border-radius:50%;background:#ffffff6b}.dot.on{background:#fff}.edge{position:absolute;top:0;bottom:0;width:31vw;z-index:5;pointer-events:none;filter:blur(11px);opacity:0}.edge.l{left:-6vw;background:linear-gradient(90deg,#02080ff7,#07111cb8 24%,#15233c33 62%,transparent);opacity:var(--left)}.edge.r{right:-6vw;background:linear-gradient(270deg,#02080ff7,#07111cb8 24%,#15233c33 62%,transparent);opacity:var(--right)}.edge:after{content:"";position:absolute;inset:0;backdrop-filter:blur(19px);-webkit-mask-image:linear-gradient(to right,#000,transparent);mask-image:linear-gradient(to right,#000,transparent)}.edge.r:after{-webkit-mask-image:linear-gradient(to left,#000,transparent);mask-image:linear-gradient(to left,#000,transparent)}.permit{position:absolute;z-index:20;left:50%;top:50%;transform:translate(-50%,-50%);width:min(88vw,380px);padding:20px;border-radius:28px;background:#0a121cba;color:#fff;text-align:center;backdrop-filter:blur(28px) saturate(1.25);border:1px solid #ffffff29;box-shadow:0 20px 60px #0006}.permit h1{font-size:23px;margin:0 0 8px}.permit p{opacity:.8;font-size:14px;line-height:1.55;margin:0 0 16px}.permit button{border:0;border-radius:16px;padding:12px 18px;font-size:15px;font-weight:700;background:#fff;color:#101820}.hide{display:none}
</style>
</head>
<body>
<div class="v">
 <div class="wall"></div>
 <div class="desk">
  <div class="status"><span id="clock">9:41</span><span>◔　⌁　▰</span></div>
  <div class="pagesWrap" id="wrap"><div class="pages" id="pages">
   <section class="page">
    <div class="app"><div class="icon b">☁</div><span>天气</span></div><div class="app"><div class="icon g">✆</div><span>电话</span></div><div class="app"><div class="icon r">♥</div><span>健康</span></div><div class="app"><div class="icon y">☀</div><span>照片</span></div>
    <div class="app"><div class="icon p">✦</div><span>音乐</span></div><div class="app"><div class="icon c">◎</div><span>浏览器</span></div><div class="app"><div class="icon w">◷</div><span>时钟</span></div><div class="app"><div class="icon k">⚙</div><span>设置</span></div>
    <div class="app"><div class="icon g">✉</div><span>信息</span></div><div class="app"><div class="icon y">◫</div><span>日历</span></div><div class="app"><div class="icon b">⌖</div><span>地图</span></div><div class="app"><div class="icon p">◉</div><span>相机</span></div>
   </section>
   <section class="page">
    <div class="app"><div class="icon c">⌁</div><span>文件</span></div><div class="app"><div class="icon r">♫</div><span>播客</span></div><div class="app"><div class="icon b">↻</div><span>同步</span></div><div class="app"><div class="icon k">◈</div><span>工具</span></div>
    <div class="app"><div class="icon y">✎</div><span>备忘录</span></div><div class="app"><div class="icon g">✓</div><span>提醒</span></div><div class="app"><div class="icon p">★</div><span>收藏</span></div><div class="app"><div class="icon w">☰</div><span>阅读</span></div>
   </section>
  </div></div>
  <div class="dots"><i class="dot on"></i><i class="dot"></i></div>
  <div class="dock"><div class="icon g">✆</div><div class="icon c">◎</div><div class="icon r">♫</div><div class="icon b">✉</div></div>
 </div>
 <div class="edge l"></div><div class="edge r"></div>
 <div class="permit" id="permit"><h1>Myphone Duo</h1><p>点击启用动作感应。左右倾斜手机时，桌面会做反向补偿，倾斜侧边缘逐渐虚化并隐去。</p><button id="go">启用动作感应</button></div>
</div>
<script>
(function(){
 var root=document.documentElement,permit=document.getElementById('permit'),go=document.getElementById('go'),pages=document.getElementById('pages'),wrap=document.getElementById('wrap'),dots=[].slice.call(document.querySelectorAll('.dot'));
 var base=null,smooth=0,startX=null,drag=0,page=0;
 function tilt(raw){if(raw==null||Number.isNaN(raw))return;if(base==null)base=raw;var g=Math.max(-35,Math.min(35,raw-base));smooth+=(g-smooth)*.12;var d=Math.abs(smooth)<1.2?0:smooth,p=Math.min(Math.abs(d)/24,1),shift=-d*1.55;root.style.setProperty('--shift',shift.toFixed(2)+'px');root.style.setProperty('--left',d<0?Math.pow(p,.8).toFixed(3):'0');root.style.setProperty('--right',d>0?Math.pow(p,.8).toFixed(3):'0')}
 async function enable(){try{if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){var s=await DeviceOrientationEvent.requestPermission();if(s!=='granted')throw new Error('denied')}if(typeof DeviceOrientationEvent==='undefined')throw new Error('unsupported');window.addEventListener('deviceorientation',function(e){tilt(e.gamma)},true);permit.classList.add('hide')}catch(e){permit.querySelector('p').textContent='没有获得动作感应权限，或当前浏览器不支持。请检查浏览器的运动与方向访问权限后重试。'}}
 go.addEventListener('click',enable);
 wrap.addEventListener('touchstart',function(e){startX=e.touches[0].clientX;drag=0;pages.style.transition='none'},{passive:true});
 wrap.addEventListener('touchmove',function(e){if(startX==null)return;drag=e.touches[0].clientX-startX;pages.style.transform='translateX(calc('+(-page*100)+'% + '+drag+'px))'},{passive:true});
 wrap.addEventListener('touchend',function(){pages.style.transition='transform .36s cubic-bezier(.22,.86,.28,1)';if(Math.abs(drag)>innerWidth*.16)page=Math.max(0,Math.min(1,page+(drag<0?1:-1)));pages.style.transform='translateX('+(-page*100)+'%)';dots.forEach(function(d,i){d.classList.toggle('on',i===page)});startX=null;drag=0});
 var clock=document.getElementById('clock');function tick(){clock.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}tick();setInterval(tick,30000);
})();
</script>
</body></html>`;

export default {
 async fetch(){
  return new Response(html,{headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-store','permissions-policy':'accelerometer=(self), gyroscope=(self)'}});
 }
};
