import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RescueControls } from '../src/controls.ts';
import { Simulation } from '../src/simulation.ts';
import { gardens, type Garden } from '../src/levels.ts';

const fixture = (change: Partial<Garden> = {}): Garden => ({
 ...gardens[0], crew: 1, quota: 1, spawn: { x: 10, y: 40, dir: 1 },
 earth: [{ x: 0, y: 40, w: 120, h: 20 }], steel: [], hazards: [],
 exit: { x: 115, y: 36, w: 4, h: 5 },
 charges: { blocker: 2, builder: 2, basher: 2, digger: 2, umbrella: 2 }, ...change
});
const run = (garden = fixture()) => {
 const sim = new Simulation(garden);
 sim.step();
 return { sim, controls: new RescueControls(sim) };
};

test('inspecting a moving glowling keeps the crew walking', () => {
 const { sim, controls } = run();
 controls.paused = false;
 assert.equal(controls.inspect(1), true);
 assert.equal(controls.paused, false);
 controls.advance(6);
 assert.equal(sim.tick, 7);
 assert.equal(sim.active[0].x, 11);
 assert.equal(controls.selected, 1);
});

test('a skill-first click assigns to the moving glowling immediately without pausing', () => {
 const { sim, controls } = run();
 controls.paused = false;
 controls.skill = 'builder';
 assert.deepEqual(controls.target(10.5, 38.7), { target: 1, assigned: true });
 assert.equal(sim.active[0].state, 'builder');
 assert.equal(sim.charges.builder, 1);
 assert.equal(controls.paused, false);
 controls.advance(8);
 assert.equal(sim.tick, 9);
 assert.equal(sim.active[0].steps, 1);
 assert.equal(sim.cell(12, 39), 1);
});

test('explicit stepping pauses and live inspection does not resume paused play', () => {
 const { sim, controls } = run();
 controls.paused = false;
 controls.step(6);
 assert.equal(controls.paused, true);
 assert.equal(sim.tick, 7);
 controls.inspect(1);
 controls.skill = 'umbrella';
 assert.equal(controls.apply(), true);
 controls.advance(20);
 assert.equal(sim.tick, 7);
 assert.equal(sim.active[0].umbrella, true);
});

test('a click at an old walking position misses without spending a charge', () => {
 const { sim, controls } = run();
 controls.paused = false;
 controls.skill = 'builder';
 controls.inspect(1);
 controls.advance(18);
 assert.equal(sim.active[0].x, 13);
 assert.deepEqual(controls.target(10.5, 38.7), { target: null, assigned: false });
 assert.equal(sim.charges.builder, 2);
 assert.equal(sim.active[0].state, 'walk');
 assert.deepEqual(controls.target(13.5, 38.7), { target: 1, assigned: true });
 assert.equal(sim.charges.builder, 1);
 assert.equal(controls.paused, false);
});

test('invalid targets never fall through to another overlapping glowling', () => {
 const { sim, controls } = run(fixture({ crew: 2, quota: 2 }));
 sim.assign(1, 'blocker');
 sim.step(60);
 assert.equal(sim.active.length, 2);
 controls.skill = 'builder';
 const result = { target: 1, assigned: false };
 assert.deepEqual(controls.target(10.5, 38.7), result);
 assert.deepEqual(controls.target(10.5, 38.7), result);
 assert.equal(sim.charges.builder, 2);
 assert.equal(sim.creatures[1].state, 'walk');
 assert.equal(controls.inspect(2), true);
 assert.equal(sim.creatures[1].state, 'walk');
 assert.equal(controls.apply(), true);
 assert.equal(sim.creatures[1].state, 'builder');
});

test('pointer and roster assignments reject stale runs and inactive travelers', () => {
 const { sim, controls } = run();
 controls.skill = 'umbrella';
 assert.equal(controls.inspect(1, sim.run - 1), false);
 assert.deepEqual(controls.target(10.5, 38.7, sim.run - 1), { target: null, assigned: false });
 assert.equal(controls.selected, null);
 assert.equal(sim.charges.umbrella, 2);
 controls.inspect(1);
 assert.equal(controls.apply(sim.run - 1), false);
 sim.step(650);
 assert.equal(sim.rescued, 1);
 assert.deepEqual(controls.target(115.5, 38.7), { target: null, assigned: false });
 assert.equal(controls.inspect(1), false);
 assert.equal(controls.apply(), false);
 assert.equal(sim.charges.umbrella, 2);
});
