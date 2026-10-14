# QA evidence

## 2026-10-14 live-targeting correction

31 Node tests pass after adding six input-boundary regressions. The old inspection behavior was extracted unchanged and the new running-state test failed with `true !== false`; removing automatic pause made it pass. Immediate canvas assignment and explicit paused stepping each had their own failing tracer before implementation. Strict typecheck and production build pass. The six new tests use real Simulation and RescueControls interfaces, without browser mocks: a running inspection advances ticks and position; a live Builder click spends one charge and creates its first stair eight ticks later; Step preserves paused play; a click at an old position spends no charge; repeated invalid clicks on an overlapping blocker do not assign another traveler; stale-run and inactive-target input cannot assign. Existing six-garden solutions still pass.

Current behavior: choose a skill and click a traveler under the pointer to assign immediately while running. Numbered crew cards inspect without pausing or assigning; Apply/Enter remains the deliberate accessible assignment action. Pause/Step are explicit. Help/reset dialogs and document hiding retain their interruption pauses. Current-position bounded hit testing replaces broad-radius repeated-click cycling. A miss or invalid action never spends a charge or falls through to another traveler.

Fresh coordinated Chrome extension browser check at http://localhost:5205/ used a separate origin from the usual 127.0.0.1 preview, without clearing progress. Through visible Step controls, staged Garden 1 at 10.5s, traveler #1 at column 47; selected Basher, half speed, resumed, then clicked its rendered body. Observed WALKING retained, Basher 1→0, traveler #1 in basher state, and success feedback “Crew keeps walking.” Time advanced to 12.5s and traveler #1 reached column 51 while excavating the wall. Clicking crew card #2 inspected it while time and all walkers continued. Explicit Pause then stopped the run at 17.7s, and the completed tunnel was visible. New served production JS index-4zo4pleM.js and CSS index-ClnzGZp8.css were fetched and matched the build byte for byte. This is focused desktop interaction evidence; the six-garden replay and edge cases above are simulation tests. The Chrome campaign evidence below is historical and describes the prior paused-inspection controls.


## Historical automated simulation

25 Node tests pass. Six scripted solutions use the same public Simulation.assign and step interfaces as the visible controls. These are deterministic simulation replays, not browser gameplay. Completion ticks: garden1 799, garden2 811, garden3 868, garden4 866, garden5 841, garden6 883. Additional assertions cover accounting, timing, impossible quota, exact quota, paused assignment, stale run input, retry, clipped terrain, blockers/free release, fall thresholds/umbrella, bramble priority, builders, soft excavation/rootstone and speed batches. Corrupt save decoding and sequential unlock integrity have separate tests.

Targeted red/green evidence: initial spawn/accounting tracer failed before Simulation existed; save-corruption tracer failed before decoder existed; both independent-review collision regressions failed against the old behavior then passed with their fixes. Node test output is reproducible with npm test.

## Historical supported local Chrome (prior controls)

Loaded the production build at http://127.0.0.1:5205 with the user's Chrome extension. Completed all six gardens through ordinary visible Step, crew selection, toolkit and Apply controls. No debug completion controls or page-state injection were used.

| Garden | Browser result | Actions |
| --- | --- | --- |
| Waking grove | 5 rescued | Step to tick210; inspect #1 at47; apply Basher |
| Stitch in the sky | 5 rescued | Deliberate no-bridge failure (2 lost); Try again; build #1 at42/tick180 |
| Dandelion descent | 5 rescued | Equip all five at spawn through roster; traverse the high drop |
| Roots & rain | 6 rescued | Dig #1 at38/tick138; follow shaft and lower shelf |
| Wrong way home | 5 rescued | Block #1 at20/tick48; bash #2 at64/tick354 |
| Lantern observatory | 6 rescued + ending | Build #1 at42/tick174; bash at79/tick360 |

Also completed Garden 2 on the corrected build at 390×844 with optional blocker: build at42, hold #2 at34, release after bridge; 5 rescued, 0 lost. Desktop and 390px full-page screenshots inspected; no horizontal overflow (document375px, viewport390px). Narrow roster selection, skill assignment, step controls and release were actually operated.

Verified saved completion survives reload (3/6 then 6/6). Canceling clear-progress retained all six completions after reload. Invalid Basher assignment was disabled away from a wall; retry cleared selection and restored charges. Live4× movement worked; opening Help interrupted and paused it. Scripted period and Tab keyboard input worked through Chrome. Two repeated visible canvas clicks near travelers #1/#2 cycled selection from #2 to #1 with time paused. The Chrome extension was able to operate; no unlocking or security changes attempted.

Screenshots: [campaign complete](qa/campaign-complete.jpg), [narrow controls](qa/narrow-controls.jpg). Browser console inspection showed third-party extension warnings only, no app errors in the returned logs.

## Limits

Physical touch and physical keyboard hardware were not tested; scripted keyboard coverage is limited to period stepping and Tab focus. Full screen-reader terrain play, other browsers and audio are untested/out of scope (the game intentionally has no audio). Corrupt/unavailable saves were tested at the decoder seam and storage exceptions are caught; browser storage corruption was not injected. Successful reset-confirmation deletion was not performed on the completed journal; safe cancellation was verified. Complete campaign ran on the production implementation; corrected collision cases and optional bridge strategy were rechecked on the rebuilt production version.
