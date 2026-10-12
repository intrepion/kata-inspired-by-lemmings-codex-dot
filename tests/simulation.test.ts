import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Simulation } from '../src/simulation.ts';
import { gardens } from '../src/levels.ts';
test('a fresh paused run spawns only when stepped and preserves crew accounting', () => {
 const s = new Simulation(gardens[0]);
 assert.equal(s.tick,0); assert.equal(s.creatures.length,0);
 s.step(); assert.equal(s.creatures.length,1);
 assert.equal(s.rescued+s.lost+s.active.length+s.remaining,5);
});
import type {Garden} from '../src/levels.ts';
const fixture=(change:Partial<Garden>={}):Garden=>({...gardens[0],crew:1,quota:1,spawn:{x:10,y:40,dir:1},earth:[{x:0,y:40,w:120,h:20}],steel:[],hazards:[],exit:{x:115,y:36,w:4,h:5},charges:{blocker:2,builder:2,basher:2,digger:2,umbrella:2},...change});
function spawn(g=fixture()){const s=new Simulation(g);s.step();return s;}
test('invalid assignments preserve charges and stale run input is rejected',()=>{
 const s=spawn();assert.equal(s.assign(1,'basher'),false);assert.equal(s.charges.basher,2);
 assert.equal(s.assign(88,'builder'),false);assert.equal(s.assign(1,'builder',s.run-1),false);
 assert.equal(s.assign(1,'umbrella'),true);assert.equal(s.assign(1,'umbrella'),false);assert.equal(s.charges.umbrella,1);
 assert.equal(s.assign(1,'blocker'),true);assert.equal(s.assign(1,'builder'),false);
 const retry=new Simulation(s.garden);retry.step();assert.equal(retry.assign(1,'blocker',s.run),false);
});
test('first spawn is tick 1, next tick 61 and accounting is conserved',()=>{
 const s=new Simulation(fixture({crew:3,quota:3}));s.step(60);assert.equal(s.spawned,1);s.step();assert.equal(s.spawned,2);
 for(let i=0;i<800&&s.status==='playing';i++){s.step();assert.equal(s.rescued+s.lost+s.active.length+s.remaining,3);}
});
test('fatal fall and safe umbrella fall have distinct outcomes',()=>{
 const g=fixture({spawn:{x:10,y:10,dir:1}});const fatal=spawn(g);fatal.step(40);assert.equal(fatal.lost,1);assert.equal(fatal.status,'failed');
 const safe=spawn(g);assert.equal(safe.assign(1,'umbrella'),true);safe.step(100);assert.equal(safe.lost,0);assert.equal(safe.active[0].y,40);
});
test('14-cell falls survive and 15-cell falls do not',()=>{
 for(const [y,lost] of [[26,0],[25,1]]){const s=spawn(fixture({spawn:{x:10,y,dir:1}}));s.step(30);assert.equal(s.lost,lost);}
});
test('bramble beats an overlapping shelter, quota failure is immediate',()=>{
 const s=spawn(fixture({hazards:[{x:10,y:36,w:2,h:5}],exit:{x:10,y:36,w:2,h:5}}));assert.equal(s.lost,1);assert.equal(s.rescued,0);assert.equal(s.status,'failed');
});
test('exact quota wins without requiring the remaining crew to die',()=>{
 const s=spawn(fixture({crew:3,quota:1,exit:{x:10,y:36,w:2,h:5}}));assert.equal(s.status,'won');assert.equal(s.rescued,1);assert.equal(s.remaining,2);s.step(100);assert.equal(s.tick,1);
});
test('blockers turn followers and can be released without charges',()=>{
 const s=spawn(fixture({crew:2,quota:1}));s.step(36);assert.equal(s.assign(1,'blocker'),true);const x=s.creatures[0].x;s.step(120);
 assert.equal(s.creatures[0].x,x);assert.equal(s.creatures[1].dir,-1);assert.equal(s.assign(1,'release'),true);assert.equal(s.creatures[0].dir,-1);
});
test('builders make finite stairs and stop at overhead rootstone',()=>{
 const s=spawn();s.assign(1,'builder');s.step(96);assert.equal(s.creatures[0].steps,12);assert.equal(s.creatures[0].y,28);assert.equal(s.cell(34,28),1);
 const blocked=spawn(fixture({steel:[{x:12,y:37,w:1,h:1}]}));blocked.assign(1,'builder');blocked.step(8);assert.equal(blocked.creatures[0].steps,0);assert.equal(blocked.creatures[0].dir,-1);assert.equal(blocked.cell(12,37),2);
});
test('bashers excavate soft walls but never rootstone',()=>{
 const s=spawn(fixture({earth:[{x:0,y:40,w:120,h:20},{x:11,y:30,w:4,h:10}],steel:[{x:14,y:37,w:1,h:3}]}));assert.equal(s.assign(1,'basher'),true);s.step(40);assert.equal(s.cell(11,39),0);assert.equal(s.cell(14,39),2);assert.equal(s.creatures[0].state,'walk');
});
test('diggers stop at rootstone and preserve the shaft boundaries',()=>{
 const s=spawn(fixture({steel:[{x:9,y:43,w:3,h:1}]}));s.assign(1,'digger');s.step(32);assert.equal(s.cell(10,40),0);assert.equal(s.cell(8,40),1);assert.equal(s.cell(10,43),2);assert.equal(s.creatures[0].y,43);
});
test('terrain creation clips negative rectangles and bounds are fatal',()=>{
 const s=spawn(fixture({spawn:{x:0,y:40,dir:-1},earth:[{x:-5,y:40,w:125,h:30}]}));assert.equal(s.cell(-1,40),0);assert.equal(s.cell(0,40),1);s.step(10);assert.equal(s.status,'failed');assert.equal(s.terrain.length,7200);
});
test('speed presentation batches do not change the simulation',()=>{
 const a=spawn(),b=spawn();a.assign(1,'builder');b.assign(1,'builder');for(let i=0;i<200;i++)a.step();for(let i=0;i<50;i++)b.step(4);assert.deepEqual(a.creatures,b.creatures);assert.deepEqual(a.terrain,b.terrain);
});
test('paused skill assignment never advances time and retry reconstructs terrain',()=>{
 const s=spawn();s.assign(1,'digger');assert.equal(s.tick,1);s.step(8);assert.equal(s.cell(10,40),0);const retry=new Simulation(s.garden);assert.equal(retry.cell(10,40),1);assert.equal(retry.tick,0);assert.equal(retry.charges.digger,2);
});
test('trapped blockers eventually fail instead of running forever',()=>{const s=spawn();s.assign(1,'blocker');s.step(6000);assert.equal(s.status,'failed');});
test('one-cell rootstone turns walkers while one-cell moss is climbable',()=>{
 const steel=spawn(fixture({steel:[{x:11,y:39,w:1,h:1}]}));steel.step(5);assert.equal(steel.creatures[0].x,10);assert.equal(steel.creatures[0].dir,-1);
 const moss=spawn(fixture({earth:[{x:0,y:40,w:120,h:20},{x:11,y:39,w:1,h:1}]}));moss.step(5);assert.equal(moss.creatures[0].x,11);assert.equal(moss.creatures[0].y,39);
});
test('builders stop before a low ceiling above the intermediate stair',()=>{
 const s=spawn(fixture({steel:[{x:11,y:37,w:1,h:1}]}));s.assign(1,'builder');s.step(8);assert.equal(s.creatures[0].steps,0);assert.equal(s.cell(11,39),0);
});
