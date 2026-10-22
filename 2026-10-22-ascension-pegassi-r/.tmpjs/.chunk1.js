size:${
d}px${
ks(r).unit}${
i&&`;
`+i}`,a.classes.chars);
m.setAttribute(`data-char`,``),f.replaceWith(m),m.append(f);
let h=null;
a.mask.has(`chars`)&&(h=Ts(`span`,`display:inline-block;
position:relative;
text-indent:0;
clip-path:inset(0)${
ks(r).mask}`,a.classes.mask),h.setAttribute(`data-mask`,``),m.replaceWith(h),h.append(m)),o.chars.push({
el:m,mask:h,target:o.target,line:-1}),c=p})},Ms=(e,t,n)=>{
let r=t.mask.has(`lines`);
for(let i of e.blocks){
let a=r?i.pad:0,o=`display:block;
position:relative${
t.words?`;
white-space:nowrap`:``}${
ks(a).unit}`,s=`display:block;
position:relative;
overflow:clip${
ks(a).mask}`,c=[],l=new Map;
for(let u=i.runs.length-1;
u>=0;
u--){
let d=i.runs[u],{
container:f,anchor:p}=d;
t.words&&As(d,i,e,t,l);
let m=()=>p?bs(p):f.childNodes.length,h=d.starts.map(e=>{
let t=`before`in e?null:l.get(e.node)?.get(e.offset);
return Os(t?{
before:t}:e,f)}),g=[];
for(let e=h.length-1;
e>=0;
e--)n.setStart(h[e].node,h[e].offset),n.setEnd(f,m()),g[e+1]=n.extractContents();
n.setStart(f,bs(d.first)),n.setEnd(f,m()),g[0]=n.extractContents(),c[u]=g.map(n=>{
let c=Ts(`div`,o,t.classes.lines);
c.append(n);
let l=null;
return r&&(l=Ts(`div`,s,t.classes.mask),l.append(c)),f.insertBefore(l??c,p),{
el:c,mask:l,target:e.target,line:-1,pitch:i.pitch,pad:a}})}let u=c.flat();
if(u.length){
if(u.forEach((e,t)=>{
e.line=t,e.el.setAttribute(`data-line`,String(t)),e.mask?.setAttribute(`data-mask`,String(t));
let n=t===u.length-1;
if(i.indent&&t>0&&(e.el.style.textIndent=`0`),i.justify&&!n&&(e.el.style.textAlignLast=`justify`),i.pre&&!n){
let t=Es(e.el);
t&&Ds.test(t.data)&&(t.data=t.data.replace(Ds,``))}}),r&&(i.mask=u[0].mask,i.el.style.setProperty(`display`,`flex`),i.el.style.setProperty(`flex-direction`,
`column`)),i.indent)for(let t of i.runs)for(let n of t.words)`atom`in n&&(e.restyled.set(n.atom,n.atom.style.getPropertyValue(`text-indent`)),n.atom.style.textIndent=i.indent)
;
e.lines.push(...u)}}if(t.words){
let t=new Map;
for(let n of e.lines)t.set(n.el,n.line);
let n=e=>{
for(let n=e;
n;
n=n.parentElement){
let e=t.get(n);
if(e!==void 0)return e}return-1};
for(let t of e.words)t.line=n(t.el);
for(let t of e.chars)t.line=n(t.el)}},Ns=(e,t)=>{
if(e.length!==t.length)return!1;
for(let n=0;
n<t.length;
n++)if(e[n]!==t[n])return!1;
return!0},Ps=e=>{
if(e.reverted)return;
e.reverted=!0;
let t=new Map;
for(let n of e.blocks)t.set(n.el,n);
for(let[n,r]of e.children){
let e=t.get(n);
if(!(e?.mask&&!n.contains(e.mask))&&(Ns(n.childNodes,r)||n.replaceChildren(...r),e?.mask)){
let t=n.style;
e.display?t.setProperty(`display`,e.display):t.removeProperty(`display`),e.direction?t.setProperty(`flex-direction`,e.direction):t.removeProperty(`flex-direction`)
,t.length||n.removeAttribute(`style`)}}for(let[t,n]of e.text)t.data!==n&&t.data===e.after.get(t)&&(t.data=n);
for(let[t,n]of e.restyled)n?t.style.textIndent=n:t.style.removeProperty(`text-indent`),t.style.length||t.removeAttribute(`style`)},Fs=e=>typeof e==`string`?[...document.querySelectorAll(e)
]:e instanceof Element?[e]:Array.from(e),Is=e=>(e?Array.isArray(e)?e:e.split(/[\s,]+/):[]).filter(Boolean),Ls=class{
targets;
lines;
words;
chars;
plans;
constructor(e,t={
}){
this.targets=Fs(e);
let n=new Set(Is(t.type)),r={
chars:n.has(`chars`),words:n.has(`words`)||n.has(`chars`),mask:new Set(Is(t.mask)),padEm:parseFloat(t.pad??`0`)||0,classes:t.classes??{
}},i=new ws(r),a=this.targets.map(e=>i.plan(e));
i.done();
let o=document.createRange();
for(let e of a){
Ms(e,r,o);
for(let t of e.text.keys())e.after.set(t,t.data)}o.detach(),this.plans=new Map(a.map(e=>[e.target,e])),this.lines=a.flatMap(e=>e.lines),this.words=a.flatMap(e=>e.words)
,this.chars=a.flatMap(e=>e.chars)}linesOf(e){
return this.plans.get(e)?.lines??[]}wordsOf(e){
return this.plans.get(e)?.words??[]}charsOf(e){
return this.plans.get(e)?.chars??[]}revert(e){
if(e){
let t=this.plans.get(e);
t&&Ps(t);
return}for(let e of this.plans.values())Ps(e)}},Rs=(e=1500)=>Promise.race([document.fonts?.ready??Promise.resolve(),new Promise(t=>setTimeout(t,e))]),zs=1.75,
Bs=.1,Vs=`expo.out`,Hs=100,Us=`.5em`,Ws=`0px 0px -20% 0px`,Gs=`.js-animate-lines`,Ks=`.js-animate-group`,qs=new Set,Js=new Map,Ys=null,Xs=e=>[...e.querySelectorAll(Gs)
],Zs=e=>e.map(e=>e.el),Qs=e=>{
let t=getComputedStyle(e);
return document.fonts?.check(`${
t.fontWeight} ${
t.fontSize} ${
t.fontFamily}`)??!0},$s=e=>{
let t=e.getBoundingClientRect();
return t.bottom>0&&t.top<window.innerHeight},ec=e=>{
Ys?.unobserve(e.target),e.lines.length&&G.killTweensOf(Zs(e.lines)),qs.delete(e),Js.delete(e.target)},tc=()=>{
for(let e of qs)e.target.isConnected||ec(e)},nc=e=>{
if(!e.length)return;
for(let t of e)t.split?.revert(t.target),t.split=null,t.lines=[];
let t=new Ls(e.map(e=>e.target),{
type:`lines`,mask:`lines`,pad:Us});
for(let n of e)n.split=t,n.lines=t.linesOf(n.target).map(e=>({
...e,mask:e.mask??e.el,entry:n}));
let n=e.flatMap(e=>e.lines);
n.length&&G.set(Zs(n),{
yPercent:Hs})},rc=({
delay:e,at:t})=>Math.max(0,e-(performance.now()-t)/1e3),ic=async e=>{
if(e.state=`pending`,G.set(e.target,{
visibility:`hidden`}),await Rs(),!qs.has(e)||!e.target.isConnected)return;
nc([e]),e.state=`parked`,G.set(e.target,{
clearProps:`visibility`});
let t=e.order;
t&&(e.order=null,lc(e,rc(t)))},ac=e=>{
tc();
let t=[];
for(let n of Xs(e)){
if(Js.has(n)||!(n.checkVisibility()||getComputedStyle(n).display===`contents`&&[...n.children].some(e=>e.checkVisibility())))continue;
let e={
target:n,split:null,lines:[],group:n.closest(Ks),state:`parked`,order:null};
qs.add(e),Js.set(n,e),Qs(n)?t.push(e):ic(e)}nc(t)},oc=()=>Ys??=new IntersectionObserver(e=>{
let t=new Set;
for(let n of e){
if(!n.isIntersecting)continue;
let e=Js.get(n.target);
e?.state===`armed`&&t.add(e)}if(t.size){
for(let e of qs)e.state===`armed`&&$s(e.target)&&t.add(e);
cc(t,`armed`);
for(let e of t)Ys.unobserve(e.target);
fc([...t],0)}},{
rootMargin:Ws}),sc=e=>{
e.state=`armed`,oc().observe(e.target)},cc=(e,t)=>{
let n=new Set;
for(let t of e)t.group&&n.add(t.group);
if(n.size)for(let r of qs)r.state===t&&r.group&&n.has(r.group)&&e.add(r)},lc=(e,t)=>{
$s(e.target)?fc([e],t):sc(e)},uc=e=>{
let t=e.map(e=>{
let t=e.mask.getBoundingClientRect();
return{
line:e,r:t,top:t.top+e.pad}}).sort((e,t)=>e.top-t.top||e.r.left-t.r.left),n=[],r=-1/0;
for(let{
line:e,top:i}of t)n.length&&Math.abs(i-r)<e.pitch/2?n[n.length-1].push(e):(n.push([e]),r=i);
return n},dc=(e,t)=>{
e.state===`revealing`&&e.split===t&&(t.revert(e.target),e.state=`done`,e.split=null,e.lines=[],ec(e))},fc=(e,t)=>{
let n=e.flatMap(e=>e.lines);
if(!n.length){
for(let t of e)ec(t);
return null}G.killTweensOf(Zs(n));
for(let t of e)t.state=`revealing`;
let r=G.timeline({
delay:t}),i=new Map;
uc(n).forEach((e,t)=>{
r.to(Zs(e),{
yPercent:0,duration:zs,ease:Vs},t*Bs);
for(let n of e)i.set(n.entry,t)});
for(let[e,t]of i)r.call(dc,[e,e.split],t*Bs+zs);
return r},pc=(e,{
delay:t=0}={
})=>{
tc();
let n=new Set,r=[];
for(let i of qs)if(e.contains(i.target)){
if(i.state===`pending`){
i.order={
delay:t,at:performance.now()};
continue}i.state===`parked`&&($s(i.target)?n.add(i):r.push(i))}cc(n,`parked`);
for(let e of r)n.has(e)||sc(e);
return n.size?fc([...n],t):null},mc=()=>{
tc(),nc([...qs].filter(e=>e.state===`parked`||e.state===`armed`))},hc=1.4,gc=.1,_c=`expo.out`,vc=1.25,yc=.1,bc=_c,xc=110,Sc=(e,t)=>e?.liveFor(t+.1),Cc=e=>[...e.querySelectorAll(`.js-slide-up`)
],wc=e=>[...e.classList.contains(`js-panel`)?[e]:[],...e.querySelectorAll(`.js-panel`)],Tc=e=>{
let t=G.getProperty(e,`y`)||0;
return Math.max(0,window.innerHeight-(e.getBoundingClientRect().top-t))},Ec=e=>G.set(e,{
overflow:`clip`}),Dc=e=>G.set(e,{
clearProps:`overflow`}),Oc=(e,t,{
delay:n=0,duration:r=hc,trail:i=0,textFade:a}={
})=>{
let o=wc(e),s=()=>{
t?.clipUnder(e,1),t?.appear(e,void 0,void 0,{
duration:a??.35,delay:i})};
return o.length?(G.killTweensOf(o),Sc(t,n+r+gc*o.length),G.to(o,{
y:0,duration:r,ease:_c,stagger:gc,delay:n,onStart:s,onComplete:()=>Dc(e)})):(G.delayedCall(n,s),null)},kc=(e,t,{
delay:n=0}={
})=>{
let r=Cc(e);
return r.length?(G.killTweensOf(r),Sc(t,n+vc+yc*r.length),G.to(r,{
yPercent:0,duration:vc,ease:bc,stagger:yc,delay:n})):null},Ac=(e,t,n={
})=>{
let{
delay:r=0,trail:i=0}=n;
return pc(e,{
delay:r+i}),ke()?(kc(e,t,{
...n,delay:r+i}),Oc(e,t,n)):null},jc=(e,t)=>{
if(ac(e),!ke())return;
let n=wc(e);
n.length&&(G.killTweensOf(n),G.set(n,{
y:(e,t)=>Tc(t)}),Ec(e));
let r=Cc(e);
r.length&&(G.killTweensOf(r),G.set(r,{
yPercent:xc})),t?.clipUnder(e,0)},Mc=1.04,Nc=class{
stage;
renderer;
scene=new fn;
camera;
disc;
textures;
geometry=null;
alpha=1;
drawn=``;
constructor(e,t){
this.stage=e,this.renderer=e.renderer,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1,this.camera=new wn(2*Math.atan(1/nt)*(180/Math.PI)
,1,.1,100),this.camera.position.z=nt,et(this.renderer,this.scene);
let n=tt(this.renderer,t);
this.disc=n.disc,this.textures=n.textures,this.scene.add(this.disc)}warm(){
this.renderer.compile(this.scene,this.camera);
for(let e of this.textures)e.image&&this.renderer.initTexture(e)}set flip(e){
this.disc.rotation.y=Math.PI/180*e}set spin(e){
this.disc.rotation.z=-e*(Math.PI/180)}set tilt(e){
this.disc.rotation.x=Math.PI/180*e}set dip(e){
this.disc.scale.setScalar(e)}mount(e){
this.geometry=e,this.behind(!1)}behind(e){
this.stage.add(this.draw,e?ln.planes-.25:ln.planes+1,this.changed)}unmount(){
this.stage.remove(this.draw),this.geometry=null}changed=()=>{
let e=this.geometry?.();
return e?(e.alpha??1)!==this.alpha||this.key(e.rect)!==this.drawn:!1};
key(e){
let t=this.disc.rotation;
return[t.x.toFixed(4),t.y.toFixed(4),t.z.toFixed(4),this.disc.scale.x.toFixed(4),e.left.toFixed(1),e.top.toFixed(1),e.width.toFixed(1),e.height.toFixed(1)
,this.alpha.toFixed(3)].join(`,`)}draw=()=>{
let e=this.geometry?.();
if(!e)return;
let t=e.rect;
if(!t.width||!t.height)return;
let n=e.alpha??1;
if(n!==this.alpha&&(this.alpha=n,this.disc.traverse(e=>{
let t=e.material;
t&&(t.opacity=n,t.transparent=n<1)})),n<=0){
this.drawn=this.key(t);
return}let r=this.renderer,i=r.getSize(Pc),a=i.y-(t.top+t.height),o=Math.min(e.fraction*t.width,t.height),s=Math.min(o,t.width/Mc,t.height/Mc);
this.camera.aspect=t.width/t.height,this.camera.fov=2*Math.atan(t.height/(s*nt))*(180/Math.PI),this.camera.updateProjectionMatrix(),r.setViewport(t.left,
a,t.width,t.height),r.setScissor(t.left,a,t.width,t.height),r.setScissorTest(!0),r.render(this.scene,this.camera),r.setScissorTest(!1),r.setViewport(0,
0,i.x,i.y),this.drawn=this.key(t)};
dispose(){
this.unmount(),this.disc.traverse(e=>{
e instanceof kn&&(e.geometry.dispose(),e.material.dispose())});
for(let e of this.textures)e.dispose();
this.scene.environment?.dispose()}},Pc=new An,Fc=e=>()=>e,Ic=(...e)=>t=>e[t],Lc=[{
slug:`ascension`,title:`Ascension`,bpm:145,gainDb:0,rows:[{
label:`Kick`,sample:Fc(`kick`),choke:!1,original:[[1,5,9,13],[1,5,9,13],[1,5,9,13],[1,5,9,13]]},{
label:`Clap`,sample:Fc(`clap`),choke:!1,original:[[5,13],[5,13],[5,13],[5,13]]},{
label:`Bass`,sample:Ic(`bass-01`,`bass-02`,`bass-03`,`bass-04`),choke:!0,original:[[1,4,7,9,12,15],[1,4,7,9,12,15],[1,4,7,9,12,15],[1,4,7,9,12,15]]},{
label:`Pluck 01`,sample:Fc(`pluck-01`),choke:!0,original:[[1,5],[1,5],[1,5],[1,5]]},{
label:`Pluck 02`,sample:Fc(`pluck-02`),choke:!0,original:[[7,15],[7,15],[7,15],[7,15]]},{
label:`Pluck 03`,sample:Fc(`pluck-03`),choke:!0,original:[[9,13],[9,13],[9,13],[9,13]]},{
label:`Pad`,sample:(e,t)=>e===3?`pad-03`:e===2&&t>=8?`pad-02`:`pad-01`,choke:!0,original:[[1],[],[1,11],[1]]}]},{
slug:`circles`,title:`Circles`,bpm:146,gainDb:-6.7,rows:[{
label:`Kick`,sample:Fc(`kick`),choke:!1,original:[[1,11],[1,11],[1,11],[1,11]]},{
label:`Snare`,sample:Fc(`snare`),choke:!1,original:[[5,13],[5,13],[5,13],[5,13]]},{
label:`Closed Hat`,sample:Fc(`closed-hat`),choke:!1,original:[[1,3,5,7,9,11,13,15],[1,3,5,7,9,11,13,15],[1,3,5,7,9,11,13,15],[1,3,5,7,9,11,13,15]]},{
label:`Bass`,sample:Ic(`bass-01`,`bass-02`,`bass-03`,`bass-03`),choke:!0,original:[[1],[11],[1],[]]},{
label:`Running Around`,sample:Fc(`running-around`),choke:!0,original:[[1],[],[],[]]},{
label:`In Circles`,sample:Fc(`in-circles`),choke:!0,original:[[],[],[15],[]]}]},{
slug:`forest-walk`,title:`Forest Walk`,bpm:148,gainDb:-13.4,rows:[{
label:`Kick`,sample:Fc(`kick`),choke:!1,original:[[1,5,9,13],[1,5,9,13],[1,5,9,13],[1,5,9,13]]},{
label:`Clap`,sample:Fc(`clap`),choke:!1,original:[[5,13],[5,13],[5,13],[5,13]]},{
label:`Hi Hat`,sample:Fc(`hi-hat`),choke:!1,original:[[3,7,11,15],[3,7,11,15],[3,7,11,15],[3,7,11,15]]},{
label:`Bass`,sample:Fc(`bass`),choke:!0,original:[[3,7,11,15],[3,7,11,15],[3,7,11,15],[3,7,11,15]]},{
label:`Lead 01`,sample:Fc(`lead-01`),choke:!0,original:[[15],[7],[15],[7]]},{
label:`Lead 02`,sample:Fc(`lead-02`),choke:!0,original:[[],[15],[],[]]},{
label:`Pluck 01`,sample:Fc(`pluck-01`),choke:!0,original:[[3,5,7],[],[],[]]},{
label:`Pluck 02`,sample:Fc(`pluck-02`),choke:!0,original:[[8],[],[],[]]}]},{
slug:`twinflame`,title:`Twinflame`,bpm:148,gainDb:2.1,rows:[{
label:`Kick`,sample:Fc(`kick`),choke:!1,original:[[1,5,9,13],[1,5,9,13],[1,5,9,13],[1,5,9,13]]},{
label:`Clap`,sample:Fc(`clap`),choke:!1,original:[[5,13],[5,13],[5,13],[5,13]]},{
label:`Hi Hat`,sample:Fc(`hi-hat`),choke:!1,original:[[3,7,11,15],[3,7,11,15],[3,7,11,15],[3,7,11,15]]},{
label:`Bass`,sample:Fc(`bass`),choke:!0,original:[[3,7,11,15],[3,7,11,15],[3,7,11,15],[3,7,11,15]]},{
label:`Saw`,sample:(e,t)=>e===0?`saw-01`:e===1?t<4?`saw-02`:`saw-01`:e===2?t<4?`saw-02`:t<14?`saw-01`:`saw-03`:t<8?`saw-02`:`saw-01`,choke:!0,original:[[1,
5,9,13],[1,5,9,13],[1,5,9,13,15],[1,5,9]]},{
label:`Atmos Synth`,sample:Fc(`atmos`),choke:!0,original:[[15],[],[],[]]},{
label:`Bass Synth`,sample:Fc(`bass-synth`),choke:!0,original:[[],[],[],[15]]},{
label:`Wooh Vox`,sample:Fc(`wooh`),choke:!0,original:[[1],[],[],[]]}]}],Rc=(e,t)=>`/sequencer/${
e.slug}/${
t}.mp3`,zc=e=>{
let t=new Set;
return e.rows.forEach(e=>{
for(let n=0;
n<4;
n++)for(let r=0;
r<16;
r++)t.add(e.sample(n,r))}),[...t]},Bc=e=>10**(e/20),Vc=globalThis.setInterval,Hc=.12,Uc=25,Wc=e=>Array.from({
length:4},()=>e.rows.map(()=>Array(16).fill(!1))),Gc=e=>Array.from({
length:4},(t,n)=>e.rows.map(e=>{
let t=Array(16).fill(!1);
return e.original[n].forEach(e=>{
t[e-1]=!0}),t})),Kc=ve(Lc.map(Gc)),qc=ve(Lc.map(()=>0)),Jc=ve(Lc.map(()=>null)),Yc=ve(0),Xc=ve(!1),Zc=ve(!0),Qc=Be(()=>Lc[Yc.value]),$c=Be(()=>Kc.value[Yc.value])
,el=Be(()=>qc.value[Yc.value]),tl=_e(Xc),nl=ve(null),rl=ve(null),il=new Map,al=new Map,ol=null,sl=null,cl={
pattern:0,step:0,time:0},ll=[],ul=null,dl=null,fl=()=>(ol||(ol=new AudioContext,ul=ol.createGain(),dl=ol.createGain(),dl.gain.value=Bc(Qc.value.gainDb)
,dl.connect(ul),ul.connect(ol.destination)),ol),pl=48e3,ml=null,hl=()=>ol??(ml??=new OfflineAudioContext(1,1,pl)),gl=e=>{
if(il.has(e))return Promise.resolve(il.get(e)??null);
let t=al.get(e);
if(t)return t;
let n=(async()=>{
try{
let t=await fetch(e);
if(!t.ok)throw Error(String(t.status));
let n=await hl().decodeAudioData(await t.arrayBuffer());
return il.set(e,n),n}catch{
return il.set(e,null),null}finally{
al.delete(e)}})();
return al.set(e,n),n},_l=e=>Promise.all(zc(e).map(t=>gl(Rc(e,t)))),vl=(e,t)=>{
if(e)try{
e.stop(t)}catch{
}},yl=(e,t,n,r,i,a,o,s)=>{
let c=n.rows[i],l=il.get(Rc(n,c.sample(a,o)));
if(!l)return null;
let u=e.createBufferSource();
return u.buffer=l,u.connect(t),c.choke&&(vl(r[i],s),r[i]=u),u.start(s),u},bl=new Set,xl=[],Sl=(e,t,n