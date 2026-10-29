import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const planetData = {
  mercury:{name:'Mercure',code:'01',type:'PLANÈTE ROCHEUSE',desc:'Un monde minéral couvert de cratères, où les écarts de température sont parmi les plus extrêmes du système solaire.',diameter:4879,temp:'167',day:'58,6 jours',year:'88 jours',distance:'57,9 millions de km',moons:'Aucun satellite naturel',composition:'Roche et noyau métallique',gravity:'3,7 m/s²',atmosphere:'Exosphère très ténue',feature:'Très grands écarts thermiques',texture:'2k_mercury.jpg',fallback:'mercury-sphere',color:0x9a8e80,scale:0.383},
  venus:{name:'Vénus',code:'02',type:'PLANÈTE ROCHEUSE',desc:'Sous ses nuages épais, Vénus est un monde brûlant soumis à une pression atmosphérique écrasante. Elle est la planète la plus chaude du système solaire.',diameter:12104,temp:'464',day:'243 jours',year:'225 jours',distance:'108,2 millions de km',moons:'Aucun satellite naturel',composition:'Roches silicatées et noyau métallique',gravity:'8,87 m/s²',atmosphere:'CO₂, nuages d’acide sulfurique',feature:'Effet de serre extrême',texture:'2k_venus_surface.jpg',fallback:'venus-sphere',color:0xd6a16c,scale:0.949},
  earth:{name:'Terre',code:'03',type:'PLANÈTE ROCHEUSE',desc:'Notre oasis bleue. La seule planète connue à abriter une vie foisonnante, protégée par une atmosphère et un champ magnétique remarquables.',diameter:12742,temp:'15',day:'23 h 56',year:'365,25 jours',distance:'149,6 millions de km',moons:'1 satellite naturel',composition:'Roche, fer et silicates',gravity:'9,81 m/s²',atmosphere:'Azote et oxygène',feature:'Eau liquide en surface',texture:'2k_earth_daymap.jpg',fallback:'earth-sphere',color:0x397fc4,scale:1},
  mars:{name:'Mars',code:'04',type:'PLANÈTE ROCHEUSE',desc:'La planète rouge conserve les traces d’anciens fleuves et de lacs. Ses paysages racontent l’histoire d’un monde qui a peut-être été plus accueillant dans le passé.',diameter:6779,temp:'−65',day:'24 h 37',year:'687 jours',distance:'227,9 millions de km',moons:'2 satellites naturels',composition:'Roche, oxydes de fer',gravity:'3,71 m/s²',atmosphere:'CO₂ très ténu',feature:'Olympus Mons, volcan géant',texture:'2k_mars.jpg',fallback:'mars-sphere',color:0xc05b3f,scale:0.532},
  jupiter:{name:'Jupiter',code:'05',type:'GÉANTE GAZEUSE',desc:'Le roi des planètes. Jupiter est si massive qu’elle dépasse à elle seule la masse de toutes les autres planètes réunies. Sa Grande Tache rouge est une tempête géante.',diameter:139820,temp:'−110',day:'9 h 56',year:'11,86 ans',distance:'778,6 millions de km',moons:'95 satellites confirmés*',composition:'Hydrogène et hélium',gravity:'24,79 m/s²',atmosphere:'Hydrogène, hélium et nuages',feature:'Grande Tache rouge',texture:'2k_jupiter.jpg',fallback:'jupiter-sphere',color:0xc7a27c,scale:10.97},
  saturn:{name:'Saturne',code:'06',type:'GÉANTE GAZEUSE',desc:'Saturne est célèbre pour son système d’anneaux spectaculaire, composé principalement de fragments de glace et de roche. Sa densité moyenne est inférieure à celle de l’eau.',diameter:116460,temp:'−140',day:'10 h 33',year:'29,4 ans',distance:'1,43 milliard de km',moons:'146 satellites confirmés*',composition:'Hydrogène et hélium',gravity:'10,44 m/s²',atmosphere:'Hydrogène, hélium et traces de méthane',feature:'Système d’anneaux étendu',texture:'2k_saturn.jpg',fallback:'saturn-sphere',color:0xd1bd91,scale:9.14},
  uranus:{name:'Uranus',code:'07',type:'GÉANTE DE GLACES',desc:'Uranus tourne presque couchée sur son orbite. Son atmosphère glacée lui donne une teinte bleu-vert et ses saisons sont parmi les plus singulières du système solaire.',diameter:50724,temp:'−195',day:'17 h 14',year:'84 ans',distance:'2,87 milliards de km',moons:'28 satellites confirmés*',composition:'Eau, ammoniac et méthane',gravity:'8,69 m/s²',atmosphere:'Hydrogène, hélium, méthane',feature:'Axe de rotation très incliné',texture:'2k_uranus.jpg',fallback:'uranus-sphere',color:0x82c9d0,scale:3.98},
  neptune:{name:'Neptune',code:'08',type:'GÉANTE DE GLACES',desc:'Lointaine et glaciale, Neptune est balayée par des vents extrêmement rapides. Sa couleur bleue profonde et ses tempêtes en font un monde fascinant, à la frontière du système solaire.',diameter:49244,temp:'−200',day:'16 h 6',year:'164,8 ans',distance:'4,50 milliards de km',moons:'16 satellites confirmés*',composition:'Eau, ammoniac et méthane',gravity:'11,15 m/s²',atmosphere:'Hydrogène, hélium, méthane',feature:'Vents supersoniques',texture:'2k_neptune.jpg',fallback:'neptune-sphere',color:0x2864d6,scale:3.86}
};
const $=s=>document.querySelector(s);
let selected='earth';
const wrap=$('#planetCanvasWrap'),loading=$('#loadingLabel'),fallback=$('#planetFallback');
const TEX='https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/';
const loader=new THREE.TextureLoader();loader.setCrossOrigin('anonymous');
const cache={};
const load=(u,srgb=true)=>cache[u+srgb]??=new Promise(r=>loader.load(u,t=>{if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;r(t)},undefined,()=>r(null)));
const pal={mercury:['#6f675f','#a89d90'],venus:['#c98f55','#f0cf9b'],mars:['#8c3a26','#d0764a'],jupiter:['#8a5a3c','#ecd3ad'],saturn:['#a58d62','#efe0b5'],uranus:['#6fb8c4','#b9eef0'],neptune:['#1c4fb8','#4f8cf0']};
const glow={venus:0xffc680,earth:0x5aa0ff,mars:0xff9a70,jupiter:0xffd7a8,saturn:0xf2dfae,uranus:0x9ff0f2,neptune:0x4a7dff};
function procTex(key){
 const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d'),P=pal[key],gas=key!=='mercury'&&key!=='mars';
 let s=key.length*9301+7;const R=()=>(s=(s*16807)%2147483647)/2147483647;
 g.fillStyle=P[0];g.fillRect(0,0,1024,512);
 if(gas){for(let y=0;y<512;){const h=4+R()*(key==='uranus'?44:26);g.fillStyle=P[R()>.5?1:0];g.globalAlpha=.25+R()*.5;g.fillRect(0,y,1024,h);y+=h}
  g.filter='blur(2px)';g.globalAlpha=.16;for(let i=0;i<280;i++){g.fillStyle=P[R()>.5?1:0];g.beginPath();g.ellipse(R()*1024,R()*512,20+R()*60,2+R()*7,0,0,7);g.fill()}
  if(key==='jupiter'){g.globalAlpha=.9;g.fillStyle='#b4502e';g.beginPath();g.ellipse(700,330,46,24,0,0,7);g.fill()}}
 else{for(let i=0;i<900;i++){const r=2+R()**3*28;g.globalAlpha=.22;g.fillStyle=R()>.5?P[1]:'#000';g.beginPath();g.arc(R()*1024,R()*512,r,0,7);g.fill()}}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
function ringTex(){const c=document.createElement('canvas');c.width=1024;c.height=1;const g=c.getContext('2d'),d=g.createImageData(1024,1);
 for(let i=0;i<1024;i++){const u=i/1024,n=Math.sin(u*180)*.5+Math.sin(u*531)*.3+Math.sin(u*47)*.4;let a=.55+n*.25;if(u>.62&&u<.66)a=.03;if(u<.08||u>.97)a*=.25;const v=190+n*30;d.data.set([v,v*.9,v*.72,a*255],i*4)}
 g.putImageData(d,0,0);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const atmoMat=col=>new THREE.ShaderMaterial({uniforms:{c:{value:new THREE.Color(col)}},
 vertexShader:'varying vec3 n,v;void main(){n=normalize(normalMatrix*normal);vec4 m=modelViewMatrix*vec4(position,1.);v=-m.xyz;gl_Position=projectionMatrix*m;}',
 fragmentShader:'uniform vec3 c;varying vec3 n,v;void main(){float f=pow(1.-abs(dot(n,normalize(v))),3.);gl_FragColor=vec4(c*f*1.5,f);}',
 blending:THREE.AdditiveBlending,transparent:true,depthWrite:false});
function buildWorld(key){
 const d=planetData[key],grp=new THREE.Group(),tilt=new THREE.Group(),body=new THREE.Group();let dead=false,clouds,moon,moonPivot;
 grp.add(tilt);tilt.add(body);tilt.rotation.z={earth:.41,mars:.44,saturn:.47,neptune:.5,uranus:1.7}[key]??.05;
 const mat=new THREE.MeshPhongMaterial({color:d.color,shininess:key==='earth'?22:4,specular:new THREE.Color(key==='earth'?0x446688:0x111111)});
 if(key!=='earth'){mat.map=procTex(key);mat.color.set(0xffffff)}
 body.add(new THREE.Mesh(new THREE.SphereGeometry(1,128,128),mat));
 if(glow[key])grp.add(new THREE.Mesh(new THREE.SphereGeometry(1.09,64,64),atmoMat(glow[key])));
 const jobs=[];
 if(key==='earth'){
  clouds=new THREE.Mesh(new THREE.SphereGeometry(1.012,96,96),new THREE.MeshPhongMaterial({transparent:true,depthWrite:false,opacity:.9}));body.add(clouds);
  moonPivot=new THREE.Group();moonPivot.rotation.x=.09;tilt.add(moonPivot);
  moon=new THREE.Mesh(new THREE.SphereGeometry(.27,48,48),new THREE.MeshPhongMaterial({color:0x9a9a9a,shininess:2}));moon.position.x=2.6;moonPivot.add(moon);
  jobs.push(Promise.all([load(TEX+'earth_atmos_2048.jpg'),load(TEX+'earth_normal_2048.jpg',false),load(TEX+'earth_specular_2048.jpg',false),load(TEX+'earth_clouds_1024.png'),load(TEX+'moon_1024.jpg')]).then(([m,n,s,cl,mo])=>{if(dead)return false;
   if(m){mat.map=m;mat.color.set(0xffffff)}if(n){mat.normalMap=n;mat.normalScale.set(.9,.9)}if(s)mat.specularMap=s;mat.needsUpdate=true;
   if(cl){clouds.material.map=cl;clouds.material.needsUpdate=true}else clouds.visible=false;
   if(mo){moon.material.map=mo;moon.material.color.set(0xffffff);moon.material.needsUpdate=true}return !!m}));
 }else jobs.push(load(`https://www.solarsystemscope.com/textures/download/${d.texture}`).then(t=>{if(dead||!t)return false;mat.map=t;mat.needsUpdate=true;return true}));
 if(key==='saturn'){const g=new THREE.RingGeometry(1.35,2.4,160),p=g.attributes.position,uv=g.attributes.uv,v=new THREE.Vector3();
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);uv.setXY(i,(v.length()-1.35)/1.05,.5)}
  const ring=new THREE.Mesh(g,new THREE.MeshPhongMaterial({map:ringTex(),side:THREE.DoubleSide,transparent:true,depthWrite:false,shininess:2}));ring.rotation.x=Math.PI/2;tilt.add(ring)}
 return{grp,body,base:key==='saturn'?.72:1,speed:key==='jupiter'||key==='saturn'?.22:key==='venus'?.03:.1,
  ready:Promise.all(jobs).then(a=>a.every(Boolean)),
  update(t,dt){if(clouds)clouds.rotation.y+=dt*.012;if(moonPivot)moonPivot.rotation.y+=dt*.08},
  dispose(){dead=true;grp.traverse(o=>{o.geometry?.dispose();const m=o.material;if(m){m.map?.isCanvasTexture&&m.map.dispose();m.dispose()}})}}}
function makeView(el,{z=5.6,hero=false}={}){
 const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(38,1,.1,200);cam.position.z=z;
 const r=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
 r.setPixelRatio(Math.min(devicePixelRatio,2));r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.1;
 el.appendChild(r.domElement);
 scene.add(new THREE.HemisphereLight(0x7f9fe0,0x05060c,.5));
 const sun=new THREE.DirectionalLight(0xfff1dc,3.4);sun.position.set(-5,2.2,4);scene.add(sun);
 const rim=new THREE.DirectionalLight(0x4a82ff,1.2);rim.position.set(4,-1,-4);scene.add(rim);
 let stars;if(!hero){const n=1400,pos=new Float32Array(n*3),sg=new THREE.BufferGeometry();
  for(let i=0;i<n;i++){const a=Math.random()*6.283,b=Math.acos(2*Math.random()-1),q=40+Math.random()*20;pos.set([q*Math.sin(b)*Math.cos(a),q*Math.cos(b),q*Math.sin(b)*Math.sin(a)],i*3)}
  sg.setAttribute('position',new THREE.BufferAttribute(pos,3));stars=new THREE.Points(sg,new THREE.PointsMaterial({size:.12,color:0xcfe0ff,transparent:true,opacity:.8,depthWrite:false}));scene.add(stars)}
 const v={r,vel:0,drag:false,t0:0,vis:true,ty:0,py:0,tilt:0,world:null};
 const rs=()=>{const w=el.clientWidth||1,h=el.clientHeight||1;r.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()};new ResizeObserver(rs).observe(el);rs();
 v.set=key=>{if(v.world){scene.remove(v.world.grp);v.world.dispose()}v.world=buildWorld(key);scene.add(v.world.grp);v.t0=performance.now();v.vel=0;return v.world};
 v.tick=(now,dt)=>{const w=v.world;if(!w)return;const k=1-Math.pow(1-Math.min(1,(now-v.t0)/1000),3);w.grp.scale.setScalar(w.base*(.75+.25*k));
  if(!v.drag){v.vel*=.94;w.body.rotation.y+=v.vel+dt*w.speed}
  v.tilt+=(v.ty-v.tilt)*.08;w.grp.rotation.x=v.tilt;w.grp.rotation.y+=(v.py-w.grp.rotation.y)*.05;
  w.update(now,dt);if(stars)stars.rotation.y+=dt*.004;r.render(scene,cam)};
 if(!hero){let lx,ly;const c=r.domElement;c.onpointerdown=e=>{v.drag=true;lx=e.clientX;ly=e.clientY;c.setPointerCapture(e.pointerId)};
  c.onpointermove=e=>{if(!v.drag)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;v.vel=dx*.006;v.world.body.rotation.y+=v.vel;v.ty=Math.max(-.6,Math.min(.6,v.ty+dy*.004))};
  c.onpointerup=c.onpointercancel=()=>{v.drag=false;v.ty=0}}
 return v}
let stage,hero;
function loadPlanet(key){
 const d=planetData[key];if(!d)return;selected=key;
 $('#stageCode').textContent=`PLANÈTE ${d.name.toLocaleUpperCase('fr-FR')} / ${d.code}`;$('#stageDistance').textContent=d.distance;
 $('#planetType').textContent=d.type;$('#planetName').innerHTML=`${d.name}<span>.</span>`;$('#planetDesc').textContent=d.desc;
 $('#planetDiameter').innerHTML=`${d.diameter.toLocaleString('fr-FR')} <small>km</small>`;$('#planetTemp').innerHTML=`${d.temp} <small>°C</small>`;$('#planetDay').textContent=d.day;$('#planetYear').innerHTML=d.year.replace('jours','<small>jours</small>').replace('ans','<small>ans</small>');
 $('#planetMoons').textContent=d.moons;$('#factComposition').textContent=d.composition;$('#factGravity').textContent=d.gravity;$('#factAtmosphere').textContent=d.atmosphere;$('#factFeature').textContent=d.feature;
 $$('.planet-option').forEach(b=>b.classList.toggle('selected',b.dataset.planet===key));
 if(!stage){fallback.className='planet-fallback '+d.fallback;return}
 fallback.style.display='none';loading.textContent='CHARGEMENT DES TEXTURES…';
 stage.set(key).ready.then(ok=>{if(selected===key)loading.textContent=ok?'FAITES TOURNER LA PLANÈTE':'MODÈLE 3D — TEXTURES PROCÉDURALES'});
}
function init(){
 try{stage=makeView(wrap);const hc=document.createElement('div');hc.className='hero-canvas';$('.hero-planet').before(hc);hero=makeView(hc,{z:5.1,hero:true});hero.set('earth');
  const views=[stage,hero];views.forEach(v=>new IntersectionObserver(([e])=>v.vis=e.isIntersecting).observe(v.r.domElement));
  addEventListener('pointermove',e=>{hero.py=(e.clientX/innerWidth-.5)*.5;hero.ty=(e.clientY/innerHeight-.5)*.3});
  let last=performance.now();(function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;if(!document.hidden)views.forEach(v=>v.vis&&v.tick(now,dt))})(last);
 }catch(err){stage=null;loading.textContent='APERÇU STYLISÉ — WEBGL NON DISPONIBLE';fallback.style.display='block'}
 loadPlanet('earth');
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
 $$('.intro-grid,.section-heading,.planet-layout>*,.compare-heading,.compare-panel,.mission-copy').forEach(el=>{el.classList.add('reveal');io.observe(el)});
}
function $$(s){return [...document.querySelectorAll(s)]}
$$('.planet-option').forEach(b=>b.addEventListener('click',()=>loadPlanet(b.dataset.planet)));
$('#moreFacts').addEventListener('click',()=>{const box=$('#expandedFacts');box.hidden=!box.hidden;$('#moreFacts').innerHTML=box.hidden?'Fiche complète <span>↗</span>':'Réduire la fiche <span>↖</span>'});

const diameters={mercury:4879,venus:12104,earth:12742,mars:6779,jupiter:139820,saturn:116460,uranus:50724,neptune:49244};
const labels={mercury:'MERCURE',venus:'VÉNUS',earth:'TERRE',mars:'MARS',jupiter:'JUPITER',saturn:'SATURNE',uranus:'URANUS',neptune:'NEPTUNE'};
const spheres={mercury:'mercury-sphere',venus:'venus-sphere',earth:'earth-sphere',mars:'mars-sphere',jupiter:'jupiter-sphere',saturn:'saturn-sphere',uranus:'uranus-sphere',neptune:'neptune-sphere'};
function fmt(n){return n.toLocaleString('fr-FR')}
function drawComparison(){
 const a=$('#planetA').value,b=$('#planetB').value,da=diameters[a],db=diameters[b],max=Math.max(da,db);
 const sizeA=Math.max(9,(da/max)*205),sizeB=Math.max(9,(db/max)*205);
 const va=$('#compareVisualA'),vb=$('#compareVisualB');va.style.setProperty('--planet-size',sizeA+'px');vb.style.setProperty('--planet-size',sizeB+'px');
 va.className='compare-planet planet-a '+(a==='saturn'?'saturn-visual':'');vb.className='compare-planet planet-b '+(b==='saturn'?'saturn-visual':'');
 va.querySelector('.compare-sphere').className='compare-sphere '+spheres[a];vb.querySelector('.compare-sphere').className='compare-sphere '+spheres[b];
 $('#compareNameA').textContent=labels[a];$('#compareNameB').textContent=labels[b];$('#compareDiameterA').textContent=fmt(da)+' KM';$('#compareDiameterB').textContent=fmt(db)+' KM';
 const ratio=Math.max(da,db)/Math.min(da,db),large=da>=db?a:b,small=da>=db?b:a;
 $('#ratioNumber').textContent=ratio.toLocaleString('fr-FR',{maximumFractionDigits:2})+'×';
 $('#ratioNumber').nextElementSibling.textContent=da===db?'même diamètre':'plus large';
 $('#ratioText').textContent=da===db?`${labels[a]} et ${labels[b]} ont le même diamètre moyen dans cette comparaison.`:`${labels[large]} est environ ${ratio.toLocaleString('fr-FR',{maximumFractionDigits:2})} fois plus large que ${labels[small].toLowerCase()}. Le volume augmente encore plus vite que le diamètre.`;
 $('#ratioSmall').textContent=labels[small];$('#ratioLarge').textContent=labels[large];
 $('#ratioBar').style.width=(Math.min(100,Math.min(da,db)/Math.max(da,db)*100))+'%';
}
$('#planetA').addEventListener('change',drawComparison);$('#planetB').addEventListener('change',drawComparison);
$('#swapPlanets').addEventListener('click',()=>{const a=$('#planetA'),b=$('#planetB'),v=a.value;a.value=b.value;b.value=v;drawComparison()});
const menu=$('#mainNav'),menuButton=$('#mobileMenu');menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'×':'☰'});$$('.nav-link').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='☰'}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){$$('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-30% 0px -60% 0px'});['accueil','planetes','comparateur','mission'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});
drawComparison();init();
