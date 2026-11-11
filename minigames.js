const $=s=>document.querySelector(s),st=$('#stage');
const rnd=a=>a[Math.floor(Math.random()*a.length)],shuf=a=>[...a].sort(()=>Math.random()-.5);
let stars=+localStorage.stars||0,T,AC;
$('#st').textContent='⭐ '+stars;
// ===== SUARA =====
const SUARA={};let cur;
function tts(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='id-ID';u.rate=.85;u.pitch=1.3;const v=speechSynthesis.getVoices().find(v=>v.lang.replace('_','-').toLowerCase().startsWith('id'));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}
function stopAudio(){if(cur){cur.pause();cur=null}try{speechSynthesis.cancel()}catch(e){}}
// Putar MP3 dari folder sounds/. Kalau filenya belum ada, pakai suara bawaan perangkat.
function mp3(file,fallback){stopAudio();if(muted)return;const au=new Audio('sounds/'+file+'.mp3');cur=au;au.play().catch(()=>{if(cur===au)tts(fallback)})}
function speak(t){if(muted)return;SUARA[t]?mp3(SUARA[t],t):(stopAudio(),tts(t))}
function say(t){$('#say').textContent=t;speak(t)}
function tone(f,d=.15,t=0){if(muted)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime+t;
o.type='triangle';o.frequency.value=f;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.2,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.start(n);o.stop(n+d)}catch(e){}}
const ding=()=>[523,659,784].forEach((f,i)=>tone(f,.2,i*.1)),buzz=()=>tone(180,.3),pop=()=>tone(300+Math.random()*400,.1);
// Suara hewan: pakai file sounds/NAMA.mp3 kalau ada, kalau tidak pakai suara Bubu
function animalSound(a){mp3(a.id,a.s)}
function star(){stars++;localStorage.stars=stars;$('#st').textContent='⭐ '+stars}
function win(){if(onWin){const f=onWin;onWin=null;f();return}ding();star();st.innerHTML='<div class="win"><div class="big">🎉🐻🎉</div><div class="q">Hebat sekali!</div><button class="btn" onclick="menu()">Main lagi</button></div>';say('Hebat sekali! Kamu dapat bintang!')}
// ===== DATA =====
const A=[{id:'kucing',e:'🐱',n:'Kucing',s:'Meong, meong'},{id:'anjing',e:'🐶',n:'Anjing',s:'Guk, guk, guk'},{id:'sapi',e:'🐮',n:'Sapi',s:'Mooo, mooo'},{id:'ayam',e:'🐔',n:'Ayam',s:'Kukuruyuk'},{id:'kambing',e:'🐐',n:'Kambing',s:'Mbeek, mbeek'},{id:'bebek',e:'🦆',n:'Bebek',s:'Kwek, kwek, kwek'},{id:'singa',e:'🦁',n:'Singa',s:'Auuum'},{id:'kuda',e:'🐴',n:'Kuda',s:'Ihihihi'}];
const O=(e,n,ok)=>({h:e+(n?'<small>'+n+'</small>':''),ok});
const SH={lingkaran:'<circle cx="50" cy="50" r="42"/>',segitiga:'<polygon points="50,8 94,90 6,90"/>',persegi:'<rect x="10" y="10" width="80" height="80" rx="8"/>',bintang:'<polygon points="50,5 61,38 96,38 68,58 79,92 50,72 21,92 32,58 4,38 39,38"/>',hati:'<path d="M50 90C10 60 5 30 28 18 40 12 50 22 50 30 50 22 60 12 72 18 95 30 90 60 50 90Z"/>'};
const SC={lingkaran:'#ff6b6b',segitiga:'#4dabf7',persegi:'#51cf66',bintang:'#fcc419',hati:'#cc5de8'};
const svg=(n,c)=>`<svg class="shp" viewBox="0 0 100 100" fill="${c||SC[n]}">${SH[n]}</svg>`;
const E=['🐶','🐱','🐰','🦊','🐼','🐸','🐵','🐷','🐧','🦁'];
// ===== DAFTAR FILE SUARA (kalimat -> nama file di folder sounds/) =====
Object.assign(SUARA,{'Hai, teman-teman! Selamat datang di Petualangan Bubu! Ayo kita bermain!':'sambutan','Hebat sekali! Kamu dapat bintang!':'menang','Benar! Pintar!':'benar-1','Hebat!':'benar-2','Yeay, benar!':'benar-3','Ayo coba lagi!':'coba-lagi','Belum tepat. Coba lagi!':'belum-tepat','Dengarkan! Hewan apa yang bersuara?':'tebak-hewan','Cari bentuk yang sama!':'bentuk','Bunga haus! Pilih air!':'bunga-air','Bunga butuh sinar matahari!':'bunga-matahari','Bunga haus lagi! Pilih air!':'bunga-air-lagi','Tanganmu kotor. Ayo pilih yang tepat!':'bersih-tangan','Gigimu kotor. Ayo pilih yang tepat!':'bersih-gigi','Mainan berantakan. Ayo pilih yang tepat!':'bersih-mainan','Ada sampah. Ayo pilih yang tepat!':'bersih-sampah','Seret kepingan ke tempat yang kosong. Susun jadi singa!':'puzzle','Singanya sudah utuh!':'puzzle-selesai','Geser bentuk ke tempat yang sama!':'geser','Sentuh gelembungnya sampai pecah!':'gelembung','Sentuh gambar yang berbeda di baris bawah!':'beda','Benar! Kamu menemukannya!':'beda-benar','Sentuh dua kartu. Cari gambar yang sama!':'memory','Cocok!':'cocok'});
// ===== MENU =====
const G=[['🐱','Tebak Hewan',g1],['🍎','Warna dan Buah',g2],['🐰','Cari Teman',g3],['🔺','Pasangkan Bentuk',g4],['🌻','Rawat Bunga',g5],['🧹','Rumah Bersih',g6],['🧩','Puzzle Hewan',g7],['🔵','Geser Bentuk',g8],['🫧','Sentuh Gelembung',g9],['🔍','Cari Perbedaan',g10],['🃏','Memory Matching',g11]];
function menu(){clearInterval(T);stopAudio();$('#say').textContent='Ayo pilih permainan!';
st.innerHTML='<div class="grid">'+G.map((g,i)=>`<button class="card" style="--h:${i*33}" onclick="play(${i})"><span>${g[0]}</span>${g[1]}</button>`).join('')+'</div><button class="btn" onclick="pesan()">⭐ Pesan dari Bubu</button>'}
function play(i){clearInterval(T);G[i][2]()}
function pesan(){const t='Yeay! Kalian hebat sekali karena sudah mencoba berbagai permainan bersama Bubu! Teruslah belajar, berani mencoba, dan jangan mudah menyerah. Tidak apa-apa jika belum berhasil, kalian selalu punya kesempatan untuk mencoba lagi. Sampai jumpa di petualangan berikutnya, teman-teman!';
st.innerHTML=`<div class="big">🐻❤️</div><div class="box">${t}</div><button class="btn" onclick="menu()">Kembali</button>`;SUARA[t]='pesan';say(t)}
function welcome(){st.innerHTML=`<div class="big" style="margin-top:20px">🐻</div><div class="q">Petualangan Bubu</div><div class="box">Hai, teman-teman! Ayo bermain sambil belajar bersama Bubu. Jangan takut salah, ya! Kalau belum tepat, kita coba lagi sampai berhasil. Kumpulkan bintang sebanyak-banyaknya!</div><button class="btn" onclick="menu();speak('Hai, teman-teman! Selamat datang di Petualangan Bubu! Ayo kita bermain!')">▶ Mulai</button>`}
// ===== MESIN KUIS (game 1-6) =====
function quiz(R){let i=0;(function next(){if(i>=R.length)return win();const r=R[i];
st.innerHTML=`<div class="q">${r.v}<button class="btn" id="rep">🔊 Dengar lagi</button></div><div class="opts"></div>`;
$('#rep').onclick=()=>r.p?r.p():say(r.s);say(r.s);if(r.p)setTimeout(r.p,2200);
shuf(r.o).forEach(o=>{const b=document.createElement('button');b.className='opt';b.innerHTML=o.h;b.onclick=()=>{if(o.ok){b.classList.add('ok');ding();say(rnd(['Benar! Pintar!','Hebat!','Yeay, benar!']));i++;setTimeout(next,1800)}else{buzz();b.classList.add('shk');say('Ayo coba lagi!');setTimeout(()=>b.classList.remove('shk'),400)}};$('.opts').append(b)})})()}
const others=(a,k,x)=>shuf(a.filter(y=>y!==x)).slice(0,k);
function g1(){quiz(shuf(A).slice(0,5).map(a=>({v:'<span class="big">🔊</span>Suara hewan apa ini?',s:'Dengarkan! Hewan apa yang bersuara?',p:()=>animalSound(a),o:[O(a.e,a.n,1),...others(A,2,a).map(x=>O(x.e,x.n))]})))}
const F=[['🍎','merah'],['🍌','kuning'],['🍇','ungu'],['🥝','hijau'],['🍊','oranye'],['🫐','biru']];
function g2(){quiz(shuf(F).slice(0,5).map(f=>({v:`<span class="big">${f[0]}</span>`,s:'Pilih buah yang berwarna '+f[1]+'!',o:[O(f[0],'',1),...others(F,2,f).map(x=>O(x[0]))]})))}
const P=['🐰','🐦','🐟','🐘','🐒','🐢','🐮','🦒'];
const CT=[['Aku suka makan wortel!','🐰'],['Aku bisa terbang di langit!','🐦'],['Aku berenang di air!','🐟'],['Aku punya belalai panjang!','🐘'],['Aku suka makan pisang!','🐒'],['Aku punya leher yang panjang!','🦒']];
function g3(){quiz(shuf(CT).slice(0,5).map(c=>({v:'<span class="big">🐻❓</span>',s:'Bubu mencari teman. '+c[0]+' Siapa aku?',o:[O(c[1],'',1),...others(P,2,c[1]).map(x=>O(x))]})))}
function g4(){const K=Object.keys(SH);quiz(shuf(K).slice(0,5).map(k=>({v:svg(k)+'Cari bentuk yang sama!',s:'Cari bentuk yang sama!',o:[{h:svg(k),ok:1},...others(K,2,k).map(x=>({h:svg(x)}))]})))}
function g5(){const S=['🌱','🌿','🌷','🌻'],D=[['Bunga haus! Pilih air!',O('💧','Air',1),O('🍫','Coklat'),O('🧸','Boneka')],['Bunga butuh sinar matahari!',O('☀️','Matahari',1),O('🍭','Permen'),O('🚗','Mobil')],['Bunga haus lagi! Pilih air!',O('💧','Air',1),O('🎈','Balon'),O('🍪','Kue')],['Bunga butuh sinar matahari!',O('☀️','Matahari',1),O('🧦','Kaus kaki'),O('⚽','Bola')]];
quiz(D.map((d,i)=>({v:`<span class="big">${S[i]}</span>`,s:d[0],o:d.slice(1)})))}
function g6(){const C=[['🖐️💦','Tanganmu kotor. Ayo pilih yang tepat!',['🧼','Cuci tangan'],['🍬','Makan permen'],['📺','Nonton TV']],['🦷','Gigimu kotor. Ayo pilih yang tepat!',['🪥','Gosok gigi'],['🍫','Makan coklat'],['🎮','Main game']],['🧸📦','Mainan berantakan. Ayo pilih yang tepat!',['🧺','Rapikan mainan'],['😴','Tidur'],['🍿','Makan camilan']],['🗑️','Ada sampah. Ayo pilih yang tepat!',['🚮','Buang sampah'],['🌳','Taruh di taman'],['🛏️','Taruh di kasur']]];
quiz(C.map(c=>({v:`<span class="big">${c[0]}</span>`,s:c[1],o:[O(c[2][0],c[2][1],1),O(c[3][0],c[3][1]),O(c[4][0],c[4][1])]})))}
F.forEach(f=>SUARA['Pilih buah yang berwarna '+f[1]+'!']='warna-'+f[1]);
CT.forEach((c,i)=>SUARA['Bubu mencari teman. '+c[0]+' Siapa aku?']='teman-'+(i+1));
// ===== SERET (drag & drop, jalan di layar sentuh) =====
function drag(el,drop){el.onpointerdown=e=>{e.preventDefault();el.setPointerCapture(e.pointerId);const x=e.clientX,y=e.clientY;el.style.zIndex=9;el.style.transition='none';
el.onpointermove=m=>el.style.transform=`translate(${m.clientX-x}px,${m.clientY-y}px) scale(1.1)`;
el.onpointerup=u=>{el.onpointermove=el.onpointerup=null;el.style.visibility='hidden';const t=document.elementFromPoint(u.clientX,u.clientY);el.style.visibility='';el.style.zIndex='';el.style.transition='transform .3s';if(!t||!drop(t)){el.style.transform='';buzz();say('Belum tepat. Coba lagi!')}}}}
const LION=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><rect width='300' height='300' fill='#bde6ff'/><rect y='250' width='300' height='50' fill='#a9e89a'/><circle cx='150' cy='150' r='128' fill='#e8590c'/><circle cx='78' cy='72' r='32' fill='#fcc419'/><circle cx='222' cy='72' r='32' fill='#fcc419'/><circle cx='78' cy='72' r='16' fill='#ffa8a8'/><circle cx='222' cy='72' r='16' fill='#ffa8a8'/><circle cx='150' cy='158' r='92' fill='#ffd43b'/><circle cx='112' cy='138' r='15' fill='#333'/><circle cx='188' cy='138' r='15' fill='#333'/><circle cx='117' cy='132' r='5' fill='#fff'/><circle cx='193' cy='132' r='5' fill='#fff'/><circle cx='95' cy='180' r='14' fill='#ff8787' opacity='.6'/><circle cx='205' cy='180' r='14' fill='#ff8787' opacity='.6'/><ellipse cx='150' cy='195' rx='42' ry='30' fill='#fff3bf'/><ellipse cx='150' cy='172' rx='15' ry='11' fill='#e64980'/><path d='M150 183Q132 214 108 198M150 183Q168 214 192 198' stroke='#333' stroke-width='5' fill='none' stroke-linecap='round'/></svg>`;
function g7(){say('Seret kepingan ke tempat yang kosong. Susun jadi singa!');let n=0;const uri='url("data:image/svg+xml,'+encodeURIComponent(LION)+'")';
st.innerHTML='<div class="puz"><div class="pz" id="bd"></div><div class="pz" id="tr"></div></div>';
for(let i=0;i<9;i++){const s=document.createElement('div');s.className='slot';s.dataset.i=i;$('#bd').append(s)}
shuf([0,1,2,3,4,5,6,7,8]).forEach(i=>{const c=document.createElement('div'),p=document.createElement('div');c.className='cell';p.className='piece';p.dataset.i=i;
p.style.backgroundImage=uri;p.style.backgroundSize='300% 300%';p.style.backgroundPosition=(i%3)*50+'% '+Math.floor(i/3)*50+'%';c.append(p);$('#tr').append(c);
drag(p,t=>{const s=t.closest('.slot');if(s&&+s.dataset.i===i&&!s.firstChild){s.append(p);p.style.transform='';p.onpointerdown=null;s.style.border='0';ding();if(++n==9){say('Singanya sudah utuh!');setTimeout(win,1800)}return true}})})}
function g8(){say('Geser bentuk ke tempat yang sama!');let n=0;const K=shuf(Object.keys(SH)).slice(0,4);
st.innerHTML='<div class="row" id="hs"></div><div class="row" id="ms"></div>';
K.forEach(k=>$('#hs').insertAdjacentHTML('beforeend',`<div class="hole" data-n="${k}">${svg(k)}</div>`));
shuf(K).forEach(k=>{const m=document.createElement('div');m.className='mv';m.dataset.n=k;m.innerHTML=svg(k);$('#ms').append(m);
drag(m,t=>{const h=t.closest('.hole');if(h&&h.dataset.n===k&&!h.dataset.d){h.dataset.d=1;h.innerHTML=svg(k);m.remove();ding();if(++n==4)setTimeout(win,900);return true}})})}
// ===== GELEMBUNG =====
function g9(){say('Sentuh gelembungnya sampai pecah!');let n=0,sp=0;st.innerHTML='<div class="sky" id="sky"></div>';
T=setInterval(()=>{if(sp-n>=5)return;sp++;const b=document.createElement('div'),z=70+Math.random()*50;b.className='bub';b.style.cssText=`width:${z}px;height:${z}px;left:${Math.random()*(88-z/9)}%;animation-duration:${5+Math.random()*3}s`;
b.onpointerdown=()=>{b.remove();pop();n++;$('#say').textContent='Pecah: '+n;if(n>=10){clearInterval(T);win()}};b.onanimationend=()=>{b.remove();sp--};$('#sky').append(b)},650)}
// ===== CARI PERBEDAAN =====
function g10(){const K=[1,2,2];let r=0;(function next(){if(r>=K.length)return win();say('Sentuh gambar yang berbeda di baris bawah!');
const top=shuf(E).slice(0,4),bot=[...top],k=K[r++],ix=shuf([0,1,2,3]).slice(0,k),sp=shuf(E.filter(e=>!top.includes(e)));let f=0;
ix.forEach((x,j)=>bot[x]=sp[j]);st.innerHTML=`<div class="q">Atas</div><div class="pair">${top.map(e=>`<button>${e}</button>`).join('')}</div><div class="q">Bawah</div><div class="pair" id="bt"></div>`;
bot.forEach((e,x)=>{const b=document.createElement('button');b.textContent=e;b.onclick=()=>{if(ix.includes(x)&&!b.classList.contains('ok')){b.classList.add('ok');ding();if(++f==k){say('Benar! Kamu menemukannya!');setTimeout(next,1800)}}else if(!b.classList.contains('ok')){buzz();b.classList.add('shk');setTimeout(()=>b.classList.remove('shk'),400)}};$('#bt').append(b)})})()}
// ===== MEMORY =====
function g11(){say('Sentuh dua kartu. Cari gambar yang sama!');const p=shuf(E).slice(0,3);let o=[],ok=0,L=0;st.innerHTML='<div class="mem" id="mm"></div>';
shuf([...p,...p]).forEach(e=>{const c=document.createElement('button');c.className='mc';c.innerHTML=`<i>❓</i><b>${e}</b>`;
c.onclick=()=>{if(L||c.classList.contains('on'))return;c.classList.add('on');pop();o.push(c);if(o.length==2){L=1;const[a,b]=o;
if(a.textContent==b.textContent){ding();say('Cocok!');o=[];L=0;if(++ok==3)setTimeout(win,1500)}else{buzz();setTimeout(()=>{a.classList.remove('on');b.classList.remove('on');o=[];L=0},1100)}}};$('#mm').append(c)})}
// ===== MULAI =====
