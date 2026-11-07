# Meridian Labs — AI Company HQ

A self-running **AI content company simulator**: 1 CEO + 14 employees across 4 divisions,
tracked on a live office board, with daily 8:00 briefs, Sunday all-hands (promotions),
a levels system and a 20-skill library.

## Run it
Just open **`index.html`** in a browser. No install, no build step, everything is offline & local.
(If your browser blocks anything over `file://`, run `npx serve` or `python -m http.server` and open the same folder.)

## The company — 4 divisions
| Division | What they do |
|---|---|
| 📡 **Trend Division** | hunts rising formats, keywords, niches → locks the next video's concept |
| 🎬 **Studio Division** | AI video generation + advanced editing, sound, motion, thumbnails |
| 📣 **Distribution Division** | publishes on the channel, cross-posts everywhere, reads the analytics |
| 🎓 **Skills & QA Division** | fact-checks every claim, audits the workflow, drills everyone's skills up |

## Features
- **Live office board** — 15 desks with real-time status, task progress, chatter feed, office-vibe meter
- **8:00 daily brief** — CEO sets the day's play, each division lead picks a focus
- **Video pipeline** — every office task pushes a real stage: Trend → Script → AI Generation → Edit & GFX → QA → Publish
- **Published videos go live** and accrue views (viral-grade / solid / slow-burn verdicts, boosted by channel SEO work)
- **Sunday all-hands** — week report (views, top video), skill report, QA flag note, **promotions**
- **Levels & XP** — agents earn XP working; level titles Intern→Legend, promotions happen on Sundays
- **Skills library** — 20 skills with L0–L5 pips, leveled by actually doing tasks and daily drills
- **Office society** — pair bonds, playful jealousy, coffee-machine drama, ping-pong tournaments, and events that move morale
- **Dashboard controls** — pause / 1× / 3× / 8× and “skip to next meeting”

## Files
- `index.html` — page shell & UI structure
- `css/styles.css` — full mission-control theme
- `js/data.js` — the world: people, divisions, skills, tasks, chatter, events
- `js/engine.js` — the simulation: clock, work, pipeline, meetings, promotions
- `js/ui.js` — rendering, tabs, meeting modal, speed controls
