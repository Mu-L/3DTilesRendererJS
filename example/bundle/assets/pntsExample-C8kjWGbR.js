import{S as c,W as m,P as l,a as h,D as p,A as f}from"./three.module-BB2USAyE.js";import{O as u}from"./OrbitControls-D8El_OnM.js";import{P as S}from"./PNTSLoader-Cb7x1xFL.js";import"./readMagicBytes-jydveJgU.js";import"./LoaderBase-QLlipkOW.js";let n,a,o,e,i;g();d();function g(){o=new c,e=new m({antialias:!0}),e.setPixelRatio(window.devicePixelRatio),e.setSize(window.innerWidth,window.innerHeight),e.setClearColor(1383455),e.shadowMap.enabled=!0,e.shadowMap.type=l,document.body.appendChild(e.domElement),n=new h(60,window.innerWidth/window.innerHeight,1,4e3),n.position.set(2,2,2),a=new u(n,e.domElement),a.screenSpacePanning=!1,a.minDistance=1,a.maxDistance=2e3,i=new p(16777215,1.25),i.position.set(1,2,3).multiplyScalar(40),i.castShadow=!0,i.shadow.bias=-.01,i.shadow.mapSize.setScalar(2048);const t=i.shadow.camera;t.left=-200,t.bottom=-200,t.right=200,t.top=200,t.updateProjectionMatrix(),o.add(i);const w=new f(16777215,.05);o.add(w),new S().loadAsync("https://raw.githubusercontent.com/CesiumGS/3d-tiles-samples/main/1.0/TilesetWithRequestVolume/points.pnts").then(s=>{console.log(s),o.add(s.scene)}),r(),window.addEventListener("resize",r,!1)}function r(){n.aspect=window.innerWidth/window.innerHeight,e.setPixelRatio(window.devicePixelRatio),e.setSize(window.innerWidth,window.innerHeight),n.updateProjectionMatrix()}function d(){requestAnimationFrame(d),P()}function P(){e.render(o,n)}
