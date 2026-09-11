import base from './worker.js';

const PHYSICS_PATCH = String.raw`<script>
(function(){
  var root = document.documentElement;
  var ownBaseline = null;
  var ownSmooth = 0;

  function orientationAngle(){
    if(screen.orientation && typeof screen.orientation.angle === 'number') return screen.orientation.angle;
    if(typeof window.orientation === 'number') return window.orientation;
    return 0;
  }

  function readRoll(e){
    var a = ((orientationAngle() % 360) + 360) % 360;
    if(a === 90) return (e.beta || 0);
    if(a === 270) return -(e.beta || 0);
    if(a === 180) return (e.gamma || 0);
    return -(e.gamma || 0);
  }

  function resetOwnBaseline(){
    ownBaseline = null;
    ownSmooth = 0;
  }

  function applyPhysicalScale(e){
    var raw = readRoll(e);
    if(raw == null || Number.isNaN(raw)) return;
    if(ownBaseline === null) ownBaseline = raw;

    var delta = raw - ownBaseline;
    if(delta > 38) delta = 38;
    if(delta < -38) delta = -38;

    // Only smooth sensor noise. Angle magnitude stays essentially 1:1.
    ownSmooth += (delta - ownSmooth) * 0.24;
    var dead = Math.abs(ownSmooth) < 0.55 ? 0 : ownSmooth;

    requestAnimationFrame(function(){
      var plane = document.getElementById('screenPlane');
      if(!plane) return;

      if(dead === 0){
        root.style.setProperty('--screen-angle', '0deg');
        root.style.setProperty('--soft-blur', '0');
        root.style.setProperty('--mid-blur', '0');
        root.style.setProperty('--strong-blur', '0');
        root.style.setProperty('--edge-dark', '0');
        root.style.setProperty('--edge-line', '.12');
        return;
      }

      // Preserve the already-corrected pivot and rotation direction from worker.js.
      var currentAngle = parseFloat(getComputedStyle(root).getPropertyValue('--screen-angle')) || 0;
      var sign = currentAngle < 0 ? -1 : 1;
      var physicalAngle = Math.min(Math.abs(dead), 34);
      root.style.setProperty('--screen-angle', (sign * physicalAngle).toFixed(2) + 'deg');

      // Edge defocus follows the real angle gently rather than being amplified.
      var p = Math.min(Math.abs(dead) / 30, 1);
      var soft = Math.min(1, p * 0.92);
      var mid = Math.min(1, Math.max(0, (p - 0.18) / 0.82));
      var strong = Math.min(1, Math.max(0, (p - 0.46) / 0.54));
      root.style.setProperty('--soft-blur', soft.toFixed(3));
      root.style.setProperty('--mid-blur', mid.toFixed(3));
      root.style.setProperty('--strong-blur', strong.toFixed(3));
      root.style.setProperty('--edge-dark', (Math.pow(p, 1.15) * 0.68).toFixed(3));
      root.style.setProperty('--edge-line', (0.12 + p * 0.48).toFixed(3));
    });
  }

  window.addEventListener('deviceorientation', applyPhysicalScale, true);
  window.addEventListener('orientationchange', resetOwnBaseline);
  if(screen.orientation && screen.orientation.addEventListener){
    screen.orientation.addEventListener('change', resetOwnBaseline);
  }

  document.addEventListener('click', function(e){
    if(e.target && (e.target.id === 'recenter' || e.target.id === 'startMotion')){
      setTimeout(resetOwnBaseline, 0);
    }
  }, true);
})();
</script>`;

export default {
  async fetch(request, env, ctx) {
    const response = await base.fetch(request, env, ctx);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;

    let body = await response.text();
    body = body.replace('</body>', PHYSICS_PATCH + '\n</body>');

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
