/* Science 4º · Unit 3 Heat and temperature: teoría (con audio) y fichas */
(function(){
const bn=CEVA.banner("ciencias4u3");
if(bn){ const h=document.querySelector(".hero"); if(h){ h.innerHTML=`<img src="${bn}" alt="" style="display:block;width:100%">`; h.style.background="none"; } }

const say=w=>`<button class="ex-say" data-say="${w}">🔊 ${w}</button>`;
const P=e=>DRAW[e]?`<span class="pic" style="width:56px;height:56px;display:inline-block">${svg(e)}</span>`:`<span class="em">${e}</span>`;
const card=(w,e)=>`<div class="w">${P(e)}${say(w)}</div>`;
const ln=(w=130)=>`<span class="ln" style="min-width:${w}px"></span>`;
const pp=e=>DRAW[e]?`<span class="pic">${svg(e)}</span>`:`<span class="em">${e}</span>`;

const THEORY=[
 {id:"sources",icon:"☀️",title:"Sources of heat · Fuentes de calor",html:`
  <p><b>Heat is a form of energy.</b> El calor es una forma de energía: hace que las cosas estén templadas o calientes.</p>
  <h3>🌿 Natural</h3>
  <p>Están en la naturaleza, nadie las ha fabricado.</p>
  <div class="ex-words">${SRC.filter(s=>SOURCES[s][1]==="n").map(s=>card(s,SOURCES[s][0])).join("")}</div>
  <h3>🏭 Artificial (man-made)</h3>
  <p>Las han hecho las personas. Casi todas funcionan con electricidad o gas.</p>
  <div class="ex-words">${SRC.filter(s=>SOURCES[s][1]==="a").map(s=>card(s,SOURCES[s][0])).join("")}</div>
  <p>${SRC.map(s=>`<b>${s}</b> = ${SOURCES[s][2]}`).join(" · ")}</p>
  <div class="ex-tip">¿Y el <b>fire</b> 🔥 (fuego)? Puede ser natural (un rayo que quema un árbol) o hecho por personas (una cerilla, una chimenea). Pregunta en clase en qué columna lo ponéis.</div>`},
 {id:"heattemp",icon:"🔥",title:"Heat and temperature · Calor y temperatura",html:`
  <ul>
   <li>${say("Heat")} (calor) <b>is a form of energy</b>. Es energía.</li>
   <li>${say("Temperature")} (temperatura) <b>is something we measure</b>. Nos dice lo caliente que está algo.</li>
  </ul>
  <div class="ex-ex">${say("Things become hotter when they gain heat.")} → Las cosas se calientan cuando <b>ganan</b> calor.</div>
  <div class="ex-ex">${say("Things become colder when they lose heat.")} → Las cosas se enfrían cuando <b>pierden</b> calor.</div>
  <div class="ex-tip">Truco: si se puede <b>medir</b> con un termómetro → temperature. Si es la <b>energía</b> → heat.</div>`},
 {id:"measure",icon:"🌡️",title:"How can we measure temperature?",html:`
  <p>Medimos la temperatura con un ${say("thermometer")} (termómetro).</p>
  <div class="ex-words">${card("thermometer","thermometer")}${card("digital thermometer","digital")}</div>
  <ul><li>Algunos tienen un <b>tubo con líquido</b>: cuando hace más calor, el líquido sube.</li>
  <li>Otros son <b>digitales</b>: enseñan la temperatura en una pantallita.</li></ul>
  <h3>Celsius y Fahrenheit</h3>
  <p>Casi todos los países usan <b>degrees Celsius</b> (°C). Unos pocos, como Estados Unidos, usan <b>degrees Fahrenheit</b> (°F).</p>
  <div class="ex-ex">25 °C = ${say("twenty-five degrees Celsius")}<br>62 °F = ${say("sixty-two degrees Fahrenheit")}</div>
  <p>Si el número tiene punto, decimos <b>point</b>:</p>
  <div class="ex-ex">25.5 °C = ${say("twenty-five point five degrees Celsius")}<br>36.6 °C = ${say("thirty-six point six degrees Celsius")}</div>
  <div class="ex-tip">Water becomes ice at <b>0 °C</b> and boils at <b>100 °C</b>. El agua se congela a 0 °C y hierve a 100 °C.</div>`},
 {id:"why",icon:"🩺",title:"Why do we measure temperature?",html:`
  <ul>
   <li>🩺 <b>Doctors</b> check our body temperature when we’re sick. ${say("Our normal temperature is around 37 °C.")}</li>
   <li>🌦️ We can see the air temperature on <b>weather forecasts</b> (el tiempo de la tele): 2 °C, −1 °C… ¡hace frío!</li>
   <li>👩‍🍳 <b>Chefs</b> measure the temperature of the food they’re cooking to see if it’s safe to eat.</li>
  </ul>
  <div class="ex-tip">−4 °C se dice “minus four degrees Celsius”: bajo cero.</div>`},
 {id:"earth",icon:"🌍",title:"The Sun, the Equator and the seasons",html:`
  <p>${say("The Earth isn’t straight on its axis. It’s tilted.")} La Tierra está <b>inclinada</b>. Por eso los países de los hemisferios norte y sur tienen estaciones.</p>
  <ul>
   <li>☀️ <b>In summer</b>, countries are tilted <b>towards</b> the Sun: more sunlight, longer days, hotter weather.</li>
   <li>❄️ <b>In winter</b>, countries are tilted <b>away from</b> the Sun: less sunlight, shorter days, colder weather.</li>
  </ul>
  <p>El ${say("Equator")} es una línea imaginaria que rodea la Tierra por la mitad. Cerca del Ecuador <b>no hay estaciones</b>: el Sol está siempre justo encima y siempre hace calor.</p>
  <div class="ex-ex">${say("Countries near the Equator have got hot weather because the Sun is always directly above them.")}</div>
  <div class="ex-tip">Países cerca del Ecuador: Ecuador, Colombia, Kenia, Brasil, Indonesia. Países con estaciones: España, Reino Unido, Argentina.</div>`},
 {id:"states",icon:"🧊",title:"How can heat change states of matter?",html:`
  <p>Hay tres estados de la materia: ${say("solid")} sólido · ${say("liquid")} líquido · ${say("gas")} gas. Con calor, los materiales cambian de estado.</p>
  <div class="ex-ex">🧊 ice (solid) ➜ 💧 water (liquid) = ${say("melting")} (fundirse)</div>
  <div class="ex-ex">💧 water (liquid) ➜ ☁️ water vapour (gas) = ${say("evaporation")} (evaporación). Pasa cuando hervimos (boil) agua.</div>
  <p><b>What happens first when you leave ice in the Sun?</b> It melts. Primero se funde.</p>
  <h3>Melting point · Punto de fusión</h3>
  <p>Es la temperatura a la que un material pasa de sólido a líquido. Cada material tiene el suyo:</p>
  <p>${[...MELT].sort((a,b)=>a[2]-b[2]).map(m=>`${P(m[1])} <b>${m[0]}</b> ${m[2]} °C`).join(" · ")}</p>
  <div class="ex-tip">Los metales tienen puntos de fusión altísimos: se funden a temperaturas muy altas.</div>
  <h3>Reversible or irreversible?</h3>
  <ul><li>🍫 <b>Melting chocolate</b>: reversible. Si se enfría, vuelve a ser sólido.</li>
  <li>🍳 <b>Cooking an egg</b>: irreversible. No vuelve a ser crudo. Es un <b>chemical change</b> (cambio químico).</li></ul>`},
 {id:"cond",icon:"🥄",title:"Conductors and insulators · Conductores y aislantes",html:`
  <ul>
   <li>🔥 <b>Thermal conductors</b>: get hot quickly and easily. Se calientan rápido. <b>Metals</b> are good thermal conductors.</li>
   <li>🧤 <b>Thermal insulators</b>: don’t get hot easily. <b>Wood, plastic, rubber</b> and <b>wool</b> are thermal insulators.</li>
  </ul>
  <div class="ex-words">${card("metal spoon","spoon")}${card("radiator","radiator")}${card("frying pan","pan")}${card("wooden spoon","woodspoon")}${card("plastic bucket","🪣")}${card("wool socks","🧦")}</div>
  <div class="ex-ex">Metal gets hot so we can cook our food easily. Plastic and wood don’t get hot: we don’t burn our hands. Por eso la sartén es de metal y el mango, de plástico.</div>
  <h3>We can save energy with insulators</h3>
  <ul><li>🪟 Modern windows have got two pieces of glass. <b>The air between them</b> stops the heat.</li>
  <li>🧥 The air in a jacket and the wool in socks stop us from losing heat.</li>
  <li>Las cortinas de lana no dejan escapar el calor de casa en invierno.</li></ul>
  <div class="ex-tip">🎵 Conductors, conductors, let heat flow. Metals like iron, silver and gold. Insulators, insulators, don’t get hot. Wood, plastic, rubber and even wool socks!</div>`},
 {id:"energy",icon:"🔆",title:"Heat as an energy source",html:`
  <p>We use heat energy for cooking, to warm ourselves and to make electricity.</p>
  <ul>
   <li>☀️ <b>The Sun</b> is the most important source of heat energy. It warms the rocks, soil and water, and keeps animals and plants warm.</li>
   <li>${P("solarpanel")} <b>Solar panels</b> get energy from sunlight to make electricity. Solar energy is <b>sustainable</b>: it doesn’t pollute the atmosphere.</li>
   <li>♨️ <b>Geothermal energy</b> is heat that comes from <b>inside the Earth</b>. It heats natural hot springs.</li>
   <li>🔥 <b>Fire</b>: we use its heat for cooking food and keeping ourselves warm.</li>
  </ul>
  <div class="ex-tip">WOW! Spain has got many solar energy farms. España tiene muchos parques solares.</div>`},
 {id:"culture",icon:"🧪",title:"Make a thermometer · Daniel Fahrenheit",html:`
  <h3>Experiment: make a thermometer</h3>
  <p>Necesitas: botella de cristal, pajita transparente, agua, alcohol de farmacia, colorante rojo, plastilina, hielo y 2 cuencos. <b>¡Siempre con un adulto!</b></p>
  <ol><li>Llena un cuarto de la botella con agua.</li><li>Echa unas gotas de colorante y remueve con la pajita.</li>
  <li>Llena un tercio con alcohol (más alcohol que agua).</li><li>Mete la pajita: abajo dentro del líquido, sin tocar el fondo.</li>
  <li>Tapa la boca con plastilina sujetando la pajita. Sin agujeros, y sin tapar la pajita por arriba.</li>
  <li>Pruébalo: en agua templada el líquido <b>sube</b> por la pajita; en agua con hielo <b>baja</b>.</li></ol>
  <h3>Culture: Daniel Fahrenheit</h3>
  <p>Fue un científico alemán. Inventó el primer termómetro de <b>mercury</b> (mercurio) en lugar de alcohol, y la escala <b>Fahrenheit</b>.</p>
  <div class="ex-tip">¿Por qué ya no se usan termómetros de mercurio? Porque el mercurio es <b>tóxico</b>: si el termómetro se rompe, es peligroso para las personas y para la naturaleza.</div>`}
];

const scr=w=>{ let s; do{ s=shuffle(w.split("")).join(""); }while(s===w&&w.length>2); return s; };
const SHEETS=[
 {id:"src",title:"Natural or artificial?",instr:"Write N (natural) or A (artificial). Escribe N o A.",
  make(){ const t=rnd(SRC); return {key:t,q:`${pp(SOURCES[t][0])} ${t} ${ln(60)}`,a:`${t}: ${SOURCES[t][1]==="n"?"N":"A"}`}; }},
 {id:"ht",title:"Heat or temperature?",instr:"Write heat or temperature. Escribe heat o temperature.",
  make(){ const [s,a]=rnd(HT); return {key:s,q:s.replace("___",ln(120)),a:s.replace("___",a)}; }},
 {id:"temp",title:"Read the temperatures",instr:"Write the temperature in words. Escribe la temperatura con letras.",
  make(){ const u=Math.random()<.75?"C":"F", v=u==="C"?rnd([12,15,21,25,27,32,37,38,40,42]):rnd([32,62,68,77,98]), d=rnd([0,0,5]), val=d?+(v+"."+d):v;
    return {key:val+u,q:`<b>${val} °${u}</b> = ${ln(300)}`,a:`${val} °${u} = ${tempWords(val,u)}`}; }},
 {id:"ci",title:"Conductor or insulator?",instr:"Write C (thermal conductor) or I (thermal insulator).",
  make(){ const t=rnd(MATS); return {key:t,q:`${pp(MAT[t][0])} ${t} ${ln(60)}`,a:`${t}: ${MAT[t][1]==="c"?"C":"I"}`}; }},
 {id:"st",title:"Melting or evaporation?",instr:"Write melting or evaporation. Escribe el cambio de estado.",
  make(){ const x=rnd(STATES); return {key:x[1],q:`${x[0]} ${x[1]} → ${x[2]} ${x[3]}: ${ln(120)}`,a:x[4]}; }},
 {id:"tf",title:"True or false?",instr:"Write true or false. Correct the false sentences. Corrige las falsas.",
  make(){ const [s,v,fix]=rnd(TF); return {key:s,q:`${s} ${ln(70)}`,a:v?"true":`false → ${fix}`}; }},
 {id:"mp",title:"Melting points",instr:"Order from the lowest to the highest melting point. Ordena de menor a mayor.",
  make(){ const set=pick(MELT,4); return {key:set.map(m=>m[0]).join(),q:`${set.map(m=>`${m[0]} (${m[2]} °C)`).join(" · ")}<br>${ln(320)}`,a:[...set].sort((a,b)=>a[2]-b[2]).map(m=>m[0]).join(" → ")}; }},
 {id:"spell",title:"Spelling",instr:"Order the letters. Ordena las letras y escribe la palabra.",
  make(){ const w=rnd([...SPELL,"thermometer","conductor","insulator","volcano","energy"]); return {key:w,q:`<b style="letter-spacing:3px">${scr(w)}</b> → ${ln()}`,a:w}; }}
];

Extras.init({subject:"Science · Unit 3 Heat and temperature",lang:"en-GB",
  theme:{bg:"#FFF5EA",card:"#FFFFFF",ink:"#3A1F0F",line:"#3A1F0F",accent:"#E8590C",soft:"#FFE6CC",rad:"16px"},
  theory:THEORY, sheets:SHEETS});
renderMenu();
})();
