/* Inglés 4º · Unit 1 Community: teoría (con audio) y fichas */
(function(){
const bn=CEVA.banner("ingles4");
if(bn){ const h=document.querySelector(".hero"); if(h){ h.innerHTML=`<img src="${bn}" alt="" style="display:block;width:100%">`; h.style.background="none"; } }

const say=w=>`<button class="ex-say" data-say="${w}">🔊 ${w}</button>`;
const card=(w,pic)=>`<div class="w">${pic}${say(w)}</div>`;
const emo=e=>`<span class="em">${e}</span>`;
const ln=(w=130)=>`<span class="ln" style="min-width:${w}px"></span>`;
const tk=t=>`<b style="color:${t==="✘"?"#C62839":"#2E9E5B"};letter-spacing:2px">${t}</b>`;

const THEORY=[
 {id:"places",icon:"🏙️",title:"Places in town · Lugares",html:`
  <p>Toca cada lugar para escuchar cómo se dice.</p>
  <div class="ex-words">${PLACES.map(p=>card(p,emo(PL[p][0]))).join("")}</div>
  <p>${say("Where am I?")} = ¿Dónde estoy? → ${say("You’re at the post office.")} = Estás en la oficina de correos.</p>
  <div class="ex-tip">En inglés casi siempre decimos <b>the</b> delante del lugar: at <b>the</b> museum, to <b>the</b> cinema.</div>`},
 {id:"often",icon:"📅",title:"How often? · Adverbs of frequency",html:`
  <p>Para decir <b>cada cuánto</b> haces algo:</p>
  <ul>
   <li>${tk("✔✔✔✔")} ${say("always")} = siempre</li>
   <li>${tk("✔✔✔")} ${say("often")} = a menudo</li>
   <li>${tk("✔✔")} ${say("sometimes")} = a veces</li>
   <li>${tk("✘")} ${say("never")} = nunca</li>
  </ul>
  <p>Pregunta: ${say("How often do you go to the swimming pool?")}</p>
  <div class="ex-ex">${say("I often go to the swimming pool.")} → Voy a la piscina a menudo.</div>
  <div class="ex-ex">${say("I never go to the library.")} → Nunca voy a la biblioteca.</div>
  <div class="ex-tip">El adverbio va <b>antes</b> del verbo: I <b>always</b> go… (no “I go always”).</div>`},
 {id:"time",icon:"⏰",title:"On, at, after · Cuándo",html:`
  <ul>
   <li><b>on</b> + día: ${say("on Saturdays")} = los sábados</li>
   <li><b>at</b>: ${say("at the weekend")} = el fin de semana</li>
   <li><b>after</b>: ${say("after school")} = después del cole</li>
  </ul>
  <div class="ex-ex">${say("I sometimes go to the cinema at the weekend.")}</div>
  <div class="ex-ex">${say("I always go to the skate park on Saturdays.")}</div>
  <div class="ex-tip">Los días de la semana en inglés se escriben siempre con <b>mayúscula</b>: Monday, Saturday…</div>`},
 {id:"actions",icon:"💌",title:"Kind actions · Acciones",html:`
  <p>Palabras del cuento <i>A mysterious friend</i>. ¿Cómo podemos ser amables?</p>
  <div class="ex-words">${Object.entries(ACTIONS).map(([w,[e]])=>card(w,emo(e))).join("")}</div>
  <p>${Object.entries(ACTIONS).map(([w,[,es]])=>`<b>${w}</b> = ${es}`).join(" · ")}</p>`},
 {id:"heshe",icon:"🧑",title:"He / She · doesn’t",html:`
  <p>Con <b>I, you</b> el verbo no cambia. Con <b>he, she</b> (él, ella) el verbo lleva <b>-s</b>:</p>
  <div class="ex-ex">${say("I borrow a book.")} → ${say("He borrows a book.")}</div>
  <p>Para decir que <b>no</b>: <b>don’t</b> con I · <b>doesn’t</b> con he/she. ¡Y el verbo vuelve sin -s!</p>
  <div class="ex-ex">${say("I don’t borrow a book.")} → ${say("She doesn’t borrow a book.")}</div>
  <div class="ex-ex">${say("She visits the museum.")} · ${say("He doesn’t meet friends at the skate park.")}</div>
  <div class="ex-tip">go → <b>goes</b> · watch → <b>watches</b> (añaden -es). doesn’t = does not.</div>`},
 {id:"where",icon:"🗺️",title:"Is there…? · Where is it?",html:`
  <p>Para preguntar si hay un sitio cerca: ${say("Excuse me. Is there a cinema near here?")}</p>
  <ul><li>Sí: ${say("Yes, there is.")}</li><li>No: ${say("No, there isn’t.")}</li></ul>
  <p>Para decir dónde está:</p>
  <ul>
   <li>${say("It’s next to the café.")} = al lado de</li>
   <li>${say("It’s opposite the station.")} = enfrente de</li>
   <li>${say("It’s between the library and the café.")} = entre</li>
  </ul>
  <div class="ex-tip">“between” siempre lleva dos lugares unidos con <b>and</b>.</div>`}
];

const PL1=PLACES.filter(p=>!p.includes(" ")&&p!=="café");
const scr=w=>{ let s; do{ s=shuffle(w.split("")).join(""); }while(s===w&&w.length>2); return s; };
const SHEETS=[
 {id:"vocab",title:"Places",instr:"Look and write the place. Mira el dibujo y escribe el lugar en inglés.",
  make(){ const p=rnd(PLACES); return {key:p,q:`${emo(PL[p][0])} the ${ln()}`,a:`the ${p}`}; }},
 {id:"spell",title:"Spelling",instr:"Order the letters. Ordena las letras y escribe la palabra.",
  make(){ const w=rnd([...PL1,"always","often","sometimes","never","weekend","school"]); return {key:w,q:`<b style="letter-spacing:3px">${scr(w)}</b> → ${ln()}`,a:w}; }},
 {id:"often",title:"How often?",instr:"Look at the ticks and write always, often, sometimes or never.",
  make(){ const p=rnd(PLACES), f=rnd(FREQ); return {key:p+f[0],q:`${emo(PL[p][0])} ${tk(f[1])} I ${ln(100)} go to the ${p}.`,a:`I ${f[0]} go to the ${p}.`}; }},
 {id:"time",title:"On, at, after",instr:"Complete with on, at or after. Completa.",
  make(){ const [pr,w]=rnd(TIMES), p=rnd(PLACES), a=rnd(["often","sometimes","always"]); return {key:pr+w+p,q:`I ${a} go to the ${p} ${ln(70)} ${w}.`,a:`${pr} ${w}`}; }},
 {id:"heshe",title:"He / She",instr:"Look and write the sentence. ✔ = sí, ✘ = no. Usa he/she y doesn’t.",
  make(){ const [n,g]=rnd(KIDS), v=rnd(VERBS), yes=Math.random()<.5, P=g==="M"?"He":"She";
    return {key:n+v[0]+yes,q:`${n} ${tk(yes?"✔":"✘")} (${v[0]} ${v[2]}) → ${ln(260)}`,a:yes?`${P} ${v[1]} ${v[2]}.`:`${P} doesn’t ${v[0]} ${v[2]}.`}; }},
 {id:"where",title:"Where is it?",instr:"Look at the street and complete with next to or between.",
  make(){ const m=shuffle(PLACES).slice(0,3), i=Math.floor(Math.random()*3);
    const row=m.map(p=>`<span style="display:inline-flex;flex-direction:column;align-items:center;margin-right:6px;vertical-align:middle"><span style="font-size:1.8rem">${PL[p][0]}</span><small>${p}</small></span>`).join("");
    if(i===1) return {key:m.join()+i,q:`${row}<br>The ${m[1]} is ${ln(90)} the ${m[0]} and the ${m[2]}.`,a:`between`};
    return {key:m.join()+i,q:`${row}<br>The ${m[i]} is ${ln(90)} the ${m[1]}.`,a:`next to`}; }}
];

Extras.init({subject:"Inglés 4º · Unit 1 Community",lang:"en-GB",
  theme:{bg:"#EEF7FF",card:"#FFFFFF",ink:"#17324D",line:"#17324D",accent:"#2F7DE1",soft:"#E3F0FF",rad:"16px"},
  theory:THEORY, sheets:SHEETS});
renderMenu();
})();
