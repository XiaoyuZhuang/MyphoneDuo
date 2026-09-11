const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
<meta name="theme-color" content="#0d1b2a" />
<title>Myphone Duo</title>
<style>
  :root {
    --tilt: 0;
    --shift-x: 0px;
    --edge-left: 0;
    --edge-right: 0;
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { width:100%; height:100%; margin:0; overflow:hidden; background:#06111c; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif; }
  body { touch-action: pan-x; }
  .viewport {
    position:fixed; inset:0; overflow:hidden; background:#071421;
  }
  .wallpaper {
    position:absolute; inset:-7%;
    background:
      radial-gradient(circle at 18% 22%, rgba(99,177,255,.42), transparent 28%),
      radial-gradient(circle at 80% 18%, rgba(183,117,255,.35), transparent 32%),
      radial-gradient(circle at 70% 78%, rgba(255,105,180,.25), transparent 30%),
      linear-gradient(145deg,#0a1b2d 0%,#17375a 38%,#34245f 70%,#14182b 100%);
    transform: translate3d(calc(var(--shift-x) * .22),0,0) scale(1.06);
    filter:saturate(1.1);
  }
  .desktop {
    position:absolute; inset:0;
    transform: translate3d(var(--shift-x),0,0);
    will-change: transform;
    transition: transform 70ms linear;
  }
  .status {
    height:48px; padding:12px 18px 0; display:flex; justify-content:space-between; align-items:flex-start;
    color:white; font-size:14px; font-weight:600; text-shadow:0 1px 8px rgba(0,0,0,.35);
  }
  .status .right { display:flex; gap:8px; opacity:.95; }
  .pages-wrap { position:absolute; left:0; right:0; top:54px; bottom:106px; overflow:hidden; }
  .pages { height:100%; display:flex; transition: transform .36s cubic-bezier(.22,.86,.28,1); will-change: transform; }
  .page { min-width:100%; padding:12px 20px 16px; display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:min-content; gap:22px 15px; align-content:start; }
  .app { display:flex; flex-direction:column; align-items:center; gap:7px; color:white; font-size:12px; text-shadow:0 2px 8px rgba(0,0,0,.45); user-select:none; }
  .icon { width:min(15vw,66px); aspect-ratio:1; border-radius:22%; display:grid; place-items:center; font-size:min(8vw,34px); box-shadow: inset 0 1px 0 rgba(255,255,255,.34), 0 8px 22px rgba(0,0,0,.2); backdrop-filter:blur(5px); }
  .i1{background:linear-gradient(145deg,#58b8ff,#3478f6)} .i2{background:linear-gradient(145deg,#71e29a,#24a957)} .i3{background:linear-gradient(145deg,#ff7992,#e73659)}
  .i4{background:linear-gradient(145deg,#ffd266,#f29b22)} .i5{background:linear-gradient(145deg,#8e8dff,#5d5ee9)} .i6{background:linear-gradient(145deg,#3fd7e7,#1696b1)}
  .i7{background:linear-gradient(145deg,#f2f2f2,#bfc5cc);color:#222} .i8{background:linear-gradient(145deg,#353d4d,#121821)}
  .dock { position:absolute; left:14px; right:14px; bottom:max(12px,env(safe-area-inset-bottom)); height:82px; border-radius:30px; background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.22); backdrop-filter:blur(26px) saturate(1.4); display:flex; align-items:center; justify-content:space-around; padding:0 12px; }
  .dock .icon { width:58px; max-width:16vw; }
  .dots { position:absolute; bottom:91px; left:0; right:0; display:flex; justify-content:center; gap:7px; }
  .dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.42); }
  .dot.active { background:white; }
  .edge { position:absolute; top:0; bottom:0; width:28vw; pointer-events:none; z-index:5; opacity:0; filter:blur(10px); }
  .edge.left { left:-5vw; background:linear-gradient(90deg,rgba(2,8,14,.96) 0%,rgba(4,12,20,.65) 20%,rgba(20,30,45,.18) 58%,rgba(20,30,45,0) 100%); opacity:var(--edge-left); }
  .edge.right { right:-5vw; background:linear-gradient(270deg,rgba(2,8,14,.96) 0%,rgba(4,12,20,.65) 20%,rgba(20,30,45,.18) 58%,rgba(20,30,45,0) 100%); opacity:var(--edge-right); }
  .edge::after { content:""; position:absolute; inset:0; backdrop-filter:blur(18px); mask-image:linear-gradient(to right,black,transparent); }
  .edge.right::after { mask-image:linear-gradient(to left,black,transparent); }
  .permission {
    position:absolute; z-index:20; left:50%; top:50%; transform:translate(-50%,-50%); width:min(88vw,380px); padding:20px; border-radius:28px;
    background:rgba(10,18,28,.72); color:white; text-align:center; backdrop-filter:blur(28px) saturate(1.25); border:1px solid rgba(255,255,255,.16); box-shadow:0 20px 60px rgba(0,0,0,.35);
  }
  .permission h1{font-size:23px;margin:0 0 8px}.permission p{opacity:.78;font-size:14px;line-height:1.55;margin:0 0 16px}
  .permission button{border:0;border-radius:16px;padding:12px 18px;font-size:15px;font-weight:700;background:white;color:#0f1720}
  .hidden{display:none}
  .debug{position:absolute;z-index:30;right:8px;top:52px;color:#fff9;font:11px/1.3 monospace;background:#0004;padding:6px 8px;border-radius:9px;display:none}
</style>
</head>
<body>
<div class="viewport" id="viewport">
  <div class="wallpaper"></div>
  <div class="desktop" id="desktop">
    <div class="status"><div id="clock">9:41</div><div class="right"><span>◔</span><span>⌁</span><span>▰</span></div></div>
    <div class="pages-wrap" id="pagesWrap">
      <div class="pages" id="pages">
        <section class="page">
          <div class="app"><div class="icon i1">☁</div><span>天气</span></div><div class="app"><div class="icon i2">✆</div><span>电话</span></div><div class="app"><div class="icon i3">♥</div><span>健康</span></div><div class="app"><div class="icon i4">☀</div><span>照片</span></div>
          <div class="app"><div class="icon i5">✦</div><span>音乐</span></div><div class="app"><div class="icon i6">◎</div><span>浏览器</span></div><div class="app"><div class="icon i7">◷</div><span>时钟</span></div><div class="app"><div class="icon i8">⚙</div><span>设置</span></div>
          <div class="app"><div class="icon i2">✉</div><span>信息</span></div><div class="app"><div class="icon i4">◫</div><span>日历</span></div><div class="app"><div class="icon i1">⌖</div><span>地图</span></div><div class="app"><div class="icon i5">◉</div><span>相机</span></div>
        </section>
        <section class="page">
          <div class="app"><div class="icon i6">⌁</div><span>文件</span></div><div class="app"><div class="icon i3">♫</div><span>播客</span></div><div class="app"><div class="icon i1">↻</div><span>同步</span></div><div class="app"><div class="icon i8">◈</div><span>工具</span></div>
          <div class="app"><div class="icon i4">✎</div><span>备忘录</span></div><div class="app"><div class="icon i2">✓</div><span>提醒</span></div><div class="app"><div class="icon i5">★</div><span>收藏</span></div><div class="app"><div class="icon i7">☰</div><span>阅读</span></div>
        </section>
      </div>
    </div>
    <div class="dots"><span class="dot active"></span><span class="dot"></span></div>
    <div class="dock"><div class="icon i2">✆</div><div class="icon i6">◎</div><div class="icon i3">♫</div><div class="icon i1">✉</div></div>
  </div>
  <div class="edge left"></div><div class="edge right"></div>
  <div class="permission" id="permission"><h1>Myphone Duo</h1><p>点击启用动作感应。左右倾斜手机时，桌面会尽量保持视觉位置稳定，同时倾斜侧边缘逐渐虚化、隐去。</p><button id="startMotion">启用动作感应</button></div>
  <div class="debug" id="debug"></div>
</div>
<script>
(() => {
  const root = document.documentElement;
  const permission = document.getElementById('permission');
  const btn = document.getElementById('startMotion');
  const pages = document.getElementById('pages');
  const dots = [...document.querySelectorAll('.dot')];
  const wrap = document.getElementById('pagesWrap');
  let baseline = null, smooth = 0;
  let startX = null, drag = 0, page = 0;

  function applyTilt(gammaRaw){
    if (gammaRaw == null || Number.isNaN(gammaRaw)) return;
    if (baseline == null) baseline = gammaRaw;
    let gamma = gammaRaw - baseline;
    if (gamma > 35) gamma = 35; if (gamma < -35) gamma = -35;
    smooth += (gamma - smooth) * 0.12;
    const dead = Math.abs(smooth) < 1.2 ? 0 : smooth;
    const p = Math.min(Math.abs(dead) / 24, 1);
    const shift = -dead * 1.55;
    root.style.setProperty('--shift-x', shift.toFixed(2) + 'px');
    root.style.setProperty('--edge-left', dead < 0 ? Math.pow(p, .8).toFixed(3) : '0');
    root.style.setProperty('--edge-right', dead > 0 ? Math.pow(p, .8).toFixed(3) : '0');
  }

  function handler(e){ applyTilt(e.gamma); }

  async function enableMotion(){
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const state = await DeviceOrientationEvent.requestPermission();
        if (state !== 'granted') throw new Error('permission denied');
      }
      window.addEventListener('deviceorientation', handler, true);
      permission.classList.add('hidden');
    } catch (e) {
      permission.querySelector('p').textContent = '没有获得动作感应权限。请检查浏览器的运动与方向访问权限后重试。';
    }
  }
  btn.addEventListener('click', enableMotion);

  wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; drag = 0; pages.style.transition='none'; }, {passive:true});
  wrap.addEventListener('touchmove', e => {
    if (startX == null) return;
    drag = e.touches[0].clientX - startX;
    pages.style.transform = `translateX(calc(${-page*100}% + ${drag}px))`;
  }, {passive:true});
  wrap.addEventListener('touchend', () => {
    pages.style.transition='transform .36s cubic-bezier(.22,.86,.28,1)';
    if (Math.abs(drag) > innerWidth * .16) page = Math.max(0, Math.min(1, page + (drag < 0 ? 1 : -1)));
    pages.style.transform = `translateX(${-page*100}%)`;
    dots.forEach((d,i)=>d.classList.toggle('active',i===page)); startX=null; drag=0;
  });

  const clock = document.getElementById('clock');
  const updateClock = () => { const d = new Date(); clock.textContent = d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); };
  updateClock(); setInterval(updateClock, 30000);
})();
</script>
</body>
</html>`;

export default {
  async fetch() {
    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': 'no-store',
        'permissions-policy': 'accelerometer=(self), gyroscope=(self)'
      }
    });
  }
};
