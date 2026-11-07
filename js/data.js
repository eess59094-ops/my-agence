/* =====================================================================
   MERIDIAN LABS — world data
   An AI-content company: 1 CEO + 14 staff in 4 divisions.
   1) Trend Division   — find what's about to blow up
   2) Studio Division  — build the video with AI + advanced editing
   3) Distribution     — publish on the channel + every other app
   4) Skills & QA      — level everyone up, fact-check, catch problems
   ===================================================================== */

const GROUPS = [
  { id:"trend",   name:"Trend Division",    ic:"📡", brief:"Hunt what's about to blow up before it does." },
  { id:"studio",  name:"Studio Division",   ic:"🎬", brief:"Turn the trend into a finished video — AI gen + advanced edit." },
  { id:"dist",    name:"Distribution Division", ic:"📣", brief:"Get it on the channel and on every other app." },
  { id:"growth",  name:"Skills & QA Division",  ic:"🎓", brief:"Fact-check everything, catch problems, level up the whole staff." },
];

/* 20-skill library — 5 per division + shared craft skills */
const SKILLS = [
  /* --- Trend Division --- */
  { id:"trend",    grp:"trend",  ic:"📡", name:"Trend Radar",         desc:"Reading the noise across platforms and spotting the wave of the next 72 hours." },
  { id:"niche",    grp:"trend",  ic:"🧭", name:"Niche Research",       desc:"Finding the audience pocket nobody is properly serving yet." },
  { id:"seo",      grp:"trend",  ic:"🔎", name:"Keyword Sniper",       desc:"Titles and terms people already search — aimed like a rifle." },
  { id:"audience", grp:"trend",  ic:"🎯", name:"Audience Mapping",     desc:"Knowing who watches, why they stay, and when they click away." },
  { id:"script",   grp:"trend",  ic:"📝", name:"Scriptwriting",        desc:"Hooks, retention beats, and endings that earn the subscribe." },
  /* --- Studio Division --- */
  { id:"aivid",    grp:"studio", ic:"🤖", name:"AI Video Generation",  desc:"Directing text/image/video models into shots that don't look haunted." },
  { id:"prompt",   grp:"studio", ic:"📜", name:"Gen Prompt Craft",     desc:"The difference between 'a dog running' and a cinematic tracking shot." },
  { id:"edit",     grp:"studio", ic:"✂️", name:"Advanced Editing",     desc:"Cuts, pacing, masking, speed-ramps — the invisible craft that makes clips hit." },
  { id:"sound",    grp:"studio", ic:"🎚️", name:"Sound Design",        desc:"Music beds, SFX, de-mucs stems — audio that carries the edit." },
  { id:"motion",   grp:"studio", ic:"🌀", name:"Motion Graphics",      desc:"Titles, transitions, powered-up lower thirds." },
  { id:"thumb",    grp:"studio", ic:"🖼️", name:"Thumbnail Design",     desc:"The three-second billboard that decides the video's fate." },
  /* --- Distribution Division --- */
  { id:"yseo",     grp:"dist",   ic:"🔺", name:"Channel SEO",          desc:"Metadata, chapters, cards — YouTube's machine reading your video right." },
  { id:"shorts",   grp:"dist",   ic:"⚡", name:"Shorts Factory",       desc:"Slicing one video into ten vertical clips that each stand alone." },
  { id:"sched",    grp:"dist",   ic:"🗓️", name:"Multi-Platform Ops",   desc:"Insta, TikTok, X, FB — same content, native fit, right time slot." },
  { id:"community",grp:"dist",   ic:"💬", name:"Community & Comments", desc:"Pinned comments, posts, replies — turning viewers into regulars." },
  { id:"growthA",  grp:"dist",   ic:"📈", name:"Growth Analytics",     desc:"CTR, retention curves, traffic sources — numbers that steer strategy." },
  /* --- Skills & QA Division --- */
  { id:"fact",     grp:"growth", ic:"✅", name:"Fact-Checking",        desc:"Every claim in the video survives a receipt hunt before publish." },
  { id:"review",   grp:"growth", ic:"🧐", name:"Peer Review",          desc:"Previewing cuts and kills weak frames before the audience does." },
  { id:"coach",    grp:"growth", ic:"🎓", name:"Skill Coaching",       desc:"Drills, pair-ups and study plans that push everyone's levels up." },
  { id:"audit",    grp:"growth", ic:"🛠️", name:"Problem Hunting",      desc:"Finding the broken workflow, the cracked tool, the silent time-sink." },
  { id:"drills",   grp:"growth", ic:"🏗️", name:"Studio Systems",       desc:"Templates, presets and automations so the studio gets faster weekly." },
];

const AGENTS = [
  /* CEO */
  { id:"vex",   name:"Vex",            av:"👑", role:"CEO",                  grp:null,     lvl:9, mc:2.0,
    skills:{trend:5, script:5, yseo:4, growthA:4},
    quirk:"Watches retention graphs the way other people watch sports.",
    desc:"Founded the lab to run a full AI content studio on one dashboard. Runs the 8:00 brief personally and signs off every Sunday report." },

  /* 1 — Trend Division (3) */
  { id:"zeph",  name:"Zephyr",         av:"📡", role:"Trend Lead",           grp:"trend",  lvl:7, mc:1.3, lead:true,
    skills:{trend:5, niche:5, audience:4},
    quirk:"Says 'this will blow up' so often that half the time it's true.",
    desc:"Forecasts three days ahead. Keeps a private list of formats that died so the studio never resurrects them." },
  { id:"mora",  name:"Mora",           av:"🔭", role:"Viral Analyst",        grp:"trend",  lvl:5, mc:1.15,
    skills:{trend:4, growthA:4, audience:4},
    quirk:"Cross-references competitor uploads in a spreadsheet named DOOMSDAY.",
    desc:"Watches rival channels so you don't have to. Spots duplicated formats and claims the gap in under an hour." },
  { id:"kit",   name:"Kit",            av:"🎯", role:"Keyword & Niche Scout",grp:"trend",  lvl:4, mc:1.1,
    skills:{seo:5, niche:4},
    quirk:"Dozes off mutting search terms. Sometimes wakes with a winner.",
    desc:"Owns the title and keyword pipeline — the first draft of every video name on the channel." },

  /* 2 — Studio Division (4) */
  { id:"reel",  name:"Reel",           av:"🎬", role:"Studio Lead / Director",grp:"studio", lvl:8, mc:1.5, lead:true,
    skills:{aivid:5, edit:4, motion:4, prompt:4},
    quirk:"Blocks a shot in their head before the prompt is even written.",
    desc:"Directs the whole pipeline — shot list, model passes, edit style decisions. The studio's taste-maker and referee." },
  { id:"sable", name:"Sable",          av:"🤖", role:"AI Generation Op",     grp:"studio", lvl:6, mc:1.25,
    skills:{aivid:4, prompt:5},
    quirk:"Keeps 300 model prompts in a vault. Regrets none of them.",
    desc:"Turns shot lists into generated footage. Has a personal folder of rejected clips titled 'the horror folder'." },
  { id:"cutter",name:"Cutter",         av:"✂️", role:"Senior Editor",        grp:"studio", lvl:6, mc:1.25,
    skills:{edit:5, sound:5},
    quirk:"Ruthless with a cut — 'that frame doesn't deserve to live'.",
    desc:"Advanced editing is the whole religion: pacing, mask-work, sfx layering. First pass is always 40% tighter than asked." },
  { id:"lux",   name:"Lux",            av:"✨", role:"Motion & Thumbnails",  grp:"studio", lvl:5, mc:1.15,
    skills:{motion:5, thumb:5},
    quirk:"Designs the thumbnail before the edit is even done. Usually right.",
    desc:"Owner of titles, lower thirds and the channel's visual identity. Guarantees the thumbnail wins the click or costs a redo." },

  /* 3 — Distribution Division (4) */
  { id:"beam",  name:"Beam",           av:"📣", role:"Channel Lead",         grp:"dist",   lvl:7, mc:1.3, lead:true,
    skills:{yseo:5, sched:4, growthA:4},
    quirk:"Publishes at 16:07 without fail. Claims the number is lucky.",
    desc:"Runs the main channel end-to-end: metadata, upload calendar, launch checklist. Owns the 'shipping rhythm'." },
  { id:"echo",  name:"Echo",           av:"⚡", role:"Shorts & Clips",       grp:"dist",   lvl:5, mc:1.15,
    skills:{shorts:5, edit:3},
    quirk:"Can find the funniest 22 seconds of a 12-minute video blindfolded.",
    desc:"Vertical clip factory. Harvests every video for shorts, reels and TikToks until the content pays rent twice." },
  { id:"mosaic",name:"Mosaic",         av:"🗓️", role:"Multi-Platform Ops",  grp:"dist",   lvl:5, mc:1.15,
    skills:{sched:5, community:4},
    quirk:"Has a posting schedule for every app on earth, color-coded.",
    desc:"Same video, native fit per app. Cross-posts, tweaks captions per platform and never lets a feed go cold." },
  { id:"tally", name:"Tally",          av:"📈", role:"Growth Analyst",       grp:"dist",   lvl:5, mc:1.15,
    skills:{growthA:5, audience:4},
    quirk:"Trusts a 24-hour retention curve more than most people's opinions.",
    desc:"Reads the traffic sources and CTR after each publish, then walks the findings back into next week's brief." },

  /* 4 — Skills & QA Division (3) */
  { id:"verdict",name:"Verdict",       av:"⚖️", role:"QA Lead",              grp:"growth", lvl:7, mc:1.3, lead:true,
    skills:{fact:5, review:5},
    quirk:"Says 'source?' so politely that it still ruins your day.",
    desc:"Final gate before publish. Kills weak claims, soft frames and lazy hooks with surgical, polite violence." },
  { id:"forge", name:"Forge",          av:"🎓", role:"Skills Coach",         grp:"growth", lvl:5, mc:1.2,
    skills:{coach:5, drills:4},
    quirk:"Runs a 10-minute daily skill drill for whoever loses the coin flip.",
    desc:"Owns the whole skills library: study plans, drills, pair-ups. Turns weaknesses into levels — that's the job." },
  { id:"proxy", name:"Proxy",          av:"🛠️", role:"Problem Hunter",       grp:"growth", lvl:4, mc:1.15,
    skills:{audit:5, review:4},
    quirk:"Once found a broken preset nobody knew existed for 8 months.",
    desc:"Audits the workflow itself — broken tools, wasted steps, silent time-sinks. Files the fix as a task before anyone asks." },
];

/* pair-bonds — duos that drift toward each other naturally */
const PRE_BONDED = [ ["zeph","mora"], ["sable","cutter"], ["beam","echo"], ["forge","proxy"], ["vex","reel"], ["mora","tally"] ];

/* =====================================================================
   TASKS — real workflow per division; completions push the video pipeline
   ===================================================================== */
const TASKS = {
  trend:    ["sweep the trending dashboards", "audit 3 rising competitors' formats", "pull keywords for the next niche", "map the retention dips of the last video", "scout an unserved audience pocket"],
  niche:    ["research the unserved niche", "profile the target viewer", "compare 4 niches for the next series", "shortlist the next series theme"],
  audit:    ["audit the render workflow", "hunt for wasted steps in the pipeline", "fix the cracked preset in the vault", "benchmark studio render times"],
  yseo:     ["rewrite the metadata for the back-catalog", "chapter the new longform properly", "test title variants for CTR", "repair the old video's end screens"],
  short:    ["cut 4 verticals from the latest longform", "climb the shorts release ladder", "re-cut the hook in the first 1.5 seconds", "harvest the launch video for shorts"],
  script:   ["draft the hook — first 8 seconds", "write the script beats", "punch up the mid-video re-hooks", "fix the ending and add the CTA"],
  aivid:    ["generate the B-roll pass", "run the style-consistency sweep", "clean up the horror folder rejects", "re-prompt the 2 haunted shots"],
  prompt:   ["tune the studio prompt vault", "write the style-lock prompts", "build shot-level prompt templates", "sort prompt library for reuse"],
  edit:     ["assembled edit v1 of the longform", "tighten the middle 4 minutes", "color-grade and master the final cut", "sync the keyframed speed-ramps"],
  sound:    ["pick and cut the music bed", "layer SFX on the transition beats", "detox the generated clip's audio", "duck the narration bed properly"],
  motion:   ["build the lower-third kit", "animate the chapter transitions", "redo the channels intro sting", "re-skin the progress bar graphics"],
  thumb:    ["design the thumbnail v1", "run the 3-variant thumbnail vote", "re-cut the failed thumbnail into v2", "A/B thumbnail text for CTR"],
  fact:     ["fact-check every claim list", "chase the receipts for the 3 bold claims", "fix the miscredited stat before publish", "verify the demo footage is unlabeled AI"],
  review:   ["review the assemble cut", "kill 3 weak frames in the rough", "pre-review the thumbnail set", "review the hooks against retention data"],
  coach:    ["run the daily skill drill", "pair up weak skills with mentors", "review the studio's study plans", "certify Cutter's skill tree milestone"],
  drills:   ["build the reusable edit template", "automate the monotonous export steps", "update the preset vault for the new look", "shave 20% off the render pipeline"],
  growth:   ["read the retention curve per second", "model the CTR lift from thumbnails", "present this week's channel report", "benchmark upload-time experiments"],
  comm:     ["pin the best comment and reply to five", "write the community tab post", "seed the comment replies on fresh posts", "schedule the poll for the voters"],
  sched:    ["schedule the week's cross-platform drops", "adapt the clip captions per app", "rework the TikTok posting slot", "sync the upload calendar across apps"],
  growthX:  ["model the next series around the audience", "map viewer churn on the last video", "profile the top 10% of subscribers", "mine comment themes for next concepts"],
};

/* task → which pipeline stage it pushes */
const TASK_STAGE = {
  trend:0, niche:0, script:1, prompt:1,
  aivid:2, sound:3, thumb:3, motion:3, edit:3, tools:3,
  fact:4, review:4, coach:5, drills:5, fix:5, audit:4,
  yseo:6, short:6, shorts:6, sched:6, comm:6, growth:6, growthX:6, growthA:6,
};

const STAGES = [
  { name:"Trend Locked",    grp:"trend"   },
  { name:"Script & Hook",   grp:"trend"   },
  { name:"AI Generation",   grp:"studio"  },
  { name:"Edit & GFX",      grp:"studio"  },
  { name:"QA & Fact-Check", grp:"growth"  },
  { name:"Ready & Published", grp:"dist"  },
  { name:"Live & Measurable", grp:"dist"  },
];

/* Assignment matrix: division → the taskTAGS it draws from */
const DIV_TASKS = {
  trend:  ["trend","niche","audit","growthX","script"],
  studio: ["aivid","prompt","edit","sound","motion","thumb","drills"],
  dist:   ["yseo","short","sched","comm","growth"],
  growth: ["fact","review","coach","drills","audit"],
};

const VIDEO_SEEDS = [
  { title:"I Let 4 AIs Run a Restaurant for 24 Hours",                kw:"AI challenge" },
  { title:"Every AI Video Generator Ranked by a Filmmaker",           kw:"tool ranking" },
  { title:"The $0 AI Shorts Pipeline (Full Tutorial)",                kw:"tutorial" },
  { title:"Real Footage vs AI Footage — Can You Tell?",               kw:"experiment" },
  { title:"I Rebuilt a Movie Scene With Only AI Tools",               kw:"remake" },
  { title:"The Truth About one-click video editors",                  kw:"honest review" },
  { title:"30 Days of AI-Only Editing — Here's What Broke",           kw:"diary series" },
  { title:"This Hidden AI Tool Edits Faster Than Premier Pro",        kw:"hidden gem" },
  { title:"AI Sound Design That Doesn't Sound Fake",                  kw:"sound design" },
  { title:"We Made a Cinematic Ad With $12 of AI Credits",            kw:"commercial" },
  { title:"Cartooning My Own Face With Open-Source Models",           kw:"face tools" },
  { title:"Selling an AI-Generated Video To a Real Client",           kw:"client story" },
];

/* =====================================================================
   CHATTER — office ambience, division-flavoured
   ===================================================================== */
const CHAT = {
  idle:  ["head clear. staring at the board now.", "monitor needed a stretch. me too.", "the render queue is watching me. dei.", "plotted the retention curve. it argued back."],
  break: ["coffee run — anyone need a shot of motivation?", "outing to the tall window for human reasons.", "snack drawer audit. purely professional."],
  work:  ["locked in. don't wait up.", "shot 6 is fighting me. shot 7 looks haunted.", "halfway — this cut's timing is nice.", "cross-checked the niche. we are early.", "getting closer. still mad about the pacing."],
  plan:  ["locked next week's loose plan. two videos. ambitious but fine.", " estimating generously, and I know it."],
  praise:["saw that clip. actually good.", "the new thumb hits hard — whoever made it earned their day.", "that save on shot 6 was clean."],
  rant:  ["why is there FOUR time zones in this dataset. FOUR.", "this model gave the subject seven fingers. seven.", "render crashed at 97%. i'm fine. everything is fine."],
  jelly: ["{other} got a clean 500k views. no pressure. fine. PRESSURE.", "{other}'s clip popped off?? childish of me to already have a plan for next quarter."],
  assist:["@{other} ping me if the model starts hallucinating hands again.", "{other} — swapped the music bed. shout if the edit disagrees."],
  kudos: ["@{other} took my weekend and made it a tuesday. cheers.", "shout out @{other} — reviewed it in 11 minutes and made it better."],
  dist:  ["scheduling the drop at 16:07 sharp.", "cross-posting to four apps with native captions.", "short #2 is climbing. holding my breath.", "metrics back in 4 hours. then we talk strategy."],
  trend: ["scanning the trending tab. three candidates.", "the competitor in this niche posted twice this week. claiming the gap.", "keyword found. search is low-competition, high-want."],
  QA:    ["that claim needs a receipt. flagged.", "found 2 weak frames. killing them politely.", "the hook is 0.8 seconds late. fixing.", "drill time. skills must go up."],
};

/* =====================================================================
   OFFICE EVENTS — random flavour with real morale effects
   ===================================================================== */
const EVENTS = [
  { txt:"☕ The studio HQ espresso portafilter was claimed by the shorts team. Contained riot.", vibe:-5, msgs:["echo guarded the coffee machine with armed vibes.", "sable muttered a prompt at the steam wand. it steamed better, hypothetically."] },
  { txt:"🚀 A render finished at 4K in under 4 minutes. Studio-wide applause.",                   vibe:8,  msgs:["cutter said the timeline 'finally respects me'.", "reel declared the whole pipeline re-certified for quality."] },
  { txt:"👻 A generated clip rendered 6 fingers and a spare shadow. The horror folder grows.",    vibe:-4, msgs:["sable filed it under 'the horror folder' with dignity.", "lux said 'not my problem' and designed the thumbnail anyway."] },
  { txt:"🧘 Optional meditation hour. Studio attendance suspiciously high.",                     vibe:6,  msgs:["forge ran a 10-minute focus drill. skeptics converted.", "verdict checked nothing. rare day."] },
  { txt:"🏓 Ping-pong rematch — Tally is not competitive. Tally is extremely competitive.",       vibe:7,  msgs:["tally won 21-19. called it 'statistically inevitable'.", "echo lost and immediately demanded a best of 5 clips instead."] },
  { txt:"🧩 A prompt vault cleanup revealed 40 reusable presets. Weekly efficiency jumps.",       vibe:6,  msgs:["forge logged them into the studio drill plan.", "proxy audited them all in 12 minutes, found 1 broken, fixed it live."] },
  { txt:"📉 An old video's shorts are suddenly viral again. Retroactive fun.",                    vibe:8,  msgs:["echo claims the re-clipped vertical is 'a second life'.", "tally plotted the curve with a highlighter."] },
  { txt:"🌡️ Render farm overheated. Two machines fan-spinning angrily.",                        vibe:-6, msgs:["proxy audited the cooling loop and filed a maintenance task.", "cutter used the wait to flip-pen a rival cut plan."] },
  { txt:"🍜 Extended team lunch overran 40 minutes and nobody apologized.",                      vibe:9,  msgs:["vex told one story. only 40% fictional.", "lux sketched the whole table live — flattering renditions, everyone."] },
  { txt:"👀 A big channel quietly copied the last thumbnail concept. Flattering, and annoying.",  vibe:-7, msgs:["verdict said 'imitation is the sincerest benchmark'.", "lux re-cut the thumbnail for the next upload. fast."] },
];

const PROMO_LINES = [
  "\"Stop standing on ceremony and just ship\" — {n} did.",
  "{n} quietly leveled everyone's projects this week.",
  "\"{n} solved something we didn't have words for yet.\"",
  "Zero drama, on-time, over-quality. {n} keeps raising the floor.",
];

const LEVEL_TITLES = ["Intern","Junior","Mid","Senior","Staff","Principal","Lead","Head","VP","Legend"];
