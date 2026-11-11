import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

(() => {
  const sceneHost = document.querySelector('.biome-career .career-3d-world');
  if (!sceneHost || !window.WebGLRenderingContext) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#a8bca0');
  scene.fog = new THREE.Fog('#a8bca0', 18, 38);

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

  scene.add(new THREE.HemisphereLight('#f6e7c9', '#314c38', 2.0));
  const sun = new THREE.DirectionalLight('#ffe1ae', 3.1);
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
  // Shingle ribs give the roof its hand-built texture.
  for(let i=0;i<11;i++){
    const x=-2.0+i*0.4;
    const ridge=box(roofGroup,x,3.05,-0.02,0.035,0.035,2.55,timberLight);
    ridge.rotation.z = x<0?-0.54:0.54;
  }
  cylinder(pavilion,0,4.05,0,0.075,0.12,0.45,gold,8);

  // Tall old trees: trunks, exposed branches, layered crowns and smaller leaf clusters.
  function makeTree(x,z,scale=1,kind=0) {
    const g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar(scale); scene.add(g);
    cylinder(g,0,1.45,0,0.18,0.32,2.9,bark,10);
    for(let i=0;i<3;i++){
      const angle=i*2.1+kind;
      const branch=cylinder(g,Math.cos(angle)*0.25,2.35,Math.sin(angle)*0.25,0.075,0.13,1.55,barkLight,7);
      branch.rotation.z=Math.cos(angle)*-0.55;
      branch.rotation.x=Math.sin(angle)*0.55;
    }
    const clusters=[
      [-0.72,3.05,0.12,1.1,0.9,1.0],[-0.15,3.55,-0.25,1.2,1.0,1.1],
      [0.62,3.15,0.1,1.05,0.9,1.0],[0.05,2.95,0.68,1.0,0.85,0.9],
      [-0.1,4.05,0.3,0.88,0.82,0.9],[0.55,3.8,-0.42,0.8,0.8,0.85]
    ];
    clusters.forEach((c,i)=>sphere(g,c[0],c[1],c[2],c[3],c[4],c[5],[leafDark,leafMid,leafLight,leafMid][(i+kind)%4]));
    for(let i=0;i<12;i++){
      const a=i*2.4+kind, r=0.72+(i%3)*0.22;
      sphere(g,Math.cos(a)*r,3.15+(i%4)*0.28,Math.sin(a)*r,0.22,0.17,0.2,[leafMid,leafLight][i%2]);
    }
    // Buttress roots make each trunk sit visibly in the terrain.
    for(let i=0;i<4;i++){
      const a=i*Math.PI/2;
      const root=box(g,Math.cos(a)*0.25,0.2,Math.sin(a)*0.25,0.16,0.48,0.48,bark);
      root.rotation.y=a; root.rotation.z=Math.cos(a)*0.28;
    }
    return g;
  }
  makeTree(-5.8,1.6,1.22,0);
  makeTree(5.65,1.45,1.28,1);
  makeTree(-5.25,-2.1,0.78,2);
  makeTree(5.0,-2.25,0.82,1);
  makeTree(-3.5,3.0,0.66,0);
  makeTree(3.6,3.1,0.7,2);

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

  // A faint woodland canopy arch frames the world without obscuring the pavilion.
  for(let i=0;i<14;i++){
    const a=Math.PI+(i/13)*Math.PI;
    const x=Math.cos(a)*8.1, y=5.0+Math.sin(a)*0.65, z=Math.sin(a)*2.8;
    sphere(scene,x,y,z,0.9,0.62,0.9,[leafDark,leafMid,leafLight][i%3]);
  }

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
    const aspect=w/h,view=8.6;
    camera.left=-view*aspect/2;camera.right=view*aspect/2;
    camera.top=view/2;camera.bottom=-view/2;camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);
  }
  const observer=new ResizeObserver(resize);observer.observe(sceneHost);resize();
  sceneHost.classList.add('is-ready');
  const fallback=sceneHost.parentElement.querySelector('.career-isometric-art');
  if(fallback)fallback.hidden=true;
  const animate=()=>{
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
  };
  animate();
  window.addEventListener('pagehide',()=>{observer.disconnect();controls.dispose();renderer.dispose();},{once:true});
})();
