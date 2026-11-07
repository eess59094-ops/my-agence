/* =====================================================================
   MERIDIAN LABS — ui layer
   renders the office board from engine state · loop drives the clock
   ===================================================================== */

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

let lastMeetingSeen = 0;
let revealTimer = 0;
let toastTimer = null;

/* ---------- toasts ---------- */
function toast(txt){
  const t = $("toast");
  t.textContent = txt;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 3200);
}
Sim.prototype.toast = function(txt){ toast(txt); };   /* engine hook */

/* ---------- tabs ---------- */
document.querySelectorAll(".tab").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active"));
    btn.classList.add("active");
    $("panel-"+btn.dataset.tab).classList.add("active");
  });
});

/* ---------- speed controls ---------- */
function setSpeedUI(){
  document.querySelectorAll(".speed-btn").forEach(b=>{
    b.classList.toggle("active", !sim.savedSpeed && Number(b.dataset.speed)===sim.speed);
    if(sim.speed===0 && b.id==="btn-pause") b.classList.add("active");
    else if(b.id==="btn-pause" && sim.speed!==0) b.classList.remove("active");
  });
}
document.querySelectorAll(".speed-btn").forEach(b=>{
  b.addEventListener("click", ()=>{
    if(b.id==="btn-pause"){ sim.speed = sim.speed===0 ? 1 : 0; }
    else { sim.speed = Number(b.dataset.speed); sim.savedSpeed = null; }
    setSpeedUI();
  });
});
$("btn-skip").addEventListener("click", ()=>{
  sim.requestSkip();
  toast("⏭ fast-forward to the next meeting…");
});

/* ---------- office board ---------- */
function pips(lvl){
  let h = "";
  for(let i=0;i<5;i++) h += `<span class="pip ${lvl>i?(lvl===5?"on gold":"on"):""}"></span>`;
  return h;
}

function deskCard(a){
  const st = a.status;
  const pill = st==="working" ? `<span class="status-pill working">${a.task?esc(a.task.name):"picking up a task"}</span>`
    : st==="break" ? `<span class="status-pill break">☕ on a break</span>`
    : st==="meeting" ? `<span class="status-pill working">📋 in the meeting</span>`
    : `<span class="status-pill home">🌙 home</span>`;
  const taskLine = a.grp ? esc(sim.group(a.grp).ic+" "+sim.group(a.grp).name) : "👑 leadership floor";
  return `<div class="desk ${a.role==="CEO"?"ceo":st==="working"?"active-work":""}" id="desk-${a.id}">
    <div class="desk-t">
      <div class="avatar">${a.av}<span class="badge-lvl">${a.lvl}</span></div>
      <div class="who">
        <div class="who-name">${esc(a.name)}</div>
        <div class="who-role">${esc(a.role)}</div>
      </div>
    </div>
    ${pill}
    <div class="desk-task">${taskLine}</div>
    <div class="desk-b">
      <span class="mini-lab">TASK</span>
      <div class="mini-track"><div class="mini-fill" style="width:${Math.min(100,a.taskProg)}%"></div></div>
    </div>
  </div>`;
}

function renderDesks(){
  const ceo = sim.agents.filter(a=>!a.grp);
  let h = ceo.map(deskCard).join("");
  GROUPS.forEach(g=>{
    h += `<div class="group-head" style="grid-column:1/-1;margin:6px 2px 0;">
      <span style="font-size:15px">${g.ic}</span>
      <b style="font-size:12.5px;letter-spacing:1.5px;color:#8b93b8">${g.name.toUpperCase()}</b>
      <span style="font-size:11px;color:#5a6187">— ${esc(g.brief)}</span></div>`;
    h += sim.agentsOf(g.id).map(deskCard).join("");
  });
  $("desks").innerHTML = h;
}

/* ---------- live feed ---------- */
function renderFeed(){
  const rows = sim.feed.slice(0,26).map(m=>{
    const av = sim.by(m.who) ? sim.by(m.who).av : (m.cls==="drama" ? "⚠️" : m.cls==="ship" ? "📦" : m.cls==="meet" ? "📋" : m.cls==="lvl" ? "🎓" : "•");
    return `<div class="fmsg ${m.cls}"><span class="fn">${av} ${esc(m.name)}:</span> ${esc(m.txt)} <span style="opacity:.45;font-size:10px">${m.t}</span></div>`;
  }).join("");
  $("feed").innerHTML = rows || `<div class="empty-note">quiet in here…</div>`;
}

/* ---------- team & levels ---------- */
function renderTeam(){
  const cards = sim.agents.map(a=>{
    const skillRows = Object.entries(a.skillLv).sort((x,y)=>y[1]-x[1]).slice(0,6).map(([sid,lvl])=>{
      const sk = SKILLS.find(s=>s.id===sid);
      return `<div class="sk-row"><span class="sk-ic">${sk.ic}</span><span class="sk-name">${esc(sk.name)}</span><span class="sk-pips">${pips(lvl)}</span><span style="font-size:10px;color:#5a6187;margin-left:6px">L${lvl}</span></div>`;
    }).join("");
    const bonds = Object.entries(sim.bonds).filter(([k,v])=>k.includes(a.id) && v>=40)
      .sort((x,y)=>y[1]-x[1]).slice(0,2).map(([k,v])=>{
        const other = k.split("|").find(id=>id!==a.id);
        return `<b>${esc(sim.by(other).name.split(" ")[0])}</b> ${v}%`;
      }).join(" · ");
    const needed = 100 + a.lvl*90;
    return `<div class="agent-card ${a.grp?"":"ceo"}">
      <div class="ac-t">
        <div class="avatar" style="width:48px;height:48px;font-size:25px">${a.av}</div>
        <div><div class="ac-name">${esc(a.name)}</div>
          <div class="ac-role">${esc(a.role)}${a.grp?` · ${esc(sim.group(a.grp).name.split(" Division")[0])}${a.lead?" · Lead":""}`:" · Founder"}</div></div>
        <div class="lvl-badge"><div class="n">${a.lvl}</div><div class="t">${LEVEL_TITLES[a.lvl-1]}</div></div>
      </div>
      <div class="xp-line"><span>XP</span><span>${Math.floor(a.xp)} / ${needed}</span></div>
      <div class="xp-track"><div class="xp-fill" style="width:${Math.min(100,(a.xp/needed)*100)}%"></div></div>
      <div class="xp-line" style="margin-top:9px"><span>morale</span><span>${Math.floor(a.morale)}%</span></div>
      <div class="mini-track"><div class="mini-fill morale" style="width:${a.morale}%"></div></div>
      <div class="ac-skills">${skillRows}</div>
      <div class="ac-quirk">“${esc(a.quirk)}”</div>
      ${bonds?`<div class="ac-bonds">bonds → ${bonds}</div>`:""}
    </div>`;
  }).join("");
  $("team-grid").innerHTML = cards;
}

/* ---------- skills library ---------- */
let skillFilter = "all";
function buildSkillFilters(){
  const f = [["all","🌐 Everything"],["trend","📡 Trend"],["studio","🎬 Studio"],["dist","📣 Distribution"],["growth","🎓 Skills & QA"]];
  $("skills-side").innerHTML = `<div class="well"><h3>FILTER THE LIBRARY</h3>
    ${f.map(([id,l])=>`<button class="skill-tick ${skillFilter===id?"on":""}" data-f="${id}">${l}</button>`).join("")}</div>
    <div class="well"><h3>TOP REPS THIS WEEK</h3>${skillTopReps()}</div>`;
  document.querySelectorAll(".skill-tick").forEach(b=>b.addEventListener("click",()=>{
    skillFilter = b.dataset.f; buildSkillFilters(); renderSkills();
  }));
}
function skillTopReps(){
  const tops = [];
  AGENTS.forEach(a=>{ Object.entries(a.wkSkillXp||{}).forEach(([k,v])=>{ tops.push({a,k,v}); }); });
  tops.sort((x,y)=>y.v-x.v);
  const rows = tops.slice(0,6).map(t=>{
    const sk = SKILLS.find(s=>s.id===t.k);
    return `<div class="top-sk"><span>${sk?sk.ic:"🎓"} ${esc(t.a.name.split(" ")[0])} · ${esc(sk?sk.name:t.k)}</span><span class="v">+${t.v.toFixed(0)}</span></div>`;
  });
  return rows.length ? rows.join("") : `<div class="top-sk" style="color:#5a6187">doors just opened — reps pending…</div>`;
}
function renderSkills(){
  const cards = SKILLS.map(sk=>{
    if(skillFilter!=="all" && sk.grp!==skillFilter) return "";
    const owners = sim.agents.filter(a=>a.skillLv[sk.id]>0).sort((x,y)=>(y.skillLv[sk.id]||0)-(x.skillLv[sk.id]||0));
    const avg = owners.length ? (owners.reduce((s,a)=>s+a.skillLv[sk.id],0)/owners.length).toFixed(1) : "0";
    return `<div class="skill-card">
      <div class="sc-t"><span class="ic">${sk.ic}</span><span class="nm">${esc(sk.name)}</span><span class="sc-avg">avg ${avg}</span></div>
      <div class="sc-desc">${esc(sk.desc)}</div>
      <div class="crews">${owners.slice(0,5).map(a=>`<span class="crew-chip">${a.av} ${esc(a.name.split(" ")[0])} <b>L${a.skillLv[sk.id]}</b></span>`).join("") || `<span class="crew-chip" style="color:#5a6187">nobody's touched it yet — Forge will notice</span>`}</div>
    </div>`;
  }).join("");
  $("skills-grid").innerHTML = cards;
}

/* ---------- meetings ---------- */
function meetingEntryHTML(e, live){
  return `<div class="meeting-entry">
    <span class="meet-tag ${e.tag}">${e.tag==="daily"?"8:00 BRIEF":"SUNDAY ALL-HANDS"}</span>
    <b>${esc(e.title)}</b>
    <span style="color:#5a6187;font-size:11px;margin-left:8px">${esc(e.when)}</span>
    ${e.lines.map(l=>{
      const ag = sim.by(l.who);
      return `<div class="me-line"><span class="me-arrow">${ag?ag.av:"•"}</span><b>${ag?esc(ag.name.split(" ")[0]):esc(l.who)}:</b> ${esc(l.txt)}</div>`;
    }).join("")}
  </div>`;
}
function renderMeetings(){
  $("meeting-log").innerHTML = sim.meetings.slice(0,14).map(e=>meetingEntryHTML(e)).join("") ||
    `<div class="empty-note">first 8:00 brief is imminent…</div>`;
  const isNow = !!sim.pending;
  $("meetings-head").innerHTML = `
    <span class="next-meet">up next → <b>${isNow ? "a meeting is LIVE right now — check the board" : esc(sim.nextMeetingLabel())}</b></span>
    <span class="next-meet" style="margin-left:auto">channel total → <b>${Math.floor(sim.published.reduce((s,v)=>s+v.views,0)).toLocaleString()} views</b> · ${sim.pubCount} video${sim.pubCount===1?"":"s"} published</span>`;
}

/* ---------- live meeting modal reveal ---------- */
function stepMeetingModal(){
  const p = sim.pending;
  if(!p) return;
  const bd = $("modal-backdrop");
  if(bd.classList.contains("hidden")){
    $("modal-title").textContent = p.entry.title;
    $("modal-body").innerHTML = "";
    $("modal-foot").textContent = "◉ recording — meeting in progress";
    bd.classList.remove("hidden");
  }
  if(p.shown < p.entry.lines.length){
    const l = p.entry.lines[p.shown];
    const ag = sim.by(l.who);
    const div = document.createElement("div");
    div.className = "mline";
    div.innerHTML = `<span class="who-t">${ag?esc(ag.av+" "+ag.name):esc(l.who)}:</span> ${esc(l.txt)}`;
    $("modal-body").appendChild(div);
    $("modal-body").scrollTop = $("modal-body").scrollHeight;
    p.shown++;
  }
  if(p.shown >= p.entry.lines.length){
    $("modal-foot").textContent = "✓ recording ended — full minutes in the Meetings tab";
    clearTimeout(revealTimer);
    revealTimer = setTimeout(()=>{
      $("modal-backdrop").classList.add("hidden");
      sim.pending = null;
      sim.settleSkip();
      setSpeedUI();
    }, 2600);
  }
}
$("modal-close").addEventListener("click", ()=>{
  clearTimeout(revealTimer);
  if(sim.pending) sim.pending = null;
  sim.settleSkip();
  $("modal-backdrop").classList.add("hidden");
  setSpeedUI();
});

/* ---------- projects / video pipeline ---------- */
function renderProjects(){
  const v = sim.video;
  const stagesHtml = STAGES.slice(0,6).map((st,i)=>{
    const done = i < v.stage;
    const cur = i === v.stage;
    const pct = done ? 100 : cur ? Math.min(100, (v.stageProg[i]/v.quota[i])*100) : 0;
    return `<div class="sk-row" style="margin-top:5px">
      <span style="width:150px;font-size:11px;color:${done?"#5beca4":cur?"#41e0d0":"#5a6187"}">${st.ic||"•"} ${esc(st.name)}</span>
      <div class="mini-track"><div class="mini-fill" style="width:${pct}%;${done?"background:#5beca4":""}"></div></div>
      <span style="font-size:10px;color:#5a6187;width:30px;text-align:right">${done?"✓":cur?`${v.stageProg[i]}/${v.quota[i]}`:""}</span></div>`;
  }).join("");
  const liveHtml = sim.live ? `<div class="proj-card">
      <div class="proj-t"><span>🔴</span><span class="proj-name">${esc(sim.live.title)}</span><span class="proj-status">LIVE</span></div>
      <div class="proj-meta">keyword: ${esc(sim.live.kw)} · QA depth ${sim.live.qa}/2 checks · ${sim.live.boost} post-publish boosts</div>
      <div class="proj-track"><div class="proj-fill" style="width:${Math.min(100,sim.live.rate*1.2)}%"></div></div>
      <div style="font-size:22px;font-weight:900;color:#41e0d0">${Math.floor(sim.live.views).toLocaleString()} <span style="font-size:11px;color:#8b93b8">views</span></div>
    </div>` : `<div class="proj-card"><div class="proj-t"><span>📺</span><span class="proj-name">channel is quiet</span></div><div class="proj-meta">no video live — publishing team is on it</div></div>`;
  const history = sim.published.slice(0,8).map(p=>`<div class="proj-card done">
      <div class="proj-t"><span class="proj-name">${esc(p.title)}</span></div>
      <div style="font-size:12px;color:#41e0d0;font-weight:800">${Math.floor(p.views).toLocaleString()} views</div>
      <div class="proj-meta">${p.rate>60?"🔥 viral-grade":p.rate>25?"🟢 solid":"🟡 slow burn"}</div></div>`).join("");
  $("projects-grid").innerHTML = `
    <div class="proj-card">
      <div class="proj-t"><span>🎬</span><span class="proj-name">${esc(v.title)} — in production</span><span class="proj-status">${STAGES[v.stage].name.toUpperCase()}</span></div>
      <div class="proj-meta">keyword angle: ${esc(v.kw)}</div>
      ${stagesHtml}
    </div>
    ${liveHtml}
    ${history}`;
}

/* ---------- header ---------- */
function renderHeader(){
  $("clock-date").textContent = sim.dateLabel();
  $("clock-time").textContent = sim.fmtTime();
  const v = Math.round(sim.vibe);
  $("vibe-fill").style.width = v+"%";
  $("vibe-val").textContent = v+"%";
}

/* ---------- main loop ---------- */
let lastPendingId = null;
function pump(){
  sim.advance(sim.speed);
  renderHeader();
  renderDesks();
  renderFeed();
  stepMeetingModal();
  if($("panel-projects").classList.contains("active")) renderProjects();
  if($("panel-team").classList.contains("active")) renderTeam();
  if($("panel-skills").classList.contains("active")) { renderSkills(); buildSkillFilters(); }
  if($("panel-meetings").classList.contains("active")) renderMeetings();
  if(sim.savedSpeed && !!sim.pending){ setSpeedUI(); }
}

/* ---------- save / resume / catch-up ---------- */
const SAVE_KEY = "meridian_hq_v1";
function saveGame(){
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(sim.snapshot())); } catch(e){}
}
$("btn-reset").addEventListener("click", ()=>{
  try { localStorage.removeItem(SAVE_KEY); } catch(e){}
  location.reload();
});
window.addEventListener("beforeunload", saveGame);
setInterval(saveGame, 10000);

(function boot(){
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch(e){}
  if(saved && sim.restore(saved)){
    const awayMin = Math.max(0, Math.floor((Date.now() - saved.t) / 600));
    if(awayMin > 5){
      const capped = Math.min(awayMin, 43200);   /* max 30 days catch-up */
      toast(`🗓 you were away ${Math.floor(capped/1440)}d ${Math.floor((capped%1440)/60)}h — fast-forwarding the company…`);
      let left = capped;
      const burger = () => {
        sim.advance(Math.min(150, left));
        left -= 150;
        stepMeetingModal();
        renderHeader(); renderDesks(); renderFeed();
        if(left > 0) setTimeout(burger, 0);
        else { setSpeedUI(); toast("caught up — the office is back to live time."); }
      };
      setTimeout(burger, 500);
    }
  }
})();

renderHeader(); renderDesks(); renderFeed(); buildSkillFilters(); renderSkills(); renderMeetings(); renderProjects(); renderTeam();
setInterval(pump, 600);
setSpeedUI();
