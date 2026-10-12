import { Simulation, WIDTH, HEIGHT } from './simulation.ts';
const S=8;
export function draw(ctx:CanvasRenderingContext2D,s:Simulation,selected:number|null){
 const w=WIDTH*S,h=HEIGHT*S;
 const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#102f35');bg.addColorStop(.7,'#244840');bg.addColorStop(1,'#172f2c');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 // Original observatory garden: paper moon, distant slopes and seed lanterns.
 ctx.fillStyle='#d5dfb2';ctx.beginPath();ctx.arc(794,79,34,0,Math.PI*2);ctx.fill();ctx.fillStyle='#bac996';ctx.beginPath();ctx.arc(785,71,5,0,Math.PI*2);ctx.fill();
 for(let i=0;i<55;i++){const x=(i*173+61)%w,y=(i*67+21)%290;ctx.globalAlpha=.2+(i%3)*.15;ctx.fillStyle='#e4e3b3';ctx.fillRect(x,y,2,2);}ctx.globalAlpha=1;
 for(let j=0;j<3;j++){ctx.fillStyle=['#1d3e3d','#21453f','#294c40'][j];ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w;x+=30)ctx.lineTo(x,260+j*45+Math.sin(x/105+j*2)*39);ctx.lineTo(w,h);ctx.fill();}
 for(let i=0;i<9;i++){const x=i*121+24;ctx.strokeStyle='#396152';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,390);ctx.quadraticCurveTo(x+20,300,x-5,230+i%3*22);ctx.stroke();ctx.fillStyle='#365f50';ctx.beginPath();ctx.ellipse(x+4,282+i%3*10,18,6,-.6,0,Math.PI*2);ctx.fill();}
 for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){
  const cell=s.cell(x,y);if(!cell)continue;const px=x*S,py=y*S;
  ctx.fillStyle=cell===2?'#6a8281':((x+y)%4===0?'#5c6651':'#495745');ctx.fillRect(px,py,S,S);
  if(!s.cell(x,y-1)){ctx.fillStyle=cell===2?'#a4bcba':'#91b875';ctx.fillRect(px,py,S,3);if(cell===1){ctx.fillStyle='#abc886';ctx.fillRect(px+(x%3)*2,py-2,2,3);}}
  if(cell===2){ctx.strokeStyle='#425e61';ctx.lineWidth=1;ctx.strokeRect(px+.5,py+.5,7,7);ctx.fillStyle='#9bb0ae';ctx.fillRect(px+2,py+2,2,2);}
  else if((x*3+y)%7===0){ctx.fillStyle='#718168';ctx.fillRect(px+2,py+4,3,1);}
 }
 for(const r of s.garden.hazards){ctx.fillStyle='#573242';ctx.fillRect(r.x*S,r.y*S,r.w*S,r.h*S);ctx.strokeStyle='#f493a4';ctx.lineWidth=2;for(let x=r.x*S+3;x<(r.x+r.w)*S;x+=9){ctx.beginPath();ctx.moveTo(x,r.y*S+12);ctx.lineTo(x+4,r.y*S-3);ctx.lineTo(x+8,r.y*S+10);ctx.stroke();}}
 const e=s.garden.exit,ex=(e.x+e.w/2)*S,ey=(e.y+e.h)*S;
 const light=ctx.createRadialGradient(ex,ey-23,2,ex,ey-23,64);light.addColorStop(0,'#fadd8780');light.addColorStop(1,'#fadd8700');ctx.fillStyle=light;ctx.fillRect(ex-64,ey-87,128,128);
 ctx.fillStyle='#dac995';ctx.fillRect(ex-23,ey-43,46,42);ctx.fillStyle='#f9df8e';ctx.fillRect(ex-13,ey-30,26,29);ctx.fillStyle='#28473d';ctx.beginPath();ctx.moveTo(ex-30,ey-43);ctx.lineTo(ex,ey-65);ctx.lineTo(ex+30,ey-43);ctx.fill();ctx.fillStyle='#fff0bc';ctx.fillRect(ex-3,ey-53,6,8);
 ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillStyle='#fff0c9';ctx.fillText('SHELTER',ex,ey-74);
 const spawn=s.garden.spawn;ctx.fillStyle='#658c76';ctx.fillRect(spawn.x*S-13,spawn.y*S-43,26,18);ctx.fillStyle='#ccdcab';ctx.fillRect(spawn.x*S-9,spawn.y*S-39,18,9);ctx.strokeStyle='#799e83';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(spawn.x*S-13,spawn.y*S-44);ctx.lineTo(spawn.x*S,spawn.y*S-58);ctx.lineTo(spawn.x*S+13,spawn.y*S-44);ctx.stroke();ctx.fillStyle='#c1d5be';ctx.fillText('CREW',spawn.x*S,spawn.y*S-66);
 for(const c of s.active){
  const x=c.x*S+4,y=c.y*S;const selectedCreature=c.id===selected;
  if(selectedCreature){ctx.strokeStyle='#ffedb1';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-11,15,18,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#ffedb1';ctx.beginPath();ctx.moveTo(x-5,y-35);ctx.lineTo(x+5,y-35);ctx.lineTo(x,y-29);ctx.fill();}
  ctx.fillStyle='#eedcb2';ctx.beginPath();ctx.ellipse(x,y-9,6,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=c.state==='blocker'?'#eda2ad':'#9bbb78';ctx.beginPath();ctx.moveTo(x-7,y-14);ctx.quadraticCurveTo(x-4,y-26,x+7,y-14);ctx.fill();ctx.fillStyle='#e0d79b';ctx.fillRect(x-3,y-22,2,5);
  ctx.fillStyle='#183a37';ctx.fillRect(x+c.dir*3-1,y-12,2,2);
  const stride=c.state==='walk'?Math.floor(s.tick/3)%2*2:0;ctx.fillStyle='#d6c79b';ctx.fillRect(x-5,y-2-stride,3,3);ctx.fillRect(x+2,y-2+stride,3,3);
  ctx.fillStyle='#f2d47f';ctx.fillRect(x+c.dir*7-2,y-8,4,5);
  if(c.umbrella){ctx.strokeStyle='#cec4f5';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y-14);ctx.lineTo(x,y-31);ctx.stroke();ctx.fillStyle='#c4b4ec';ctx.beginPath();ctx.arc(x,y-31,11,Math.PI,Math.PI*2);ctx.fill();}
  if(c.state==='blocker'){ctx.strokeStyle='#eda2ad';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-12,y-10);ctx.lineTo(x+12,y-10);ctx.stroke();}
  if(c.state==='builder'){ctx.fillStyle='#e9bf75';ctx.fillRect(x+c.dir*9-3,y-12,6,3);}
  if(c.state==='basher'||c.state==='digger'){ctx.strokeStyle='#d8e4c5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+4,y-14);ctx.lineTo(x+12,y-5);ctx.stroke();}
  ctx.fillStyle=selectedCreature?'#fff2bd':'#c8d6be';ctx.font='9px monospace';ctx.fillText(String(c.id),x,y+13);
 }
 if(s.tick===0){ctx.font='14px sans-serif';ctx.fillStyle='#d5e2cd';ctx.textAlign='left';ctx.fillText('A little crew. A bright way home.',28,42);}
}
