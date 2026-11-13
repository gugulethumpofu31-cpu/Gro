import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const mountCanopy = () => {
  const sceneHost = document.querySelector('.biome-career .career-3d-world');
  if (!sceneHost) { if (window.GROCanopyCleanup) window.GROCanopyCleanup(); return; }
  if (sceneHost.dataset.mounted || !window.WebGLRenderingContext) return;
  sceneHost.dataset.mounted = 'true';
  if (window.GROCanopyCleanup) window.GROCanopyCleanup();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#c4d0b0');
  scene.fog = new THREE.Fog('#c4d0b0', 19, 40);

  const camera = new THREE.OrthographicCamera(-10, 10, 7.2, -7.2, 0.1, 100);
  camera.position.set(12, 13, 14);
  camera.lookAt(0, 1.4, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.setAttribute('aria-label', 'Interactive three-dimensional Canopy garden. Drag to orbit and use the view controls to turn the scene.');
  sceneHost.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.4, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.065;
  controls.enablePan = false;
  controls.minZoom = 0.72;
  controls.maxZoom = 1.65;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.43;
  controls.rotateSpeed = 0.55;

  const mat = (colour, roughness = 0.88, extra = {}) => new THREE.MeshStandardMaterial({ color: colour, roughness, ...extra });
  const earth = mat('#76523a');
  const soil = mat('#4b382d');
  const grass = mat('#66834c');
  const grassLight = mat('#8da968');
  const bark = mat('#69452f');
  const barkLight = mat('#a4774d');
  const leafDark = mat('#315d3e');
  const leafMid = mat('#527d49');
  const leafLight = mat('#91aa60');
  const gold = mat('#d7b477', 0.52, { metalness: 0.12 });
  const timber = mat('#98653f');
  const timberLight = mat('#c4935d');
  const roofMat = mat('#60402f');
  const stone = mat('#b7aa86');
  const waterMat = new THREE.MeshStandardMaterial({ color: '#70b6ae', roughness: 0.22, metalness: 0.08, transparent: true, opacity: 0.9 });
  const flowerPink = mat('#d88bb6');
  const flowerCream = mat('#f0d59a');
  // Hand-painted procedural surface maps keep the geometry from feeling plastic.
  function canvasTexture(draw, repeatX=1, repeatY=1) {
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
    const ctx=canvas.getContext('2d');draw(ctx,canvas.width,canvas.height);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(repeatX,repeatY);
    texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return texture;
  }
  const barkTexture=canvasTexture((ctx,w,h)=>{
    const g=ctx.createLinearGradient(0,0,w,0);g.addColorStop(0,'#543724');g.addColorStop(.28,'#916541');g.addColorStop(.55,'#69452f');g.addColorStop(.82,'#a2764d');g.addColorStop(1,'#4d3528');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(let i=0;i<72;i++){const x=(i*47)%w;ctx.strokeStyle=i%3?'#2e211b55':'#e0b17a55';ctx.lineWidth=1+(i%3);ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x-12,70,x+14,170,x+(i%2?5:-8),h);ctx.stroke();}
    for(let i=0;i<9;i++){const x=(i*83)%w,y=(i*59)%h;ctx.strokeStyle='#3e291f77';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,5+(i%3)*2,12+(i%4)*3,.2,0,Math.PI*2);ctx.stroke();}
  },1,2);
  bark.map=barkTexture;bark.bumpMap=barkTexture;bark.bumpScale=.09;barkLight.map=barkTexture;barkLight.bumpMap=barkTexture;barkLight.bumpScale=.055;
  const groundTexture=canvasTexture((ctx,w,h)=>{
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#8b9d5d');g.addColorStop(.45,'#789451');g.addColorStop(1,'#a8ad70');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(let i=0;i<1050;i++){const x=(i*73)%w,y=(i*137)%h;ctx.fillStyle=i%4===0?'#d0c98755':i%3===0?'#345c3c55':'#e0d49a33';ctx.beginPath();ctx.ellipse(x,y,1+(i%3),2+(i%5),((i%7)-3)*.18,0,Math.PI*2);ctx.fill();}
    for(let i=0;i<110;i++){const x=(i*97)%w,y=(i*53)%h;ctx.strokeStyle=i%2?'#365d3d88':'#d4d18a88';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x,y+5);ctx.quadraticCurveTo(x-3,y,x+((i%5)-2)*2,y-5);ctx.stroke();}
  },3,3);
  grass.map=groundTexture;grass.bumpMap=groundTexture;grass.bumpScale=.045;

  const woodTexture=canvasTexture((ctx,w,h)=>{
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#d3a36c');g.addColorStop(.5,'#95613d');g.addColorStop(1,'#6b432e');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(let i=0;i<36;i++){const y=i*7;ctx.strokeStyle=i%2?'#e6bd8055':'#422b2055';ctx.lineWidth=1+(i%3);ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(80,y-5,150,y+7,w,y-2);ctx.stroke();}
  },2,1);
  timber.map=woodTexture;timber.bumpMap=woodTexture;timber.bumpScale=.035;timberLight.map=woodTexture;timberLight.bumpMap=woodTexture;timberLight.bumpScale=.025;


  scene.add(new THREE.HemisphereLight('#fff1d3', '#496b43', 2.35));
  const sun = new THREE.DirectionalLight('#ffe5b7', 2.65);
  sun.position.set(-8, 14, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -14; sun.shadow.camera.right = 14;
  sun.shadow.camera.top = 14; sun.shadow.camera.bottom = -14;
  sun.shadow.bias = -0.0002;
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#b8d7d0', 1.1);
  fill.position.set(8, 8, -8);
  scene.add(fill);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), mat('#647d58'));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.78;
  ground.receiveShadow = true;
  scene.add(ground);

  function add(mesh, parent = scene) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function box(parent, x, y, z, sx, sy, sz, material, rz = 0) {
    const m = add(new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material), parent);
    m.position.set(x, y, z); m.rotation.z = rz; return m;
  }
  function sphere(parent, x, y, z, sx, sy, sz, material) {
    const m = add(new THREE.Mesh(new THREE.SphereGeometry(1, 18, 14), material), parent);
    m.position.set(x, y, z); m.scale.set(sx, sy, sz); return m;
  }
  function cylinder(parent, x, y, z, rt, rb, h, material, radial = 9) {
    const m = add(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, radial), material), parent);
    m.position.set(x, y, z); return m;
  }

  // Raised, bevelled island with a living turf surface.
  const islandShape = new THREE.Shape();
  islandShape.moveTo(-7.5, -3.4);
  islandShape.quadraticCurveTo(-8.4, -1.8, -7.1, 0.1);
  islandShape.quadraticCurveTo(-6.7, 3.7, -3.4, 4.1);
  islandShape.quadraticCurveTo(0, 5.1, 3.2, 4.0);
  islandShape.quadraticCurveTo(7.4, 3.5, 7.5, 0.6);
  islandShape.quadraticCurveTo(8.2, -2.1, 5.9, -3.8);
  islandShape.quadraticCurveTo(2.4, -5.0, -1.2, -4.3);
  islandShape.quadraticCurveTo(-5.4, -4.7, -7.5, -3.4);
  const island = new THREE.Mesh(new THREE.ExtrudeGeometry(islandShape, { depth: 0.82, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.16, bevelThickness: 0.18, curveSegments: 12 }), [grass, earth]);
  island.rotation.x = -Math.PI / 2;
  island.position.y = -0.45;
  add(island);
  const turf = new THREE.Mesh(new THREE.ShapeGeometry(islandShape, 16), grass);
  turf.rotation.x = -Math.PI / 2;
  turf.position.y = 0.39;
  add(turf);

  // Stream: an independently modelled winding watercourse with raised banks.
  const streamPoints = [
    new THREE.Vector3(-7.2, 0.03, -2.5), new THREE.Vector3(-5.2, 0.03, -1.65),
    new THREE.Vector3(-3.0, 0.03, -1.9), new THREE.Vector3(-0.9, 0.03, -1.25),
    new THREE.Vector3(1.5, 0.03, -1.6), new THREE.Vector3(3.8, 0.03, -0.8),
    new THREE.Vector3(6.9, 0.03, 1.6)
  ];
  const streamCurve = new THREE.CatmullRomCurve3(streamPoints);
  const stream = add(new THREE.Mesh(new THREE.TubeGeometry(streamCurve, 90, 0.43, 12, false), waterMat));
  stream.castShadow = false;
  const bank = add(new THREE.Mesh(new THREE.TubeGeometry(streamCurve, 90, 0.58, 10, false), mat('#8b7657')));
  bank.position.y = -0.055;
  bank.material = bank.material.clone(); bank.material.color.set('#8b7657');
  bank.renderOrder = 1;
  stream.renderOrder = 2;

  // Stone stepping pads along the banks.
  for (let i = 0; i < 11; i++) {
    const t = 0.12 + i * 0.074;
    const p = streamCurve.getPoint(t);
    const s = add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.18 + (i % 3) * 0.035, 0), stone));
    s.position.set(p.x + (i % 2 ? 0.65 : -0.62), 0.04, p.z + 0.35);
    s.scale.y = 0.42;
  }

  // Arched bridge, deck boards, curved rails and individual balusters.
  const bridge = new THREE.Group(); scene.add(bridge);
  const bridgeDeck = box(bridge, 0.15, 0.43, -1.35, 2.45, 0.18, 1.05, timber);
  bridgeDeck.rotation.y = -0.16;
  for (let i = 0; i < 9; i++) box(bridge, -0.95 + i * 0.27, 0.535, -1.35, 0.035, 0.018, 1.02, timberLight);
  const railCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-1.15,0.5,-1.82),new THREE.Vector3(0.1,1.05,-1.82),new THREE.Vector3(1.35,0.5,-1.82));
  for (const z of [-1.82, -0.88]) {
    const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-1.15,0.48,z),new THREE.Vector3(0.1,1.02,z),new THREE.Vector3(1.35,0.48,z));
    add(new THREE.Mesh(new THREE.TubeGeometry(c, 24, 0.065, 8, false), timberLight), bridge);
    for (let i=0;i<7;i++) {
      const x=-1.05+i*0.39, y=0.5+0.48*(1-Math.pow((x-0.1)/1.25,2));
      cylinder(bridge,x,y-0.12,z,0.035,0.045,0.35,timber,7);
    }
  }

  // Pavilion: platform, posts, braces, open arch and a four-sided timber roof.
  const pavilion = new THREE.Group();
  pavilion.position.set(0.5, 0.42, 1.05);
  scene.add(pavilion);
  box(pavilion,0,0.08,0,4.1,0.22,3.0,soil);
  box(pavilion,0,0.22,0,3.92,0.12,2.82,timberLight);
  for (let i=0;i<8;i++) box(pavilion,-1.65+i*0.47,0.295,0,0.035,0.025,2.76,gold);
  const postPositions=[[-1.65,-1.05],[1.65,-1.05],[-1.65,1.05],[1.65,1.05]];
  for (const [x,z] of postPositions) {
    box(pavilion,x,1.38,z,0.19,2.18,0.19,timber);
    box(pavilion,x,2.32,z,0.27,0.12,0.27,gold);
    const brace=box(pavilion,x*0.82,2.12,z,0.68,0.11,0.11,timberLight, x<0?-0.65:0.65);
    brace.rotation.y = z<0?0.7:-0.7;
  }
  // Back wall and warm inner wall panels, leaving the front open.
  box(pavilion,0,1.28,-1.03,3.18,1.75,0.13,mat('#36563e'));
  box(pavilion,0,1.02,-0.94,1.05,1.18,0.06,mat('#c5a16e'));
  box(pavilion,0,1.0,-0.89,0.72,0.98,0.04,mat('#7eaa94'));
  // Roof fascia and layered pitched planes.
  const roofGroup = new THREE.Group(); pavilion.add(roofGroup);
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-2.45,0); roofShape.lineTo(0,1.5); roofShape.lineTo(2.45,0); roofShape.lineTo(2.2,-0.22); roofShape.lineTo(0,1.12); roofShape.lineTo(-2.2,-0.22); roofShape.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(roofShape,{depth:2.65,bevelEnabled:true,bevelThickness:0.07,bevelSize:0.05,bevelSegments:2});
  const roof = add(new THREE.Mesh(roofGeo,roofMat),roofGroup);
  roof.rotation.x = 0; roof.position.set(0,2.45,-1.32);
  roofGroup.scale.set(0.88,0.88,0.9);
  // Shingle ribs give the roof its hand-built texture.
  for(let i=0;i<11;i++){
    const x=-2.0+i*0.4;
    const ridge=box(roofGroup,x,3.05,-0.02,0.035,0.035,2.55,timberLight);
    ridge.rotation.z = x<0?-0.54:0.54;
  }
  cylinder(pavilion,0,4.05,0,0.075,0.12,0.45,gold,8);


  // Ancient mother-tree and elevated treehouse architecture.
  const motherTree=new THREE.Group();motherTree.position.set(-3.35,0,-.15);scene.add(motherTree);
  const heartwood=mat('#563722'),barkRidge=mat('#91613d');
  cylinder(motherTree,0,3.55,0,1.02,1.28,7.1,heartwood,24);
  for(let i=0;i<10;i++){
    const a=i*Math.PI/5;
    const rootCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(Math.cos(a)*.3,.55,Math.sin(a)*.3),new THREE.Vector3(Math.cos(a)*1.05,.22,Math.sin(a)*1.05),new THREE.Vector3(Math.cos(a)*1.6,.08,Math.sin(a)*1.6)]);
    add(new THREE.Mesh(new THREE.TubeGeometry(rootCurve,18,.16,8,false),barkRidge),motherTree);
    const branchCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,4.6,0),new THREE.Vector3(Math.cos(a)*.8,5.3,Math.sin(a)*.8),new THREE.Vector3(Math.cos(a)*2.1,6.1,Math.sin(a)*2.1),new THREE.Vector3(Math.cos(a)*3.1,6.6,Math.sin(a)*3.1)]);
    add(new THREE.Mesh(new THREE.TubeGeometry(branchCurve,28,.22,10,false),barkRidge),motherTree);
  }
  // Wraparound timber terrace, individually laid boards and carved balustrade.
  const terrace=new THREE.Group();terrace.position.set(.15,2.02,.9);scene.add(terrace);
  const terraceShape=new THREE.Shape();terraceShape.moveTo(-4.5,-1.7);terraceShape.quadraticCurveTo(-4.8,.4,-2.8,1.9);terraceShape.quadraticCurveTo(0,3.0,3.5,1.8);terraceShape.quadraticCurveTo(4.6,.1,4,-1.8);terraceShape.quadraticCurveTo(0,-2.65,-4.5,-1.7);
  const terraceBase=add(new THREE.Mesh(new THREE.ExtrudeGeometry(terraceShape,{depth:.2,bevelEnabled:true,bevelThickness:.12,bevelSize:.1,bevelSegments:3}),timber),terrace);terraceBase.rotation.x=-Math.PI/2;terraceBase.position.y=.08;
  for(let i=0;i<36;i++)box(terrace,-4.15+i*.235,.31,-.45,.19,.045,2.9,i%4===0?timber:timberLight);
  const balustrade=new THREE.CatmullRomCurve3([new THREE.Vector3(-4,.76,-.8),new THREE.Vector3(-3.8,.82,1.35),new THREE.Vector3(-1.8,.85,2.05),new THREE.Vector3(.8,.85,2.1),new THREE.Vector3(3.2,.82,1.45),new THREE.Vector3(4,.72,-.6)]);
  add(new THREE.Mesh(new THREE.TubeGeometry(balustrade,70,.07,9,false),timberLight),terrace);
  for(let i=0;i<28;i++){const p=balustrade.getPoint(i/27);cylinder(terrace,p.x,.49,p.z,.04,.05,.48,timberLight,8);sphere(terrace,p.x,.77,p.z,.07,.06,.07,gold);}
  // Broad timber staircase rises to the terrace.
  const stairs=new THREE.Group();scene.add(stairs);
  for(let i=0;i<14;i++){const t=i/13,x=-2.75-t*.45,y=.24+t*1.85,z=3.4-t*3.35;box(stairs,x,y,z,1.5,.13,.39,timber);box(stairs,x,y+.075,z-.03,1.42,.03,.32,timberLight);}
  // A book-lined study and planning table make the pavilion a working sanctuary.
  const bookcase=new THREE.Group();bookcase.position.set(-1.0,2.43,-.55);scene.add(bookcase);
  box(bookcase,0,1.05,0,2.0,2.2,.16,heartwood);
  for(let row=0;row<4;row++){box(bookcase,0,.35+row*.52,.12,1.95,.07,.32,timberLight);for(let b=0;b<12;b++){const bh=.24+(b%3)*.07;box(bookcase,-.86+b*.155,.4+row*.52+bh/2,.2,.105,bh,.1,['#853d37','#c28c47','#355f4d','#655080'][b%4]);}}
  const writingDesk=new THREE.Group();writingDesk.position.set(1.0,2.42,-.2);scene.add(writingDesk);
  box(writingDesk,0,.76,0,1.8,.15,.78,timber);for(const x of [-.76,.76])for(const z of [-.28,.28])box(writingDesk,x,.36,z,.1,.72,.1,timber);
  box(writingDesk,0,.86,-.15,1.0,.025,.5,mat('#c59a60'));
  cylinder(writingDesk,.63,1.05,.12,.15,.15,.28,gold,16);sphere(writingDesk,.63,1.22,.12,.16,.16,.16,mat('#55947e'));
  // Conversation lounge: cushions around a carved circular table.
  const lounge=new THREE.Group();lounge.position.set(.1,2.42,2.0);scene.add(lounge);
  cylinder(lounge,0,.38,0,.68,.72,.22,timber,24);cylinder(lounge,0,.51,0,.6,.6,.05,gold,24);
  for(let i=0;i<10;i++){const a=i*Math.PI/5,seat=box(lounge,Math.cos(a)*1.15,.46,Math.sin(a)*.78,.78,.3,.48,i%2?mat('#9b5147'):mat('#bd8956'));seat.rotation.y=-a;}
  // Suspended rope bridge, waterfall ribbons and lanterns beyond the terrace.
  const suspension=new THREE.Group();scene.add(suspension);
  for(let i=0;i<18;i++){const t=i/17,x=3.1+t*4.1,z=1.25-t*.7,y=2.25+Math.sin(t*Math.PI)*.2;box(suspension,x,y,z,.28,.09,.82,timberLight);}
  for(const side of [-1,1]){const cable=new THREE.CatmullRomCurve3([new THREE.Vector3(3,3.15,1.25+side*.5),new THREE.Vector3(4.8,2.8,.9+side*.5),new THREE.Vector3(7.25,3.05,.55+side*.5)]);add(new THREE.Mesh(new THREE.TubeGeometry(cable,32,.025,6,false),gold),suspension);}
  const waterfallMat=new THREE.MeshStandardMaterial({color:'#9ce0df',transparent:true,opacity:.68,roughness:.2,side:THREE.DoubleSide,emissive:'#2d8d91',emissiveIntensity:.2});
  for(let i=0;i<3;i++){const shape=new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(-.15,-.8,.18,-1.3,0,-2.5);shape.lineTo(.42,-2.5);shape.bezierCurveTo(.25,-1.3,.58,-.7,.42,0);shape.closePath();const fall=add(new THREE.Mesh(new THREE.ShapeGeometry(shape,20),waterfallMat));fall.position.set(7.6+i*.4,4.2,1.8+i*.35);}
  for(const [x,z] of [[-3.1,-1.1],[2.8,-1.0],[-2.7,1.9],[2.8,1.6]]){cylinder(scene,x,5.65,z,.018,.018,.48,gold,6);sphere(scene,x,5.35,z,.15,.22,.15,mat('#ffe5a2',.3,{emissive:'#efa53f',emissiveIntensity:1.3}));}

  // Mature canopy trees: sculpted trunks, branching limbs and individually shaped leaves.
  const canopyLeafShape = new THREE.Shape();
  canopyLeafShape.moveTo(0,0);
  canopyLeafShape.bezierCurveTo(-0.13,0.16,-0.18,0.42,0,0.68);
  canopyLeafShape.bezierCurveTo(0.18,0.42,0.13,0.16,0,0);
  const canopyLeafGeometry = new THREE.ShapeGeometry(canopyLeafShape,5);
  const leafTexture=canvasTexture((ctx,w,h)=>{
    const g=ctx.createLinearGradient(0,h,0,0);g.addColorStop(0,'#244b34');g.addColorStop(.48,'#6f9858');g.addColorStop(1,'#c4c77d');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(w/2,h-4);ctx.bezierCurveTo(7,h*.58,12,h*.2,w/2,4);ctx.bezierCurveTo(w-12,h*.2,w-7,h*.58,w/2,h-4);ctx.fill();
    ctx.strokeStyle='#e0d99a99';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w/2,h-8);ctx.lineTo(w/2,8);ctx.stroke();
    for(let i=1;i<7;i++){const y=h-i*h/8;ctx.beginPath();ctx.moveTo(w/2,y);ctx.quadraticCurveTo(w*.27,y-13,w*.16,y-26);ctx.moveTo(w/2,y);ctx.quadraticCurveTo(w*.73,y-13,w*.84,y-26);ctx.stroke();}
    for(let i=0;i<34;i++){ctx.fillStyle=i%2?'#fff1bd55':'#193e2b55';ctx.beginPath();ctx.arc((i*37)%w,(i*61)%h,1+(i%3),0,Math.PI*2);ctx.fill();}
  });
  const canopyLeafMaterials = ['#547b43','#71964d','#87a95b','#a0b56b','#c0c27b'].map((c,i)=>new THREE.MeshStandardMaterial({color:c,map:leafTexture,roughness:0.94,side:THREE.DoubleSide,emissive:new THREE.Color(i%2?'#253d1b':'#314522'),emissiveIntensity:.12}));
  function makeTree(x,z,scale=1,kind=0) {
    const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);
    cylinder(g,0,1.42,0,0.17,0.31,2.84,bark,11);
    // Visible roots and tapered limbs create a branching silhouette.
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5+kind*.38;
      const root=box(g,Math.cos(a)*.23,.18,Math.sin(a)*.23,.13,.42,.42,bark);
      root.rotation.y=a;root.rotation.z=Math.cos(a)*.3;
    }
    for(let i=0;i<5;i++){
      const a=i*2.4+kind*.7;
      const start=new THREE.Vector3(Math.cos(a)*.04,2.05,Math.sin(a)*.04);
      const end=new THREE.Vector3(Math.cos(a)*(.72+(i%2)*.18),3.35+(i%3)*.18,Math.sin(a)*(.72+(i%2)*.18));
      const mid=start.clone().lerp(end,.58);mid.y+=.18;
      const curve=new THREE.QuadraticBezierCurve3(start,mid,end);
      add(new THREE.Mesh(new THREE.TubeGeometry(curve,12,.055,7,false),barkLight),g);
    }

    // Broad, layered botanical crowns. Avoid needle-like leaf planes and hard spherical clumps.
    const crownPalette=['#496d43','#587b49','#668650','#789457','#8a9d61','#9eaa6d'].map(c=>
      new THREE.MeshStandardMaterial({color:c,roughness:1,flatShading:true})
    );
    const lobes=[
      [-.48,3.08,-.10,.72,.48,.63],[-.18,3.38,.38,.72,.46,.62],
      [.38,3.18,.34,.78,.5,.66],[.52,3.02,-.28,.70,.47,.63],
      [.08,3.48,-.42,.73,.48,.64],[-.42,3.42,-.42,.62,.43,.58],
      [.02,3.03,.02,.78,.49,.7]
    ];
    lobes.forEach((v,i)=>{
      const crownLobe=new THREE.Mesh(new THREE.IcosahedronGeometry(1,2),crownPalette[(i+kind)%crownPalette.length]);
      crownLobe.position.set(v[0],v[1],v[2]);crownLobe.scale.set(v[3],v[4],v[5]);
      crownLobe.rotation.set(i*.13,i*.61,i*.09);crownLobe.castShadow=true;crownLobe.receiveShadow=true;g.add(crownLobe);
    });
    // Individual rounded leaves sit in overlapping sprays along the crown edge.
    const leafletGeo=new THREE.SphereGeometry(1,10,7);
    const leafletMats=['#63834c','#789653','#8da260','#a2ad70'].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1,flatShading:true}));
    for(let i=0;i<76;i++){
      const a=i*2.39996+kind*.47;
      const ring=.55+((i*13)%19)/42;
      const y=2.92+((i*17)%23)/22;
      const leaflet=new THREE.Mesh(leafletGeo,leafletMats[i%leafletMats.length]);
      leaflet.position.set(Math.cos(a)*ring,y,Math.sin(a)*ring);
      leaflet.scale.set(.19+((i*7)%5)*.018,.065,.115+((i*11)%4)*.018);
      leaflet.rotation.set(.18*Math.sin(a),a,.22*Math.cos(a));
      leaflet.castShadow=false;leaflet.receiveShadow=false;g.add(leaflet);
    }
    return g;
  }
  makeTree(-6.0,1.8,0.88,0);
  makeTree(6.0,1.8,0.92,1);
  makeTree(-5.7,-2.4,0.62,2);
  makeTree(5.7,-2.45,0.66,1);
  makeTree(-4.1,3.15,0.48,0);
  makeTree(4.2,3.15,0.5,2);

  // Cascades of wisteria: climbing stems, hanging racemes and delicate paired leaves.
  const wisteriaStem = mat('#456b43');
  const wisteriaLeaf = mat('#668b52');
  const wisteriaBloomA = mat('#a98acb',0.72);
  const wisteriaBloomB = mat('#c4a5dc',0.72);
  const wisteriaBloomC = mat('#e1c4e9',0.72);
  function addWisteriaCascade(parent, x, y, z, length=1.7, seed=0) {
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x,y,z), new THREE.Vector3(x+0.12,y-0.22,z+0.04),
      new THREE.Vector3(x-0.05,y-length*0.55,z+0.09), new THREE.Vector3(x+0.08,y-length,z+0.12)
    ]);
    add(new THREE.Mesh(new THREE.TubeGeometry(stemCurve,18,0.025,6,false),wisteriaStem),parent);
    for(let i=0;i<5;i++){
      const t=0.14+i*0.15,p=stemCurve.getPoint(t);
      const leaf=sphere(parent,p.x+(i%2?0.16:-0.16),p.y+0.06,p.z+0.03,0.13,0.055,0.085,wisteriaLeaf);
      leaf.rotation.z=(i%2?-.55:.55);
    }
    for(let i=0;i<8;i++){
      const t=i/7,p=stemCurve.getPoint(0.25+t*0.72),spread=0.12+Math.sin(t*Math.PI)*0.16;
      const bloomMat=[wisteriaBloomA,wisteriaBloomB,wisteriaBloomC][(i+seed)%3];
      for(let j=0;j<3;j++){
        const a=j*Math.PI*2/3+(seed*0.7);
        const petal=sphere(parent,p.x+Math.cos(a)*spread*0.42,p.y-t*0.08,p.z+Math.sin(a)*spread*0.42,0.075,0.105,0.07,bloomMat);
        petal.rotation.z=-0.22;
      }
    }
    sphere(parent,x+0.08,y-length,z+0.12,0.07,0.09,0.07,wisteriaBloomC);
  }
  // Wisteria drapes from the pavilion eaves and selected mature branches.
  for(const x of [-1.75,-0.9,0.15,1.25,1.85]) addWisteriaCascade(pavilion,x,2.48,1.34,1.05+(Math.abs(x)%0.4),Math.round((x+2)*3));
  for(const [x,z,scale] of [[-5.95,1.8,0.9],[5.95,1.75,0.82],[-4.0,3.0,0.55]]){
    const vineGroup=new THREE.Group();vineGroup.position.set(x,0,z);vineGroup.scale.setScalar(scale);scene.add(vineGroup);
    for(let i=0;i<3;i++) addWisteriaCascade(vineGroup,-0.3+i*0.3,3.15-(i%2)*0.15,0.1,1.45+(i%3)*0.25,i+2);
  }

  // Layered leaf silhouettes and clustered understory give the forest a painterly edge.
  const leafPalette=['#355b3d','#456f48','#5b8151','#78945c','#a3aa67'].map(c=>mat(c,0.96,{side:THREE.DoubleSide}));
  const leafShape=new THREE.Shape();
  leafShape.moveTo(0,0);leafShape.bezierCurveTo(-0.16,0.18,-0.2,0.42,0,0.72);
  leafShape.bezierCurveTo(0.2,0.42,0.16,0.18,0,0);
  const leafGeo=new THREE.ShapeGeometry(leafShape,5);
  const leafMeshes=[];
  function botanicalLeaf(parent,x,y,z,scale,rotation,material){
    const mesh=add(new THREE.Mesh(leafGeo,material),parent);
    mesh.position.set(x,y,z);mesh.scale.setScalar(scale);
    mesh.rotation.set(rotation[0],rotation[1],rotation[2]);
    leafMeshes.push(mesh);return mesh;
  }
  // Tree crowns are built within each tree group to preserve natural proportions and depth.
  // Low, varied ground-cover beds, rather than a uniformly empty grass slab.
  for(let i=0;i<210;i++){
    const a=i*2.399963,r=1.7+Math.sqrt(i/210)*5.4;
    const x=Math.cos(a)*r,z=Math.sin(a)*r*.67;
    if(Math.abs(x)<2.8&&z>-.1&&z<2.8)continue;
    const height=.12+(i%7)*.035;
    botanicalLeaf(scene,x,.39,z,.25+(i%5)*.08,[Math.PI*.12,Math.sin(i)*1.4,Math.cos(i)*.7],leafPalette[i%5]);
  }
  // Flecks of golden morning light float through the garden.
  const motes=new THREE.Group();scene.add(motes);
  const moteMat=new THREE.MeshBasicMaterial({color:'#f9dba1',transparent:true,opacity:.72,depthWrite:false});
  for(let i=0;i<48;i++){
    const x=Math.sin(i*12.17)*6.3,y=.8+(i%17)*.22,z=Math.cos(i*7.31)*3.5;
    const mote=new THREE.Mesh(new THREE.SphereGeometry(.022+(i%3)*.008,5,4),moteMat);
    mote.position.set(x,y,z);motes.add(mote);
  }
  // Small animated butterflies with individually articulated wings.
  const butterflies=[];
  const wingMat=[mat('#e2c0a0',.8,{side:THREE.DoubleSide}),mat('#c9a8d7',.8,{side:THREE.DoubleSide}),mat('#e8d88e',.8,{side:THREE.DoubleSide})];
  for(let i=0;i<9;i++){
    const g=new THREE.Group();scene.add(g);
    g.position.set(Math.sin(i*2.7)*4,1.3+(i%4)*.45,Math.cos(i*1.9)*2.8);
    cylinder(g,0,0,0,.017,.02,.15,bark,6);
    const wings=[];
    for(const side of [-1,1]){
      const pivot=new THREE.Group();g.add(pivot);
      const wing=new THREE.Mesh(new THREE.SphereGeometry(1,10,7),wingMat[i%3]);
      wing.scale.set(.23,.31,.035);wing.position.set(side*.17,.09,0);
      pivot.add(wing);wings.push([pivot,side]);
    }
    butterflies.push({g,wings,phase:i*1.8,base:g.position.clone()});
  }

  // Ferns, shrubs, flowers and small woodland details.
  function makeFern(x,z,s=1){
    const g=new THREE.Group();g.position.set(x,0.42,z);g.scale.setScalar(s);scene.add(g);
    for(let i=0;i<7;i++){
      const a=-1.2+i*0.4;
      const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,0,0),new THREE.Vector3(Math.sin(a)*0.45,0.42,Math.cos(a)*0.4),new THREE.Vector3(Math.sin(a)*0.9,0.02,Math.cos(a)*0.8));
      add(new THREE.Mesh(new THREE.TubeGeometry(curve,12,0.018,5,false),leafLight),g);
      for(let j=1;j<5;j++){
        const p=curve.getPoint(j/5);
        sphere(g,p.x-0.12,p.y,p.z,0.18,0.045,0.075,leafMid);
        sphere(g,p.x+0.12,p.y,p.z,0.18,0.045,0.075,leafLight);
      }
    }
  }
  [[-6.6,-2.8,1.1],[6.4,-2.8,1.0],[-4.3,0.2,.75],[4.3,0.3,.8],[-1.8,-3.4,.75],[2.5,-3.3,.8]].forEach(v=>makeFern(...v));
  function flower(x,z,scale=1,colour=flowerPink){
    const g=new THREE.Group();g.position.set(x,0.43,z);g.scale.setScalar(scale);scene.add(g);
    cylinder(g,0,0.18,0,0.018,0.025,0.36,leafDark,6);
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5; sphere(g,Math.cos(a)*0.1,0.42,Math.sin(a)*0.1,0.095,0.06,0.07,colour);}
    sphere(g,0,0.44,0,0.055,0.055,0.055,flowerCream);
  }
  for(let i=0;i<28;i++){
    const x=-6.7+(i%7)*2.05+(Math.sin(i*4)*0.28);
    const z=-3.5+Math.floor(i/7)*1.75+(Math.cos(i*2)*0.25);
    if(Math.abs(x)<2.8 && z>0.1 && z<2.6) continue;
    flower(x,z,0.55+(i%3)*0.18,i%4===0?flowerCream:flowerPink);
  }
  // Mossy boulders and mushrooms near the water.
  for(let i=0;i<16;i++){
    const x=-6.8+(i%8)*1.85, z=(i<8?-2.9:2.9)+(Math.sin(i*2)*0.22);
    const rock=add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.2+(i%3)*0.06,1),mat(i%2?'#7b8b67':'#9c9876')));
    rock.position.set(x,0.42,z);rock.scale.y=0.55;
  }
  for(let i=0;i<7;i++){
    const x=-5.5+i*1.7,z=-2.7+(i%2)*0.5;
    cylinder(scene,x,0.53,z,0.045,0.055,0.2,mat('#e8d2ad'),7);
    sphere(scene,x,0.66,z,0.15,0.07,0.13,mat('#b96e62'));
  }
  // Lanterns hanging from the pavilion corners.
  for(const [x,z] of [[-1.8,-1.15],[1.8,-1.15],[-1.8,1.15],[1.8,1.15]]){
    cylinder(pavilion,x,2.0,z,0.018,0.018,0.42,roofMat,6);
    const lamp=sphere(pavilion,x,1.77,z,0.12,0.17,0.12,mat('#ffe4a0',0.3,{emissive:'#e8a94c',emissiveIntensity:1.0}));
  }

  // The canopy is formed by the independently modelled trees around the island.

  // Controls: real camera orbit, with quarter-turn buttons for accessible rotation.
  sceneHost.closest('.biome-scene')?.querySelectorAll('[data-world-turn]').forEach(button=>{
    button.addEventListener('click',event=>{
      event.preventDefault();event.stopPropagation();
      const direction=Number(button.dataset.worldTurn)||1;
      const offset=camera.position.clone().sub(controls.target);
      const spherical=new THREE.Spherical().setFromVector3(offset);
      spherical.theta-=direction*Math.PI/2;
      offset.setFromSpherical(spherical);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    });
  });

  function resize(){
    const w=Math.max(1,sceneHost.clientWidth),h=Math.max(1,sceneHost.clientHeight);
    const aspect=w/h,view=9.5;
    camera.left=-view*aspect/2;camera.right=view*aspect/2;
    camera.top=view/2;camera.bottom=-view/2;camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);
  }
  const observer=new ResizeObserver(resize);observer.observe(sceneHost);resize();
  sceneHost.classList.add('is-ready');
  const fallback=sceneHost.parentElement.querySelector('.career-isometric-art');
  if(fallback)fallback.hidden=true;
  let animationFrame=0;
  const clock=new THREE.Clock();
  const animate=()=>{
    animationFrame=requestAnimationFrame(animate);
    const t=clock.getElapsedTime();
    butterflies.forEach(({g,wings,phase,base})=>{
      g.position.set(base.x+Math.sin(t*.65+phase)*.27,base.y+Math.sin(t*1.4+phase)*.16,base.z+Math.cos(t*.55+phase)*.23);
      g.rotation.y=Math.sin(t*.5+phase)*.5;
      wings.forEach(([pivot,side])=>{pivot.rotation.y=side*(.4+Math.sin(t*11+phase)*.85);});
    });
    motes.position.y=Math.sin(t*.4)*.06;
    controls.update();
    renderer.render(scene,camera);
  };
  animate();
  const cleanup=()=>{
    cancelAnimationFrame(animationFrame);observer.disconnect();controls.dispose();
    scene.traverse(object=>{if(object.geometry)object.geometry.dispose();});
    renderer.dispose();renderer.domElement.remove();window.GROCanopyCleanup=null;
  };
  window.GROCanopyCleanup=cleanup;
};
const canopyObserver = new MutationObserver(mountCanopy);
canopyObserver.observe(document.body,{childList:true,subtree:true});
mountCanopy();
