import app from './index.js';

const oldReadRoll = `function readRoll(e){
    var a=((orientationAngle()%360)+360)%360;
    if(a===90) return -(e.beta||0);
    if(a===270) return (e.beta||0);
    if(a===180) return -(e.gamma||0);
    return e.gamma||0;
  }`;

const newReadRoll = `function readRoll(e){
    var a=((orientationAngle()%360)+360)%360;
    if(a===90) return (e.beta||0);
    if(a===270) return -(e.beta||0);
    if(a===180) return (e.gamma||0);
    return -(e.gamma||0);
  }`;

export default {
  async fetch(request, env, ctx) {
    const original = await app.fetch(request, env, ctx);
    const headers = new Headers(original.headers);
    const html = (await original.text()).replace(oldReadRoll, newReadRoll);
    return new Response(html, {
      status: original.status,
      statusText: original.statusText,
      headers
    });
  }
};
