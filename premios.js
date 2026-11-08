/* Premios: 4 juegos de 4 minutos que se alternan */
(function(){
const DUR = 4*60*1000;
const CSS = `
.pz-ov{position:fixed;inset:0;z-index:1000;background:#0E2A3A;color:#fff;display:flex;flex-direction:column;font-family:"Nunito",system-ui,sans-serif;
  padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px);user-select:none;-webkit-user-select:none}
.pz-top{display:flex;align-items:center;gap:8px;padding:10px 12px;flex:none;flex-wrap:wrap}
.pz-top b{flex:1;font-size:1.05rem;min-width:120px}
.pz-pill{background:rgba(255,255,255,.14);border-radius:99px;padding:4px 10px;font-weight:900;white-space:nowrap}
.pz-btn{font:inherit;font-weight:900;font-size:1rem;padding:8px 14px;border-radius:14px;border:3px solid #fff;background:transparent;color:#fff;cursor:pointer}
.pz-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:4px 8px}
.pz-stage canvas{display:block;border-radius:12px;touch-action:none}
.pz-help{text-align:center;font-weight:800;opacity:.85;padding:0 12px 6px;flex:none;font-size:.95rem}
.pz-pad{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:4px 12px 12px;max-width:420px;width:100%;margin:0 auto;flex:none}
.pz-pad button{font:inherit;font-size:1.4rem;font-weight:900;padding:12px 0;border-radius:14px;border:3px solid #fff;background:rgba(255,255,255,.12);color:#fff;touch-action:manipulation}
.pz-pad.two{grid-template-columns:1fr 1fr}
.pz-pad.two button{font-size:1.3rem;padding:20px 0}
.pz-slider{position:relative;height:56px;margin:2px auto 6px;width:calc(100% - 24px);max-width:420px;border-radius:28px;border:3px solid #fff;background:rgba(255,255,255,.12);touch-action:none;flex:none}
.pz-slider::before{content:"⟵ arrastra ⟶";position:absolute;inset:0;display:grid;place-items:center;font-weight:900;opacity:.45}
.pz-knob{position:absolute;top:5px;width:64px;height:40px;border-radius:20px;background:#FFD23F;border:3px solid #17324D;transform:translateX(-50%);pointer-events:none}
.pz-end{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(8,20,30,.82);padding:20px}
.pz-end div{background:#fff;color:#17324D;border-radius:22px;padding:22px;text-align:center;max-width:320px;display:flex;flex-direction:column;gap:12px}
.pz-end b{font-size:1.4rem}
.pz-end button{font:inherit;font-weight:900;font-size:1.1rem;padding:12px;border-radius:14px;border:3px solid #17324D;background:#E8457A;color:#fff}
`;
function injectCSS(){ if(document.getElementById("pz-css")) return; const s=document.createElement("style"); s.id="pz-css"; s.textContent=CSS; document.head.appendChild(s); }
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}

/* ---------- 1. Bloques que caen ---------- */
function Blocks(){
  const W=10,H=20,C=24;
  const P=[{m:[[1,1,1,1]],c:"#4FC3F7"},{m:[[1,1],[1,1]],c:"#FFD23F"},{m:[[0,1,0],[1,1,1]],c:"#B57EDC"},
    {m:[[0,1,1],[1,1,0]],c:"#5BC67A"},{m:[[1,1,0],[0,1,1]],c:"#FF6B81"},{m:[[1,0,0],[1,1,1]],c:"#3D7DD8"},{m:[[0,0,1],[1,1,1]],c:"#FB8C00"}];
  let board,bag=[],p,x,y,acc=0,lines=0,msg="";
  const empty=()=>Array.from({length:H},()=>Array(W).fill(null));
  const rot=m=>m[0].map((_,i)=>m.map(r=>r[i]).reverse());
  function hit(m,X,Y){for(let r=0;r<m.length;r++)for(let c=0;c<m[r].length;c++){if(!m[r][c])continue;const a=X+c,b=Y+r;if(a<0||a>=W||b>=H)return true;if(b>=0&&board[b][a])return true;}return false;}
  function spawn(){ if(!bag.length)bag=shuffle([0,1,2,3,4,5,6]); const q=P[bag.pop()]; p={m:q.m.map(r=>[...r]),c:q.c}; x=Math.floor((W-q.m[0].length)/2); y=-1;
    if(hit(p.m,x,y+1)){ board=empty(); msg="La torre llegó arriba: ¡otra!"; } }
  function lock(){ p.m.forEach((row,r)=>row.forEach((v,c)=>{if(v&&y+r>=0)board[y+r][x+c]=p.c;}));
    let n=0; for(let r=H-1;r>=0;r--){ if(board[r].every(Boolean)){board.splice(r,1);board.unshift(Array(W).fill(null));n++;r++;} }
    if(n){ lines+=n; msg=n>1?`¡${n} filas de golpe!`:"¡Fila completa!"; } spawn(); }
  function act(a){
    if(a==="left"&&!hit(p.m,x-1,y))x--; else if(a==="right"&&!hit(p.m,x+1,y))x++;
    else if(a==="down"){ if(!hit(p.m,x,y+1))y++; else lock(); acc=0; }
    else if(a==="drop"){ while(!hit(p.m,x,y+1))y++; lock(); acc=0; }
    else if(a==="rot"){ const m=rot(p.m); for(const k of [0,-1,1,-2,2]){ if(!hit(m,x+k,y)){p.m=m;x+=k;break;} } }
  }
  function cell(c,X,Y,col,al){ c.globalAlpha=al||1; c.fillStyle=col; c.fillRect(X*C+1,Y*C+1,C-2,C-2); c.fillStyle="rgba(255,255,255,.35)"; c.fillRect(X*C+3,Y*C+3,C-12,5); c.globalAlpha=1; }
  board=empty(); spawn();
  function slide(f){ const pw=p.m[0].length, tx=Math.round(Math.max(0,Math.min(1,f))*(W-pw)); let guard=12;
    while(x!==tx&&guard--){ const st=tx>x?1:-1; if(hit(p.m,x+st,y)) break; x+=st; } }
  return {W:W*C,H:H*C,help:"Completa filas enteras. Arrastra la barra de abajo para mover y toca la pantalla para girar.",
    slider:true, slide, sliderPos:()=>{ const pw=p.m[0].length; return (W-pw)?x/(W-pw):.5; },
    pad:[["◀","left"],["⟳","rot"],["▶","right"],["▼","down"],["⤓","drop"]],
    act, key(k){ const m={ArrowLeft:"left",ArrowRight:"right",ArrowDown:"down",ArrowUp:"rot"," ":"drop"}; if(m[k])act(m[k]); },
    down(){ act("rot"); }, move(){}, up(){},
    update(dt){ acc+=dt; const sp=Math.max(.14,.7-lines*.025); if(acc>=sp){acc=0; if(!hit(p.m,x,y+1))y++; else lock();} },
    draw(c){ c.fillStyle="#0B2230"; c.fillRect(0,0,W*C,H*C); c.fillStyle="rgba(255,255,255,.07)";
      for(let i=0;i<W;i++)for(let j=0;j<H;j++)c.fillRect(i*C+C/2-1,j*C+C/2-1,2,2);
      board.forEach((row,j)=>row.forEach((col,i)=>{if(col)cell(c,i,j,col);}));
      let gy=y; while(!hit(p.m,x,gy+1))gy++;
      p.m.forEach((row,r)=>row.forEach((v,k)=>{ if(v&&gy+r>=0)cell(c,x+k,gy+r,p.c,.22); }));
      p.m.forEach((row,r)=>row.forEach((v,k)=>{ if(v&&y+r>=0)cell(c,x+k,y+r,p.c); })); },
    score:()=>`Filas: ${lines}`, msg:()=>msg, summary:()=>`Has hecho ${lines} ${lines===1?"fila":"filas"}.`};
}

/* ---------- 2. Salta obstáculos ---------- */
function Runner(){
  const W=480,H=300,GY=250;
  let pl={x:80,y:GY,vy:0,extra:1}, obs=[], speed=270, dist=0, best=0, dead=0, spawnIn=1.2, t=0, msg="";
  let clouds=[{x:60,y:50},{x:260,y:80},{x:420,y:40}];
  function jump(){ if(dead>0) return; if(pl.y>=GY-0.5){ pl.vy=-640; pl.extra=1; } else if(pl.extra>0){ pl.vy=-560; pl.extra--; } }
  return {W,H,dur:120,help:"Toca para saltar y vuelve a tocar en el aire para un doble salto. ¡Cada vez va más rápido!",
    down(){ jump(); }, move(){}, up(){}, key(k){ if(k===" "||k==="ArrowUp")jump(); },
    update(dt){
      t+=dt;
      if(dead>0){ dead-=dt; if(dead<=0){ obs=[]; dist=0; speed=270; spawnIn=.9; msg=""; } return; }
      speed=Math.min(600,speed+dt*13); dist+=speed*dt;
      pl.vy+=1750*dt; pl.y+=pl.vy*dt; if(pl.y>GY){pl.y=GY;pl.vy=0;pl.extra=1;}
      spawnIn-=dt;
      if(spawnIn<=0){ const tall=Math.random()<.35; obs.push({x:W+20,w:tall?24:28+Math.random()*16,h:tall?50:24+Math.random()*14,tall});
        if(speed>320&&Math.random()<.2) obs.push({x:W+20+60+Math.random()*25,w:24,h:24+Math.random()*10,tall:false});
        spawnIn=(0.55+Math.random()*0.6-Math.min(.2,speed/3000))*1.5; }
      obs.forEach(o=>o.x-=speed*dt); obs=obs.filter(o=>o.x+o.w>-10);
      clouds.forEach(cl=>{cl.x-=speed*.15*dt; if(cl.x<-60)cl.x=W+40;});
      for(const o of obs){
        if(pl.x+12>o.x+4 && pl.x-12<o.x+o.w-4 && pl.y>GY-o.h+4){
          dead=1; const m=Math.floor(dist/10); best=Math.max(best,m); msg=`¡Choque! ${m} m. Otra vez…`; break;
        }
      }
    },
    draw(c){
      const g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,"#FFC9A6"); g.addColorStop(1,"#A7E9E2"); c.fillStyle=g; c.fillRect(0,0,W,H);
      c.fillStyle="#FFD23F"; c.beginPath(); c.arc(400,60,26,0,7); c.fill();
      c.fillStyle="rgba(255,255,255,.9)"; clouds.forEach(cl=>{ c.beginPath(); c.arc(cl.x,cl.y,16,0,7); c.arc(cl.x+18,cl.y-6,20,0,7); c.arc(cl.x+38,cl.y,15,0,7); c.fill(); });
      c.fillStyle="#7FCF9A"; c.beginPath(); c.moveTo(0,GY); for(let i=0;i<=W;i+=20){ c.lineTo(i,GY-30-18*Math.sin((i+dist*.2)/60)); } c.lineTo(W,GY); c.fill();
      c.fillStyle="#F5D9A8"; c.fillRect(0,GY,W,H-GY); c.fillStyle="#E9C27E"; for(let i=-((dist)%40);i<W;i+=40)c.fillRect(i,GY+14,18,4);
      obs.forEach(o=>{ c.fillStyle=o.tall?"#3FA36B":"#8C7B6B"; c.strokeStyle="#17324D"; c.lineWidth=3;
        rrect(c,o.x,GY-o.h,o.w,o.h,o.tall?8:10); c.fill(); c.stroke();
        if(o.tall){ c.fillStyle="#3FA36B"; rrect(c,o.x-8,GY-o.h+14,10,16,4); c.fill(); c.stroke(); } });
      const bob=pl.y>=GY-0.5&&dead<=0?Math.sin(t*20)*2:0;
      c.fillStyle="#FFB3C7"; c.strokeStyle="#17324D"; c.lineWidth=3;
      c.beginPath(); c.ellipse(pl.x,pl.y-16+bob,16,16,0,0,7); c.fill(); c.stroke();
      c.fillStyle="#17324D"; c.beginPath(); c.arc(pl.x+4,pl.y-20+bob,2.6,0,7); c.arc(pl.x+11,pl.y-20+bob,2.6,0,7); c.fill();
      if(dead>0){ c.fillStyle="rgba(23,50,77,.25)"; c.fillRect(0,0,W,H); }
      c.fillStyle="rgba(255,255,255,.75)"; rrect(c,8,8,250,30,10); c.fill();
      c.fillStyle="#17324D"; c.font="900 18px Nunito, sans-serif"; c.fillText(`🏃 ${Math.floor(dist/10)} m   ·   🏆 Récord: ${best} m`,18,29);
    },
    score:()=>`${Math.floor(dist/10)} m`, msg:()=>msg, summary:()=>`Tu mejor carrera: ${Math.max(best,Math.floor(dist/10))} metros.`};
}

/* ---------- 3. Rompe ladrillos ---------- */
function Breakout(){
  const W=360,H=520,COLS=8,ROWS=6,BW=38,BH=16,GAP=4,TOP=64;
  const LEFT=(W-(COLS*BW+(COLS-1)*GAP))/2, PY=H-34;
  const COLORS=["#FF6B81","#FB8C00","#FFD23F","#5BC67A","#4FC3F7","#B57EDC"];
  let bricks=[], pad={x:W/2,w:78}, ball, lives=3, score=0, level=1, msg="";
  function build(){ bricks=[]; for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)bricks.push({x:LEFT+c*(BW+GAP),y:TOP+r*(BH+GAP),c:COLORS[r],on:true}); }
  function reset(){ ball={x:pad.x,y:PY-9,vx:0,vy:0,r:7,stuck:true}; }
  const sp=()=>280+level*25;
  function launch(){ if(!ball.stuck) return; const a=(-90+(Math.random()*50-25))*Math.PI/180; ball.vx=Math.cos(a)*sp(); ball.vy=Math.sin(a)*sp(); ball.stuck=false; msg=""; }
  build(); reset();
  return {W,H,help:"Mueve el dedo para llevar la pala. Toca para lanzar.",
    down(x){ pad.x=clamp(x,pad.w/2,W-pad.w/2); launch(); }, move(x){ pad.x=clamp(x,pad.w/2,W-pad.w/2); }, up(){},
    key(k){ if(k==="ArrowLeft")pad.x=clamp(pad.x-24,pad.w/2,W-pad.w/2); if(k==="ArrowRight")pad.x=clamp(pad.x+24,pad.w/2,W-pad.w/2); if(k===" ")launch(); },
    update(dt){
      if(ball.stuck){ ball.x=pad.x; return; }
      const steps=3; for(let s=0;s<steps;s++){
        const px=ball.x, py=ball.y; ball.x+=ball.vx*dt/steps; ball.y+=ball.vy*dt/steps;
        if(ball.x<ball.r){ball.x=ball.r;ball.vx=Math.abs(ball.vx);} if(ball.x>W-ball.r){ball.x=W-ball.r;ball.vx=-Math.abs(ball.vx);}
        if(ball.y<ball.r){ball.y=ball.r;ball.vy=Math.abs(ball.vy);}
        if(ball.vy>0 && ball.y+ball.r>=PY && ball.y+ball.r<=PY+14 && Math.abs(ball.x-pad.x)<=pad.w/2+ball.r){
          const f=clamp((ball.x-pad.x)/(pad.w/2),-1,1), a=(-90+f*60)*Math.PI/180;
          ball.vx=Math.cos(a)*sp(); ball.vy=Math.sin(a)*sp(); ball.y=PY-ball.r;
        }
        for(const b of bricks){ if(!b.on) continue;
          const nx=clamp(ball.x,b.x,b.x+BW), ny=clamp(ball.y,b.y,b.y+BH);
          if((ball.x-nx)**2+(ball.y-ny)**2<=ball.r*ball.r){
            b.on=false; score+=10;
            if(py+ball.r<=b.y||py-ball.r>=b.y+BH) ball.vy=-ball.vy; else ball.vx=-ball.vx;
            break;
          }
        }
      }
      if(ball.y-ball.r>H){ lives--; if(lives<=0){ lives=3; build(); msg="Sin vidas: ¡muro nuevo!"; } else msg=`Te quedan ${lives} vidas`; reset(); }
      if(bricks.every(b=>!b.on)){ level++; build(); reset(); msg=`¡Nivel ${level}!`; }
    },
    draw(c){
      c.fillStyle="#132F42"; c.fillRect(0,0,W,H);
      bricks.forEach(b=>{ if(!b.on)return; c.fillStyle=b.c; rrect(c,b.x,b.y,BW,BH,4); c.fill(); c.fillStyle="rgba(255,255,255,.35)"; c.fillRect(b.x+4,b.y+3,BW-8,3); });
      c.fillStyle="#fff"; rrect(c,pad.x-pad.w/2,PY,pad.w,12,6); c.fill();
      c.fillStyle="#FFD23F"; c.beginPath(); c.arc(ball.x,ball.y,ball.r,0,7); c.fill();
      c.fillStyle="#fff"; c.font="900 15px Nunito, sans-serif"; c.fillText("❤".repeat(lives)+`   Nivel ${level}`,12,26);
    },
    score:()=>`${score} pts`, msg:()=>msg, summary:()=>`Has hecho ${score} puntos y llegado al nivel ${level}.`};
}

/* ---------- 4. Une tres ---------- */
function Match3(){
  const N=7,CS=50,W=N*CS,H=N*CS,T=6;
  const COL=["#FF5C6E","#3D9BE9","#4CC35C","#FFD23F","#B57EDC","#FB8C00"];
  let g=[],off=[],sel=null,score=0,phase="idle",timer=0,pending=null,start=null,startPt=null,combo=0,msg="";
  const rt=()=>Math.floor(Math.random()*T);
  for(let r=0;r<N;r++){ g.push([]); off.push(Array(N).fill(0)); for(let c=0;c<N;c++){ let v; do{v=rt();}while((c>=2&&g[r][c-1]===v&&g[r][c-2]===v)||(r>=2&&g[r-1][c]===v&&g[r-2][c]===v)); g[r].push(v);} }
  function find(){ const m=[]; const mark=Array.from({length:N},()=>Array(N).fill(false));
    for(let r=0;r<N;r++){ let k=1; for(let c=1;c<=N;c++){ if(c<N&&g[r][c]!==null&&g[r][c]===g[r][c-1])k++; else { if(k>=3)for(let j=c-k;j<c;j++)mark[r][j]=true; k=1; } } }
    for(let c=0;c<N;c++){ let k=1; for(let r=1;r<=N;r++){ if(r<N&&g[r][c]!==null&&g[r][c]===g[r-1][c])k++; else { if(k>=3)for(let j=r-k;j<r;j++)mark[j][c]=true; k=1; } } }
    for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(mark[r][c])m.push([r,c]); return m; }
  const swap=(a,b)=>{ const t=g[a[0]][a[1]]; g[a[0]][a[1]]=g[b[0]][b[1]]; g[b[0]][b[1]]=t; };
  function hasMoves(){ for(let r=0;r<N;r++)for(let c=0;c<N;c++)for(const [dr,dc] of [[0,1],[1,0]]){ const r2=r+dr,c2=c+dc; if(r2>=N||c2>=N)continue; swap([r,c],[r2,c2]); const ok=find().length>0; swap([r,c],[r2,c2]); if(ok)return true; } return false; }
  function step(){
    const m=find();
    if(!m.length){ if(pending){ swap(pending[0],pending[1]); msg="Así no se junta ninguna fila"; } pending=null; return false; }
    pending=null; combo++; score+=m.length*10*combo; if(combo>1)msg=`¡Combo x${combo}!`;
    m.forEach(([r,c])=>g[r][c]=null);
    for(let c=0;c<N;c++){ let w=N-1; for(let r=N-1;r>=0;r--){ if(g[r][c]!==null){ if(r!==w){ g[w][c]=g[r][c]; off[w][c]=(r-w)*CS; g[r][c]=null; } w--; } }
      for(let r=w;r>=0;r--){ g[r][c]=rt(); off[r][c]=-(w+1)*CS; } }
    return true;
  }
  function doSwap(a,b){ swap(a,b); pending=[a,b]; phase="check"; timer=.12; sel=null; combo=0; msg=""; }
  const adj=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1;
  const cellAt=(x,y)=>[clamp(Math.floor(y/CS),0,N-1),clamp(Math.floor(x/CS),0,N-1)];
  function shape(c,k,x,y,s){
    c.fillStyle=COL[k]; c.strokeStyle="rgba(0,0,0,.35)"; c.lineWidth=2.5; c.beginPath();
    if(k===0){ c.arc(x,y,s,0,7); }
    else if(k===1){ c.moveTo(x,y-s); c.lineTo(x+s,y); c.lineTo(x,y+s); c.lineTo(x-s,y); c.closePath(); }
    else if(k===2){ rrect(c,x-s*.85,y-s*.85,s*1.7,s*1.7,6); }
    else if(k===3){ for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?s*.45:s; c.lineTo(x+rr*Math.cos(a),y+rr*Math.sin(a)); } c.closePath(); }
    else if(k===4){ c.moveTo(x,y-s); c.lineTo(x+s,y+s*.8); c.lineTo(x-s,y+s*.8); c.closePath(); }
    else { for(let i=0;i<6;i++){ const a=i*Math.PI/3; c.lineTo(x+s*Math.cos(a),y+s*Math.sin(a)); } c.closePath(); }
    c.fill(); c.stroke();
    c.fillStyle="rgba(255,255,255,.45)"; c.beginPath(); c.arc(x-s*.3,y-s*.35,s*.22,0,7); c.fill();
  }
  return {W,H,help:"Desliza o toca dos piezas vecinas para cambiarlas y juntar tres iguales.",
    down(x,y){ if(phase!=="idle")return; start=cellAt(x,y); startPt={x,y}; },
    move(x,y){ if(!start||phase!=="idle")return; const dx=x-startPt.x, dy=y-startPt.y;
      if(Math.hypot(dx,dy)>CS*.4){ const t=Math.abs(dx)>Math.abs(dy)?[start[0],start[1]+Math.sign(dx)]:[start[0]+Math.sign(dy),start[1]];
        if(t[0]>=0&&t[0]<N&&t[1]>=0&&t[1]<N) doSwap(start,t); start=null; } },
    up(){ if(!start)return; if(sel&&adj(sel,start)) doSwap(sel,start); else sel=(sel&&sel[0]===start[0]&&sel[1]===start[1])?null:start; start=null; },
    key(){},
    update(dt){
      let moving=false;
      for(let r=0;r<N;r++)for(let c=0;c<N;c++){ if(off[r][c]<0){ off[r][c]=Math.min(0,off[r][c]+760*dt); moving=true; } }
      if(phase==="check"){ timer-=dt; if(timer<=0&&!moving){ if(step()) timer=.22; else { phase="idle"; if(!hasMoves()){ const flat=shuffle(g.flat()); for(let r=0;r<N;r++)for(let c=0;c<N;c++)g[r][c]=flat[r*N+c]; phase="check"; timer=.1; msg="¡Barajamos!"; } } } }
    },
    draw(c){
      for(let r=0;r<N;r++)for(let c2=0;c2<N;c2++){ c.fillStyle=(r+c2)%2?"#1A3B50":"#15344A"; c.fillRect(c2*CS,r*CS,CS,CS); }
      if(sel){ c.strokeStyle="#FFD23F"; c.lineWidth=4; rrect(c,sel[1]*CS+3,sel[0]*CS+3,CS-6,CS-6,10); c.stroke(); }
      for(let r=0;r<N;r++)for(let c2=0;c2<N;c2++){ const k=g[r][c2]; if(k===null)continue; shape(c,k,c2*CS+CS/2,r*CS+CS/2+off[r][c2],CS*.36); }
    },
    score:()=>`${score} pts`, msg:()=>msg, summary:()=>`Has hecho ${score} puntos.`};
}

/* ---------- 5. Moto de colinas ---------- */
function Hill(){
  const W=480,H=300,R=10,D=40,GRAV=640,ACC=1150,MAXV=540,ROT_AIR=3.0,ROT_GND=0.35;
  const P=640, START=350, startX=100;
  let seed=Math.random()*1000, p1,p2,q1,q2, gas=false, brake=false, fuel, cans, coins;
  let coinN=0, pts=0, best=0, dead=0, msg="", camY=0, air=0, spin=0, lastA=0, wasAir=false, pop="", popT=0, lastSeg=-1;
  const rnd=k=>{ const v=Math.sin(k*12.9898+seed*78.233)*43758.5453; return v-Math.floor(v); };
  const TYPES=["kicker","kicker","kicker","hump","hump","hump","double","double","rocks","rocks","river","river","tunnel","tunnel","mud"];
  function seg(x){
    const d=x-startX; if(d<START) return null;
    const k=Math.floor((d-START)/P), u=(d-START)-k*P, lvl=Math.min(1,k/12);
    let t; if(k===0) t="hump"; else if(k===1) t="kicker"; else t=TYPES[Math.floor(rnd(k)*TYPES.length)];
    return {k,u,t,lvl,x0:x-u};
  }
  const hills=x=>{ const k=Math.min(1,.25+Math.max(0,x-startX)/5000); return 200-k*(36*Math.sin((x+seed)/170)+18*Math.sin((x+seed*2)/71)+62*Math.sin((x+seed*3)/430)); };
  const RIVER={up:120,top:40}; const gapOf=s=>110+Math.round(60*s.lvl+30*rnd(s.k+.5));
  function feature(x){
    const s=seg(x); if(!s) return 0; const u=s.u, Hh=50+50*s.lvl;
    switch(s.t){
      case "kicker": { const L=120,F=34; return u<L?-Hh*Math.pow(u/L,1.7):(u<L+F?-Hh*(1-(u-L)/F):0); }
      case "hump": { const L=230; return u<L?-(Hh*.9)*Math.pow(Math.sin(Math.PI*u/L),2):0; }
      case "double": { const L=150; return u<2*L?-(Hh*.6)*Math.pow(Math.sin(Math.PI*(u%L)/L),2):0; }
      case "mud": { const L=90, M=mudLen(s); if(u<L) return -26*Math.pow(Math.sin(Math.PI*u/(2*L)),2); if(u<L+18) return -26*(1-(u-L)/18); if(u<L+18+M) return 16; const e=u-(L+18+M); if(e<60) return 8+8*Math.cos(Math.PI*e/60); return 0; }
      case "tunnel": { let y=0; for(const c of [190,320,450]){ const r=(u-c)/40; if(Math.abs(r)<1) y=Math.min(y,-11*(0.5+0.5*Math.cos(Math.PI*r))); } return y; }
      case "rocks": { let y=0; for(const c of [140,260,380,500]){ const r=(u-c)/48; if(Math.abs(r)<1) y=Math.min(y,-8*(0.5+0.5*Math.cos(Math.PI*r))); } return y; }
      case "river": { const G=gapOf(s), up=RIVER.up, top=RIVER.top, h2=Hh*.8;
        if(u<up) return -h2*Math.pow(u/up,1.4); if(u<up+top) return -h2;
        if(u<up+top+G) return 150; return 0; }
      default: return 0;
    }
  }
  const ground=x=>hills(x)+feature(x);
  const slope=x=>(ground(x+1)-ground(x-1))/2;
  const mudLen=s=>110+Math.round(50*s.lvl+30*rnd(s.k+.3));
  const inMud=x=>{ const s=seg(x); return s&&s.t==="mud"&&s.u>=108&&s.u<108+mudLen(s); };
  const TUN={a:70,b:560,gap:74};
  function ceil(x){ const s=seg(x); if(!s||s.t!=="tunnel"||s.u<TUN.a||s.u>TUN.b) return null; return hills(x)-TUN.gap; }
  function water(x){ const s=seg(x); if(!s||s.t!=="river") return null; const G=gapOf(s), a=RIVER.up+RIVER.top; if(s.u>=a&&s.u<a+G) return {y:hills(x)+30,x0:s.x0+a,x1:s.x0+a+G}; return null; }
  const norm=a=>{ while(a>Math.PI)a-=2*Math.PI; while(a<-Math.PI)a+=2*Math.PI; return a; };
  function reset(){
    p1={x:startX,y:ground(startX)-R-2}; p2={x:startX+D,y:ground(startX+D)-R-2}; q1={...p1}; q2={...p2};
    fuel=100; cans=[];
    for(let i=1;i<20;i++){ let x=startX+i*7500; for(let t=0;t<20&&(water(x)||(seg(x)&&seg(x).t==="river"));t++) x+=60; cans.push({x,got:false}); }
    coins=[]; for(let i=1;i<700;i++){ const x=startX+i*55; if(i%9<5&&!water(x)) coins.push({x,got:false}); }
    dead=0; pts=0; air=0; spin=0; wasAir=false; camY=ground(startX)-190; lastA=0; lastSeg=-1;
  }
  reset();
  const onGround=p=>p.y>=ground(p.x)-R-1.5;
  function collide(p,q){
    const gy=ground(p.x); if(p.y<=gy-R) return;
    let vx=p.x-q.x, vy=p.y-q.y;
    p.y=gy-R; const s=Math.max(-3,Math.min(3,slope(p.x))), l=Math.hypot(s,1), nx=s/l, ny=-1/l;
    const vn=vx*nx+vy*ny;
    if(vn<0){ vx-=nx*vn; vy-=ny*vn; }
    const f=inMud(p.x)?.975:.997; vx*=f; vy*=f; q.x=p.x-vx; q.y=p.y-vy;
  }
  const center=()=>({x:(p1.x+p2.x)/2,y:(p1.y+p2.y)/2});
  const angle=()=>Math.atan2(p2.y-p1.y,p2.x-p1.x);
  const dist=()=>Math.max(0,Math.floor((center().x-startX)/10));
  function crash(why){ dead=1.5; msg=why; best=Math.max(best,pts); }
  function bonus(t,n){ pts+=n; pop=`${t} +${n}`; popT=1.6; }
  function rotateAround(cx,cy,a){ const co=Math.cos(a), si=Math.sin(a);
    for(const [p,q] of [[p1,q1],[p2,q2]]){ const vx=p.x-q.x, vy=p.y-q.y, dx=p.x-cx, dy=p.y-cy;
      p.x=cx+dx*co-dy*si; p.y=cy+dx*si+dy*co; q.x=p.x-vx; q.y=p.y-vy; } }
  const headPt=()=>{ const c=center(), a=angle(); return {x:c.x+Math.sin(a)*30,y:c.y-Math.cos(a)*30}; };
  return {W,H,dur:240,help:"Gas para acelerar y freno para frenar. En el aire, Gas gira hacia atrás y Freno hacia delante. Salta el río y el barro, y en los túneles ve despacio.",
    hold:[["◀ Freno","brake"],["Gas ▶","gas"]],
    setHold(a,v){ if(a==="gas")gas=v; else brake=v; },
    key(k,v){ if(k==="ArrowRight")gas=v; if(k==="ArrowLeft")brake=v; },
    down(){}, move(){}, up(){},
    _st:()=>({air:!onGround(p1)&&!onGround(p2),a:angle(),pts,m:dist()}),
    update(dt){
      if(popT>0) popT-=dt;
      if(dead>0){ dead-=dt; if(dead<=0){ seed=Math.random()*1000; reset(); msg=""; } return; }
      const sub=5, h=dt/sub;
      for(let s=0;s<sub;s++){
        for(const [p,q] of [[p1,q1],[p2,q2]]){
          let vx=p.x-q.x, vy=p.y-q.y; const sp=Math.hypot(vx,vy)/h; if(sp>MAXV){ vx*=MAXV/sp; vy*=MAXV/sp; }
          q.x=p.x; q.y=p.y; p.x+=vx*.9993; p.y+=vy*.9993+GRAV*h*h;
        }
        const g1=onGround(p1), g2=onGround(p2), c=center();
        if(g1||g2){
          if(fuel>0&&(gas||brake)){ const dir=gas?1:-1;
            for(const [p,gr] of [[p1,g1],[p2,g2]]) if(gr){ const s2=Math.max(-3,Math.min(3,slope(p.x))), l=Math.hypot(1,s2), acc=ACC*(inMud(p.x)?.45:1); p.x+=dir*acc*h*h/l; p.y+=dir*acc*h*h*s2/l; }
            if(gas&&g1&&g2) rotateAround(p1.x,p1.y,-ROT_GND*h);
          }
        } else if(gas||brake){ rotateAround(c.x,c.y,(gas?-1:1)*ROT_AIR*h); }
        for(let it=0;it<3;it++){
          const dx=p2.x-p1.x, dy=p2.y-p1.y, d=Math.hypot(dx,dy)||1, k=(d-D)/d/2;
          p1.x+=dx*k; p1.y+=dy*k; p2.x-=dx*k; p2.y-=dy*k; collide(p1,q1); collide(p2,q2);
        }
      }
      const c=center(), a=angle(), inAir=!onGround(p1)&&!onGround(p2), hd=headPt();
      if(inAir){ air+=dt; spin+=norm(a-lastA); }
      else if(wasAir){
        const flips=Math.floor((Math.abs(spin)+0.7)/(2*Math.PI));
        if(flips>0) bonus(flips>1?`¡${flips} volteretas!`:(spin<0?"¡Voltereta atrás!":"¡Voltereta adelante!"),flips*500);
        else if(air>0.7) bonus("¡Gran salto!",Math.round(air*100));
        air=0; spin=0;
      }
      wasAir=inAir; lastA=a;
      const sg=seg(c.x+120);
      if(sg&&sg.k!==lastSeg){ lastSeg=sg.k; if(sg.t==="river") msg="¡Río a la vista! Coge velocidad"; else if(sg.t==="mud") msg="¡Charco de barro! Sáltalo o te atascarás"; else if(sg.t==="tunnel") msg="Túnel: ¡ve despacio o te darás en la cabeza!"; else if(sg.t==="rocks") msg="Piedras en el camino"; else msg=""; }
      fuel=Math.max(0,fuel-dt*(gas?3:.7));
      for(const cn of cans){ if(cn.got) continue; const gy=ground(cn.x), top=gy-36, bot=gy-4;
        if([p1,p2,c,hd].some(pt=>Math.abs(pt.x-cn.x)<12+R&&pt.y>top-R&&pt.y<bot+R)){ cn.got=true; fuel=100; msg="¡Gasolina llena!"; } }
      for(const co of coins){ if(co.got) continue; const cy=ground(co.x)-34;
        if([p1,p2,c,hd].some(pt=>Math.hypot(pt.x-co.x,pt.y-cy)<8+R)){ co.got=true; coinN++; pts+=10; } }
      for(const p of [p1,p2]){ const w=water(p.x); if(w&&p.y>w.y) return crash(`¡Al agua! ${pts} puntos`); }
      if(hd.y>ground(hd.x)-3) return crash(`¡Te has caído! ${pts} puntos`);
      for(const pt of [hd,{x:p1.x,y:p1.y-R},{x:p2.x,y:p2.y-R}]){ const cy=ceil(pt.x); if(cy!==null&&pt.y-6<cy) return crash(`¡Cabezazo en el túnel! ${pts} puntos`); }
      const sp=Math.hypot(p1.x-q1.x,p1.y-q1.y)/(dt/5);
      if(fuel<=0&&sp<8&&!inAir) return crash(`Sin gasolina: ${pts} puntos`);
      best=Math.max(best,pts);
      camY+=((c.y-170)-camY)*Math.min(1,dt*3);
    },
    draw(c){
      const ce=center(), camX=ce.x-150, a=angle();
      const g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,"#FFC9A6"); g.addColorStop(1,"#A7E9E2"); c.fillStyle=g; c.fillRect(0,0,W,H);
      c.fillStyle="rgba(63,163,107,.3)"; c.beginPath(); c.moveTo(0,H);
      for(let x=0;x<=W;x+=12) c.lineTo(x,150-camY*.3+30*Math.sin((x+camX*.3)/90)); c.lineTo(W,H); c.fill();
      // agua
      for(let x=0;x<=W;x+=4){ const w=water(camX+x); if(w){ c.fillStyle="#3D9BE9"; c.fillRect(x,w.y-camY,4,H); c.fillStyle="rgba(255,255,255,.5)"; if(((camX+x)|0)%24<8) c.fillRect(x,w.y-camY,4,2); } }
      // suelo
      c.beginPath(); c.moveTo(0,H); for(let x=0;x<=W;x+=4){ const gx=camX+x; c.lineTo(x,water(gx)?H+50:ground(gx)-camY); } c.lineTo(W,H); c.closePath(); c.fillStyle="#9C6B3F"; c.fill();
      for(let x=0;x<W;x+=4){ const gx=camX+x; if(water(gx)) continue; const y=ground(gx)-camY, s=seg(gx);
        const wood=s&&s.t==="river"&&s.u<RIVER.up+RIVER.top;
        c.strokeStyle=inMud(gx)?"#5A3A1E":wood?"#C98B55":"#4CC35C"; c.lineWidth=inMud(gx)?12:9; c.beginPath(); c.moveTo(x,y); c.lineTo(x+4.5,ground(gx+4)-camY); c.stroke();
        if(wood&&((gx|0)%28<4)){ c.fillStyle="#7A4E2A"; c.fillRect(x,y,4,H); }
        if(inMud(gx)){ c.fillStyle="#5A3A1E"; c.fillRect(x,y-9,4,10); if(((gx|0)%30<5)){ c.fillStyle="#3E2712"; c.beginPath(); c.arc(x+2,y-9,3,0,7); c.fill(); } } }
      for(let x=0;x<W;x+=4){ const gx=camX+x, cy=ceil(gx); if(cy===null) continue; const y=cy-camY;
        c.fillStyle="#6E6A73"; c.fillRect(x,-10,4.5,y+10); c.fillStyle="#4E4A55"; c.fillRect(x,y-8,4.5,8);
        if(((gx|0)%60<5)){ c.fillStyle="#88848E"; c.beginPath(); c.arc(x,y-30,6,0,7); c.fill(); } }
      coins.forEach(co=>{ if(co.got)return; const x=co.x-camX; if(x<-20||x>W+20)return; const y=ground(co.x)-34-camY;
        c.fillStyle="#FFD23F"; c.strokeStyle="#B8860B"; c.lineWidth=3; c.beginPath(); c.arc(x,y,8,0,7); c.fill(); c.stroke(); });
      cans.forEach(cn=>{ if(cn.got)return; const x=cn.x-camX; if(x<-30||x>W+30)return; const y=ground(cn.x)-camY;
        c.fillStyle="#E53935"; c.strokeStyle="#17324D"; c.lineWidth=3; rrect(c,x-12,y-36,24,30,4); c.fill(); c.stroke(); c.fillStyle="#fff"; c.font="900 13px Nunito,sans-serif"; c.fillText("⛽",x-9,y-15); });
      for(const p of [p1,p2]){ const x=p.x-camX, y=p.y-camY, r=p.x/R;
        c.fillStyle="#1E1E1E"; c.beginPath(); c.arc(x,y,R,0,7); c.fill(); c.fillStyle="#C9D2DA"; c.beginPath(); c.arc(x,y,R*.5,0,7); c.fill();
        c.strokeStyle="#1E1E1E"; c.lineWidth=2; for(let k=0;k<3;k++){ const an=r+k*2.09; c.beginPath(); c.moveTo(x,y); c.lineTo(x+Math.cos(an)*R*.5,y+Math.sin(an)*R*.5); c.stroke(); } }
      c.save(); c.translate(ce.x-camX,ce.y-camY); c.rotate(a);
      c.strokeStyle="#17324D"; c.lineWidth=4; c.lineCap="round";
      c.beginPath(); c.moveTo(-20,0); c.lineTo(-4,-12); c.lineTo(14,-12); c.lineTo(20,0); c.stroke();
      c.fillStyle="#FF5C8A"; c.beginPath(); c.moveTo(-10,-10); c.lineTo(14,-14); c.lineTo(18,-6); c.lineTo(-6,-4); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(14,-12); c.lineTo(20,-24); c.stroke();
      c.strokeStyle="#3D7DD8"; c.lineWidth=5; c.beginPath(); c.moveTo(-2,-14); c.lineTo(2,-26); c.lineTo(14,-22); c.stroke();
      c.fillStyle="#FFB3C7"; c.strokeStyle="#17324D"; c.lineWidth=3; c.beginPath(); c.arc(4,-32,7.5,0,7); c.fill(); c.stroke();
      c.fillStyle="#FFD23F"; c.beginPath(); c.arc(4,-33,7.5,Math.PI,2*Math.PI); c.fill(); c.stroke();
      c.restore();
      c.fillStyle="rgba(23,50,77,.75)"; rrect(c,8,8,120,14,7); c.fill();
      c.fillStyle=fuel>25?"#5BC67A":"#FF5C6E"; rrect(c,10,10,116*fuel/100,10,5); c.fill();
      c.fillStyle="#17324D"; c.font="900 15px Nunito,sans-serif"; c.fillText(`⭐ ${pts}  ·  ${dist()} m  ·  🏆 ${best}`,138,21);
      if(popT>0&&pop){ c.globalAlpha=Math.min(1,popT); c.font="900 26px Nunito,sans-serif"; c.textAlign="center"; c.lineWidth=6; c.strokeStyle="#17324D"; c.strokeText(pop,W/2,70); c.fillStyle="#FFD23F"; c.fillText(pop,W/2,70); c.textAlign="left"; c.globalAlpha=1; }
      if(dead>0){ c.fillStyle="rgba(23,50,77,.3)"; c.fillRect(0,0,W,H); }
    },
    score:()=>`⭐ ${pts}`, msg:()=>msg, summary:()=>`Tu mejor puntuación: ${best} puntos y ${coinN} monedas.`};
}

const GAMES=[Blocks,Runner,Breakout,Match3,Hill];
const NAMES=["Bloques que caen","Salta obstáculos","Rompe ladrillos","Une tres","Moto de colinas"];

function start(idx,onEnd){
  injectCSS();
  const i=((idx%GAMES.length)+GAMES.length)%GAMES.length, g=GAMES[i]();
  const ov=document.createElement("div"); ov.className="pz-ov";
  ov.innerHTML=`<div class="pz-top"><b>🎁 ${NAMES[i]}</b><span class="pz-pill" data-t></span><span class="pz-pill" data-s></span><button class="pz-btn" data-x>Salir</button></div>
    <div class="pz-help" data-h>${g.help}</div><div class="pz-stage"><canvas></canvas></div>${g.slider?`<div class="pz-slider"><div class="pz-knob"></div></div>`:""}${g.pad?`<div class="pz-pad">${g.pad.map(([l,a])=>`<button data-a="${a}">${l}</button>`).join("")}</div>`:""}${g.hold?`<div class="pz-pad two">${g.hold.map(([l,a])=>`<button data-h="${a}">${l}</button>`).join("")}</div>`:""}`;
  document.body.appendChild(ov);





  const cv=ov.querySelector("canvas"), stage=ov.querySelector(".pz-stage"), ctx=cv.getContext("2d");
  const dpr=Math.min(2,window.devicePixelRatio||1); cv.width=g.W*dpr; cv.height=g.H*dpr; ctx.scale(dpr,dpr);
  function fit(){ const r=stage.getBoundingClientRect(); const s=Math.max(.2,Math.min((r.width-8)/g.W,(r.height-8)/g.H)); cv.style.width=g.W*s+"px"; cv.style.height=g.H*s+"px"; }
  fit(); window.addEventListener("resize",fit);
  const pt=e=>{ const r=cv.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*g.W,(e.clientY-r.top)/r.height*g.H]; };
  let down=false;
  cv.addEventListener("pointerdown",e=>{ e.preventDefault(); down=true; try{cv.setPointerCapture(e.pointerId);}catch(_){} const [x,y]=pt(e); g.down(x,y); });
  cv.addEventListener("pointermove",e=>{ if(!down&&e.pointerType!=="mouse")return; const [x,y]=pt(e); g.move(x,y); });
  const upH=e=>{ if(!down)return; down=false; const [x,y]=pt(e); g.up(x,y); };
  cv.addEventListener("pointerup",upH); cv.addEventListener("pointercancel",upH);
  ov.querySelectorAll(".pz-pad button[data-a]").forEach(b=>b.addEventListener("pointerdown",e=>{ e.preventDefault(); g.act(b.dataset.a); }));
  ov.querySelectorAll(".pz-pad button[data-h]").forEach(b=>{
    const on=e=>{ e.preventDefault(); try{b.setPointerCapture(e.pointerId);}catch(_){} g.setHold(b.dataset.h,true); b.style.background="rgba(255,255,255,.35)"; };
    const off=()=>{ g.setHold(b.dataset.h,false); b.style.background=""; };
    b.addEventListener("pointerdown",on); b.addEventListener("pointerup",off); b.addEventListener("pointercancel",off); b.addEventListener("lostpointercapture",off);
  });
  const sl=ov.querySelector(".pz-slider"), knob=ov.querySelector(".pz-knob");
  if(sl){ let drag=false; const f=e=>{ const r=sl.getBoundingClientRect(); return (e.clientX-r.left-32)/(r.width-64); };
    sl.addEventListener("pointerdown",e=>{ e.preventDefault(); drag=true; try{sl.setPointerCapture(e.pointerId);}catch(_){} g.slide(f(e)); });
    sl.addEventListener("pointermove",e=>{ if(drag) g.slide(f(e)); });
    const st=()=>{ drag=false; }; sl.addEventListener("pointerup",st); sl.addEventListener("pointercancel",st); }
  const onKey=e=>{ if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(e.key)){ e.preventDefault(); g.key(e.key,true); } };
  const onKeyUp=e=>{ if(g.hold&&["ArrowLeft","ArrowRight"].includes(e.key)) g.key(e.key,false); };
  document.addEventListener("keydown",onKey); document.addEventListener("keyup",onKeyUp);
  const end=Date.now()+(g.dur?g.dur*1000:DUR); let running=true, last=0, paused=false;
  function loop(t){
    if(!running) return;
    const dt=Math.min(.05,last?(t-last)/1000:0); last=t;
    if(!paused) g.update(dt); g.draw(ctx);
    const left=Math.max(0,end-Date.now()), s=Math.ceil(left/1000);
    ov.querySelector("[data-t]").textContent=`⏱ ${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
    ov.querySelector("[data-s]").textContent=g.score();
    if(knob&&g.sliderPos) knob.style.left=`calc(32px + ${g.sliderPos()} * (100% - 64px))`;
    const m=g.msg&&g.msg(); ov.querySelector("[data-h]").textContent=m||g.help;
    if(left<=0) return finish();
    requestAnimationFrame(loop);
  }
  function finish(){
    running=false;
    const e=document.createElement("div"); e.className="pz-end";
    e.innerHTML=`<div><b>¡Se acabó el recreo!</b><span>${g.summary()}</span><span>Ahora todo vuelve a empezar y tus gemas se quedan.</span><button>Volver</button></div>`;
    ov.appendChild(e); e.querySelector("button").onclick=close;
  }
  function close(){ running=false; window.removeEventListener("resize",fit); document.removeEventListener("keydown",onKey); document.removeEventListener("keyup",onKeyUp); ov.remove(); if(onEnd) onEnd(); }
  ov.querySelector("[data-x]").addEventListener("pointerdown",e=>{
    e.preventDefault(); e.stopPropagation();
    if(!running) return close();
    if(ov.querySelector(".pz-ask")) return;
    paused=true;
    const a=document.createElement("div"); a.className="pz-end pz-ask";
    a.innerHTML=`<div><b>¿Salir del premio?</b><span>Si sales, el premio se gasta igualmente.</span><button data-yes>Sí, salir</button><button data-no style="background:#fff;color:#17324D">Seguir jugando</button></div>`;
    ov.appendChild(a);
    a.querySelector("[data-yes]").addEventListener("pointerdown",ev=>{ ev.preventDefault(); close(); });
    a.querySelector("[data-no]").addEventListener("pointerdown",ev=>{ ev.preventDefault(); a.remove(); paused=false; last=0; });
  });
  requestAnimationFrame(loop);
}
/* Premios permitidos por perfil (Configuración → Premios). Sin configurar = todos. */
function allowed(pid){
  try{
    const id=pid||(typeof PROFILE!=="undefined"?PROFILE:null);
    const p=(typeof CEVA!=="undefined"&&id)?CEVA.profiles().find(x=>x.id===id):null;
    const a=p&&Array.isArray(p.prizes)?p.prizes.filter(i=>i>=0&&i<GAMES.length):null;
    return a&&a.length?a:GAMES.map((_,i)=>i);
  }catch(e){ return GAMES.map((_,i)=>i); }
}
/* n = vueltas completadas: va rotando solo entre los premios permitidos */
function pick(n,pid){ const a=allowed(pid); return a[((+n||0)%a.length+a.length)%a.length]; }
window.Premios={start,NAMES,allowed,pick};
})();
