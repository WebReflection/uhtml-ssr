self.uhtml=function(e){"use strict";const{replace:t}="",n=/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g,r=/[&<>'"]/g,s={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},a=e=>s[e],c=e=>t.call(e,r,a),o={"&amp;":"&","&#38;":"&","&lt;":"<","&#60;":"<","&gt;":">","&#62;":">","&apos;":"'","&#39;":"'","&quot;":'"',"&#34;":'"'},i=e=>o[e];const l=/([^\s\\>"'=]+)\s*=\s*(['"]?)$/,u=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,p=/<[a-z][^>]+$/i,$=/>[^<>]*$/,f=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/gi,g=/\s+$/,h=(e,t)=>0<t--&&(p.test(e[t])||!$.test(e[t])&&h(e,t)),b=(e,t,n)=>u.test(t)?e:`<${t}${n.replace(g,"")}></${t}>`;const{isArray:m}=Array,{toString:w}=Function,{keys:k}=Object,d=(e=>{let t;return n=>{t!==n&&(t=n,"function"==typeof n?n(e):n.current=e)}})(null),y="isµ"+Date.now(),x=new RegExp(`(\x3c!--${y}(\\d+)--\x3e|\\s*${y}(\\d+)=('|")([^\\4]+?)\\4)`,"g"),j=(e,t,n)=>` ${e}=${t}${c(n)}${t}`,S=e=>{switch(typeof e){case"string":return c(e);case"boolean":case"number":return String(e);case"object":switch(!0){case m(e):return e.map(S).join("");case e instanceof v:return e.toString()}break;case"function":return S(e())}return null==e?"":c(String(e))};class v extends String{}const z=(e,t,n)=>{const r=((e,t,n)=>{const r=[],{length:s}=e;for(let n=1;n<s;n++){const s=e[n-1];r.push(l.test(s)&&h(e,n)?s.replace(l,((e,r,s)=>`${t}${n-1}=${s||'"'}${r}${s?"":'"'}`)):`${s}\x3c!--${t}${n-1}--\x3e`)}r.push(e[s-1]);const a=r.join("").trim();return n?a:a.replace(f,b)})(e,y,n),s=[];let a=0,c=null;for(;c=x.exec(r);){const e=r.slice(a,c.index);if(a=c.index+c[0].length,c[2])s.push((t=>e+S(t)));else{let t=c[5];const n=c[4];switch(!0){case"aria"===t:s.push((t=>e+k(t).map(A,t).join("")));break;case"ref"===t:s.push((t=>(d(t),e)));break;case"?"===t[0]:const r=t.slice(1).toLowerCase();s.push((t=>{let n=e;return t&&(n+=` ${r}`),n}));break;case"."===t[0]:const a=t.slice(1).toLowerCase();s.push("dataset"===a?t=>e+k(t).map(C,t).join(""):t=>{let r=e;return null!=t&&!1!==t&&(r+=!0===t?` ${a}`:j(a,n,t)),r});break;case"@"===t[0]:t="on"+t.slice(1);case"o"===t[0]&&"n"===t[1]:s.push((r=>{let s=e;switch(typeof r){case"object":if(!(t in r))break;if("function"!=typeof(r=r[t]))break;case"function":if(r.toString===w)break;case"string":s+=j(t,n,r)}return s}));break;default:s.push((r=>{let s=e;return null!=r&&(s+=j(t,n,r)),s}))}}}const{length:o}=s;if(o!==t)throw new Error(`invalid template ${e}`);if(o){const e=s[o-1],t=r.slice(a);s[o-1]=n=>e(n)+t}else s.push((()=>r));return s};function A(e){const t=c(this[e]);return"role"===e?` role="${t}"`:` aria-${e.toLowerCase()}="${t}"`}function C(e){return` data-${t=e,t.replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z])([A-Z]))/g,"$2$5-$3$6").toLowerCase()}="${c(this[e])}"`;var t}const{replace:L}="",q=e=>L.call(e,/<(script|style|title)>([\s\S]+)<\/\1>/gi,((e,r,s)=>{return`<${r}>${a=s,t.call(a,n,i)}</${r}>`;var a})),Z=(E=new WeakMap,{get:e=>E.get(e),set:(e,t)=>(E.set(e,t),t)});var E;const D=e=>{const t=(t,...n)=>{const{length:r}=n,s=Z.get(t)||Z.set(t,z(t,r,e));return new v(r?n.map(M,s).join(""):s[0]())};return t.node=t,t.for=()=>t,t},F=D(!1),H=D(!0);function M(e,t){return this[t](e)}return e.Hole=v,e.html=F,e.render=(e,t)=>{const n=q("function"==typeof t?t():t);return"function"==typeof e?e(n):(e.write(n),e)},e.svg=H,e}({});
