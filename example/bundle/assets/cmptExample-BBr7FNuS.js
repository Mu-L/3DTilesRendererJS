import{S as m,W as c,P as l,a as p,D as f,A as h}from"./three.module-BB2USAyE.js";import{O as u}from"./OrbitControls-D8El_OnM.js";import{C as g}from"./CMPTLoader-CO2F6B4Q.js";import"./LoaderBase-QLlipkOW.js";import"./readMagicBytes-jydveJgU.js";import"./B3DMLoader-DkbFLGRR.js";import"./GLTFLoader-_VBLdhWf.js";import"./PNTSLoader-Cb7x1xFL.js";import"./I3DMLoader-BBnK3G_T.js";let n,o,a,e,i;P();d();function P(){a=new m,e=new c({antialias:!0}),e.setPixelRatio(window.devicePixelRatio),e.setSize(window.innerWidth,window.innerHeight),e.setClearColor(1383455),e.shadowMap.enabled=!0,e.shadowMap.type=l,document.body.appendChild(e.domElement),n=new p(60,window.innerWidth/window.innerHeight,1,4e3),n.position.set(400,400,400),o=new u(n,e.domElement),o.screenSpacePanning=!1,o.minDistance=1,o.maxDistance=2e3,i=new f(16777215,1.25),i.position.set(1,2,3).multiplyScalar(40),i.castShadow=!0,i.shadow.bias=-.01,i.shadow.mapSize.setScalar(2048);const t=i.shadow.camera;t.left=-200,t.bottom=-200,t.right=200,t.top=200,t.updateProjectionMatrix(),a.add(i);const s=new h(16777215,.05);a.add(s),new g().loadAsync("...").then(w=>{console.log(w)}),r(),window.addEventListener("resize",r,!1)}function r(){n.aspect=window.innerWidth/window.innerHeight,e.setPixelRatio(window.devicePixelRatio),e.setSize(window.innerWidth,window.innerHeight),n.updateProjectionMatrix()}function d(){requestAnimationFrame(d),S()}function S(){e.render(a,n)}
