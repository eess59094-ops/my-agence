/* =====================================================================
   MERIDIAN LABS — simulation engine
   Clock · division work · video pipeline · 8:00 briefs · Sunday meeting
   skills/levels · bonds · events · office vibe
   ===================================================================== */

const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TAG_SKILL = { trend:"trend", niche:"niche", audit:"audit", growthX:"audience",
  script:"script", aivid:"aivid", prompt:"prompt", edit:"edit", sound:"sound",
  motion:"motion", thumb:"thumb", drills:"drills", yseo:"yseo", short:"shorts",
  sched:"sched", comm:"community", growth:"growthA", fact:"fact", review:"review", coach:"coach" };

const rnd = arr => arr[Math.floor(Math.random()*arr.length)];
const pickW = arr => rnd(arr);              /* room to weight later */
const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
const key2 = (a,b)=> a<b ? a+"|"+b : b+"|"+a;

class Sim {
  constructor(){
    this.agents = AGENTS.map(a => ({
      ...a,
      xp:0, morale: 64 + Math.floor(Math.random()*22),
      status:"home", task:null, taskProg:0, breakUntil:-1,
      skillLv:{...a.skills}, skillXp:{}, wkSkillXp:{},
      skills: a.skills,
    }));
    this.agents.forEach(ag => { ag.xp = (ag.lvl-1) * 90; });

    this.bonds = {};
    PRE_BONDED.forEach(([p,q]) => { if(this.by(p)&&this.by(q)) this.bonds[key2(p,q)] = 48 + Math.floor(Math.random()*20); });

    this.dayIdx = 0;                    /* Monday */
    this.time = 7*60 + 52;
    this.week = 1; this.dayCount = 1;
    this.speed = 1; this.savedSpeed = null;

    this.vibe = 68;
    this.feed = [];                     /* newest first {cls,who,txt} */
    this.meetings = []; this.pending = null;

    this.seeds = [...VIDEO_SEEDS];
    this.video = this.newVideo();
    this.live = null;                   /* published video accruing views */
    this.pubCount = 0;
    this.weekViews = 0;
    this.weekPubs = 0;
    this.published = [];                /* history */
    this.usedSeeds = new Set();

    this.nextChat = this.time + 4;
    this.nextEvent = this.time + 90 + Math.floor(Math.random()*70);
    this.nextDrill = this.time + 55;
  }

  by(id){ return this.agents.find(a => a.id===id); }
  group(id){ return GROUPS.find(g => g.id===id); }
  agentsOf(gid){ return this.agents.filter(a => a.grp===gid); }
  fmtTime(){
    const h = Math.floor(this.time/60), m = this.time%60;
    return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
  }
  dateLabel(){ return `${DAY_NAMES[this.dayIdx]} · Day ${this.dayCount} · Week ${this.week}`; }
  dayEnd(){ return (this.dayIdx===6 ? 15*60 : 18*60); }
  nextMeetingLabel(){
    if(this.dayIdx===6 && this.time < 10*60) return `Sunday all-hands at 10:00`;
    return `Brief at 08:00 (${DAY_NAMES[(this.dayIdx+1)%7]})`;
  }
  minutesUntilNextMeeting(){
    if(this.dayIdx<6) return (6-this.dayIdx)*24*60 + (10*60 - this.time);
    return this.time<10*60 ? 10*60-this.time : 7*24*60 - this.time + 10*60*0;
  }

  /* ---------- video pipeline ---------- */
  newVideo(){
    if(this.seeds.length===0) this.seeds = [...VIDEO_SEEDS];
    const s = this.seeds.splice(Math.floor(Math.random()*this.seeds.length),1)[0];
    return { title:s.title, kw:s.kw, stage:0,
      stageProg:[0,0,0,0,0,0], quota:[3,2,4,4,2,2] };
  }
  addStage(tag){
    const idx = (STAGES[TASK_STAGE[tag]] ? TASK_STAGE[tag] : 6);
    if(idx === 6){                        /* channel-level work boosts live video */
      if(this.live) this.live.boost += 1;
      else this.channelPrep = (this.channelPrep||0)+1;
      return;
    }
    const v = this.video;
    v.stageProg[idx] += 1;
    while(v.stage < 6 && v.stageProg[v.stage] >= v.quota[v.stage]){
      const st = STAGES[v.stage];
      this.feedMsg("sys", "pipeline", `${st.name} — done. ${v.title} moves on.`);
      v.stage++;
      if(v.stage===5){
        this.publish(v);
      }
    }
  }
  publish(v){
    const qa = this.video.stageProg[4];    /* fact-check depth */
    const viral = 12 + qa*9 + Math.floor(Math.random()*70) + (this.vibe>60?12:0);
    this.live = { title:v.title, kw:v.kw, views:0, rate:viral, boost:0, qa, age:0 };
    this.pubCount++; this.weekPubs++;
    this.published.unshift(this.live);
    this.video = this.newVideo();
    this.feedMsg("ship","pub","🎬 PUBLISHED — "+v.title+" is live on the channel.");
    this.agents.forEach(a=>{ a.morale = clamp(a.morale+2,0,100); });
  }
  tickLive(min){
    const v = this.live; if(!v) return;
    v.age += min;
    const decay = Math.max(0.35, 1 - v.age/(60*24*3));
    const gain = v.rate * (0.5 + this.vibe/120) * (1 + v.boost*0.15) * decay * min * 0.55;
    v.rate = Math.max(6, v.rate * (0.9995)); 
    this.live.views += gain; this.weekViews += gain;
  }

  /* ---------- daily flow ---------- */
  advance(min){ this.step(min); }
  step(min){
    for(let i=0;i<min;i++) this.stepMinute();
  }
  stepMinute(){
    this.time++;
    /* day rollover */
    if(this.time >= this.dayEnd()){
      this.time = 7*60 + 50;
      this.dayIdx = (this.dayIdx+1)%7; this.dayCount++;
      if(this.dayIdx===0) this.week++;
      this.agents.forEach(a => { a.status="home"; a.task=null; a.breakUntil=-1; });
      this.feedMsg("sys","day",`☀️ ${DAY_NAMES[this.dayIdx]} — doors open at 08:00. ${this.dayIdx===6?"All-hands at 10:00 today.":"Brief at 08:00."}`);
      return;
    }
    const inHours = this.time >= (this.dayIdx===6? 10*60 : 9*60) && this.time < this.dayEnd();

    if(this.time===8*60) this.runBrief();
    if(this.dayIdx===6 && this.time===10*60) this.runSunday();

    if(this.meetingUntil && this.time >= this.meetingUntil){
      this.meetingUntil = null;
      this.agents.forEach(a=>{ if(a.status==="meeting"){ a.status = "working"; if(!a.task) this.assignTask(a); } });
      if(this.live) this.tickLive(0);
    }
    if(!inHours){ this.agents.forEach(a=>{ if(a.status!=="meeting") a.status = "home"; }); return; }

    /* work & breaks */
    this.agents.forEach(a=>{
      if(a.status==="meeting") return;
      if(a.breakUntil > this.time){ a.status="break"; return; }
      if(a.breakUntil > 0 && a.breakUntil <= this.time){ a.breakUntil=-1; }
      a.status = "working";
      if(!a.task) this.assignTask(a);
      a.taskProg += 1.45 * a.mc;
      const tag = a.task ? a.task.tag : "trend";
      const sid = TAG_SKILL[tag]; 
      if(sid){
        a.skillXp[sid] = (a.skillXp[sid]||0) + 0.4*a.mc;
        a.wkSkillXp[sid] = (a.wkSkillXp[sid]||0) + 0.4*a.mc;
        this.skillMaybeUp(a, sid);
      }
      a.xp += 0.04 * a.mc * (this.vibe>70?1.08:1);
      a.morale = clamp(a.morale + (72 - a.morale)*0.004, 10, 100);
      if(a.task && a.taskProg >= 100) this.completeTask(a);
      if(Math.random() < 0.0009) this.startBreak(a);
    });

    if(this.live) this.tickLive(1);

    if(this.time >= this.nextChat){ this.chatter(); this.nextChat = this.time + 5 + Math.floor(Math.random()*7); }
    if(this.time >= this.nextEvent){ this.officeEvent(); this.nextEvent = this.time + 160 + Math.floor(Math.random()*140); }
    if(this.time >= this.nextDrill){ this.drill(); this.nextDrill = this.time + 120; }
    this.vibe += ( (this.avgMorale() - this.vibe) * 0.015 );
    this.vibe = clamp(this.vibe, 8, 100);
  }

  avgMorale(){ return this.agents.reduce((s,a)=>s+a.morale,0)/this.agents.length; }

  startBreak(a){
    a.breakUntil = this.time + 14 + Math.floor(Math.random()*26);
    a.status = "break";
  }

  assignTask(a){
    const tags = a.grp ? DIV_TASKS[a.grp] : ["trend","script","yseo","growth"];
    const tag = pickW(tags);
    a.task = { tag, name: rnd(TASKS[tag]), prog: 0 };
    a.taskProg = 0;
  }

  completeTask(a){
    a.xp += 8*a.mc;
    a.morale = clamp(a.morale + 3, 0, 100);
    if(a.grp){
      this.feedMsg("ship", a.id, `shipped "${a.task.name}" (${this.group(a.grp).ic} ${this.group(a.grp).name.toLowerCase()}).`);
    } else {
      this.feedMsg("ship", a.id, `closed out "${a.task.name}" personally.`);
    }
    this.addStage(a.task.tag);
    /* bond bump when two finish near each other */
    const partner = this.agents.find(o => o!==a && o.status==="working" && o.grp===a.grp);
    if(partner && Math.random()<0.3){
      const k = key2(a.id, partner.id);
      this.bonds[k] = clamp((this.bonds[k]||20)+3, 0, 100);
    }
    this.assignTask(a);
  }

  skillMaybeUp(a, sid){
    const cur = a.skillLv[sid] ?? 0, xp = a.skillXp[sid]||0;
    if(cur >= 5) return;
    if(xp >= (cur+1)*30){
      a.skillLv[sid] = cur+1;
      a.skillXp[sid] = 0;
      const sk = SKILLS.find(s=>s.id===sid);
      this.feedMsg("lvl", a.id, `${a.av} ${sk.ic} ${sk.name} → level ${cur+1}. coach noted.`);
      if(cur+1>=4 && typeof this.toast === "function") this.toast(`${sk.name} L${cur+1} — ${a.name.split(" ")[0]}`);
    }
  }

  drill(){
    const a = rnd(this.agents);
    const sids = Object.keys(a.skillLv).filter(s=>a.skillLv[s]<5);
    if(!sids.length) return;
    const sid = rnd(sids);
    a.skillXp[sid] = (a.skillXp[sid]||0)+18;
    a.wkSkillXp[sid] = (a.wkSkillXp[sid]||0)+18;
    const sk = SKILLS.find(s=>s.id===sid);
    this.feedMsg("lvl", "forge", `🎓 drill — ${a.name.split(" ")[0]} grinding ${sk.name}.`);
    this.skillMaybeUp(a, sid);
  }

  chatter(){
    const a = rnd(this.agents.filter(x=>x.status!=="home"));
    if(!a) return;
    const other = rnd(this.agents.filter(x=>x!==a));
    let pool;
    if(a.status==="break") pool = CHAT.break;
    else switch(a.grp){
      case "trend": pool = Math.random()<0.5?CHAT.trend:CHAT.work; break;
      case "dist":  pool = Math.random()<0.55?CHAT.dist:CHAT.work; break;
      case "growth":pool = Math.random()<0.5?CHAT.QA:CHAT.work; break;
      default: pool = CHAT.work;
    }
    const roll = Math.random();
    if(roll<0.08) pool = CHAT.praise;
    else if(roll<0.15) pool = CHAT.rant;
    else if(roll<0.20) pool = Math.random()<0.5 ? CHAT.assist : CHAT.kudos;
    else if(roll<0.26 && other) pool = CHAT.jelly;
    let txt = rnd(pool);
    if(other) txt = txt.replace("{other}", other.name.split(" ")[0]);
    this.feedMsg("chat", a.id, txt);
    if(pool===CHAT.kudos || pool===CHAT.assist){
      const k = key2(a.id, other.id);
      this.bonds[k] = clamp((this.bonds[k]||20)+4, 0, 100);
    }
  }

  officeEvent(){
    const ev = rnd(EVENTS);
    this.vibe = clamp(this.vibe + ev.vibe, 8, 100);
    this.agents.forEach(a => a.morale = clamp(a.morale + ev.vibe*0.18, 10, 100));
    this.feedMsg(ev.vibe>=0?"meet":"drama", "office", ev.txt);
    ev.msgs.forEach(m => this.feedMsg("chat", rnd(this.agents.filter(x=>x.status!=="home")).id, m));
  }

  /* ---------- meetings ---------- */
  newMeeting(tag, title, lines){
    const entry = { tag, title, when:`${DAY_NAMES[this.dayIdx]} ${this.fmtTime()}`, lines };
    this.meetings.unshift(entry);
    this.pending = { entry, shown:0 };
  }

  runBrief(){
    const Sunday = this.dayIdx===6;
    const lines = [];
    lines.push({who:"vex", txt: Sunday
      ? "short one this morning, chef — all-hands is at 10:00. trend first, then celebrate."
      : "morning. doors open, dashboards fresh. here's the day."});
    lines.push({who:"vex", txt:`today's play: ${this.video.title}. keyword angle: "${this.video.kw}". ${STAGES[this.video.stage].name} is the floor to clear.`});
    GROUPS.forEach(g=>{
      const lead = this.agents.find(a=>a.grp===g.id && a.lead);
      const focus = rnd(DIV_TASKS[g.id]);
      lines.push({who: lead.id, txt:`${g.ic} ${g.name}: focus on ${rnd(TASKS[focus])}. you've got the day.`});
    });
    if(this.live) lines.push({who:"tally", txt:`live video is at ${Math.floor(this.live.views).toLocaleString()} views — ${this.live.rate>60?"it's climbing":this.live.rate>25?"steady, not viral":"it's a slow burn"}.`});
    this.newMeeting("daily", `Daily Brief — ${this.dateLabel()}`, lines);
    this.agents.forEach(a=>{ a.status="meeting"; a.breakUntil=-1; });
    this.feedMsg("meet","vex","📻 8:00 brief running in the board room.");
    this.meetingUntil = this.time + 25;
  }

  runSunday(){
    const lines = [];
    const best = [...this.published].slice().sort((a,b)=>b.views-a.views)[0];
    lines.push({who:"vex", txt:"Sunday all-hands. seats, everyone — week report first."});
    lines.push({who:"vex", txt:`This week: ${this.weekPubs} video${this.weekPubs===1?"":"s"} published, ${Math.floor(this.weekViews).toLocaleString()} views. ${this.weekViews>5000? "wave caught." : "the wave is coming; keep cutting."}`});
    if(best) lines.push({who:"vex", txt:`Top performer: "${best.title}" — ${Math.floor(best.views).toLocaleString()} views. ${best.qa>=2?"QA paid for itself.":"QA, tighter next week."}`});
    /* skill report */
    const mgains = this.agents.map(a=>({a, g:Object.values(a.wkSkillXp).reduce((s,v)=>s+v,0)})).sort((x,y)=>y.g-x.g);
    if(mgains[0] && mgains[0].g > 1)
      lines.push({who:"forge", txt:`Skill report: ${mgains[0].a.name.split(" ")[0]} reps'd the most practice hours this week. Library is stronger for it — ${this.agents.reduce((s,a)=>s+Object.values(a.wkSkillXp).reduce((z,v)=>z+v,0),0).toFixed(0)} total skill XP gained.`});
    /* QA note */
    const flagged = Math.floor(Math.random()*4);
    lines.push({who:"verdict", txt: flagged===0 ? "QA note: zero claims flagged this week. either the studio is careful or I'm losing my edge."
      : `QA note: ${flagged} claim${flagged===1?"":"s"} fixed pre-publish this week. receipts below every number.`});
    /* promos */
    const promo = [];
    this.agents.forEach(a=>{
      let up=0;
      while(a.lvl<10 && a.xp >= (100 + a.lvl*90)){ a.xp -= (100 + a.lvl*90); a.lvl++; up++; a.morale=clamp(a.morale+7,0,100); }
      if(up) promo.push(a);
    });
    promo.forEach(a=>{
      lines.push({who:"vex", txt:`📈 promotion — ${a.name} is now ${LEVEL_TITLES[a.lvl-1]} (level ${a.lvl}). ${rnd(PROMO_LINES).replace("{n}", a.name.split(" ")[0])}`});
      this.feedMsg("lvl","vex", `📈 ${a.name} promoted → ${LEVEL_TITLES[a.lvl-1]} (L${a.lvl})`);
    });
    if(!promo.length) lines.push({who:"vex", txt:"No promotions this week — close calls on two of you. Monday decides."});
    lines.push({who:"vex", txt:`Next brief is Monday 08:00. rest, then we chase the bigger wave. dismissed.`});
    this.newMeeting("weekly", `Sunday All-Hands — Week ${this.week}`, lines);
    this.agents.forEach(a=>{ a.status="meeting"; });
    this.meetingUntil = this.time + 40;
    this.weekViews = 0; this.weekPubs = 0;
    this.agents.forEach(a=>{ a.wkSkillXp = {}; });
  }

  /* ---------- feed ---------- */
  feedMsg(cls, who, txt){
    let name = who==="office"?"OFFICE":who==="pipeline"?"PIPELINE":who==="day"?"HQ":who==="pub"?"CHANNEL":
      (this.by(who)? this.by(who).name.split(" ")[0] : who.toUpperCase());
    this.feed.unshift({cls, who, name, txt, t:this.fmtTime()});
    if(this.feed.length>90) this.feed.pop();
  }

  /* ---------- save / restore ---------- */
  snapshot(){
    return {
      v: 1,
      t: Date.now(),
      dayIdx: this.dayIdx, time: this.time, week: this.week, dayCount: this.dayCount,
      vibe: this.vibe, pubCount: this.pubCount, weekViews: this.weekViews, weekPubs: this.weekPubs,
      bonds: this.bonds, video: this.video, live: this.live, published: this.published.slice(0,24),
      meetings: this.meetings.slice(0,20),
      agents: this.agents.map(a => ({
        id:a.id, lvl:a.lvl, xp:a.xp, morale:a.morale,
        skillLv:a.skillLv, skillXp:a.skillXp, wkSkillXp:a.wkSkillXp,
        task:a.task, taskProg:a.taskProg
      })),
    };
  }
  restore(s){
    if(!s || s.v !== 1) return false;
    try {
      this.dayIdx=s.dayIdx; this.time=s.time; this.week=s.week; this.dayCount=s.dayCount;
      this.vibe=s.vibe; this.pubCount=s.pubCount; this.weekViews=s.weekViews; this.weekPubs=s.weekPubs;
      this.bonds=s.bonds||{}; this.video=s.video; this.live=s.live||null;
      this.published=s.published||[]; this.meetings=s.meetings||[];
      s.agents.forEach(sa=>{
        const a=this.by(sa.id); if(!a) return;
        a.lvl=sa.lvl; a.xp=sa.xp; a.morale=sa.morale;
        a.skillLv=sa.skillLv; a.skillXp=sa.skillXp||{}; a.wkSkillXp=sa.wkSkillXp||{};
        a.task=sa.task; a.taskProg=sa.taskProg||0; a.status="home"; a.breakUntil=-1;
      });
      this.nextChat=this.time+4; this.nextEvent=this.time+80; this.nextDrill=this.time+40;
      return true;
    } catch(e){ return false; }
  }

  /* ---------- skip ---------- */
  requestSkip(){ if(!this.savedSpeed){ this.savedSpeed = this.speed||1; this.speed = 26; } }
  settleSkip(){ if(this.savedSpeed){ this.speed = this.savedSpeed; this.savedSpeed = null; } }
}

window.sim = new Sim();
