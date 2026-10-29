import*as THREE from 'three';
import{EffectComposer}from 'three/addons/postprocessing/EffectComposer.js';
import{RenderPass}from 'three/addons/postprocessing/RenderPass.js';
import{UnrealBloomPass}from 'three/addons/postprocessing/UnrealBloomPass.js';
import{OutputPass}from 'three/addons/postprocessing/OutputPass.js';
// nom, type, couleur, taille, orbite, période (j), inclinaison, diamètre, température, jour, année, distance, lunes, gravité, description
const D=[
['Mercure','Planète rocheuse',0xb5a999,.4,7,88,.03,'4 879 km','167 °C','58,6 j','88 j','57,9 M km','0','3,7 m/s²','Crevassée de cratères, brûlante le jour et glaciale la nuit : les écarts thermiques y sont parmi les plus violents du système.'],
['Vénus','Planète rocheuse',0xe0a864,.7,10,225,3.1,'12 104 km','464 °C','243 j','225 j','108,2 M km','0','8,87 m/s²','Sous ses nuages d’acide sulfurique, un effet de serre extrême en fait la planète la plus chaude. Elle tourne à l’envers.'],
['Terre','Planète rocheuse',0x2f78d8,.75,13.5,365,.41,'12 742 km','15 °C','23 h 56','365,25 j','149,6 M km','1','9,81 m/s²','Notre oasis bleue, seule planète connue à abriter la vie, protégée par son atmosphère et son champ magnétique.'],
['Mars','Planète rocheuse',0xc4603f,.5,17,687,.44,'6 779 km','−65 °C','24 h 37','687 j','227,9 M km','2','3,71 m/s²','La planète rouge garde les traces de fleuves anciens. Elle porte Olympus Mons, le plus grand volcan connu.'],
['Jupiter','Géante gazeuse',0xd4a574,2,24,4333,.05,'139 820 km','−110 °C','9 h 56','11,9 ans','778,6 M km','95+','24,79 m/s²','Plus massive que toutes les autres planètes réunies, elle abrite une tempête, la Grande Tache rouge, vieille de siècles.'],
['Saturne','Géante gazeuse',0xe3d09a,1.7,31,10759,.47,'116 460 km','−140 °C','10 h 33','29,4 ans','1,43 Md km','146+','10,44 m/s²','Ses anneaux de glace s’étendent sur des centaines de milliers de kilomètres pour une épaisseur de quelques dizaines de mètres.'],
['Uranus','Géante de glaces',0x86d8e0,1.2,37,30687,1.7,'50 724 km','−195 °C','17 h 14','84 ans','2,87 Md km','28','8,69 m/s²','Couchée sur le flanc, elle subit des saisons de plus de vingt ans, avec des pôles éclairés tour à tour.'],
['Neptune','Géante de glaces',0x2f5fe0,1.2,43,60190,.5,'49 244 km','−200 °C','16 h 6','164,8 ans','4,50 Md km','16','11,15 m/s²','Aux confins du système, elle est balayée par des vents supersoniques qui dépassent 2 000 km/h.']];
const $=s=>document.querySelector(s),cv=$('#gl');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.toneMapping=THREE.ACESFilmicToneMapping;
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,1,.1,2000);
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),1.1,.7,.15);
const comp=new EffectComposer(R);comp.addPass(new RenderPass(scene,cam));comp.addPass(bloom);comp.addPass(new OutputPass());
const U={t:{value:0}};let holo=true;
// étoiles + ceinture
const pts=(n,r0,r1,flat,size,col,att)=>{const p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=Math.random()*6.283,r=r0+Math.random()*(r1-r0),b=flat?0:Math.acos(2*Math.random()-1);flat?p.set([Math.cos(a)*r,(Math.random()-.5)*.6,Math.sin(a)*r],i*3):p.set([r*Math.sin(b)*Math.cos(a),r*Math.cos(b),r*Math.sin(b)*Math.sin(a)],i*3)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const m=new THREE.Points(g,new THREE.PointsMaterial({size,color:col,sizeAttenuation:att,transparent:true,opacity:.85,depthWrite:false}));scene.add(m);return m};
pts(3500,400,900,false,1.6,0xbfe8ff,false);const belt=pts(6000,19.5,21.5,true,.07,0xb9a58c,true);
// Soleil
const sun=new THREE.Mesh(new THREE.SphereGeometry(3,64,64),new THREE.MeshBasicMaterial({color:new THREE.Color(3.2,1.7,.5)}));scene.add(sun);
const gl=(s,o)=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,200,110,'+o+')');r.addColorStop(1,'#0000');g.fillStyle=r;g.fillRect(0,0,128,128);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.setScalar(s);scene.add(sp);return sp};
const g1=gl(14,.9),g2=gl(34,.35);
scene.add(new THREE.PointLight(0xfff0d8,9,0,0),new THREE.AmbientLight(0x223355,.35));
// matériaux
const holoMat=c=>new THREE.ShaderMaterial({uniforms:{t:U.t,c:{value:new THREE.Color(c)}},transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,
 vertexShader:'varying vec3 n,v,w;varying vec2 u;void main(){u=uv;n=normalize(normalMatrix*normal);vec4 m=modelViewMatrix*vec4(position,1.);v=-m.xyz;w=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*m;}',
 fragmentShader:'uniform float t;uniform vec3 c;varying vec3 n,v,w;varying vec2 u;void main(){float f=pow(1.-abs(dot(n,normalize(v))),2.);float g=max(smoothstep(.94,1.,abs(sin(u.y*3.14159*9.))),smoothstep(.94,1.,abs(sin(u.x*3.14159*18.))));float s=.65+.35*sin(w.y*30.-t*3.);float fl=.93+.07*sin(t*45.+w.y*3.);float a=(.1+f*1.1+g*.6)*s*fl;gl_FragColor=vec4(mix(c,vec3(.7,1.,1.),f*.5)*a*1.8,a);}'});
const tex=(c,gas,i)=>{const k=document.createElement('canvas');k.width=512;k.height=256;const g=k.getContext('2d');let s=i*977+5;const r=()=>(s=s*16807%2147483647)/2147483647;
 g.fillStyle=new THREE.Color(c).getStyle();g.fillRect(0,0,512,256);
 for(let j=0;j<(gas?100:500);j++){g.globalAlpha=.16;g.fillStyle=r()>.5?'#fff':'#000';g.beginPath();gas?g.rect(0,r()*256,512,2+r()*12):g.arc(r()*512,r()*256,1+r()**3*14,0,7);g.fill()}
 if(i==2){g.globalAlpha=.85;g.fillStyle='#4b8a52';for(let j=0;j<30;j++){g.beginPath();g.ellipse(r()*512,40+r()*176,10+r()*40,6+r()*20,r()*3,0,7);g.fill()}}
 const t=new THREE.CanvasTexture(k);t.colorSpace=THREE.SRGBColorSpace;return t};
const W=D.map((d,i)=>{const gas=i>3&&i!==3,hm=holoMat(d[2]),rm=new THREE.MeshStandardMaterial({map:tex(d[2],i>3,i),roughness:.9});
 const m=new THREE.Mesh(new THREE.SphereGeometry(d[3],64,64),hm);m.rotation.z=d[6];scene.add(m);
 const o=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({length:160},(_,k)=>new THREE.Vector3(Math.cos(k/160*6.283)*d[4],0,Math.sin(k/160*6.283)*d[4]))),new THREE.LineBasicMaterial({color:0x5ef2ff,transparent:true,opacity:.22}));scene.add(o);
 let ring;if(i==5){ring=new THREE.Mesh(new THREE.RingGeometry(d[3]*1.4,d[3]*2.3,128),new THREE.MeshBasicMaterial({color:0xe3c88a,side:THREE.DoubleSide,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));ring.rotation.x=Math.PI/2.2;m.add(ring)}
 const tag=document.createElement('button');tag.textContent=d[0];tag.onclick=()=>go(i);$('#tags').append(tag);
 const b=document.createElement('button');b.innerHTML=`<i style="color:#${d[2].toString(16).padStart(6,'0')}"></i>${d[0]}`;b.onclick=()=>go(i);$('#list').append(b);
 return{d,m,hm,rm,ring,a:Math.random()*6.283,w:.35*Math.pow(88/d[5],.7),tag,b}});
// caméra
const S={az:.6,el:.5,dist:260,tgt:new THREE.Vector3(),f:-1,zoom:1};let dd=60;
function go(i){S.f=i;S.zoom=1;const d=i<0?null:D[i];$('#kind').textContent=d?d[1]:'Vue d\'ensemble';$('#name').textContent=d?d[0]:'Le système solaire';
 $('#desc').textContent=d?d[14]:'Une étoile, huit planètes, une ceinture d’astéroïdes. Choisissez un monde pour y voler, ou faites glisser pour orbiter autour de la scène.';
 $('#stats').innerHTML=d?['Diamètre','Température','Jour','Année','Distance','Lunes','Gravité'].map((l,k)=>`<div><dt>${l}</dt><dd>${d[7+k]}</dd></div>`).join(''):'';
 const p=$('#panel');p.classList.remove('swap');void p.offsetWidth;p.classList.add('swap');W.forEach((w,k)=>{w.b.classList.toggle('on',k===i);w.tag.classList.toggle('dim',i>=0&&k!==i)})}
$('#home').onclick=()=>go(-1);addEventListener('keydown',e=>{if(e.key=='ArrowRight')go((S.f+1)%8);if(e.key=='ArrowLeft')go((S.f+7)%8);if(e.key=='Escape')go(-1)});
$('#mode').onclick=e=>{holo=!holo;e.target.textContent='Mode : '+(holo?'hologramme':'réaliste');bloom.strength=holo?1.1:.6;W.forEach(w=>w.m.material=holo?w.hm:w.rm);W.forEach(w=>w.tag.style.display=holo?'':'none')};
let drag=0,lx=0,ly=0,idle=0;cv.onpointerdown=e=>{drag=1;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)};
cv.onpointermove=e=>{if(!drag)return;S.az-=(e.clientX-lx)*.005;S.el=Math.max(.05,Math.min(1.45,S.el+(e.clientY-ly)*.004));lx=e.clientX;ly=e.clientY;idle=0};cv.onpointerup=cv.onpointercancel=()=>drag=0;
cv.addEventListener('wheel',e=>{e.preventDefault();S.zoom=Math.max(.4,Math.min(2.5,S.zoom*(1+e.deltaY*.001)))},{passive:false});
function rs(){const w=innerWidth,h=innerHeight;R.setSize(w,h);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();go(-1);
const clk=new THREE.Clock(),v3=new THREE.Vector3(),want=new THREE.Vector3();
R.setAnimationLoop(()=>{const dt=Math.min(.05,clk.getDelta());U.t.value+=dt;
 W.forEach(w=>{w.a+=w.w*dt;w.m.position.set(Math.cos(w.a)*w.d[4],0,Math.sin(w.a)*w.d[4]);w.m.rotation.y+=dt*.4});belt.rotation.y+=dt*.01;
 const sc=1+Math.sin(U.t.value*1.5)*.02;g1.scale.setScalar(14*sc);sun.rotation.y+=dt*.05;
 const f=S.f>=0?W[S.f]:null;want.copy(f?f.m.position:v3.set(0,0,0));S.tgt.lerp(want,1-Math.pow(.001,dt));
 const wd=(f?f.d[3]*5+2.5:(innerWidth<800?125:75))*S.zoom;dd+=(wd-dd)*(1-Math.pow(.02,dt));if(S.dist>dd)S.dist+=(dd-S.dist)*(1-Math.pow(.15,dt));else S.dist=dd;
 if(!drag){idle+=dt;if(idle>1)S.az+=dt*.05}
 cam.position.set(S.tgt.x+Math.sin(S.az)*Math.cos(S.el)*S.dist,S.tgt.y+Math.sin(S.el)*S.dist,S.tgt.z+Math.cos(S.az)*Math.cos(S.el)*S.dist);cam.lookAt(S.tgt);
 if(holo)W.forEach(w=>{v3.copy(w.m.position);v3.y+=w.d[3]+.5;v3.project(cam);w.tag.style.transform=`translate(${(v3.x*.5+.5)*innerWidth}px,${(-v3.y*.5+.5)*innerHeight}px) translate(-50%,-120%)`;w.tag.style.visibility=v3.z>1?'hidden':'visible'});
 comp.render()});
