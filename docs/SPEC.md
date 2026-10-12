# Mosslight Rescue specification

## Problem and solution
Deliver an original complete rescue puzzle campaign inspired by autonomous walkers and limited skills. Six gardens teach excavation, bridges, falls, shafts, redirection and a combined finale. Every garden is winnable with ordinary visible controls.

## User stories
1. Inspect a garden before releasing the crew.
2. See crew size, exact rescue quota, rescued/lost/live/remaining counts and charges.
3. Pause, resume, single-step and choose 0.5x/1x/2x/4x speed.
4. Select moving or overlapping glowling travelers reliably through canvas and roster; selection pauses.
5. Apply a selected charged skill to exactly one valid active traveler without wasting charges on invalid actions.
6. Build stairs, bash soft walls, dig shafts, redirect with blockers and equip permanent safe-fall umbrellas.
7. See rootstone, bramble, spawn and shelter distinctly; hazards precede rescue.
8. Retry with a fresh run; stale selected IDs cannot affect a new run.
9. Read a garden-specific tutorial and an optional concrete hint.
10. Unlock subsequent gardens and retain best rescue counts across reloads.
11. Receive an ending after the sixth garden; replay any unlocked garden.
12. Use keyboard controls and readable narrow layouts without offscreen controls.
13. Confirm clearing saved progress; cancel safely.
14. Recover from corrupt saves or unavailable storage without breaking gameplay.

## Simulation contract
20 fixed ticks/second. Walk every 6 ticks; spawn first on tick 1 and subsequent every 60 ticks. Support is the cell under a creature's feet. Walkers climb one cell and turn at higher walls or rootstone. Blockers redirect nearby walkers; release is free and turns the released traveler toward its redirected crew. Builders create 12 stairs two cells wide and one cell high, every 8 ticks, stopping at overhead obstruction. Bashers clear a three-cell-high soft corridor at 8-tick intervals; diggers clear a three-cell shaft downward, stopping at rootstone. Earthwork requires grounded walkers; umbrella works on any active unequipped traveler. Falls over 14 cells are fatal without umbrella; umbrella slows descent. Bounds are fatal, terrain operations are clipped. Success occurs on meeting quota, failure when rescued + live + unreleased < quota or after 6000 ticks. Accounting is conserved throughout.

## Testing and verification
Behavior tests through the Simulation seam cover invariant accounting, clipped terrain, charge validation, builders and excavation collisions, blockers, fatal/safe falls, hazard/shelter priority, spawning, exact quota, impossible failure, paused assignment, speed equivalence, retry stale inputs and save validation. Replay real campaign solutions. Strict typecheck, build, audit and GitHub CI. Independently review code and specification. Actual supported Chrome gameplay and screenshots are separate evidence from automated simulation. Physical touch, keyboard and audio cannot be claimed without testing.

## Scope
No historical art, names, levels or music. No paid assets, remote runtime dependencies, public deployment or changes to earlier repositories/servers. Canvas is accompanied by accessible DOM controls and roster; full screen-reader terrain play is out of scope.
