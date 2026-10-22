const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DTxiOSn8.js","./BcL1QBv6.js","./H2AGsyCA.js","./CKimS5rj.js","./oPCmLQ4I.js","./D-l4523c.js","./Dv6o1hQR.js","./CZEyUk1w.js","./Cto4mOXT.js","./BBS_-sb2.js","./B2Cn2Kjp.js","./CSB_9qOQ.js","./Co8Gqqe3.js","./9Gf3pYfE.js","./entry.mTHQBrhg.css"])))=>i.map(i=>d[i]);

import{
C as e}
from"./oPCmLQ4I.js";
import{
$ as t,A as n,C as r,D as i,E as a,It as o,K as s,L as c,Lt as l,O as u,Pt as d,R as f,S as p,V as m,W as h,Y as g,_t as _,b as v,dt as y,et as b,ft as x,g as S,it as C,k as w,mt as T,p as E,rt as D,t as O,tt as k,x as A,y as j}
from"./BcL1QBv6.js";
import{
s as ee}
from"./H2AGsyCA.js";
import{
t as te}
from"./B2Cn2Kjp.js";
import{
t as ne}
from"./Cto4mOXT.js";
import{
a as re,l as ie,t as M}
from"./CSB_9qOQ.js";
import{
i as N}
from"./Co8Gqqe3.js";
import{
I as P,R as F,n as I,r as L,t as R}
from"#entry";
import{
t as z}
from"./BDNMzG2s.js";
import{
n as B}
from"./BB7OxwI-.js";
import{
n as V,t as H}
from"./D8wzH0Ee.js";
import{
n as U,t as W}
from"./ysi2AbB9.js";
import{
t as G}
from"./dgVLAbKl.js";
import{
t as K}
from"./DLb29fxS.js";
var q=F(`/hero-wordmark.webp`),J=w(()=>ne(()=>import(`./DTxiOSn8.js`).then(e=>e.default||e),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]),import.meta.url)),Y=[`media`],ae=`data:image/gif;
base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`,oe=.12,se=Object.assign(n({
__name:`Wordmark`,setup(n){
let{
$planes:i,$resize:a}
=e(),o=b(`el`),c=t(),l=[];
m(()=>{
for(let e of l)e()}
);
let g=j(()=>!1),y=T(null);
h(async()=>{
if(await f(),!i||!o.value||!await B(o))return;
let e=i.ensureWordmark({
id:c,el:o.value,order:1}
);
g.value&&(y.value=e),x(e,o.value)}
);
let x=(e,t)=>{
let n=0,r=0,i=()=>{
e.scroll=r,e.offsetY=n*oe*r}
,o=()=>{
n=t.offsetHeight,i()}
;
a.add(o);
let s=L.create({
trigger:t,start:`clamp(top bottom)`,end:`clamp(bottom top)`,onUpdate:e=>{
r=e.progress,i()}
}
);
l.push(()=>{
a.remove(o),s.kill()}
)}
;
return(e,t)=>{
let n=J;
return s(),r(`div`,{
ref_key:`el`,ref:o,class:`absolute inset-0`}
,[v(`picture`,null,[v(`source`,{
media:`GL_MEDIA`in e?e.GL_MEDIA:_(O),srcset:ae}
,null,8,Y),v(`img`,{
src:q,alt:`Ascension`,class:d([`w-full h-full object-contain`,`has-gl:hidden`])}
,null,2)]),_(y)?(s(),A(S,{
key:0,to:`body`}
,[u(n,{
plane:_(y)}
,null,8,[`plane`])])):p(``,!0)],512)}
}
}
),{
__name:`GlWordmark`}
),ce=2,X=e=>({
video:`/videos/${
e}
.mp4`,still:`/videos/${
e}
.webp`}
),Z={
A1:X(`home-ascension1`),A2:X(`home-circles2`),B1:X(`home-forestwalk2`),B2:X(`home-twinflame1`)}
,Q=x(null),le=y(Q),ue=t=>{
let{
$event:n,$resize:r}
=e(),i=e=>{
let n=t.value;
if(n){
n.classList.toggle(`cued`,!!e);
for(let t of n.querySelectorAll(`[data-cue]`))t.classList.toggle(`lit`,!!e&&t.dataset.cue===e)}
}
,a=e=>{
Q.value===e||!Z[e]||(Q.value||re(`cue`),Q.value=e,i(e))}
,o=()=>{
Q.value&&(Q.value=null,i(null),ie(`cue`))}
,s=e=>{
let t=(e.target?.closest?.(`[data-cue]`))?.getAttribute(`data-cue`);
if(t)return a(t);
o()}
,c=-1,l=!1,u=({
y:e,ratio:n}
)=>{
let r=c<0||!n?0:Math.abs(e-c)/n;
c=e;
let i=r>ce;
i!==l&&(l=i,t.value?.classList.toggle(`scrolling`,i),i&&o())}
;
h(()=>{
let e=t.value;
if(!(!e||!r.mouse)){
e.addEventListener(`mouseover`,s),e.addEventListener(`mouseleave`,o),n.on(`tick`,u);
for(let e of Object.values(Z))new Image().src=e.still}
}
),m(()=>{
let e=t.value;
e?.removeEventListener(`mouseover`,s),e?.removeEventListener(`mouseleave`,o),n.off(`tick`,u),o()}
)}
,de={
class:`fixed inset-x-0 top-12 z-70 site-max site-grid pointer-events-none`,"aria-hidden":`true`}
,fe={
class:`col-span-5 rounded-4 overflow-hidden`}
,pe=[`poster`],me=Object.assign(n({
__name:`index`,setup(e){
let t=le,n=j(()=>t.value&&Z[t.value]?.still||void 0),i=b(`clip`),a=b(`bar`),o={
at:0}
,c=(e,t)=>{
let n=i.value;
n&&(N.killTweensOf(o),n.volume=o.at,e>0&&(n.muted=!1),N.to(o,{
at:e,duration:M,ease:`none`,onUpdate:()=>{
n.volume=o.at}
,onComplete:t}
))}
;
return k(t,e=>{
let t=i.value;
if(!t)return;
if(!e)return c(0,()=>{
t.pause(),t.muted=!0}
);
let n=Z[e]?.video;
n&&(t.src.endsWith(n)||(t.src=n),t.currentTime=0,t.play().catch(()=>{
}
),a.value?.reset(),c(1))}
),(e,o)=>{
let c=K;
return s(),r(E,null,[C(v(`div`,de,[v(`div`,fe,[v(`video`,{
ref_key:`clip`,ref:i,poster:_(n),loop:``,playsinline:``,preload:`none`,class:`block w-full h-auto`}
,null,8,pe)])],512),[[ee,_(t)]]),u(c,{
ref_key:`bar`,ref:a,source:()=>_(i),on:!!_(t)}
,null,8,[`source`,`on`])],64)}
}
}
),{
__name:`TrackCue`}
),he=.4,ge=2,_e=(t,n)=>{
let{
$resize:r}
=e(),i=0,a=0,o=1,s=null,c=null,l=[],u=()=>{
s?.(i*he*a),c?.(o)}
,d=()=>{
i=t.value?.offsetHeight??0,u()}
;
h(async()=>{
await f();
let e=t.value;
if(!e)return;
s=N.quickSetter(e,`y`,`px`),c=N.quickSetter(e,`opacity`),r.add(d);
let i=e.closest(`.hero`);
l.push(L.create({
trigger:i??e,start:`top top`,end:`bottom top`,onUpdate:e=>{
a=e.progress,u()}
}
)),n.value&&l.push(L.create({
trigger:n.value,start:`top bottom`,end:`top top`,onUpdate:e=>{
o=(1-e.progress)**ge,u()}
}
))}
),m(()=>{
r.remove(d);
for(let e of l)e.kill();
l.length=0}
)}
,ve={
ref:`page`,class:`relative`}
,ye={
class:`hero relative min-h-svh overflow-x-clip s:overflow-visible`}
,be={
class:`absolute inset-x-0 top-0 h-svh site-max`}
,xe={
class:`h-svh flex flex-col justify-end items-center pb-[48.7svh] s:flex-row s:justify-center s:pb-0`}
,Se={
class:`relative z-10 w-full aspect-[2496/1173] s:z-auto s:w-[83%]`}
,Ce={
class:`slide-mask absolute left-10 bottom-8 hidden s:block`}
,we={
class:`relative overflow-hidden`}
,Te={
class:`site-max site-grid mt-110 s:mt-195`}
,Ee={
class:`site-max site-grid mt-125 s:mt-260`}
,De={
class:`row-start-3 col-span-4 grid grid-cols-2 gap-x-10 mt-10 s:row-start-1 s:block s:col-start-5 s:col-span-2 s:-mt-4`}
,$={
class:`t-meta leading-16`}
,Oe={
class:`w-full max-w-[17rem] -mt-16 ml-20 t-note`}
,ke={
class:`mt-15`}
,Ae={
class:`row-start-1 col-span-4 site-grid-4 t-copy s:col-start-9 js-animate-group`}
,je={
class:`col-start-1 col-end-2 js-animate-lines`}
,Me={
class:`col-start-2 col-end-[-1] js-animate-lines`}
,Ne={
class:`col-start-2 col-end-[-1] relative ml-35 js-animate-lines`}
,Pe={
class:`w-full max-w-[31rem]`}
,Fe={
class:`col-start-2 col-end-[-1] mt-45 ml-35`}
,Ie=z(n({
__name:`index`,setup(e){
let t=b(`tracklist`);
ue(t);
let n=b(`stairs`);
_e(n,t);
let f=[{
body:`The track ‘YOYOYO’ was the first breakthrough track, produced during covid.`,link:`Spotify`,to:U.spotify}
,{
body:`Pegassi did his first AV show on the freedom stage of Tomorrowland 2026.`,link:`Watch`,to:U.youtube}
],p=[{
n:1,key:`A:`,heading:`How one track started it.`,line:1,body:`Pegassi’s rise accelerated with his breakout club anthem “Yoyoyo,” a track that set the tone for the hybrid, emotionally-charged rave identity he would continue perfecting. Follow-up singles like “Spectrals Bells” and the explosive “227kg” amplified his momentum;
 the latter became a true cult phenomenon, earning millions of streams and cementing the “bells” as an essential part of his sonic DNA.`}
,{
n:2,key:`B:`,heading:`An international following`,line:7,body:`His catalogue has grown into a global streaming presence, including “Bring It Back,” released on Berlin’s iconic Live From Earth label. On stage, Pegassi has established himself across Europe’s most respected festivals and clubs, performing at Awakenings, Time Warp, Tomorrowland, RSO, Dour, Sziget, Intercell, Pitch, BTV, Glitch, Hive, Baum, AVA and Boiler Room. His global footprint continues to expand through strong worldwide touring, with yearly runs across Europe, Australia, North America and South America that have earned him a devoted international following.`}
],m=b(`parallax`);
return G(m),I({
title:`Ascension`,description:`The debut EP from Belgian electronic artist Pegassi. Four tracks — Ascension, Circles, Forest Walk, Twinflame. Out 4 September 2026.`,type:`music.album`}
),P({
script:[{
type:`application/ld+json`,innerHTML:JSON.stringify({
"@context":`https://schema.org`,"@type":`MusicAlbum`,name:`Ascension`,albumProductionType:`https://schema.org/StudioAlbum`,albumReleaseType:`https://schema.org/EPRelease`,datePublished:`2026-09-04`,genre:[`Trance`,`Techno`,`Rave`],url:R(`/`),image:R(`/cover.webp`),byArtist:{
"@type":`MusicGroup`,name:`Pegassi`,url:R(`/about`),sameAs:Object.values(U).map(e=>e.href)}
,numTracks:4,track:[`Ascension`,`Circles`,`Forest Walk`,`Twinflame`].map((e,t)=>({
"@type":`MusicRecording`,position:t+1,name:e}
))}
)}
]}
),(e,h)=>{
let y=se,b=V,x=H,S=te,C=W,w=me;
return s(),r(`div`,ve,[v(`section`,ye,[v(`div`,be,[v(`div`,xe,[h[0]||=v(`h1`,{
class:`sr-only`}
,`Pegassi — Ascension EP`,-1),v(`div`,Se,[u(y)])]),v(`div`,{
ref_key:`stairs`,ref:n,class:`stairs relative -mx-[40%] w-[180%] aspect-[1260/825] -mt-[52.5svh] s:mx-auto s:w-[84%] s:-mt-[33.6svh]`}
,[u(b,{
src:`/hero-stairs.webp`,alt:``,eager:``}
)],512),h[1]||=v(`p`,{
class:`slide-mask absolute left-10 top-1/2 -translate-y-1/2 hidden s:block`}
,[v(`span`,{
class:`block js-slide-up`}
,`EP`)],-1),h[2]||=v(`p`,{
class:`slide-mask absolute right-10 top-1/2 -translate-y-1/2 hidden s:block`}
,[v(`span`,{
class:`block js-slide-up`}
,`01`)],-1),v(`p`,Ce,[v(`a`,c((`SOCIAL`in e?e.SOCIAL:_(U)).album,{
class:`link block js-slide-up`}
),`Spotify`,16)])])]),v(`div`,we,[v(`div`,{
ref_key:`parallax`,ref:m,class:`pb-100 s:pb-195`}
,[v(`section`,{
ref_key:`tracklist`,ref:t,class:`site-max site-grid mt-45 s:mt-7`}
,[...h[3]||=[a(`<div class="contents js-animate-group" data-v-337fa076><p class="col-span-2 t-mark js-animate-lines" data-v-337fa076>● TRACKLIST</p><p class="col-span-4 -mt-27 t-display col-indent [--indent:1] s:col-span-12 s:[--cols:12] s:[--indent:5] js-animate-lines" data-v-337fa076> This EP is all about showing my versatility as an artist. With “Ascension”, I&#39;
m dropping four tracks that reflect the different sides of my sound and everything I&#39;
ve been developing over the past few years. </p><p class="col-start-1 mt-10 t-mark s:col-start-5 s:mt-6 js-animate-lines" data-v-337fa076>A1</p><p class="col-start-2 col-end-[-1] mt-10 t-display s:col-start-6 s:col-span-7 s:mt-6 s:-ml-1 js-animate-lines" data-v-337fa076> The <span data-cue="A1" data-v-337fa076>title track<sup class="raised t-meta" data-v-337fa076>1</sup></span> combines that uplifting yet heavy-hitting energy with orchestral influences which, by now, you all know I absolutely love. </p><p class="col-start-1 mt-5 t-mark s:col-start-5 s:mt-18 js-animate-lines" data-v-337fa076>A2</p><p class="col-start-2 col-end-[-1] mt-5 t-display s:col-start-7 s:col-span-6 s:mt-18 js-animate-lines" data-v-337fa076><span data-cue="A2" data-v-337fa076>“Circles”<sup class="raised t-meta" data-v-337fa076>2</sup></span> is only the second time in my career I&#39;
ve stepped on my own vocals, this time on a punk-heavy breakbeat track. </p></div><div class="titles col-start-2 col-end-[-1] mt-80 t-display leading-30 s:col-start-1 s:col-end-[-1] s:mt-120 s:leading-45" data-v-337fa076><p class="s:flex s:justify-center s:gap-27 js-animate-lines" data-v-337fa076><span data-cue="A1" data-v-337fa076><sup class="ride" data-v-337fa076>A1</sup>\xA0Ascension (03:01)</span><span data-cue="B1" data-v-337fa076><sup class="ride" data-v-337fa076>B1</sup>\xA0Forest Walk (03:10)</span></p><p class="s:flex s:justify-center s:gap-15 s:mt-10 js-animate-lines" data-v-337fa076><span data-cue="A2" data-v-337fa076><sup class="ride" data-v-337fa076>A2</sup>\xA0Circles (03:19)</span><span data-cue="B2" data-v-337fa076><sup class="ride" data-v-337fa076>B2</sup>\xA0Twinflame (02:45)</span></p></div><div class="contents js-animate-group" data-v-337fa076><p class="col-start-1 mt-70 t-mark s:col-start-5 s:mt-145 js-animate-lines" data-v-337fa076>B1</p><p class="col-start-2 col-end-[-1] mt-70 t-display s:col-start-6 s:col-span-7 s:mt-145 s:-ml-1 js-animate-lines" data-v-337fa076><span data-cue="B1" data-v-337fa076>Forest Walk<sup class="raised t-meta" data-v-337fa076>3</sup></span> instantly felt right. Hypnotic, driving and mysterious, it’s built around that catchy pluck and a groove pulling you forward. </p><p class="col-start-1 mt-5 t-mark s:col-start-5 s:mt-9 js-animate-lines" data-v-337fa076>B2</p><p class="col-start-2 col-end-[-1] mt-5 t-display s:col-start-7 s:col-span-6 s:mt-9 js-animate-lines" data-v-337fa076><span data-cue="B2" data-v-337fa076>Twinflame<sup class="raised t-meta" data-v-337fa076>4</sup></span> was created just after I moved out on my own. It’s a darker, harder record shaped by touring and discovering different sides of my sound. </p></div>`,3)]],512),v(`section`,Te,[u(x,{
class:`col-span-4 aspect-[484/645] rounded-5 s:col-start-7`}
,{
default:D(()=>[u(b,{
src:`/videos/ascension-glitch.webp`,video:`/videos/ascension-glitch.mp4`,alt:``}
)]),_:1}
),h[4]||=v(`p`,{
class:`col-start-11 col-span-2 leading-20 hidden s:block js-animate-lines`}
,[i(`● ASCENSION`),v(`br`),i(`GLITCH (MALTA)`)],-1)])],512)]),h[6]||=v(`section`,{
class:`border-t border-rule`}
,[v(`div`,{
class:`site-max site-grid mt-9`}
,[v(`p`,{
class:`col-span-2 t-mark js-animate-lines`}
,`● PEGASSI`),v(`p`,{
class:`col-span-4 -mt-27 t-display col-indent [--indent:1] s:col-span-12 s:[--cols:12] s:[--indent:6] js-animate-lines`}
,` Belgian electronic artist Pegassi, the creative alter ego of Sam Huybrecht, has emerged as one of Europe’s most exciting next-generation acts. His sound is a high-energy fusion of trance, techno and rave, rooted in the hip-hop he grew up with and elevated by a signature element that fans instantly recognize: the “bells.” What began as a sonic motif has evolved into a defining symbol of his artistry, shaping some of his biggest live moments. `)])],-1),v(`section`,Ee,[u(x,{
class:`row-start-2 col-span-4 mt-100 aspect-[487/754] rounded-5 s:row-start-1 s:mt-0`}
,{
default:D(()=>[u(b,{
src:`/videos/twinflame-awakenings.webp`,video:`/videos/twinflame-awakenings.mp4`,alt:``}
)]),_:1}
),v(`div`,De,[(s(),r(E,null,g(f,(e,t)=>v(`div`,{
key:e.link,class:d([`js-animate-lines`,t?`s:mt-60`:``])}
,[v(`p`,$,l(t+1),1),v(`div`,Oe,[v(`p`,null,l(e.body),1),v(`p`,ke,[v(`a`,c({
ref_for:!0}
,e.to,{
class:`link`}
),l(e.link)+` ↗`,17)])])],2)),64))]),v(`div`,Ae,[(s(),r(E,null,g(p,e=>v(`div`,{
key:e.key,class:`contents`}
,[v(`p`,je,l(e.key),1),v(`p`,Me,l(e.heading),1),v(`div`,Ne,[v(`span`,{
class:`absolute -left-35 t-meta leading-22`,style:o({
top:`${
e.line*2.2}
rem`}
)}
,l(e.n),5),v(`p`,Pe,l(e.body),1)])])),64)),v(`div`,Fe,[u(S,{
to:`/about`,class:`link flex justify-between w-full max-w-[33rem] js-animate-lines`}
,{
default:D(()=>[...h[5]||=[v(`span`,null,`More about Pegassi`,-1),v(`span`,null,`→`,-1)]]),_:1}
)])])]),u(C),u(w)],512)}
}
}
),[[`__scopeId`,`data-v-337fa076`]]);
export{
Ie as default}
;
