import{
W as e,dt as t,ft as n,i as r,tt as i,y as a}from"./BcL1QBv6.js";
var o=(e,t,n,r)=>{
if(!e||!t)return!1;
let i=t.currentTime;
return e.gain.cancelScheduledValues(i),e.gain.setValueAtTime(e.gain.value,i),e.gain.linearRampToValueAtTime(n,i+r),!0},ee={
"pegassi-ascension":[44,52,45,43,37,52,46,34,27,31,36,30,22,23,49,53,42,46,45,41,60,41,32,42,46,35,36,40,41,46,55,38,40,58,48,47,45,41,42,41,31,26,45,41,23,24,23,26,24,24,25,26,24,24,26,25,23,22,24,23,23,24,23,21,22,22,19,21,19,19,17,33,36,38,21,18,18,20,19,22,21,25,28,28,30,30,31,36,43,42,43,41,44,43,41,47,46,47,43,40,11,28,91,100,92,100,94,93,90,93,94,95,96,92,95,93,93,93,89,95,89,92,91,95,97,96,93,98,90,89,30,88,97,88,98,92,94,91,93,91,93,93,91,94,91,95,93,91,93,90,92,89,93,95,94,95,97,91,59,39,84,95,89,98,89,97,92,93,90,94,94,90,92,91,94,93,96,92,92,88,89,91,95,93,95,95,92,67,39,28,18,14,19,20,19,20,15,19,15,19,15,23,18,18,21,30,23,20,23,18,21,21,24,25,20,18,19,17,40,53,45,40,45,46,48,56,45,43,58,53,50,43,41,59,51,42,48,48,55,56,49,51,49,45,42,42,42,47,29,22,22,16,19,21,21,22,20,23,23,25,26,29,40,44,43,43,43,41,43,43,47,45,47,43,33,16,66,96,92,95,91,93,88,94,96,96,94,98,92,92,90,87,95,89,98,91,97,92,94,92,95,93,90,93,78,57,95,96,92,92,89,88,92,96,95,94,97,92,94,89,87,95,87,96,91,93,91,98,92,96,90,93,90,44,52,90,98,94,95,89,89,90,94,93,95,95,93,94,92,89,93,87,95,89,93,90,95,95,97,91,93,91,49,37,24,19,22,19,24,20,22,19,21,17,20,24,21,16,15,26,27,23,21,24,22,20,27,26,24,14,16,15,16,7,3,2,1,1,0,0],"pegassi-circles":[10,11,7,10,7,14,13,14,16,17,12,12,12,19,16,16,22,20,23,22,22,22,24,21,12,25,64,86,94,87,82,75,85,88,89,86,83,89,77,87,78,89,82,84,86,76,89,85,88,92,75,93,80,90,91,89,89,91,73,95,79,100,75,82,82,82,88,88,89,89,77,87,78,89,89,89,57,9,13,61,79,94,81,87,76,80,88,86,90,90,90,80,78,80,82,83,85,85,70,86,79,92,89,79,85,87,87,84,88,88,91,66,93,73,96,84,83,85,82,85,79,85,92,73,79,75,58,45,60,33,9,11,27,46,46,26,24,25,38,46,46,37,29,30,29,30,50,53,33,25,37,48,48,45,40,31,31,33,32,45,49,36,24,25,50,43,44,36,28,23,23,23,37,47,40,21,20,18,16,55,19,56,16,11,13,55,77,90,81,85,83,75,89,83,88,93,80,94,77,90,89,88,93,90,70,88,76,92,71,84,83,85,86,79,87,89,85,83,78,89,86,88,90,88,90,89,84,92,80,85,72,79,85,81,83,73,46,25,38,77,83,87,86,84,72,87,85,91,94,77,91,84,89,86,87,88,92,66,93,80,97,79,82,82,82,90,86,87,91,80,84,75,88,84,89,89,87,83,93,79,98,81,89,79,77,87,85,91,73,16,15,5,84,84,82,81,85,69,88,82,90,80,81,83,85,89,88,89,86,91,71,91,81,87,85,85,85,82,86,83,88,87,67,76,77,86,85,85,84,88,80,91,79,96,77,85,83,80,88,86,89,82,38,56,31,82,86,84,86,86,68,85,75,91,75,86,86,86,86,81,86,88,91,72,81,87,82,87,89,88,85,91,83,92,84,81,68,81,87,82,86,84,89,78,89,75,85,83,85,83,74,66,38,30,28,28,19,8,0,0],"pegassi-forest-walk":[45,54,33,23,27,20,26,26,19,31,10,20,15,69,94,95,94,97,98,93,91,93,90,99,94,95,91,91,97,96,95,92,95,91,99,96,92,97,94,44,93,94,94,95,94,100,96,95,95,93,96,98,95,92,90,93,97,96,91,93,91,89,92,86,57,45,57,72,97,92,92,92,94,96,96,91,93,92,97,96,91,91,93,94,97,93,93,93,94,100,96,94,93,94,93,98,95,95,96,93,97,98,92,96,94,92,98,93,91,94,90,98,96,96,92,92,96,96,78,50,55,56,48,45,39,44,45,38,41,36,41,36,36,41,35,49,46,36,50,36,41,37,34,36,38,50,42,40,34,59,54,45,61,48,52,64,54,60,60,53,60,55,62,55,57,57,58,54,57,65,58,60,64,51,66,52,45,59,50,38,52,44,53,46,42,49,48,52,63,47,60,53,51,44,49,46,51,55,38,45,45,44,50,46,53,42,41,46,46,40,47,40,36,49,46,51,47,38,28,38,53,55,59,51,35,15,31,31,29,30,82,94,93,99,93,95,92,94,100,95,95,93,94,93,98,96,92,95,94,99,97,94,95,94,94,99,94,93,96,91,99,95,94,91,95,95,97,96,90,93,89,97,96,92,95,93,93,67,51,56,50,53,46,62,90,94,94,94,98,96,91,95,95,97,97,93,96,93,92,99,95,94,93,94,98,98,94,94,95,95,98,94,92,95,93,96,96,92,97,95,91,99,94,95,92,91,97,94,94,93,97,93,91,95,84,54,46,56,75,96,94,96,93,96,95,94,97,94,94,98,94,94,95,92,99,96,94,95,93,96,97,92,93,94,66,60,95,91,94,90,93,95,93,93,95,91,98,94,90,93,90,94,96,93,94,94,64,62,58,53,19,10,30,14,4,1,1,0,0,0],"pegassi-twinflame":[24,30,26,30,26,30,27,30,28,29,29,28,17,10,65,87,96,97,94,99,95,94,94,93,92,93,91,92,89,91,91,91,90,92,91,95,89,89,88,89,88,89,89,45,33,29,85,88,90,90,97,92,92,94,94,94,94,93,95,94,95,95,94,94,94,93,99,95,95,94,94,94,95,94,69,68,66,17,48,26,25,34,49,31,26,30,25,28,30,35,29,28,26,37,30,31,32,30,28,32,32,35,32,34,34,38,34,31,38,60,50,46,46,60,51,52,53,52,50,50,50,54,50,50,52,62,50,46,49,52,45,36,39,38,45,39,45,41,35,43,57,93,96,95,100,97,95,95,94,93,95,93,94,93,92,93,91,89,91,90,96,91,91,89,89,90,91,90,64,36,33,78,88,91,92,92,96,94,93,92,93,93,93,95,95,93,95,94,95,93,94,98,96,94,95,95,95,96,95,88,68,67,15,67,83,90,87,88,77,84,88,83,83,87,85,87,78,81,84,85,87,91,80,86,69,81,65,63,34,58,53,27,30,33,49,48,50,49,59,51,57,53,52,46,50,46,51,44,46,46,60,49,50,49,43,46,46,47,42,44,41,44,47,43,33,18,74,96,96,96,99,95,95,93,92,91,93,90,93,88,90,90,90,89,90,94,92,89,93,91,92,93,92,85,35,33,61,81,93,93,94,97,94,95,93,92,92,94,92,93,92,94,94,92,95,94,94,99,96,97,95,94,94,95,96,69,67,57,53,91,93,93,96,93,91,92,91,93,91,92,90,88,89,89,90,89,90,89,96,92,91,91,91,91,91,91,63,33,29,74,90,78,79,81,85,81,79,78,77,78,78,79,80,77,78,88,49,46,44,58,48,46,44,42,38,41,37,44,33,28,17,23,3,2,1,0,0,0,0,0]},s=[{
title:`Ascension`,side:`a`,pos:1,src:`/music/pegassi-ascension.mp3`,bpm:145,blurb:[`The title track combines that uplifting yet heavy-hitting energy with the orchestral influences that, by now, you all know I absolutely love.`,`Ascension represents the different worlds I’ve been bringing together in my music over the past few years, and felt like the perfect track to carry the name of my debut EP.`]},{
title:`Circles`,side:`a`,pos:2,src:`/music/pegassi-circles.mp3`,bpm:146,blurb:[`Circles is only the second time in my career I’ve stepped on my own vocals, this time taking them into a punk-heavy breakbeat record.`,`It’s another side of my sound I’ve wanted to explore for a long time: rawer and more personal, while still carrying the energy I want people to experience when I play it live.`]},{
title:`Forest Walk`,side:`b`,pos:1,src:`/music/pegassi-forest-walk.mp3`,bpm:148,blurb:[`Forest Walk came together as one of those tracks that instantly felt right. Hypnotic, driving and a little mysterious, it’s built around that catchy pluck and a groove that keeps pulling you forward.`,`I’ve been playing it in my sets for a while now, and watching it slowly turn into a crowd favourite has made this one incredibly special to me.`]},{
title:`Twinflame`,side:`b`,pos:2,src:`/music/pegassi-twinflame.mp3`,bpm:148,blurb:[`Twinflame was created just after I moved out on my own and started embracing myself more as an artist. It’s a darker, harder record shaped by touring and discovering different sides of my sound.`,`Built for the later hours in clubs and festivals, it represents a side of Pegassi that I was only beginning to discover at the time.`]}],te=e=>`${
e.side.toUpperCase()}${
e.pos}`,ne=e=>{
if(!Number.isFinite(e))return`00:00`;
let t=Math.max(0,Math.floor(e));
return`${
String(Math.floor(t/60)).padStart(2,`0`)}:${
String(t%60).padStart(2,`0`)}`},re=e=>ee[e.src.split(`/`).pop().replace(/\.mp3$/,``)]??[],c=(e,t)=>{
if(!e.length||t<1)return[];
if(t>=e.length)return Array.from({
length:t},(n,r)=>e[Math.floor(r*e.length/t)]);
let n=e.length/t;
return Array.from({
length:t},(t,r)=>{
let i=Math.floor(r*n),a=Math.max(i+1,Math.floor((r+1)*n)),o=0;
for(let t=i;
t<a;
t++)e[t]>o&&(o=e[t]);
return o})},l=n(0),u=n(!1),d=n(0),f=t(u),p=n(s.map(()=>0)),m=null,h=null,g=null,_=null,v=null,y=n([0,0,0]),b=()=>{
g||!m||(h=new AudioContext,g=h.createAnalyser(),g.fftSize=256,g.smoothingTimeConstant=.3,g.minDecibels=-80,g.maxDecibels=-5,v=h.createGain(),h.createMediaElementSource(m).connect(v),v.connect(g),g.connect(h.destination),_=new Uint8Array(g.frequencyBinCount))},ie=[1,3],ae=1.25,x=120,S=.08,C=.01,oe=[1,.7,.85],se=[.08,.14,.11],w=[.3,.85],T=[110,260],E=.18,D=[0,0,0],O=[.5,.5,.5],k=[.5,.5,.5],A=[0,0,0],j=0,M=1,N=0,P=0,ce=([e,t])=>{
let n=0;
for(let r=e;
r<t;
r++)_[r]>n&&(n=_[r]);
return n/255},le=()=>{
if(!g||!_)return;
g.getByteFrequencyData(_);
let e=ce(ie),t=performance.now();
M=e<M?e:M+(e-M)*C,N=e>N?e:N+(e-N)*C;
let n=j>.05&&e>j*ae&&t-P>x;
if(j+=(e-j)*S,n){
P=t;
let n=N-M,r=n>.05?.4+.6*(e-M)/n:1;
for(let e=0;
e<3;
e++)D[e]=Math.max(D[e],oe[e]*r)}for(let e=0;
e<3;
e++)D[e]=D[e]*(1-se[e]),t>=A[e]&&(k[e]=w[0]+Math.random()*(w[1]-w[0]),A[e]=t+T[0]+Math.random()*(T[1]-T[0])),O[e]=O[e]+(k[e]-O[e])*E;
y.value=[0,1,2].map(e=>{
let t=O[e];
return Math.min(1,t+(1-t)*D[e])})},F=()=>m||(m=new Audio,m.preload=`metadata`,m.src=s[l.value].src,m.addEventListener(`loadedmetadata`,()=>{
p.value[l.value]=m.duration,p.value=[...p.value]}),m.addEventListener(`ended`,()=>{
l.value<s.length-1?V(l.value+1,!0):(u.value=!1,d.value=0)}),m),I=!1,L=()=>{
I||(I=!0,s.forEach((e,t)=>{
if(p.value[t])return;
let n=new Audio;
n.preload=`metadata`,n.addEventListener(`loadedmetadata`,()=>{
p.value[t]=n.duration,p.value=[...p.value]},{
once:!0}),n.src=e.src}))},R=()=>{
let e=F();
e&&(G.has(`video`)&&K?.(),b(),h?.state===`suspended`&&h.resume(),e.play().then(()=>{
u.value=!0},()=>{
u.value=!1}))},z=()=>{
F()?.pause(),u.value=!1},B=()=>u.value?z():R(),V=(e,t=!0)=>{
let n=F();
if(!n)return;
let r=(e+s.length)%s.length,i=r===l.value;
l.value=r,d.value=0,i||(n.src=s[r].src,n.load()),t?R():z()},H=()=>V(l.value+1,u.value),U=()=>{
if(d.value>3)return void Q(0);
V(l.value-1,u.value)},W=.5,G=new Set,K=null,ue=e=>{
K=e},q=!1,J=0,Y=e=>o(v,h,e,W),X=(e=`route`)=>{
let t=!G.size;
if(G.add(e),!t)return;
if(J++,!u.value){
q=!1;
return}if(q=!0,!Y(0))return z();
let n=J;
setTimeout(()=>{
n===J&&z()},W*1e3)},Z=(e=`route`)=>{
!G.delete(e)||G.size||(J++,q&&(q=!1,Y(1),u.value||R()))},Q=e=>{
let t=F(),n=p.value[l.value];
!t||!n||(t.currentTime=r(0,n,e*n),d.value=t.currentTime)},$=()=>{
m&&(d.value=m.currentTime),le()},de=e=>{
i(u,t=>{
t?e.on(`tick`,$):e.off(`tick`,$)},{
immediate:!0})};
function fe(){
let n=a(()=>s[l.value]),r=a(()=>p.value[l.value]??0),i=a(()=>r.value?d.value/r.value:0);
return e(()=>{
L()}),{
tracks:s,index:t(l),track:n,playing:t(u),time:t(d),duration:r,progress:i,durations:t(p),bands:t(y),play:R,pause:z,toggle:B,duck:X,restore:Z,select:V,next:H,prev:U,seek:Q}}export{
X as a,c,re as d,fe as f,ne as i,Z as l,s as n,ue as o,o as p,de as r,f as s,W as t,te as u};
