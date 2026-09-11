const html = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
<meta name="theme-color" content="#030405" />
<title>Myphone Duo</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#030405;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif}
body{touch-action:none;overscroll-behavior:none}
#gl{position:fixed;inset:0;width:100%;height:100%;display:block;background:#030405;touch-action:none}
.permission{position:fixed;z-index:20;left:50%;top:50%;transform:translate(-50%,-50%);width:min(88vw,390px);padding:21px;border-radius:28px;background:rgba(12,17,25,.76);color:#fff;text-align:center;backdrop-filter:blur(30px) saturate(1.25);border:1px solid rgba(255,255,255,.15);box-shadow:0 24px 70px rgba(0,0,0,.42)}
.permission h1{font-size:23px;margin:0 0 8px}.permission p{opacity:.8;font-size:14px;line-height:1.55;margin:0 0 16px}.permission button{border:0;border-radius:16px;padding:12px 18px;font-size:15px;font-weight:720;background:#fff;color:#111820}.hidden{display:none}
#recenter{position:fixed;z-index:15;left:50%;bottom:max(106px,calc(env(safe-area-inset-bottom) + 102px));transform:translateX(-50%);border:1px solid rgba(255,255,255,.15);background:rgba(20,23,31,.58);color:rgba(255,255,255,.78);font-size:12px;padding:8px 12px;border-radius:99px;backdrop-filter:blur(16px);display:none}#recenter.show{display:block}
.fallback{position:fixed;inset:0;display:none;place-items:center;color:#fff;padding:30px;text-align:center;background:#090b10;z-index:30}
</style>
</head>
<body>
<canvas id="gl"></canvas>
<button id="recenter">重新校准</button>
<div class="permission" id="permission"><h1>Myphone Duo</h1><p>启用动作感应后，桌面会按手机真实倾角近似 1:1 保持空间姿态。失焦和屏幕外延伸由同一个 WebGL 着色器连续计算，不再使用分块 CSS 模糊。</p><button id="startMotion">启用动作感应</button></div>
<div class="fallback" id="fallback">当前浏览器没有可用的 WebGL 渲染环境。</div>
<script>
(function(){
  var canvas=document.getElementById('gl');
  var gl=canvas.getContext('webgl',{alpha:false,antialias:true,premultipliedAlpha:true})||canvas.getContext('experimental-webgl');
  if(!gl){document.getElementById('fallback').style.display='grid';return;}

  var vsSource=[
    'attribute vec2 a_pos;',
    'varying vec2 v_uv;',
    'uniform float u_angle;',
    'uniform float u_pivot;',
    'uniform float u_expand;',
    'uniform float u_side;',
    'uniform float u_halo;',
    'void main(){',
    '  vec2 p=a_pos;',
    '  if(u_halo>0.5){',
    '    if(u_side>0.5){ float t=p.x+0.5; p.x+=u_expand*t; }',
    '    else { float t=0.5-p.x; p.x-=u_expand*t; }',
    '    p.y*=1.0+u_expand*0.55;',
    '  }',
    '  float x=p.x-u_pivot;',
    '  float c=cos(u_angle);',
    '  float s=sin(u_angle);',
    '  float xr=x*c+u_pivot;',
    '  float z=-x*s;',
    '  float d=1.72;',
    '  float w=d-z;',
    '  gl_Position=vec4(xr*2.0*d,p.y*2.0*d,0.0,w);',
    '  v_uv=a_pos+0.5;',
    '}'
  ].join('\n');

  var fsSource=[
    'precision mediump float;',
    'varying vec2 v_uv;',
    'uniform sampler2D u_tex;',
    'uniform vec2 u_texel;',
    'uniform float u_strength;',
    'uniform float u_side;',
    'uniform float u_halo;',
    'vec4 blur9(vec2 uv,float r){',
    '  vec2 x=vec2(u_texel.x*r,0.0);',
    '  vec2 y=vec2(0.0,u_texel.y*r);',
    '  vec2 d=vec2(u_texel.x*r*0.68,u_texel.y*r*0.68);',
    '  vec4 c=texture2D(u_tex,clamp(uv,0.001,0.999))*0.20;',
    '  c+=texture2D(u_tex,clamp(uv+x,0.001,0.999))*0.105;',
    '  c+=texture2D(u_tex,clamp(uv-x,0.001,0.999))*0.105;',
    '  c+=texture2D(u_tex,clamp(uv+y,0.001,0.999))*0.105;',
    '  c+=texture2D(u_tex,clamp(uv-y,0.001,0.999))*0.105;',
    '  c+=texture2D(u_tex,clamp(uv+d,0.001,0.999))*0.095;',
    '  c+=texture2D(u_tex,clamp(uv-d,0.001,0.999))*0.095;',
    '  c+=texture2D(u_tex,clamp(uv+vec2(d.x,-d.y),0.001,0.999))*0.095;',
    '  c+=texture2D(u_tex,clamp(uv+vec2(-d.x,d.y),0.001,0.999))*0.095;',
    '  return c;',
    '}',
    'void main(){',
    '  float edgeCoord=u_side>0.5?v_uv.x:1.0-v_uv.x;',
    '  float edge=smoothstep(0.42,1.0,edgeCoord);',
    '  if(u_halo>0.5){',
    '    float h=smoothstep(0.50,1.0,edgeCoord);',
    '    float r=7.0+22.0*u_strength*pow(h,1.15);',
    '    vec4 col=blur9(v_uv,r);',
    '    float a=u_strength*pow(h,1.35)*0.78;',
    '    col.rgb*=0.94;',
    '    gl_FragColor=vec4(col.rgb*a,a);',
    '  }else{',
    '    float b=u_strength*pow(edge,1.55);',
    '    float r=1.0+17.0*b;',
    '    vec4 sharp=texture2D(u_tex,clamp(v_uv,0.001,0.999));',
    '    vec4 soft=blur9(v_uv,r);',
    '    vec4 col=mix(sharp,soft,smoothstep(0.0,0.92,b));',
    '    float dark=1.0-0.24*u_strength*pow(edge,1.25);',
    '    col.rgb*=dark;',
    '    float fade=1.0-u_strength*0.92*smoothstep(0.89,1.0,edgeCoord);',
    '    col.a*=fade;',
    '    gl_FragColor=col;',
    '  }',
    '}'
  ].join('\n');

  function compile(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){throw new Error(gl.getShaderInfoLog(s));}return s;}
  var program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vsSource));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fsSource));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){throw new Error(gl.getProgramInfoLog(program));}gl.useProgram(program);

  var buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-0.5,-0.5,0.5,-0.5,-0.5,0.5,-0.5,0.5,0.5,-0.5,0.5,0.5]),gl.STATIC_DRAW);
  var aPos=gl.getAttribLocation(program,'a_pos');gl.enableVertexAttribArray(aPos);gl.vertexAttribPointer(aPos,2,gl.FLOAT,false,0,0);
  var loc={angle:gl.getUniformLocation(program,'u_angle'),pivot:gl.getUniformLocation(program,'u_pivot'),expand:gl.getUniformLocation(program,'u_expand'),side:gl.getUniformLocation(program,'u_side'),halo:gl.getUniformLocation(program,'u_halo'),strength:gl.getUniformLocation(program,'u_strength'),texel:gl.getUniformLocation(program,'u_texel')};
  gl.uniform1i(gl.getUniformLocation(program,'u_tex'),0);
  var texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

  var source=document.createElement('canvas'),ctx=source.getContext('2d');
  var cssW=innerWidth,cssH=innerHeight,dpr=Math.min(devicePixelRatio||1,1.75),page=0,drag=0,touchStart=null,textureDirty=true;
  var baseline=null,smooth=0,currentAngle=0,currentStrength=0,currentSide=1;

  var pages=[
    [['☁','天气','#3478f6'],['✆','电话','#24a957'],['♥','健康','#e73659'],['☀','照片','#f2a526'],['✦','音乐','#675fdc'],['◎','浏览器','#19a7b8'],['◷','时钟','#eef0f3','#20242a'],['⚙','设置','#1c222d'],['✉','信息','#32b45d'],['▦','日历','#f0a92c'],['⌖','地图','#3d91ee'],['◉','相机','#6c63ea']],
    [['⌁','文件','#20a9b7'],['♫','播客','#e94d6e'],['↻','同步','#418bea'],['◈','工具','#222935'],['✎','备忘录','#eeaa27'],['✓','提醒','#32b45d'],['★','收藏','#6c63ea'],['☰','阅读','#eef0f3','#20242a']]
  ];

  function rr(c,x,y,w,h,r){var q=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+q,y);c.arcTo(x+w,y,x+w,y+h,q);c.arcTo(x+w,y+h,x,y+h,q);c.arcTo(x,y+h,x,y,q);c.arcTo(x,y,x+w,y,q);c.closePath();}
  function drawWallpaper(){var g=ctx.createLinearGradient(0,0,cssW,cssH);g.addColorStop(0,'#10243d');g.addColorStop(.42,'#23517d');g.addColorStop(.72,'#49327b');g.addColorStop(1,'#1a1834');ctx.fillStyle=g;ctx.fillRect(0,0,cssW,cssH);var r=ctx.createRadialGradient(cssW*.16,cssH*.13,0,cssW*.16,cssH*.13,cssW*.46);r.addColorStop(0,'rgba(87,183,255,.52)');r.addColorStop(1,'rgba(87,183,255,0)');ctx.fillStyle=r;ctx.fillRect(0,0,cssW,cssH);var r2=ctx.createRadialGradient(cssW*.77,cssH*.78,0,cssW*.77,cssH*.78,cssW*.52);r2.addColorStop(0,'rgba(231,78,190,.25)');r2.addColorStop(1,'rgba(231,78,190,0)');ctx.fillStyle=r2;ctx.fillRect(0,0,cssW,cssH);}
  function drawIcon(x,y,size,item){ctx.save();ctx.shadowColor='rgba(0,0,0,.20)';ctx.shadowBlur=18;ctx.shadowOffsetY=8;rr(ctx,x,y,size,size,size*.22);ctx.fillStyle=item[2];ctx.fill();ctx.restore();ctx.fillStyle=item[3]||'#fff';ctx.font='500 '+Math.round(size*.43)+'px -apple-system,Segoe UI,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(item[0],x+size/2,y+size/2);ctx.fillStyle='#fff';ctx.font='400 12px -apple-system,Segoe UI,sans-serif';ctx.textBaseline='top';ctx.fillText(item[1],x+size/2,y+size+7);}
  function drawPage(data,x0){var cols=4,pad=20,gap=15,size=Math.min(cssW*.15,66),cell=(cssW-pad*2)/cols;var y0=72,rowH=size+48;for(var i=0;i<data.length;i++){var col=i%4,row=Math.floor(i/4);var x=x0+pad+col*cell+(cell-size)/2;var y=y0+row*rowH;drawIcon(x,y,size,data[i]);}}
  function drawDesktop(){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,source.width,source.height);ctx.setTransform(dpr,0,0,dpr,0,0);drawWallpaper();var offset=-page*cssW+drag;drawPage(pages[0],offset);drawPage(pages[1],offset+cssW);ctx.fillStyle='#fff';ctx.font='650 14px -apple-system,Segoe UI,sans-serif';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),18,12);ctx.textAlign='right';ctx.fillText('◔   ⌁   ▰',cssW-18,12);ctx.globalAlpha=.42;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cssW/2-6,cssH-97,3,0,Math.PI*2);ctx.arc(cssW/2+6,cssH-97,3,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cssW/2+(page?6:-6),cssH-97,3,0,Math.PI*2);ctx.fill();var dockY=cssH-94,dockX=14,dockW=cssW-28,dockH=78;ctx.fillStyle='rgba(255,255,255,.16)';rr(ctx,dockX,dockY,dockW,dockH,29);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.20)';ctx.lineWidth=1;ctx.stroke();var dock=[['✆','#24a957'],['◎','#19a7b8'],['♫','#e94d6e'],['✉','#3478f6']];for(var j=0;j<4;j++){var s=Math.min(58,cssW*.16),dx=dockX+16+j*((dockW-32-s)/3);rr(ctx,dx,dockY+(dockH-s)/2,s,s,s*.22);ctx.fillStyle=dock[j][1];ctx.fill();ctx.fillStyle='#fff';ctx.font='500 '+Math.round(s*.42)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(dock[j][0],dx+s/2,dockY+dockH/2);}textureDirty=true;}

  function resize(){cssW=innerWidth;cssH=innerHeight;dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);source.width=canvas.width;source.height=canvas.height;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(loc.texel,1/source.width,1/source.height);drawDesktop();}
  function upload(){if(!textureDirty)return;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);textureDirty=false;}
  function drawPass(halo){gl.uniform1f(loc.halo,halo?1:0);gl.uniform1f(loc.expand,halo?currentStrength*.15:0);gl.drawArrays(gl.TRIANGLES,0,6);}
  function render(){upload();gl.clearColor(.012,.016,.022,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(loc.angle,currentAngle*Math.PI/180);gl.uniform1f(loc.pivot,currentSide>0?-.5:.5);gl.uniform1f(loc.side,currentSide>0?1:0);gl.uniform1f(loc.strength,currentStrength);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);if(currentStrength>.001)drawPass(true);drawPass(false);requestAnimationFrame(render);}

  function orientationAngle(){if(screen.orientation&&typeof screen.orientation.angle==='number')return screen.orientation.angle;if(typeof window.orientation==='number')return window.orientation;return 0;}
  function readRoll(e){var a=((orientationAngle()%360)+360)%360;if(a===90)return(e.beta||0);if(a===270)return-(e.beta||0);if(a===180)return(e.gamma||0);return-(e.gamma||0);}
  function applyRoll(raw){if(raw==null||Number.isNaN(raw))return;if(baseline===null)baseline=raw;var d=raw-baseline;if(d>38)d=38;if(d<-38)d=-38;smooth+=(d-smooth)*.28;var dead=Math.abs(smooth)<.55?0:smooth;if(dead===0){currentAngle=0;currentStrength=0;return;}currentSide=dead>0?1:-1;currentAngle=(dead>0?1:-1)*Math.min(Math.abs(dead),34);currentStrength=Math.min(Math.abs(dead)/30,1);}
  function motionHandler(e){applyRoll(readRoll(e));}

  var permission=document.getElementById('permission'),startButton=document.getElementById('startMotion'),recenter=document.getElementById('recenter');
  async function enableMotion(){try{if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){var state=await DeviceOrientationEvent.requestPermission();if(state!=='granted')throw new Error('denied');}window.addEventListener('deviceorientation',motionHandler,true);permission.classList.add('hidden');recenter.classList.add('show');}catch(err){permission.querySelector('p').textContent='没有获得动作感应权限。请检查浏览器的运动与方向访问权限后重试。';}}
  startButton.addEventListener('click',enableMotion);recenter.addEventListener('click',function(){baseline=null;smooth=0;currentAngle=0;currentStrength=0;});
  window.addEventListener('orientationchange',function(){baseline=null;smooth=0;currentAngle=0;currentStrength=0;setTimeout(resize,120);});window.addEventListener('resize',resize);

  canvas.addEventListener('touchstart',function(e){touchStart=e.touches[0].clientX;drag=0;},{passive:true});
  canvas.addEventListener('touchmove',function(e){if(touchStart===null)return;drag=e.touches[0].clientX-touchStart;drawDesktop();},{passive:true});
  canvas.addEventListener('touchend',function(){if(Math.abs(drag)>cssW*.16)page=Math.max(0,Math.min(1,page+(drag<0?1:-1)));drag=0;touchStart=null;drawDesktop();});

  resize();setInterval(drawDesktop,30000);requestAnimationFrame(render);
})();
</script>
</body>
</html>`;

export default {async fetch(){return new Response(html,{headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-store','permissions-policy':'accelerometer=(self), gyroscope=(self)'}});}};
