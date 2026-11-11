// ===== PETUALANGAN BUBU: mesin platformer 2D =====
var muted=localStorage.mute=='1',onWin=null;
const W0=800,H0=450,GY=380,NUM=['nol','satu','dua','tiga','empat','lima'];
const canv=$('#cv'),cx=canv.getContext('2d');canv.width=W0;canv.height=H0;
let pr=JSON.parse(localStorage.bubu||'{"done":0}'),LV,bb,cam=0,run=0,paused=0,carry=null,tick=0,tally={},last=0,acc=0,lvl=0,raf=0,keys={},cdoor=null;
const save=()=>localStorage.bubu=JSON.stringify(pr);
const COL={merah:'#e03131',kuning:'#fcc419',ungu:'#9c36b5',hijau:'#40c057',oranye:'#fd7e14',biru:'#339af0'};
const NAMA=['Hutan Hewan','Kebun Buah Ajaib','Istana Bentuk','Taman Bunga','Gua Misteri','Gerbang Pelangi'],IKON=['🌲','🍎','🏰','🌻','🪨','🌈'];
const TH=[['#9fe0ff','#e6ffd0','#4caf50','#8d5a2b'],['#ffe8a3','#ffd6e0','#7bc96f','#a0693a'],['#c9b6ff','#ffe0f5','#b39ddb','#6d5a9c'],['#bff0ff','#fff3c4','#66bb6a','#8d5a2b'],['#7e6bbf','#d9c2ff','#9575cd','#4a3a7a'],['#8fd3ff','#ffe3f0','#5fd068','#8d5a2b']];
const circ=(x,y,r)=>{cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()};
const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
// ===== LAYAR / MENU =====
function showOv(h){const o=$('#ov');o.innerHTML=h||'';o.style.display=h?'flex':'none'}
function home(){run=0;paused=0;onWin=null;document.body.classList.remove('mini');stopAudio();$('#gm').hidden=true;
showOv(`<div class="bx"><div class="big">🐻</div><h1>PETUALANGAN BUBU</h1><p class="q">Misi Menyelamatkan Hutan Pelangi</p><button class="btn" onclick="start(pr.done>5?0:pr.done)">▶ Mulai Petualangan</button><button class="btn" onclick="maps()">🗺️ Pilih Level</button><button class="btn" onclick="how()">❓ Cara Bermain</button><button class="btn" onclick="sndM()">${muted?'🔇 Suara mati':'🔊 Suara hidup'}</button><p class="q">⭐ ${stars} &nbsp; Level selesai: ${pr.done}/6</p></div>`);
$('#say').textContent='Ayo selamatkan Hutan Pelangi!'}
function maps(){showOv(`<div class="bx"><h2>Peta Hutan Pelangi</h2><div class="map">${NAMA.map((n,i)=>`<button class="node" ${i>pr.done?'disabled':''} onclick="start(${i})"><span>${i<=pr.done?IKON[i]:'🔒'}</span>${i+1}. ${n}${i==Math.min(pr.done,5)?'<b>🐻</b>':''}</button>`).join('')}</div><button class="btn" onclick="home()">Kembali</button></div>`)}
function how(){const t='Tekan panah untuk berjalan. Tekan tombol lompat untuk melompat. Kumpulkan bintang dan selesaikan misi di setiap tempat!';
showOv(`<div class="bx"><h2>Cara Bermain</h2><div class="box">◀ ▶ = berjalan<br>⬆ = melompat<br>Di laptop: tombol panah atau W A D, lompat dengan spasi.<br>${t}</div><button class="btn" onclick="speak('${t}')">🔊 Dengar lagi</button><button class="btn" onclick="home()">Kembali</button></div>`);speak(t)}
function sndM(){muted=!muted;localStorage.mute=muted?1:0;if(muted)stopAudio();home()}
function sndG(){muted=!muted;localStorage.mute=muted?1:0;$('#sb').textContent=muted?'🔇':'🔊';if(muted)stopAudio();else task()}
function pauseG(){paused=1;showOv(`<div class="bx"><h1>Istirahat dulu 😊</h1><button class="btn" onclick="showOv('');paused=0">▶ Lanjut main</button><button class="btn" onclick="start(lvl)">🔁 Ulangi level</button><button class="btn" onclick="home()">🏠 Menu utama</button></div>`)}
function finish(){run=0;ding();pr.done=Math.max(pr.done,lvl+1);save();
if(lvl==5){say('Selamat! Kamu Penjelajah Hebat! Lima bintang ajaib bersinar lagi!');showOv(`<div class="bx cert"><div class="big">🌈🏅🌈</div><h1>Penjelajah Hebat</h1><p class="q">Lima bintang ajaib bersinar lagi. Hutan Pelangi indah kembali!</p><div class="big">⭐⭐⭐⭐⭐</div><div class="box">Yeayyy! Kalian hebat sekali! Teruslah belajar, berani mencoba, dan jangan mudah menyerah. Sampai jumpa di petualangan berikutnya! 🐻❤️</div><button class="btn" onclick="home()">Menu utama</button></div>`)}
else{say('Hore! Level selesai! Kamu hebat!');showOv(`<div class="bx"><div class="big">🎉🐻🎉</div><h1>Level ${lvl+1} selesai!</h1><p class="q">Bintang ${lvl+1} dari 5 sudah ditemukan!</p><button class="btn" onclick="start(${lvl+1})">▶ Level berikutnya</button><button class="btn" onclick="maps()">🗺️ Peta</button></div>`)}}
// ===== MINI GAME DI PINTU (Level 5) =====
function openMini(d){cdoor=d;paused=1;onWin=()=>{closeMini(1);d.o=1;ding();star();say('Pintu terbuka!')};document.body.classList.add('mini');d.f()}
function closeMini(ok){onWin=null;document.body.classList.remove('mini');paused=0;stopAudio();if(!ok&&cdoor)cdoor.w=tick+400}
// ===== MEMBANGUN LEVEL =====
function build(i){const r={W:2700,gaps:[],logs:[],pl:[],en:[],dr:[],gs:[],need:{},th:i,fx:2560,dd:0},t=rnd;
const gate=(x,gr)=>r.dr.push({x,y:80,w:34,h:300,k:'g',gr,o:0});
const stars=(a,b)=>{for(let x=a;x<b;x+=280)r.en.push({k:'s',x,y:230+Math.random()*100})};
const grp=(text,s)=>r.gs.push({text,s,ok:0,wr:0});
const ch=(g,x,y,ok,o)=>r.en.push({k:'c',g,x,y,ok,...o});
const fork=(x0,list,g)=>[[0,300],[180,220],[360,300]].forEach((p,j)=>{r.pl.push([x0+p[0],p[1],120]);ch(g,x0+p[0]+60,p[1]-42,list[j].ok,list[j].o)});
if(i==0){r.gaps=[[620,700],[1100,1180]];r.logs=[400,880,1350];const a=t(A),o=shuf([a,...others(A,2,a)]);
 fork(1650,o.map(x=>({ok:x==a,o:{e:x.e}})),0);grp('Dengarkan suara hewan ini!',()=>animalSound(a));gate(2350,0);stars(300,2300)}
if(i==1){const c=t(F)[1],n=3,xs=[300,560,800,1100,1340,1580,1820,2060,2300],cs=shuf(xs.map((_,j)=>j<n?c:t(F.filter(f=>f[1]!=c))[1]));
 r.W=2900;r.fx=2760;r.gaps=[[900,980]];r.logs=[450,1230,1450,2180];
 xs.forEach((x,j)=>{const hi=j%3==2;if(hi)r.pl.push([x-60,270,120]);r.en.push({k:'i',x,y:hi?228:345,c:cs[j]})});
 r.need={[c]:n};grp(`Kumpulkan ${NUM[n]} buah ${c}!`);gate(2550,0)}
if(i==2){r.W=3100;r.fx=3000;r.dd=1;const S=shuf(['lingkaran','segitiga','persegi']);
 S.forEach((s,j)=>{const dx=950+j*750;r.dr.push({x:dx,y:80,w:40,h:300,k:'d',s,o:0});r.logs.push(dx-350);
  const q=shuf(Object.keys(SH).filter(z=>z!=s)).slice(0,j+1);q.push(s);
  shuf(q).forEach((z,m)=>{const x=dx-600+m*140,hi=m%2;if(hi)r.pl.push([x-50,270,100]);r.en.push({k:'k',s:z,x,y:hi?228:345})})});
 grp('Ambil kunci yang bentuknya sama dengan pintu!')}
if(i==3){r.gaps=[[800,880],[1500,1580]];r.logs=[500,1200,1900];r.need={air:1,matahari:1};r.fl=2250;
 [['bola',350],['air',700],['permen',1000],['matahari',1350],['permen',1700],['bola',2000]].forEach(([c,x],j)=>{const hi=j%2;if(hi)r.pl.push([x-60,270,120]);r.en.push({k:'i',x,y:hi?228:345,c})});
 grp('Bunga layu! Cari air dan sinar matahari!');gate(2450,0);stars(300,2200)}
if(i==4){r.W=3300;r.fx=3200;r.dd=1;r.gaps=[[500,580],[1400,1480],[2300,2380]];r.logs=[300,1200,2100];
 [[1000,g11],[1900,g10],[2800,g7]].forEach(([x,f])=>{r.dr.push({x,y:80,w:40,h:300,k:'m',f,o:0});r.pl.push([x-320,290,120],[x-170,220,100])});
 grp('Buka tiga pintu rahasia! Sentuh pintu lalu bermain!');stars(250,3000)}
if(i==5){r.W=4300;r.fx=4130;const s0=[700,1850,3000];
 s0.forEach(x=>{r.gaps.push([x+60,x+140]);r.logs.push(x+200)});stars(250,4000);
 const c=t(F)[1],oc=shuf(F.filter(f=>f[1]!=c)).slice(0,2).map(f=>f[1]),sh=shuf(Object.keys(SH)).slice(0,3),a=t(A),an=shuf([a,...others(A,2,a)]);
 fork(s0[0]+300,shuf([c,...oc]).map(x=>({ok:x==c,o:{col:COL[x]}})),0);grp(`Pilih buah yang berwarna ${c}!`);gate(s0[0]+900,0);
 fork(s0[1]+300,sh.map((x,j)=>({ok:j==0,o:{sh:x,col:SC[x]}})),1);grp(`Cari bentuk ${sh[0]}!`);gate(s0[1]+900,1);
 fork(s0[2]+300,an.map(x=>({ok:x==a,o:{e:x.e}})),2);grp('Dengarkan suara hewan ini!',()=>animalSound(a));gate(s0[2]+900,2);}
return r}
function solids0(){const s=[];let x=0;[...LV.gaps,[LV.W,LV.W]].forEach(g=>{if(g[0]>x)s.push({x,y:GY,w:g[0]-x,h:70});x=g[1]});
LV.logs.forEach(l=>s.push({x:l,y:GY-30,w:42,h:30}));LV.pl.forEach(p=>s.push({x:p[0],y:p[1],w:p[2],h:16,o:1}));return s}
function start(i){cancelAnimationFrame(raf);document.body.classList.remove('mini');lvl=i;LV=build(i);LV.so=solids0();
bb={x:60,y:322,w:38,h:58,vx:0,vy:0,g:0,f:1,c:0,sx:60,sy:322,on:null};cam=0;tally={};carry=null;tick=0;paused=0;run=1;last=0;acc=0;
showOv('');$('#gm').hidden=false;$('#sb').textContent=muted?'🔇':'🔊';setTimeout(task,600);raf=requestAnimationFrame(loop)}
function task(){const g=LV.gs.find(g=>!g.ok);if(g){say(g.text);if(g.s)setTimeout(g.s,2300)}}
// ===== LOGIKA =====
function solve(i){const g=LV.gs[i];if(g.ok)return;g.ok=1;ding();star();star();LV.en.forEach(x=>{if(x.k=='c'&&x.g==i)x.d=1});say(rnd(['Hebat!','Benar! Pintar!','Yeay, benar!']));
const nx=LV.gs.find(q=>!q.ok);setTimeout(()=>{if(!run)return;if(nx)task();else say('Gerbang terbuka! Ayo lanjut ke kanan!')},1800)}
function touch(e){const g=LV.gs[e.g||0];
if(e.k=='s'){e.d=1;star();ding()}
else if(e.k=='i'){const n=LV.need[e.c];if(n&&(tally[e.c]|0)<n){e.d=1;tally[e.c]=(tally[e.c]|0)+1;ding();star();if(Object.keys(LV.need).every(k=>(tally[k]|0)>=LV.need[k]))solve(0)}
 else if(tick>(e.w||0)){e.w=tick+120;buzz();say('Itu belum tepat. '+g.text);g.wr++;if(g.wr>1)LV.en.forEach(x=>{if(x.k=='i'&&LV.need[x.c]&&!x.d)x.hl=1})}}
else if(e.k=='c'){if(g.ok)return;if(e.ok)solve(e.g);else if(tick>(e.w||0)){e.w=tick+90;buzz();bb.vy=-8;g.wr++;say('Belum tepat. Ayo coba lagi!');if(g.s)setTimeout(g.s,2200);if(g.wr>1)LV.en.forEach(x=>{if(x.k=='c'&&x.g==e.g&&x.ok)x.hl=1})}}
else if(e.k=='k'&&tick>(e.w||0)&&carry!==e){if(carry){carry.d=0;carry.w=tick+90}carry=e;e.d=1;ding()}}
function doorHit(d){if(d.k=='g')say('Gerbang masih terkunci. Selesaikan misinya dulu, ya!');
else if(d.k=='d'){if(carry&&carry.s==d.s){d.o=1;carry=null;ding();star();say('Pintu terbuka!')}else say('Pintu ini bergambar '+d.s+'. Cari kuncinya!')}
else if(d.k=='m'){say('Pintu rahasia! Ayo bermain untuk membukanya!');setTimeout(()=>{if(run&&!paused)openMini(d)},1500)}}
function step(){if(!run||paused)return;tick++;const k=keys;
bb.vx=((k.r?1:0)-(k.l?1:0))*3.3;if(bb.vx)bb.f=bb.vx>0?1:-1;
if(k.j&&!bb.jp&&bb.c>0){bb.vy=-13.2;bb.c=0;bb.jp=1;tone(440,.12);tone(660,.1,.08)}if(!k.j)bb.jp=0;
bb.vy=Math.min(bb.vy+.62,14);const S=LV.so.concat(LV.dr.filter(d=>!d.o));
bb.x+=bb.vx;S.forEach(s=>{if(!s.o&&hit(bb,s))bb.x=bb.vx>0?s.x-bb.w:s.x+s.w});bb.x=Math.max(0,Math.min(LV.W-bb.w,bb.x));
const py=bb.y;bb.y+=bb.vy;bb.g=0;
S.forEach(s=>{if(hit(bb,s)){if(bb.vy>=0&&(!s.o||py+bb.h<=s.y+8)){bb.y=s.y-bb.h;bb.vy=0;bb.g=1;bb.on=s}else if(bb.vy<0&&!s.o){bb.y=s.y+s.h;bb.vy=0}}});
bb.c=bb.g?7:Math.max(bb.c-1,0);
if(bb.g&&bb.on&&bb.on.h==70&&bb.x-bb.on.x>60&&bb.on.x+bb.on.w-bb.x>100){bb.sx=bb.x;bb.sy=bb.y}
if(bb.y>540){bb.x=bb.sx;bb.y=bb.sy;bb.vy=0;say('Ups! Tidak apa-apa. Ayo coba lagi!')}
LV.en.forEach(e=>{if(!e.d&&Math.abs(bb.x+19-e.x)<32&&Math.abs(bb.y+29-e.y)<44)touch(e)});
LV.dr.forEach(d=>{if(!d.o&&tick>(d.w||0)&&bb.x+bb.w>=d.x-8&&bb.x<=d.x+d.w+8&&bb.y+bb.h>d.y){d.w=tick+150;doorHit(d)}
 if(d.k=='g'&&!d.o&&LV.gs[d.gr].ok){d.o=1;tone(700,.2);tone(900,.3,.1)}});
if(LV.dd&&!LV.gs[0].ok&&LV.dr.every(d=>d.o)){LV.gs[0].ok=1;ding();say('Hebat! Semua pintu sudah terbuka!')}
if(LV.fl&&LV.gs[0].ok)LV.bl=Math.min((LV.bl||0)+.02,1);
if(bb.x>LV.fx-20&&LV.gs.every(g=>g.ok))finish();
cam+=(Math.max(0,Math.min(LV.W-W0,bb.x-300))-cam)*.12}
function loop(t){if(!run)return;raf=requestAnimationFrame(loop);acc+=Math.min(t-(last||t),100);last=t;while(acc>=16.67){acc-=16.67;step()}draw()}
// ===== GAMBAR =====
function shp(n,x,y,s,col){cx.fillStyle=col;cx.strokeStyle='#0004';cx.lineWidth=3;cx.beginPath();
if(n=='lingkaran')cx.arc(x,y,s,0,7);
else if(n=='segitiga'){cx.moveTo(x,y-s);cx.lineTo(x+s,y+s*.85);cx.lineTo(x-s,y+s*.85);cx.closePath()}
else if(n=='persegi')cx.rect(x-s*.85,y-s*.85,s*1.7,s*1.7);
else if(n=='bintang'){for(let i=0;i<10;i++){const r=i%2?s*.45:s,a=i*Math.PI/5-Math.PI/2;cx[i?'lineTo':'moveTo'](x+Math.cos(a)*r,y+Math.sin(a)*r)}cx.closePath()}
else{cx.moveTo(x,y+s*.9);cx.bezierCurveTo(x-s*1.5,y-s*.2,x-s*.6,y-s,x,y-s*.3);cx.bezierCurveTo(x+s*.6,y-s,x+s*1.5,y-s*.2,x,y+s*.9)}
cx.fill();cx.stroke()}
function item(k,x,y,s=1){cx.save();cx.translate(x,y);cx.scale(s,s);
if(COL[k]){cx.fillStyle=COL[k];circ(0,0,17);cx.fillStyle='#fff7';circ(-6,-6,5);cx.fillStyle='#2f9e44';cx.fillRect(-1,-25,3,9);cx.beginPath();cx.ellipse(8,-21,8,4,.5,0,7);cx.fill()}
else if(k=='air'){cx.fillStyle='#4dabf7';cx.beginPath();cx.moveTo(0,-24);cx.quadraticCurveTo(22,4,0,17);cx.quadraticCurveTo(-22,4,0,-24);cx.fill();cx.fillStyle='#fff8';circ(-6,5,4)}
else if(k=='matahari'){cx.strokeStyle='#ffa94d';cx.lineWidth=4;for(let a=0;a<8;a++){cx.beginPath();cx.moveTo(Math.cos(a*.785)*16,Math.sin(a*.785)*16);cx.lineTo(Math.cos(a*.785)*24,Math.sin(a*.785)*24);cx.stroke()}cx.fillStyle='#ffd43b';circ(0,0,14)}
else if(k=='bola'){cx.fillStyle='#fff';circ(0,0,16);cx.strokeStyle='#e03131';cx.lineWidth=4;cx.stroke();cx.fillStyle='#e03131';circ(0,0,5)}
else if(k=='permen'){cx.fillStyle='#f06595';cx.beginPath();cx.moveTo(-28,-11);cx.lineTo(-14,0);cx.lineTo(-28,11);cx.moveTo(28,-11);cx.lineTo(14,0);cx.lineTo(28,11);cx.fill();circ(0,0,14);cx.fillStyle='#fff9';circ(-4,-4,4)}
cx.restore()}
function deco(th){const o=-((cam*.5)%240);
if(th==5){['#e03131','#fd7e14','#fcc419','#40c057','#339af0','#9c36b5'].forEach((c,i)=>{cx.strokeStyle=c;cx.lineWidth=12;cx.beginPath();cx.arc(400,GY+30,300-i*12,Math.PI,0);cx.stroke()})}
for(let x=o-240;x<W0+240;x+=240){
 if(th==0||th==1||th==3){cx.fillStyle='#7a4b24';cx.fillRect(x+60,GY-70,14,70);cx.fillStyle=th==3?'#8bd36b':'#2f9e44';circ(x+67,GY-90,38);
  if(th==1){cx.fillStyle='#e03131';circ(x+50,GY-95,6);circ(x+82,GY-85,6)}
  if(th==3){cx.fillStyle='#2f9e44';cx.fillRect(x+160,GY-30,3,30);cx.fillStyle=['#f783ac','#ffd43b','#74c0fc'][Math.abs(Math.round(x/240))%3];circ(x+161,GY-34,10)}}
 else if(th==2){cx.fillStyle='#b197fc';cx.fillRect(x+40,GY-150,70,150);cx.fillStyle='#f06595';cx.beginPath();cx.moveTo(x+30,GY-150);cx.lineTo(x+75,GY-205);cx.lineTo(x+120,GY-150);cx.fill();cx.fillStyle='#fff';cx.fillRect(x+66,GY-110,18,30)}
 else if(th==4){cx.fillStyle='#4a3a7a';cx.beginPath();cx.moveTo(x+20,0);cx.lineTo(x+90,0);cx.lineTo(x+55,110);cx.fill();cx.fillStyle='#74c0fc';cx.beginPath();cx.moveTo(x+140,GY);cx.lineTo(x+155,GY-55);cx.lineTo(x+170,GY);cx.fill()}
 else{cx.fillStyle='#fffc';circ(x+60,90,22);circ(x+85,85,28);circ(x+112,92,20)}}}
function drawDoor(d){if(d.o)return;const x=d.x,y=d.y;
if(d.k=='g'){Object.values(COL).forEach((c,i)=>{cx.fillStyle=c;cx.fillRect(x+i*6,y,6,d.h)});shp('bintang',x+17,y+150,12,'#fff')}
else if(d.k=='d'){cx.fillStyle='#a0693a';cx.fillRect(x,y,d.w,d.h);cx.fillStyle='#fff';cx.fillRect(x+4,y+110,d.w-8,60);shp(d.s,x+d.w/2,y+140,14,SC[d.s]);cx.fillStyle='#ffd43b';circ(x+d.w-8,y+230,5)}
else{cx.fillStyle='#8e7cc3';cx.fillRect(x,y,d.w,d.h);cx.fillStyle='#fff';cx.font='bold 34px sans-serif';cx.textAlign='center';cx.fillText('?',x+d.w/2,y+150);cx.fillStyle='#ffd43b';circ(x+d.w/2,y+190,9)}}
function drawEnt(e){if(e.d)return;const by=Math.sin(tick/15+e.x)*4;
if(e.hl){cx.strokeStyle='#ffd43b';cx.lineWidth=5;cx.beginPath();cx.arc(e.x,e.y+by,36+Math.sin(tick/6)*4,0,7);cx.stroke()}
if(e.k=='s')shp('bintang',e.x,e.y+by,13,'#ffd43b');
else if(e.k=='i')item(e.c,e.x,e.y+by);
else if(e.k=='k'){shp(e.s,e.x,e.y+by,14,SC[e.s]);cx.fillStyle='#fcc419';cx.fillRect(e.x-3,e.y+by+14,6,14)}
else if(e.e){cx.font='54px serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(e.e,e.x,e.y+by);cx.textBaseline='alphabetic'}
else if(e.sh)shp(e.sh,e.x,e.y+by,24,e.col);
else{cx.fillStyle=e.col;circ(e.x,e.y+by,22)}}
function flower(){const k=LV.bl||0,x=LV.fl,hx=x+16*(1-k),hy=GY-45-35*k;cx.strokeStyle='#2f9e44';cx.lineWidth=6;cx.beginPath();cx.moveTo(x,GY);cx.lineTo(hx,hy);cx.stroke();
for(let a=0;a<8;a++){cx.fillStyle=k>.5?'#f783ac':'#adb5bd';circ(hx+Math.cos(a*.785)*(14+8*k),hy+Math.sin(a*.785)*(14+8*k),9+5*k)}cx.fillStyle=k>.5?'#ffd43b':'#868e96';circ(hx,hy,9+4*k)}
function drawBubu(){const w=Math.abs(bb.vx)>.5&&bb.g?Math.sin(tick/3)*4:0,up=bb.g?0:8;
cx.save();cx.translate(bb.x+bb.w/2,bb.y+bb.h);cx.scale(bb.f,1);
cx.fillStyle='#6f4320';circ(-10,-5+w,8);circ(10,-5-w,8);cx.fillStyle='#8d5a2b';circ(0,-24,21);cx.fillStyle='#f3d9b1';circ(2,-20,12);
cx.fillStyle='#8d5a2b';circ(-20,-26-up,7);circ(20,-26-up,7);circ(0,-44,19);circ(-14,-58,7);circ(14,-58,7);
cx.fillStyle='#f4a8a8';circ(-14,-58,3.5);circ(14,-58,3.5);cx.fillStyle='#f3d9b1';circ(5,-39,9);
cx.fillStyle='#2b1a0e';circ(-4,-48,2.8);circ(9,-48,2.8);circ(9,-41,3);cx.strokeStyle='#2b1a0e';cx.lineWidth=2;cx.beginPath();cx.arc(6,-37,4,.2,2.9);cx.stroke();
cx.fillStyle='#ff8fab88';circ(-8,-40,4);cx.restore();
if(carry){shp(carry.s,bb.x+19,bb.y-26,12,SC[carry.s])}}
function draw(){const th=LV.th,T3=TH[th],g=cx.createLinearGradient(0,0,0,H0);g.addColorStop(0,T3[0]);g.addColorStop(1,T3[1]);cx.fillStyle=g;cx.fillRect(0,0,W0,H0);
cx.fillStyle=T3[2]+'66';for(let i=-1;i<5;i++)circ(i*300-(cam*.25)%300+100,GY+70,150);
deco(th);cx.save();cx.translate(-Math.round(cam),0);
LV.gaps.forEach(g=>{cx.fillStyle='#4dabf7';cx.fillRect(g[0],GY+8,g[1]-g[0],62);cx.fillStyle='#fff8';for(let x=g[0]+8;x<g[1];x+=20)circ(x,GY+12+Math.sin(tick/8+x)*3,4)});
LV.so.forEach(s=>{if(s.h==70){cx.fillStyle=T3[3];cx.fillRect(s.x,s.y,s.w,s.h);cx.fillStyle=T3[2];cx.fillRect(s.x,s.y,s.w,14)}
 else if(s.o){cx.fillStyle=T3[3];cx.fillRect(s.x,s.y,s.w,s.h);cx.fillStyle=T3[2];cx.fillRect(s.x,s.y,s.w,7)}
 else{cx.fillStyle='#a0693a';cx.fillRect(s.x,s.y,s.w,s.h);cx.fillStyle='#d9a066';circ(s.x+s.w-8,s.y+s.h/2,7);cx.fillStyle='#7a4b24';circ(s.x+s.w-8,s.y+s.h/2,3)}});
if(LV.fl)flower();LV.dr.forEach(drawDoor);LV.en.forEach(drawEnt);
cx.fillStyle='#fff';cx.fillRect(LV.fx,GY-120,6,120);shp('bintang',LV.fx+28,GY-105,18,'#ffd43b');drawBubu();cx.restore();
let hx=16;Object.keys(LV.need).forEach(k=>{for(let j=0;j<LV.need[k];j++){cx.globalAlpha=(tally[k]|0)>j?1:.3;item(k,hx+18,34,.9);hx+=46}});cx.globalAlpha=1;
cx.fillStyle='#fffd';cx.fillRect(W0/2-110,6,220,30);cx.fillStyle='#5b3a1e';cx.font='bold 18px sans-serif';cx.textAlign='center';cx.fillText(`Level ${lvl+1}: ${NAMA[lvl]}`,W0/2,27)}
// ===== KONTROL =====
const KM={ArrowLeft:'l',a:'l',ArrowRight:'r',d:'r',ArrowUp:'j',w:'j',' ':'j'};
addEventListener('keydown',e=>{const k=KM[e.key];if(k){keys[k]=1;e.preventDefault()}});
addEventListener('keyup',e=>{const k=KM[e.key];if(k)keys[k]=0});
[['bl','l'],['br','r'],['bj','j']].forEach(([id,k])=>{const b=$('#'+id),on=v=>ev=>{ev.preventDefault();keys[k]=v};b.onpointerdown=on(1);b.onpointerup=b.onpointerleave=b.onpointercancel=on(0);b.oncontextmenu=e=>e.preventDefault()});
addEventListener('blur',()=>keys={});
home();
