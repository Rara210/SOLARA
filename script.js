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
let selected='earth', renderer, scene, camera, sphere, rings, frame=0, drag=false, lastX=0, lastY=0, rotationX=0, rotationY=0;
const wrap=$('#planetCanvasWrap'), loading=$('#loadingLabel'), fallback=$('#planetFallback');
const textureLoader=new THREE.TextureLoader(); textureLoader.setCrossOrigin('anonymous');
function create3D(){
 try{
  scene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,0,5.6);
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setSize(wrap.clientWidth,wrap.clientHeight);renderer.domElement.setAttribute('aria-label','Modèle 3D interactif de la planète sélectionnée');wrap.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0x8fa8d8,1.15));const key=new THREE.DirectionalLight(0xfff3df,3.2);key.position.set(-4,2,5);scene.add(key);const rim=new THREE.PointLight(0x4e8dff,2.3);rim.position.set(3,-1,-3);scene.add(rim);
  const geo=new THREE.SphereGeometry(1,96,96);const mat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:0});sphere=new THREE.Mesh(geo,mat);scene.add(sphere);
  const glowGeo=new THREE.SphereGeometry(1.045,64,64);const glowMat=new THREE.MeshBasicMaterial({color:0x6caaff,transparent:true,opacity:.09,side:THREE.BackSide});scene.add(new THREE.Mesh(glowGeo,glowMat));
  resize3D();window.addEventListener('resize',resize3D);renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;rotationY+=(e.clientX-lastX)*.008;rotationX+=(e.clientY-lastY)*.008;lastX=e.clientX;lastY=e.clientY});renderer.domElement.addEventListener('pointerup',()=>drag=false);renderer.domElement.addEventListener('pointercancel',()=>drag=false);
  loadPlanet('earth');animate();
 }catch(err){loading.textContent='APERÇU STYLISÉ — WEBGL NON DISPONIBLE';fallback.style.display='block'}
}
function resize3D(){if(!renderer)return;const w=Math.max(1,wrap.clientWidth),h=Math.max(1,wrap.clientHeight);renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}
function loadPlanet(key){
 const d=planetData[key];if(!d)return;selected=key;
 $('#stageCode').textContent=`PLANÈTE ${d.name.toLocaleUpperCase('fr-FR')} / ${d.code}`;$('#stageDistance').textContent=d.distance;
 $('#planetType').textContent=d.type;$('#planetName').innerHTML=`${d.name}<span>.</span>`;$('#planetDesc').textContent=d.desc;
 $('#planetDiameter').innerHTML=`${d.diameter.toLocaleString('fr-FR')} <small>km</small>`;$('#planetTemp').innerHTML=`${d.temp} <small>°C</small>`;$('#planetDay').textContent=d.day;$('#planetYear').innerHTML=d.year.replace('jours','<small>jours</small>').replace('ans','<small>ans</small>');
 $('#planetMoons').textContent=d.moons;$('#factComposition').textContent=d.composition;$('#factGravity').textContent=d.gravity;$('#factAtmosphere').textContent=d.atmosphere;$('#factFeature').textContent=d.feature;
 $$('.planet-option').forEach(b=>b.classList.toggle('selected',b.dataset.planet===key));
 fallback.className='planet-fallback '+d.fallback;fallback.style.display='block';
 if(renderer&&sphere){sphere.material.map=null;sphere.material.color.setHex(d.color);sphere.material.needsUpdate=true;loading.textContent='CHARGEMENT DE LA TEXTURE…';
  const url=`https://www.solarsystemscope.com/textures/download/${d.texture}`;
  textureLoader.load(url,tex=>{tex.colorSpace=THREE.SRGBColorSpace;if(selected!==key){tex.dispose();return}sphere.material.map=tex;sphere.material.color.setHex(0xffffff);sphere.material.needsUpdate=true;fallback.style.display='none';loading.textContent='FAITES TOURNER LA PLANÈTE';},undefined,()=>{loading.textContent='MODÈLE 3D — TEXTURE DE SECOURS';});
  if(rings){scene.remove(rings);rings.geometry.dispose();rings.material.dispose();rings=null}
  if(key==='saturn'){const ringGeo=new THREE.RingGeometry(1.22,1.82,128);const ringMat=new THREE.MeshStandardMaterial({color:0xb6a17b,side:THREE.DoubleSide,transparent:true,opacity:.72,roughness:1});rings=new THREE.Mesh(ringGeo,ringMat);rings.rotation.x=Math.PI/2.25;rings.rotation.z=-.25;scene.add(rings)}
 }
}
function animate(){frame=requestAnimationFrame(animate);if(sphere){if(!drag)rotationY+=.0018;sphere.rotation.y=rotationY;sphere.rotation.x=rotationX*.35;if(rings){rings.rotation.y=sphere.rotation.y;rings.rotation.x=Math.PI/2.25+rotationX*.08}}if(renderer)renderer.render(scene,camera)}
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
drawComparison();create3D();
