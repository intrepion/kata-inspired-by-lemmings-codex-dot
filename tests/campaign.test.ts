import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Simulation} from '../src/simulation.ts';
import {gardens} from '../src/levels.ts';
for(let i=0;i<gardens.length;i++)test(`visible solution rescues quota in ${gardens[i].name}`,()=>{
 const s=new Simulation(gardens[i]);const actions:string[]=[];
 for(let t=0;t<6000&&s.status==='playing';t++){
  for(const c of s.active){
   const apply=(skill:Parameters<Simulation['assign']>[1])=>{if(s.assign(c.id,skill))actions.push(`${s.tick}: #${c.id} ${skill} at ${c.x},${c.y}`);};
   if(i===0&&c.x===47&&c.dir===1)apply('basher');
   if((i===1||i===5)&&c.x===42&&c.dir===1)apply('builder');
   if(i===2&&!c.umbrella)apply('umbrella');
   if(i===3&&c.x===38&&c.y===25)apply('digger');
   if(i===4&&c.id===1&&c.x===20)apply('blocker');
   if(i===4&&c.x===64&&c.dir===1)apply('basher');
   if(i===5&&c.x===79&&c.dir===1)apply('basher');
  }
  s.step();
 }
 assert.equal(s.status,'won',JSON.stringify({actions,creatures:s.creatures}));assert.ok(s.rescued>=s.garden.quota);
 console.log(`Garden ${i+1}: ${s.rescued}/${s.garden.quota}, ${s.tick} ticks; ${actions.join('; ')}`);
});
test('Roots & rain also supports a diagonal miner route without a digger',()=>{
 const s=new Simulation(gardens[3]);let mined=false;
 for(let t=0;t<6000&&s.status==='playing';t++){
  for(const c of s.active)if(!mined&&c.x===38&&c.y===25)mined=s.assign(c.id,'miner');
  s.step();
 }
 assert.equal(mined,true);assert.equal(s.status,'won');assert.equal(s.rescued,6);
 assert.equal(s.charges.digger,1);assert.equal(s.charges.miner,0);
});
