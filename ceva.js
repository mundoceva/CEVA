/* Mundo CEVA: utilidades compartidas por todas las pantallas */
const PROFILE=new URLSearchParams(location.search).get("p")||"default";
/* Versión lite: los datos viven solo mientras la pestaña esté abierta */
const STORE={
  get(k){try{return sessionStorage.getItem(k);}catch(e){return null;}},
  set(k,v){try{sessionStorage.setItem(k,v);}catch(e){}},
  del(k){try{sessionStorage.removeItem(k);}catch(e){}}
};
const CEVA_VERSION="2.5";
const CEVA=(function(){
  const SUBJ_KEYS={lengua:"minaPalabras_v1_",ingles:"englishIsland_v1_",mates:"matesCueva_v1_",ciencias:"plantasScience_v1_"};
  const json=(k,d)=>{ try{ const v=JSON.parse(STORE.get(k)); return v==null?d:v; }catch(e){ return d; } };
  const DEF={pass:"1234",mgCost:10,factsCustom:[],factsHidden:[]};
  const cfg=()=>Object.assign({},DEF,json("cfg_v1",{}));
  const setCfg=c=>STORE.set("cfg_v1",JSON.stringify(c));
  const profiles=()=>{ const p=json("profiles_v1",null); return Array.isArray(p)?p:[]; };
  const setProfiles=p=>STORE.set("profiles_v1",JSON.stringify(p));
  const earned=pid=>Object.values(SUBJ_KEYS).reduce((a,k)=>{ const d=json(k+pid,null); return a+((d&&+d.gems)||0); },0);
  function wallet(pid){ const p=profiles().find(x=>x.id===pid); return Math.max(0,earned(pid)-((p&&p.spent)||0)); }
  function spend(pid,n){ const ps=profiles(), p=ps.find(x=>x.id===pid); if(!p) return; p.spent=(p.spent||0)+n; setProfiles(ps); }
  const banner=sid=>STORE.get("banner_"+sid);
  function printPage(name){ try{ if(window.Android&&Android.print){ Android.print(name||"Mundo CEVA"); return; } }catch(e){} window.print(); }
  function speak(t,lang){
    lang=lang||"en-GB";
    try{
      if(window.Android&&Android.speakLang){ Android.speakLang(t,lang); return; }
      if(window.Android&&Android.speak&&lang.startsWith("en")){ Android.speak(t); return; }
      if("speechSynthesis" in window){ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang=lang; u.rate=.85;
        const v=speechSynthesis.getVoices().find(v=>v.lang&&v.lang.replace("_","-").startsWith(lang.slice(0,2))); if(v)u.voice=v; speechSynthesis.speak(u); }
    }catch(e){}
  }
  return {SUBJ_KEYS,json,cfg,setCfg,profiles,setProfiles,earned,wallet,spend,banner,printPage,speak};
})();
document.addEventListener("DOMContentLoaded",()=>{ const a=document.querySelector(".homebtn"); if(a) a.href="index.html?p="+encodeURIComponent(PROFILE); });

document.addEventListener("DOMContentLoaded",()=>{
  if(!/(^|\/)(index\.html)?$/.test(location.pathname)) return;
  const f=document.createElement("footer");
  f.style.cssText="width:100%;max-width:720px;margin:auto auto 0;padding:18px 16px 28px;color:var(--soft,#3E4A55);font:600 13px/1.55 Nunito,system-ui,sans-serif;text-align:center;border-top:3px solid var(--line,#1B1B1B)";
  f.innerHTML='Esta web se ha desarrollado mediante <i>vibecoding</i>. Cualquier aportación me vendrá genial, así que puedes escribirme a '+
    '<a href="mailto:mundocevaprimaria@gmail.com" style="color:inherit;font-weight:900">mundocevaprimaria@gmail.com</a>.<br><br>'+
    'Esta web nace para fomentar y apoyar la motivación del estudio en casa en Primaria. No es una web oficial: el temario se ha seleccionado de libros y cuadernos de estudio, así que puede contener errores. '+
    'Cero responsabilidades, que ya tengo bastante en casa 🙂'+
    '<br><br><span style="opacity:.75">Versión '+CEVA_VERSION+'</span>';
  const g=document.querySelector(".ground"); if(g){ g.style.marginTop="0"; document.body.insertBefore(f,g); } else document.body.appendChild(f);
  if(STORE.get("aviso_cerrado")) return;
  const d=document.createElement("div");
  d.style.cssText="position:relative;background:#17324D;color:#fff;font:700 15px Nunito,system-ui,sans-serif;padding:10px 44px;text-align:center;line-height:1.4";
  d.innerHTML='Versión de prueba: el progreso se borra al cerrar la pestaña. <a href="Mundo-CEVA.apk" download style="color:#FFD23F">Descarga la app NO oficial en Android</a> para guardarlo.'+
    '<button type="button" aria-label="Cerrar aviso" style="position:absolute;top:50%;right:8px;transform:translateY(-50%);width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.15);color:#fff;font:900 18px/30px system-ui,sans-serif;cursor:pointer;padding:0">×</button>';
  d.querySelector("button").onclick=()=>{ STORE.set("aviso_cerrado","1"); d.remove(); };
  document.body.prepend(d);
});

/* Versión lite: perfiles de ejemplo sin nombres reales */
(function(){
  const ps=CEVA.profiles();
  if(ps.length) return;
  CEVA.setProfiles([
    {id:"p2",name:"2º Primaria",avatar:"🐢",color:"#FFC2D4",subjects:["ingles","ciencias"]},
    {id:"p4",name:"4º Primaria",avatar:"🦊",color:"#B8E28F",subjects:["lengua","mates"]}
  ]);
  STORE.set("mig_mates_v1","1"); STORE.set("mig_ciencias_v1","1");
})();
