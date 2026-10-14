import { Simulation } from './simulation.ts';
import type { Skill } from './levels.ts';

export type TargetResult = { target: number | null; assigned: boolean };
// Cell bounds match the rendered body, hat and feet (eight pixels per cell),
// with room for side tools. Labels, umbrella canopy and selection rings are not targets.
const TARGET_BODY = { halfWidth: 1.5, top: 3.25, bottom: .5, centerX: .5, centerY: 1.3 };

/** Input state for one run; terrain and traveler behavior stay in Simulation. */
export class RescueControls {
 readonly sim: Simulation;
 paused = true;
 selected: number | null = null;
 skill: Skill = 'basher';
 constructor(sim: Simulation) { this.sim = sim; }
 inspect(id: number, run = this.sim.run): boolean {
  if (run !== this.sim.run || !this.sim.active.some(c => c.id === id)) return false;
  this.selected = id;
  return true;
 }
 apply(run = this.sim.run): boolean {
  return this.selected !== null && this.sim.assign(this.selected, this.skill, run);
 }
 target(x: number, y: number, run = this.sim.run): TargetResult {
  if (run !== this.sim.run) return { target: null, assigned: false };
  // Bound the click to a rendered traveler, not a broad radius of nearby walkers.
  const candidates = this.sim.active.filter(c =>
   Math.abs(c.x + TARGET_BODY.centerX - x) <= TARGET_BODY.halfWidth &&
   y >= c.y - TARGET_BODY.top && y <= c.y + TARGET_BODY.bottom
  ).sort((a, b) =>
   Math.hypot(a.x + TARGET_BODY.centerX - x, a.y - TARGET_BODY.centerY - y) -
   Math.hypot(b.x + TARGET_BODY.centerX - x, b.y - TARGET_BODY.centerY - y) || a.id - b.id
  );
  const target = candidates[0];
  if (!target) return { target: null, assigned: false };
  this.inspect(target.id, run);
  return { target: target.id, assigned: this.apply(run) };
 }
 step(count = 1) { this.paused = true; this.sim.step(count); }
 advance(count = 1) { if (!this.paused) this.sim.step(count); }
}
