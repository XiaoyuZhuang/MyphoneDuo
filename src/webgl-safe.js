import webglApp from './webgl.js';
import compatApp from './app-v2.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.searchParams.get('compat') === '1') {
      return compatApp.fetch(request, env, ctx);
    }

    const response = await webglApp.fetch(request, env, ctx);
    let body = await response.text();

    // WebGL 1 / GLSL ES 1.00 compatibility: some Android drivers reject
    // clamp(vec2, float, float), so use vec2 bounds explicitly.
    body = body.replaceAll(
      'clamp(uv,0.001,0.999)',
      'clamp(uv,vec2(0.001),vec2(0.999))'
    );

    // Do not let the canvas intercept the permission button before WebGL is ready.
    body = body.replace(
      '#gl{position:fixed;inset:0;width:100%;height:100%;display:block;background:#030405;touch-action:none}',
      '#gl{position:fixed;inset:0;width:100%;height:100%;display:block;background:#030405;touch-action:none;pointer-events:none}'
    );

    body = body.replace(
      "permission.classList.add('hidden');recenter.classList.add('show');",
      "permission.classList.add('hidden');recenter.classList.add('show');canvas.style.pointerEvents='auto';"
    );

    // Ensure a shader/driver failure never leaves an inert black screen.
    body = body.replace(
      '<script>\n(function(){',
      `<script>\n(function(){try{`
    );

    body = body.replace(
      "  resize();setInterval(drawDesktop,30000);requestAnimationFrame(render);\n})();",
      `  resize();setInterval(drawDesktop,30000);requestAnimationFrame(render);\n  }catch(err){\n    console.error('MyphoneDuo WebGL init failed:', err);\n    var f=document.getElementById('fallback');\n    var p=document.getElementById('permission');\n    if(p)p.style.display='none';\n    if(f){\n      f.style.display='grid';\n      f.innerHTML='<div><div style="font-size:18px;font-weight:700;margin-bottom:10px">WebGL 初始化失败</div><div style="opacity:.72;line-height:1.55;margin-bottom:18px">当前浏览器或 GPU 驱动没有成功编译这版效果，已避免黑屏。</div><button id="compatBtn" style="border:0;border-radius:14px;padding:12px 18px;font-size:15px;font-weight:700">进入兼容模式</button></div>';\n      setTimeout(function(){var b=document.getElementById('compatBtn');if(b)b.onclick=function(){location.href='/?compat=1';};},0);\n    }\n  }\n})();`
    );

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
