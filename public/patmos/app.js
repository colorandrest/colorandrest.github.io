import * as THREE from 'three';
import {Water} from './vendor/Water.js';
import {Sky} from './vendor/Sky.js';
import {createGroundSampler} from './terrain.js';
const $=id=>document.getElementById(id);
const clamp=THREE.MathUtils.clamp;
let noticeTimer;
function notice(message){$('notice').textContent=message;$('notice').classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').classList.remove('visible'),3200);}
async function read(url,binary=false){const response=await fetch(url);if(!response.ok)throw Error('지형 자료를 불러올 수 없습니다.');return binary?response.arrayBuffer():response.json();}
try { await start(); } catch(error) {
 console.error(error);$('loading').classList.remove('loaded');$('loading').querySelector('strong').textContent='탐험 화면을 열지 못했습니다';
 $('load-detail').textContent=error.message.includes('WebGL')?'브라우저의 하드웨어 가속을 켠 뒤 다시 열어 주세요.':error.message;
 const retry=document.createElement('button');retry.textContent='다시 불러오기';retry.onclick=()=>location.reload();$('loading').append(retry);
}
async function start(){
 const mobile=matchMedia('(max-width:680px)').matches;
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',logarithmicDepthBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.3:1.7));
 renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.52;
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 $('world').append(renderer.domElement);
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x9eb9bc,.000035);
 const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.15,160000);camera.rotation.order='YXZ';
 const [meta,pBuffer,iBuffer]=await Promise.all([read('./data/terrain.json'),read('./data/terrain-positions.bin',true),read('./data/terrain-indices.bin',true)]);
 $('load-detail').textContent='지면과 이동 경로를 준비합니다';
 const positions=new Float32Array(pBuffer),indices=new Uint32Array(iBuffer);
 const sample=createGroundSampler(positions,indices);
 const toGeo=(x,z)=>({lon:meta.origin[0]+x/meta.mLon,lat:meta.origin[1]-z/meta.mLat});
 const toWorld=(lon,lat)=>({x:(lon-meta.origin[0])*meta.mLon,z:(meta.origin[1]-lat)*meta.mLat});
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setIndex(new THREE.BufferAttribute(indices,1));geometry.computeVertexNormals();geometry.computeBoundingSphere();
 const normals=geometry.getAttribute('normal'),colors=new Float32Array(positions.length);
 const sand=new THREE.Color('#afa083'),stone=new THREE.Color('#726b61'),scrub=new THREE.Color('#747960');
 const tmp=new THREE.Color();
 for(let i=0;i<positions.length/3;i++){
  const x=positions[i*3],y=positions[i*3+1],z=positions[i*3+2];
  const variation=(Math.sin(x*.009+Math.cos(z*.006))*Math.sin(z*.007)+1)*.5;
  const slope=1-normals.getY(i);
  tmp.copy(sand).lerp(stone,clamp(slope*2.6,0,.82)).lerp(scrub,variation*.36*clamp(y/35,0,1));
  tmp.multiplyScalar(.94+variation*.09);colors.set([tmp.r,tmp.g,tmp.b],i*3);
 }
 geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
 const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 vTerrainPosition;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvTerrainPosition=position;');
  shader.fragmentShader=`varying vec3 vTerrainPosition;
   float grain(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
   float terrainNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(grain(i),grain(i+vec2(1,0)),f.x),mix(grain(i+vec2(0,1)),grain(i+vec2(1,1)),f.x),f.y);}
  `+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float d=distance(cameraPosition,vTerrainPosition);
   float detail=(grain(floor(vTerrainPosition.xz*5.0))-.5)*.14+(terrainNoise(vTerrainPosition.xz*.8)-.5)*.19;
   float broad=terrainNoise(vTerrainPosition.xz*.04)*.45+terrainNoise(vTerrainPosition.xz*.14)*.17;
   diffuseColor.rgb*=.70+broad+detail*(1.0-smoothstep(20.0,300.0,d));`);
 };
 const land=new THREE.Mesh(geometry,material);land.name='actual-patmos-terrain';scene.add(land);
 const hemisphere=new THREE.HemisphereLight(0xdcecff,0x756b54,2.1);scene.add(hemisphere);
 const sunlight=new THREE.DirectionalLight(0xffedcb,3.2);scene.add(sunlight);
 const sky=new Sky();sky.scale.setScalar(150000);scene.add(sky);
 const sun=new THREE.Vector3();
 sky.material.uniforms.turbidity.value=3;sky.material.uniforms.rayleigh.value=2;
 sky.material.uniforms.mieCoefficient.value=.004;sky.material.uniforms.mieDirectionalG.value=.82;
 const normalData=new Uint8Array(128*128*4);
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  const i=(y*128+x)*4,px=x/128*Math.PI*2,py=y/128*Math.PI*2;
  const nx=(Math.cos(px*4+py*3+Math.sin(py*3))+.5*Math.cos(py*7+px*9)+.28*Math.cos(px*13-py*11))*.12;
  const ny=(Math.cos(py*5-px*2+Math.sin(px*2))+.5*Math.cos(px*6-py*8)+.28*Math.sin(px*11+py*13))*.12;
  const n=new THREE.Vector3(nx,ny,1).normalize();normalData.set([(n.x*.5+.5)*255,(n.y*.5+.5)*255,(n.z*.5+.5)*255,255],i);
 }
 const normalMap=new THREE.DataTexture(normalData,128,128);normalMap.wrapS=normalMap.wrapT=THREE.RepeatWrapping;normalMap.minFilter=THREE.LinearFilter;normalMap.magFilter=THREE.LinearFilter;normalMap.needsUpdate=true;
 const water=new Water(new THREE.PlaneGeometry(200000,200000),{textureWidth:mobile?256:512,textureHeight:mobile?256:512,waterNormals:normalMap,sunDirection:sun,waterColor:0x126275,sunColor:0xffe8c0,distortionScale:2.4,fog:true});
 water.material.fragmentShader=water.material.fragmentShader.replace('float rf0 = 0.3;','float rf0 = 0.02;');
 water.rotation.x=-Math.PI/2;water.position.y=-.04;water.material.uniforms.size.value=1.1;scene.add(water);
 const rainCount=mobile?350:750,rainArray=new Float32Array(rainCount*6);
 const rainGeometry=new THREE.BufferGeometry();rainGeometry.setAttribute('position',new THREE.BufferAttribute(rainArray,3));
 const rain=new THREE.LineSegments(rainGeometry,new THREE.LineBasicMaterial({color:0xcce6ec,transparent:true,opacity:.28,depthWrite:false}));rain.frustumCulled=false;rain.visible=false;scene.add(rain);
 const rainSeeds=Array.from({length:rainCount},()=>[Math.random()*80-40,Math.random()*60,Math.random()*80-40]);
 const state={mode:'fly',speed:80,hour:10,weather:'clear',yaw:Math.PI*.7,pitch:-.2,showMap:true,hidden:false};
 // Only an initial arrival position. No camera rails or authored viewing poses.
 const arrival=toWorld(26.558,37.3272);camera.position.set(arrival.x,240,arrival.z);$('time').value=String(state.hour);
 function setWeatherAndTime(){
  const angle=(state.hour-6)/12*Math.PI,latitude=meta.origin[1]*Math.PI/180;
  sun.set(Math.cos(angle),Math.sin(angle)*Math.cos(latitude),Math.sin(angle)*Math.sin(latitude)).normalize();
  sky.material.uniforms.sunPosition.value.copy(sun);water.material.uniforms.sunDirection.value.copy(sun);
  sunlight.position.copy(sun).multiplyScalar(10000);
  const cloudy=state.weather!=='clear',rainy=state.weather==='rain';
  const warmth=1-clamp(sun.y*3,0,1);
  sunlight.color.set(0xffefd2).lerp(new THREE.Color(0xff915d),warmth*.6);
  sunlight.intensity=(cloudy?.6:3.2)*clamp(sun.y*6,.1,1);
  hemisphere.intensity=cloudy?1.05:.8;
  sky.material.uniforms.turbidity.value=cloudy?18:3;
  sky.material.uniforms.rayleigh.value=cloudy?.35:2;
  sky.material.uniforms.mieCoefficient.value=cloudy?.07:.004;
  scene.fog.color.set(cloudy?0x9ba9ad:0xa9c3ca).lerp(new THREE.Color(0xcbad91),warmth*.4);
  scene.fog.density=rainy?.0005:cloudy?.00012:.000035;
  water.material.uniforms.distortionScale.value=rainy?4:2.4;
  water.material.uniforms.waterColor.value.set(cloudy?0x32535c:0x126275);
  rain.visible=rainy;material.roughness=rainy?.69:1;
  $('time-value').textContent=`${String(Math.floor(state.hour)).padStart(2,'0')}:${String(Math.round(state.hour%1*60)).padStart(2,'0')}`;
 }
 setWeatherAndTime();
 const held=new Set(),touchMove={x:0,y:0,up:0};let lastNotice=0;
 function setMode(mode){
  state.mode=mode;$('walk').setAttribute('aria-pressed',String(mode==='walk'));$('fly').setAttribute('aria-pressed',String(mode==='fly'));
  $('speed').disabled=mode==='walk';$('speed-value').textContent=mode==='walk'?'1.6 m/s':`${state.speed} m/s`;
  const ground=sample(camera.position.x,camera.position.z);
  if(mode==='walk')camera.position.y=(ground?.height||0)+(ground?1.7:.85);
  else camera.position.y=Math.max(camera.position.y,(ground?.height||0)+3);
  notice(mode==='walk'?'사람 눈높이로 걷습니다. F 키로 다시 비행합니다.':'자유 비행 · E 상승 / Q 하강 · Shift 빠르게');
 }
 function hideUI(hidden){state.hidden=hidden;document.body.classList.toggle('ui-hidden',hidden);$('restore-ui').hidden=!hidden;}
 function togglePanel(id){
  const panel=$(id),willOpen=panel.hidden;for(const p of ['help-panel','info-panel'])$(p).hidden=true;
  panel.hidden=!willOpen;$('help-toggle').setAttribute('aria-expanded',String(!$('help-panel').hidden));$('info-toggle').setAttribute('aria-expanded',String(!$('info-panel').hidden));
  if(document.pointerLockElement)document.exitPointerLock();
 }
 function toggleMap(){state.showMap=!state.showMap;$('map-panel').hidden=!state.showMap;$('map-toggle').setAttribute('aria-expanded',String(state.showMap));}
 $('walk').onclick=()=>setMode('walk');$('fly').onclick=()=>setMode('fly');$('hide-ui').onclick=()=>hideUI(true);$('restore-ui').onclick=()=>hideUI(false);
 $('map-toggle').onclick=toggleMap;$('help-toggle').onclick=()=>togglePanel('help-panel');$('info-toggle').onclick=()=>togglePanel('info-panel');
 for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>togglePanel(b.dataset.close);
 $('speed').oninput=e=>{state.speed=Number(e.target.value);$('speed-value').textContent=`${state.speed} m/s`;};
 $('time').oninput=e=>{state.hour=Number(e.target.value);setWeatherAndTime();};$('weather').onchange=e=>{state.weather=e.target.value;setWeatherAndTime();};
 const movementKeys=['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'];
 addEventListener('keydown',e=>{
  if(e.target.matches('input,select,textarea'))return;
  if(movementKeys.includes(e.code)){e.preventDefault();held.add(e.code);}
  if(e.repeat)return;
  if(e.code==='KeyF')setMode(state.mode==='walk'?'fly':'walk');if(e.code==='KeyM')toggleMap();if(e.code==='KeyH')hideUI(!state.hidden);
 });
 addEventListener('keyup',e=>held.delete(e.code));
 const release=()=>{held.clear();touchMove.x=touchMove.y=touchMove.up=0;};
 addEventListener('blur',release);document.addEventListener('visibilitychange',release);
 let drag=null;
 const look=(dx,dy)=>{state.yaw-=dx*.0023;state.pitch=clamp(state.pitch-dy*.0023,-1.5,1.5);};
 renderer.domElement.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:0,type:e.pointerType};renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener('pointermove',e=>{
  if(document.pointerLockElement===renderer.domElement){look(e.movementX,e.movementY);return;}
  if(!drag||drag.id!==e.pointerId)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved+=Math.abs(dx)+Math.abs(dy);drag.x=e.clientX;drag.y=e.clientY;look(dx,dy);
 });
 renderer.domElement.addEventListener('pointerup',e=>{
  if(drag?.moved<5&&drag.type==='mouse'&&!document.pointerLockElement){
   try{renderer.domElement.requestPointerLock()?.catch(()=>notice('마우스를 드래그해 둘러볼 수 있습니다.'));}catch{notice('마우스를 드래그해 둘러볼 수 있습니다.');}
  }drag=null;
 });
 renderer.domElement.addEventListener('pointercancel',()=>drag=null);
 renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
 document.addEventListener('pointerlockchange',()=>{$('crosshair').hidden=document.pointerLockElement!==renderer.domElement;release();});
 const stick=$('joystick');let stickId=null;
 function stickMove(e){if(e.pointerId!==stickId)return;const r=stick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,len=Math.hypot(dx,dy),s=len>25?25/len:1;touchMove.x=dx*s/25;touchMove.y=-dy*s/25;stick.firstElementChild.style.transform=`translate(${dx*s}px,${dy*s}px)`;}
 stick.onpointerdown=e=>{stickId=e.pointerId;stick.setPointerCapture(e.pointerId);stickMove(e);};stick.onpointermove=stickMove;
 const resetStick=()=>{stickId=null;touchMove.x=touchMove.y=0;stick.firstElementChild.style.transform='';};stick.onpointerup=resetStick;stick.onpointercancel=resetStick;
 for(const [id,value]of [['touch-up',1],['touch-down',-1]]){$(id).onpointerdown=e=>{e.target.setPointerCapture(e.pointerId);touchMove.up=value;};$(id).onpointerup=$(id).onpointercancel=()=>touchMove.up=0;}
 const map=$('map'),ctx=map.getContext('2d'),mapW=440,mapH=510,extent={minX:-6168.62745,maxX:6168.62745,minZ:-7200,maxZ:7100};
 const mx=x=>(x-extent.minX)/(extent.maxX-extent.minX)*mapW,mz=z=>(z-extent.minZ)/(extent.maxZ-extent.minZ)*mapH;
 const staticMap=document.createElement('canvas');staticMap.width=mapW;staticMap.height=mapH;const sm=staticMap.getContext('2d');
 sm.strokeStyle='#dfdcb020';sm.lineWidth=1;for(let x=-6000;x<6000;x+=2000){sm.beginPath();sm.moveTo(mx(x),0);sm.lineTo(mx(x),mapH);sm.stroke();}for(let z=-6000;z<7500;z+=2000){sm.beginPath();sm.moveTo(0,mz(z));sm.lineTo(mapW,mz(z));sm.stroke();}
 for(const island of meta.coastlines){sm.beginPath();island.ring.forEach(([x,z],i)=>i?sm.lineTo(mx(x),mz(z)):sm.moveTo(mx(x),mz(z)));sm.closePath();sm.fillStyle='#99a78b';sm.fill();sm.strokeStyle='#e4dec099';sm.lineWidth=1.4;sm.stroke();}
 sm.font='21px sans-serif';sm.textBaseline='middle';sm.fillStyle='#f3f0d7';
 for(const [name,lon,lat]of [['스칼라',26.5447,37.3238],['코라',26.5483,37.3086],['그리코스',26.5605,37.2989],['캄보스',26.569,37.3515]]){const p=toWorld(lon,lat);sm.fillRect(mx(p.x)-2,mz(p.z)-2,4,4);sm.fillText(name,mx(p.x)+9,mz(p.z)-9);}
 function drawMap(){ctx.clearRect(0,0,mapW,mapH);ctx.drawImage(staticMap,0,0);ctx.save();ctx.translate(mx(camera.position.x),mz(camera.position.z));ctx.rotate(-state.yaw);ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(9,10);ctx.lineTo(0,6);ctx.lineTo(-9,10);ctx.closePath();ctx.fillStyle='#fff9cf';ctx.shadowColor='#072d36';ctx.shadowBlur=5;ctx.fill();ctx.restore();document.querySelector('.map-scale span').style.width=(map.clientWidth*2000/(extent.maxX-extent.minX))+'px';}
 function navigateTo(lon,lat){
  if(!Number.isFinite(lon)||!Number.isFinite(lat)||lon<26.51||lon>26.633||lat<37.26||lat>37.39)throw Error('밧모섬 지도 범위의 좌표를 입력해 주세요.');
  const p=toWorld(lon,lat),g=sample(p.x,p.z);camera.position.set(p.x,state.mode==='walk'?(g?.height||0)+(g?1.7:.85):(g?.height||0)+160,p.z);updateTelemetry();drawMap();
  return {longitude:lon,latitude:lat,altitude:camera.position.y,mode:state.mode};
 }
 map.onclick=e=>{const r=map.getBoundingClientRect();const x=extent.minX+(e.clientX-r.left)/r.width*(extent.maxX-extent.minX),z=extent.minZ+(e.clientY-r.top)/r.height*(extent.maxZ-extent.minZ);const g=toGeo(x,z);try{navigateTo(g.lon,g.lat);notice('선택한 위치로 이동했습니다.');}catch(error){notice(error.message);}};
 let tick=0,previous=performance.now(),elapsed=0;
 function updateTelemetry(){
  const geo=toGeo(camera.position.x,camera.position.z);$('coordinates').textContent=`${geo.lat.toFixed(5)}° N · ${geo.lon.toFixed(5)}° E`;
  const ground=sample(camera.position.x,camera.position.z);$('altitude').textContent=state.mode==='walk'&&!ground?'수면 이동':`해발 ${Math.round(camera.position.y)} m`;
  let nearest=null,dist=Infinity;for(const p of meta.places){const d=Math.hypot(p.x-camera.position.x,p.z-camera.position.z);if(d<dist){nearest=p;dist=d;}}
  $('location-name').textContent=dist<800?`${nearest.name} 부근`:ground?'밧모의 능선과 만':'에게해';
  const heading=((THREE.MathUtils.radToDeg(-state.yaw)%360)+360)%360;const names=['북','북동','동','남동','남','남서','서','북서'];$('heading').textContent=`${names[Math.round(heading/45)%8]} ${Math.round(heading)}°`;
 }
 const forward=new THREE.Vector3(),right=new THREE.Vector3(),move=new THREE.Vector3();
 function frame(now){
  const dt=Math.min((now-previous)/1000,.05);previous=now;elapsed+=dt;
  camera.rotation.set(state.pitch,state.yaw,0,'YXZ');
  const active=key=>held.has(key)?1:0;
  const f=active('KeyW')+active('ArrowUp')-active('KeyS')-active('ArrowDown')+touchMove.y;
  const r=active('KeyD')+active('ArrowRight')-active('KeyA')-active('ArrowLeft')+touchMove.x;
  const up=active('KeyE')-active('KeyQ')+touchMove.up;
  const fast=held.has('ShiftLeft')||held.has('ShiftRight');
  forward.set(-Math.sin(state.yaw),0,-Math.cos(state.yaw));right.set(Math.cos(state.yaw),0,-Math.sin(state.yaw));
  move.copy(forward).multiplyScalar(f).addScaledVector(right,r);if(move.length()>1)move.normalize();
  const speed=state.mode==='fly'?state.speed*(fast?3:1):(fast?4.2:1.6);
  const distance=speed*dt,steps=Math.max(1,Math.ceil(distance/2));
  for(let j=0;j<steps;j++){
   const nx=camera.position.x+move.x*distance/steps,nz=camera.position.z+move.z*distance/steps;
   const ground=sample(nx,nz),current=sample(camera.position.x,camera.position.z);
   if(state.mode==='walk'&&ground&&ground.normalY<.60&&ground.height>(current?.height||0)+.05){
    if((f||r)&&now-lastNotice>5000){notice('가파른 경사입니다. F 키로 비행해 살펴보세요.');lastNotice=now;}break;
   }
   camera.position.x=nx;camera.position.z=nz;
   if(state.mode==='walk')camera.position.y=(ground?.height||0)+(ground?1.7:.85);
  }
  if(state.mode==='fly'){
   camera.position.y+=up*distance;camera.position.y=clamp(camera.position.y,Math.max(2,(sample(camera.position.x,camera.position.z)?.height||0)+2),12000);
  }
  // Limits enclose all supplied land; beyond these is unmodelled open sea.
  camera.position.x=clamp(camera.position.x,-9000,9000);camera.position.z=clamp(camera.position.z,-11000,11000);
  water.material.uniforms.time.value+=dt*(state.weather==='rain'?1.3:.7);
  if(rain.visible){rain.position.copy(camera.position);for(let i=0;i<rainCount;i++){const seed=rainSeeds[i],y=((seed[1]-elapsed*24)%60+60)%60-15,x=seed[0]+Math.sin(elapsed*.5)*2;rainArray.set([x,y,seed[2],x-.17,y+1.5,seed[2]+.05],i*6);}rainGeometry.attributes.position.needsUpdate=true;}
  if(tick++%8===0){updateTelemetry();if(state.showMap&&!state.hidden)drawMap();}
  renderer.render(scene,camera);requestAnimationFrame(frame);
 }
 addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();release();notice('그래픽 연결이 중단되었습니다. 페이지를 새로 열어 주세요.');});
 updateTelemetry();drawMap();renderer.render(scene,camera);$('loading').classList.add('loaded');$('world').dataset.ready='true';
 setTimeout(()=>$('loading').hidden=true,600);notice('화면을 누르고 WASD로 이동하세요. 조작법에서 키를 확인할 수 있습니다.');requestAnimationFrame(frame);
 if(document.modelContext?.registerTool){
  const life=new AbortController();
  const tool={name:'navigate_patmos_coordinate',title:'밧모섬의 좌표로 이동',description:'지도 클릭과 같이 밧모섬 안의 지정 위경도로 이동합니다. 시선 방향은 그대로 유지합니다.',inputSchema:{type:'object',properties:{longitude:{type:'number',minimum:26.51,maximum:26.633},latitude:{type:'number',minimum:37.26,maximum:37.39}},required:['longitude','latitude'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||Object.keys(input).some(k=>!['longitude','latitude'].includes(k)))throw Error('좌표 형식이 올바르지 않습니다.');return navigateTo(input.longitude,input.latitude);}};
  try{Promise.resolve(document.modelContext.registerTool(tool,{signal:life.signal})).catch(()=>{});}catch{}
  addEventListener('pagehide',()=>life.abort(),{once:true});
 }
}
