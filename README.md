# Mosslight Rescue

An original, quiet rescue puzzle about a little lantern crew finding its way through six handcrafted gardens. Inspired by the autonomous-walker and limited-skill genre; all names, art and layouts are original.

## Play locally

Production preview: **http://127.0.0.1:5205/**

Install Node 24, then:

```sh
npm ci
npm run build
node scripts/serve.mjs
```

The last command starts a session-only detached process, binds loopback only, logs to `/tmp/mosslight-rescue-5205.log`, and prints its PID. It refuses an occupied port and never stops another server. No login or boot autostart is installed. To stop the printed process, run `kill PID`. The server currently running for delivery has PID 76883.

Exact restart from this workspace (after stopping this game's existing PID):

```sh
cd /Users/intrepion/Documents/Codex/2026-10-11/task-21/kata-inspired-by-lemmings-codex-dot && npm run build && node scripts/serve.mjs
```

For development: `npm run dev -- --port 5206 --strictPort` after checking that port is free.

## Controls

Release/resume, pause, tick/0.3s/1s/3s stepping, four speeds, retry and garden selection are visible controls. Choose a toolkit skill, then click a moving traveler on the canvas to assign it immediately while the crew keeps walking. A numbered crew card inspects that traveler without pausing or assigning; use Apply or Enter to assign the chosen skill to the inspected traveler. Pause explicitly to plan. Step pauses and advances the chosen interval. Canvas clicks use current positions, target the nearest body under the pointer, and never cycle or redirect to another traveler after an invalid assignment. Use crew cards for exact overlapping targets. Invalid assignment never spends a charge. Blocker release is free. Keyboard: Tab controls, Space pause, period step, 1–6 skills, Enter apply on canvas, R retry. Native buttons keep their normal keyboard behavior when focused.

Bash soft walls, build twelve stairs, dig shafts, turn crews with blockers, and equip permanent safe-fall umbrellas. Rootstone is immutable. Bramble and falls over fourteen cells are fatal. Rescue the exact displayed quota to unlock the next garden. Garden hints give concrete solutions. Campaign best scores save on this browser origin/device; a reload restarts the current incomplete garden, not a mid-run snapshot. Reset requires confirmation.

## Verification

```sh
npm test
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

31 observable input/domain/save tests include six actual campaign solution replays. Live input tests cover uninterrupted inspection and direct assignment, explicit stepping, moving targets, overlap, invalid charges, stale runs and inactive travelers. See [specification](docs/SPEC.md), [glossary](GLOSSARY.md), [decisions](docs/decisions.md), [QA evidence](docs/QA.md), and [independent reviews](docs/REVIEWS.md). Browser gameplay and simulation replay are separately reported. No audio or external runtime assets; only TypeScript and Vite development tools.

## Play online

[Play the hosted game](https://intrepion.github.io/kata-inspired-by-lemmings-codex-dot/)
