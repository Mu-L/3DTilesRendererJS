import{W as l,S as m,a as u}from"./three.module-BB2USAyE.js";import{T as w}from"./TilesFadePlugin-CyUpxPB4.js";import{g as c}from"./lil-gui.module.min-D95Toaa3.js";import{E as g,L as f,T as P}from"./TileCompressionPlugin-D8IJLwao.js";import{G as h}from"./GlobeControls-CLLOjRy9.js";import{C as y}from"./CesiumIonAuthPlugin-hD5WdXhv.js";import"./TilesRenderer-BWSIOyW5.js";import"./B3DMLoader-DkbFLGRR.js";import"./readMagicBytes-jydveJgU.js";import"./LoaderBase-QLlipkOW.js";import"./GLTFLoader-_VBLdhWf.js";import"./PNTSLoader-Cb7x1xFL.js";import"./I3DMLoader-BBnK3G_T.js";import"./CMPTLoader-CO2F6B4Q.js";import"./GLTFExtensionLoader-Dn4yPdlw.js";import"./EnvironmentControls-BSw-XyT-.js";import"./GoogleCloudAuthPlugin-Ccye0Neh.js";let a,r,i,t,e;const C=localStorage.getItem("ionApiKey")??"put-your-api-key-here",n={apiKey:C,reload:d};R();p();function d(){e&&(r.remove(e.group),e.dispose(),e=null),localStorage.setItem("ionApiKey",n.apiKey),e=new g(null,f),e.registerPlugin(new y({apiToken:n.apiKey,assetId:"2684829"})),e.registerPlugin(new P),e.registerPlugin(new w),e.group.rotation.x=-Math.PI/2,e.errorTarget=20,r.add(e.group),e.setCamera(i),a.setTilesRenderer(e)}function R(){t=new l({antialias:!0}),t.setClearColor(1383455),document.body.appendChild(t.domElement),r=new m,i=new u(60,window.innerWidth/window.innerHeight,1,16e7),i.position.set(2620409,0,-6249816),i.lookAt(0,0,0),a=new h(r,i,t.domElement,null),d(),s(),window.addEventListener("resize",s,!1);const o=new c;o.width=300,o.add(n,"apiKey"),o.add(n,"reload")}function s(){const o=window.innerWidth/window.innerHeight;i.aspect=o,i.updateProjectionMatrix(),t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(window.devicePixelRatio)}function p(){requestAnimationFrame(p),e&&(a.update(),e.setResolutionFromRenderer(i,t),i.updateMatrixWorld(),e.update(),t.render(r,i))}
