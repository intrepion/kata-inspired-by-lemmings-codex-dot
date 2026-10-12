import type { Garden, Rect, Skill } from './levels.ts';
export const WIDTH=120, HEIGHT=60;
export type State = 'walk'|'fall'|'builder'|'basher'|'digger'|'blocker'|'rescued'|'lost';
export type Creature = {id:number;x:number;y:number;dir:1|-1;state:State;umbrella:boolean;fall:number;clock:number;steps:number};
let nextRun = 0;
export class Simulation {
 readonly run = ++nextRun;
 readonly garden:Garden;
 terrain = new Uint8Array(WIDTH*HEIGHT);
 creatures:Creature[]=[];
 tick=0; rescued=0; lost=0; spawned=0;
 status:'playing'|'won'|'failed'='playing';
 charges:Garden['charges'];
 constructor(garden:Garden) {
  this.garden=garden; this.charges={...garden.charges};
  for(const r of garden.earth)this.paint(r,1);
  for(const r of garden.steel)this.paint(r,2);
 }
 get active() {return this.creatures.filter(c=>c.state!=='lost'&&c.state!=='rescued');}
 get remaining(){return this.garden.crew-this.spawned;}
 cell(x:number,y:number){return x<0||x>=WIDTH||y<0||y>=HEIGHT?0:this.terrain[y*WIDTH+x];}
 private paint(r:Rect,value:number){for(let y=Math.max(0,r.y);y<Math.min(HEIGHT,r.y+r.h);y++)for(let x=Math.max(0,r.x);x<Math.min(WIDTH,r.x+r.w);x++)this.terrain[y*WIDTH+x]=value;}
 private clear(r:Rect){for(let y=Math.max(0,r.y);y<Math.min(HEIGHT,r.y+r.h);y++)for(let x=Math.max(0,r.x);x<Math.min(WIDTH,r.x+r.w);x++)if(this.cell(x,y)!==2)this.terrain[y*WIDTH+x]=0;}
 private contains(r:Rect,c:Creature){return c.x>=r.x&&c.x<r.x+r.w&&c.y>=r.y&&c.y<r.y+r.h;}
 private finish(c:Creature,state:'lost'|'rescued'){c.state=state;if(state==='lost')this.lost++;else this.rescued++;}
 canAssign(id:number,skill:Skill,run=this.run):boolean {
  const c=this.active.find(c=>c.id===id);
  if(run!==this.run||this.status!=='playing'||!c)return false;
  if(skill==='release')return c.state==='blocker';
  if(this.charges[skill]<=0)return false;
  if(skill==='umbrella')return !c.umbrella;
  if(c.state!=='walk'||!this.cell(c.x,c.y))return false;
  if(skill==='basher')return this.cell(c.x+c.dir,c.y-1)===1;
  if(skill==='digger')return this.cell(c.x,c.y)===1;
  return true;
 }
 assign(id:number,skill:Skill,run=this.run):boolean {
  if(!this.canAssign(id,skill,run))return false;
  const c=this.creatures.find(c=>c.id===id)!;
  if(skill==='release'){c.state='walk';c.dir=c.dir===1?-1:1;}
  else {this.charges[skill]--;if(skill==='umbrella')c.umbrella=true;else {c.state=skill;c.clock=0;c.steps=0;}}
  return true;
 }
 step(count=1){for(let i=0;i<count&&this.status==='playing';i++)this.advance();}
 private advance(){
  this.tick++;
  if(this.remaining>0&&(this.tick-1)%60===0){this.spawned++;this.creatures.push({id:this.spawned,...this.garden.spawn,state:'walk',umbrella:false,fall:0,clock:0,steps:0});}
  for(const c of this.active){
   if(c.x<0||c.x>=WIDTH||c.y>=HEIGHT||c.y<1){this.finish(c,'lost');continue;}
   if(this.garden.hazards.some(r=>this.contains(r,c))){this.finish(c,'lost');continue;}
   if(this.contains(this.garden.exit,c)){this.finish(c,'rescued');continue;}
   c.clock++;
   if(c.state==='digger'){
    if(c.clock<8)continue;c.clock=0;
    if([c.x-1,c.x,c.x+1].some(x=>this.cell(x,c.y)===2)){c.state='walk';continue;}
    if(!this.cell(c.x,c.y)){c.state='fall';continue;}
    this.clear({x:c.x-1,y:c.y,w:3,h:1});c.y++;continue;
   }
   if(!this.cell(c.x,c.y)){
    if(c.state!=='fall'){c.state='fall';c.fall=0;}
    if(!c.umbrella||c.clock%3===0){c.y++;c.fall++;}
    if(this.cell(c.x,c.y)){if(c.fall>14&&!c.umbrella)this.finish(c,'lost');else{c.state='walk';c.fall=0;c.clock=0;}}
    continue;
   }
   if(c.state==='fall'){if(c.fall>14&&!c.umbrella){this.finish(c,'lost');continue;}c.state='walk';c.fall=0;}
   if(c.state==='blocker')continue;
   if(c.state==='builder'){
    if(c.clock<8)continue;c.clock=0;
    const nx=c.x+2*c.dir,ny=c.y-1;
    if(nx<0||nx>=WIDTH||ny<3||this.cell(nx,ny-1)||this.cell(nx,ny-2)||this.cell(c.x+c.dir,ny-1)||this.cell(c.x+c.dir,ny-2)){c.state='walk';c.dir=c.dir===1?-1:1;continue;}
    for(const x of [c.x+c.dir,nx])if(!this.cell(x,ny))this.paint({x,y:ny,w:1,h:1},1);
    c.x=nx;c.y=ny;c.steps++;if(c.steps>=12)c.state='walk';continue;
   }
   if(c.state==='basher'){
    if(c.clock<8)continue;c.clock=0;
    const nx=c.x+c.dir;
    if([1,2,3].some(h=>this.cell(nx,c.y-h)===2)){c.state='walk';continue;}
    if(![1,2,3].some(h=>this.cell(nx,c.y-h)===1)){c.state='walk';continue;}
    this.clear({x:nx,y:c.y-3,w:1,h:3});c.x=nx;continue;
   }
   if(c.clock<6)continue;c.clock=0;
   const nx=c.x+c.dir;
   if(this.active.some(b=>b.id!==c.id&&b.state==='blocker'&&Math.abs(b.y-c.y)<=1&&Math.abs(b.x-nx)<=1)){c.dir=c.dir===1?-1:1;continue;}
   if(this.cell(nx,c.y-1)){
    if(this.cell(nx,c.y-1)===1&&!this.cell(nx,c.y-2)&&!this.cell(nx,c.y-3)){c.x=nx;c.y--;}
    else c.dir=c.dir===1?-1:1;
   }else c.x=nx;
  }
  if(this.rescued>=this.garden.quota)this.status='won';
  else if(this.rescued+this.active.length+this.remaining<this.garden.quota||this.tick>=6000)this.status='failed';
 }
}
