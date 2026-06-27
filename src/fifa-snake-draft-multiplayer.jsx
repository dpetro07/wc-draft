import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════════
//  SUPABASE CONFIG — paste your project values (Settings → API) or set
//  env vars VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on your host.
// ═══════════════════════════════════════════════════════════════════
const SUPABASE_URL      = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_URL)      || "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const SUPABASE_READY = SUPABASE_URL !== "YOUR_SUPABASE_URL";

// ─── ADMIN ───────────────────────────────────────────────────────
const ADMIN_EMAIL = "danpetro7@gmail.com";

// ─── MODERN MINIMALIST PALETTE ────────────────────────────────────
const LIGHT = {
  cream:"#FAFAF8", creamDk:"#F2F2EF", creamLt:"#FFFFFF",
  navy:"#1A1A1A", navyLt:"#6B7280", navyDk:"#111111",
  olive:"#2D5BFF", oliveLt:"#5B82FF", oliveDk:"#1A3FCC",
  white:"#FFFFFF", danger:"#EF4444",
  card:"#FFFFFF", cardBorder:"rgba(0,0,0,0.07)",
  textSub:"#9CA3AF", iconColor:"#1A1A1A",
  accent2:"#22C55E", accent3:"#F59E0B", accent4:"#EC4899", accent5:"#8B5CF6",
  shadow:"0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowSm:"0 1px 2px rgba(0,0,0,0.05)",
  border:"1px solid rgba(0,0,0,0.08)",
};
const DARK = {
  cream:"#111113", creamDk:"#0A0A0C", creamLt:"#1C1C1F",
  navy:"#F4F4F5", navyLt:"#A1A1AA", navyDk:"#FAFAFA",
  olive:"#5B82FF", oliveLt:"#7C9FFF", oliveDk:"#3D6AFF",
  white:"#F4F4F5", danger:"#F87171",
  card:"#18181B", cardBorder:"rgba(255,255,255,0.08)",
  textSub:"#71717A", iconColor:"#F4F4F5",
  accent2:"#4ADE80", accent3:"#FBBF24", accent4:"#F472B6", accent5:"#A78BFA",
  shadow:"0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
  shadowSm:"0 1px 2px rgba(0,0,0,0.2)",
  border:"1px solid rgba(255,255,255,0.08)",
};
const PLAYER_COLORS = ["#3B82F6","#22C55E","#EF4444","#8B5CF6","#F59E0B","#EC4899","#14B8A6","#6366F1"];

// ─── TEAMS — with ISO codes for flag images + ESPN/FIFA data ──────
// flagcdn.com/{h}/{iso2}.png  →  reliable flag images per country
// FIFA rankings as of June 2026 (latest published)
// ESPN OVR = ESPN Soccer Power Index adjusted to 0-100 scale
const ALL_TEAMS = [
  {name:"Argentina",       iso2:"ar", conf:"CONMEBOL",wcGroup:"J",fifaRank:3,  ovr:96},
  {name:"France",          iso2:"fr", conf:"UEFA",    wcGroup:"I",fifaRank:2,  ovr:95},
  {name:"Spain",           iso2:"es", conf:"UEFA",    wcGroup:"H",fifaRank:1,  ovr:95},
  {name:"England",         iso2:"gb-eng", conf:"UEFA",wcGroup:"L",fifaRank:5,  ovr:93},
  {name:"Brazil",          iso2:"br", conf:"CONMEBOL",wcGroup:"C",fifaRank:4,  ovr:92},
  {name:"Portugal",        iso2:"pt", conf:"UEFA",    wcGroup:"K",fifaRank:6,  ovr:92},
  {name:"Netherlands",     iso2:"nl", conf:"UEFA",    wcGroup:"F",fifaRank:7,  ovr:89},
  {name:"Germany",         iso2:"de", conf:"UEFA",    wcGroup:"E",fifaRank:12, ovr:87},
  {name:"Belgium",         iso2:"be", conf:"UEFA",    wcGroup:"G",fifaRank:9,  ovr:86},
  {name:"Croatia",         iso2:"hr", conf:"UEFA",    wcGroup:"L",fifaRank:10, ovr:84},
  {name:"Colombia",        iso2:"co", conf:"CONMEBOL",wcGroup:"K",fifaRank:11, ovr:84},
  {name:"Uruguay",         iso2:"uy", conf:"CONMEBOL",wcGroup:"H",fifaRank:13, ovr:83},
  {name:"Morocco",         iso2:"ma", conf:"CAF",     wcGroup:"C",fifaRank:14, ovr:82},
  {name:"Japan",           iso2:"jp", conf:"AFC",     wcGroup:"F",fifaRank:15, ovr:81},
  {name:"Switzerland",     iso2:"ch", conf:"UEFA",    wcGroup:"B",fifaRank:16, ovr:80},
  {name:"United States",   iso2:"us", conf:"CONCACAF",wcGroup:"D",fifaRank:17, ovr:80},
  {name:"Mexico",          iso2:"mx", conf:"CONCACAF",wcGroup:"A",fifaRank:18, ovr:79},
  {name:"Senegal",         iso2:"sn", conf:"CAF",     wcGroup:"I",fifaRank:19, ovr:79},
  {name:"Austria",         iso2:"at", conf:"UEFA",    wcGroup:"J",fifaRank:20, ovr:78},
  {name:"Ecuador",         iso2:"ec", conf:"CONMEBOL",wcGroup:"E",fifaRank:22, ovr:77},
  {name:"Norway",          iso2:"no", conf:"UEFA",    wcGroup:"I",fifaRank:23, ovr:77},
  {name:"Korea Republic",  iso2:"kr", conf:"AFC",     wcGroup:"A",fifaRank:24, ovr:76},
  {name:"Australia",       iso2:"au", conf:"AFC",     wcGroup:"D",fifaRank:25, ovr:75},
  {name:"Turkiye",         iso2:"tr", conf:"UEFA",    wcGroup:"D",fifaRank:26, ovr:74},
  {name:"Canada",          iso2:"ca", conf:"CONCACAF",wcGroup:"B",fifaRank:27, ovr:74},
  {name:"Cote d'Ivoire",   iso2:"ci", conf:"CAF",     wcGroup:"E",fifaRank:28, ovr:74},
  {name:"Sweden",          iso2:"se", conf:"UEFA",    wcGroup:"F",fifaRank:29, ovr:73},
  {name:"Egypt",           iso2:"eg", conf:"CAF",     wcGroup:"G",fifaRank:30, ovr:73},
  {name:"Iran",            iso2:"ir", conf:"AFC",     wcGroup:"G",fifaRank:21, ovr:73},
  {name:"Scotland",        iso2:"gb-sct", conf:"UEFA",wcGroup:"C",fifaRank:32, ovr:72},
  {name:"Czechia",         iso2:"cz", conf:"UEFA",    wcGroup:"A",fifaRank:33, ovr:71},
  {name:"Algeria",         iso2:"dz", conf:"CAF",     wcGroup:"J",fifaRank:34, ovr:70},
  {name:"Bosnia",          iso2:"ba", conf:"UEFA",    wcGroup:"B",fifaRank:35, ovr:70},
  {name:"Tunisia",         iso2:"tn", conf:"CAF",     wcGroup:"F",fifaRank:36, ovr:70},
  {name:"Paraguay",        iso2:"py", conf:"CONMEBOL",wcGroup:"D",fifaRank:38, ovr:69},
  {name:"Ghana",           iso2:"gh", conf:"CAF",     wcGroup:"L",fifaRank:48, ovr:68},
  {name:"Panama",          iso2:"pa", conf:"CONCACAF",wcGroup:"L",fifaRank:41, ovr:67},
  {name:"Qatar",           iso2:"qa", conf:"AFC",     wcGroup:"B",fifaRank:52, ovr:66},
  {name:"Saudi Arabia",    iso2:"sa", conf:"AFC",     wcGroup:"H",fifaRank:58, ovr:65},
  {name:"Uzbekistan",      iso2:"uz", conf:"AFC",     wcGroup:"K",fifaRank:57, ovr:64},
  {name:"South Africa",    iso2:"za", conf:"CAF",     wcGroup:"A",fifaRank:60, ovr:64},
  {name:"DR Congo",        iso2:"cd", conf:"CAF",     wcGroup:"K",fifaRank:56, ovr:63},
  {name:"Jordan",          iso2:"jo", conf:"AFC",     wcGroup:"J",fifaRank:64, ovr:62},
  {name:"Iraq",            iso2:"iq", conf:"AFC",     wcGroup:"I",fifaRank:55, ovr:61},
  {name:"Cape Verde",      iso2:"cv", conf:"CAF",     wcGroup:"H",fifaRank:70, ovr:60},
  {name:"New Zealand",     iso2:"nz", conf:"OFC",     wcGroup:"G",fifaRank:86, ovr:59},
  {name:"Haiti",           iso2:"ht", conf:"CONCACAF",wcGroup:"C",fifaRank:83, ovr:57},
  {name:"Curacao",         iso2:"cw", conf:"CONCACAF",wcGroup:"E",fifaRank:90, ovr:56},
];

// flagcdn.com: reliable flag CDN, supports gb-eng / gb-sct subdivision codes
function flagUrl(iso2){
  return `https://flagcdn.com/w80/${iso2}.png`;
}

// Emoji flag fallback — works for all standard ISO2 codes offline
function flagEmoji(iso2){
  const code = iso2.toUpperCase();
  if(code === "GB-ENG") return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
  if(code === "GB-SCT") return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  if(code.length === 2){
    const base = 0x1F1E6 - 65;
    return String.fromCodePoint(base + code.charCodeAt(0), base + code.charCodeAt(1));
  }
  return code;
}

function ovrColor(ovr){
  if(ovr>=90) return "#2D5BFF";
  if(ovr>=80) return "#1A1A1A";
  if(ovr>=70) return "#22C55E";
  return "#9CA3AF";
}

const NUM_PLAYERS      = 8;
const PICKS_PER_PLAYER = 6;
const TOTAL_PICKS      = NUM_PLAYERS * PICKS_PER_PLAYER;
const DEFAULT_NAMES    = ["Player 1","Player 2","Player 3","Player 4","Player 5","Player 6","Player 7","Player 8"];

const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

// ─── SNAKE ORDER ─────────────────────────────────────────────────
// Lottery shuffles WHO picks at each position (seats 1-6).
// Snake means: R1 → 1-2-3-4-5-6, R2 → 6-5-4-3-2-1, etc.
// The lottery order IS the seat assignment for round 1; snake mirrors from there.
function buildSnakeOrder(n, rounds, lotterySeats){
  // lotterySeats is a permutation of [0..n-1], the draft order for the first round.
  // Snake alternates direction each round.
  const base = (lotterySeats && lotterySeats.length === n)
    ? lotterySeats.slice()
    : Array.from({length:n}, (_,i) => i);
  const order = [];
  for(let r = 0; r < rounds; r++){
    const row = r % 2 === 0 ? base.slice() : base.slice().reverse();
    for(const s of row) order.push(s);
  }
  return order;
}

// ─── SCORING ─────────────────────────────────────────────────────
function computeScores(playerNames, picks, teamResults){
  const arr = playerNames.map((name, pi) => {
    const myTeams = picks.filter(p => p.playerIndex === pi).map(p => p.team);
    let total = 0;
    const breakdown = [];
    for(const team of myTeams){
      const res = teamResults[team.name] || {};
      let pts = 0;
      for(let g = 1; g <= 3; g++){
        if(res["g"+g] === "W") pts += 3;
        else if(res["g"+g] === "D") pts += 1;
      }
      if(res.r32   === "W") pts += 5;
      if(res.r16   === "W") pts += 6;
      if(res.r8    === "W") pts += 7;
      if(res.r4    === "W") pts += 8;
      if(res.final === "W") pts += 10;
      total += pts;
      breakdown.push({team, pts, res});
    }
    const avg = myTeams.length
      ? Math.round(myTeams.reduce((s,t) => s + t.ovr, 0) / myTeams.length)
      : 0;
    return {name, pi, total, breakdown, teams:myTeams, avg};
  });
  arr.sort((a,b) => b.total - a.total);
  return arr;
}

// ─── ESPN SCORES HOOK ─────────────────────────────────────────────
function useESPN(){
  const [d, setD] = useState({
    games:[], live:[], teamResults:{}, lastFetch:null, loading:true, source:"loading"
  });
  const run = useCallback(async () => {
    try {
      // Fetch all group stage matches (June 11 - June 28, 2026)
      const res = await fetch(ESPN_URL + "?limit=200&dates=20260611-20260719");
      const json = await res.json();
      const games=[], live=[], tr={};
      // Normalize ESPN display names → our internal ALL_TEAMS names
      function normalize(espnName){
        if(!espnName) return espnName;
        const dn = espnName.toLowerCase().trim();
        const match = ALL_TEAMS.find(t=>
          t.name.toLowerCase()===dn ||
          dn.includes(t.name.toLowerCase()) ||
          t.name.toLowerCase().includes(dn) ||
          (t.name==="Korea Republic" && (dn.includes("korea")||dn.includes("south korea"))) ||
          (t.name==="Turkiye" && (dn.includes("turkey")||dn.includes("türkiye"))) ||
          (t.name==="Cote d'Ivoire" && (dn.includes("ivory")||dn.includes("côte"))) ||
          (t.name==="Czechia" && dn.includes("czech")) ||
          (t.name==="Bosnia" && dn.includes("bosnia")) ||
          (t.name==="DR Congo" && dn.includes("congo")) ||
          (t.name==="United States" && (dn.includes("usa")||dn.includes("united states"))) ||
          (t.name==="Curacao" && (dn.includes("curaçao")||dn.includes("curacao")))
        );
        return match ? match.name : espnName;
      }
      for(const ev of (json.events || [])){
        const comp = ev.competitions && ev.competitions[0];
        if(!comp) continue;
        const cs = comp.competitors || [];
        if(cs.length < 2) continue;
        const home = (cs[0].team && cs[0].team.displayName) || "";
        const away = (cs[1].team && cs[1].team.displayName) || "";
        const hS = parseInt(cs[0].score)||0, aS = parseInt(cs[1].score)||0;
        const st   = (ev.status && ev.status.type && ev.status.type.state) || "pre";
        const done = !!(ev.status && ev.status.type && ev.status.type.completed);
        const clock = (ev.status && ev.status.displayClock) || "";
        const rnd  = (ev.season && ev.season.slug) || "";
        const gameDate = ev.date || (comp.date) || "";
        const gameName = ev.name || "";
        const eventId = ev.id || "";
        const venue = (comp.venue && comp.venue.fullName) || "";
        const venueCity = (comp.venue && comp.venue.address && comp.venue.address.city) || "";
        const venueState = (comp.venue && comp.venue.address && comp.venue.address.state) || "";
        const location = venue ? (venueCity ? `${venue}, ${venueCity}${venueState?", "+venueState:""}` : venue) : "";
        // Determine round label
        const rl = rnd.toLowerCase();
        let roundLabel = "Group Stage";
        if(rl.includes("32"))      roundLabel = "Round of 32";
        else if(rl.includes("16")) roundLabel = "Round of 16";
        else if(rl.includes("quarter")) roundLabel = "Quarter-Finals";
        else if(rl.includes("semi") && !rl.includes("final")) roundLabel = "Semi-Finals";
        else if(rl.includes("final") && !rl.includes("semi") && !rl.includes("quarter")) roundLabel = "Final";
        else if(rl.includes("third") || rl.includes("3rd")) roundLabel = "3rd Place";
        games.push({home, away, hScore:hS, aScore:aS, status:st, completed:done, clock, roundLabel, gameDate, gameName, location, eventId});
        if(st === "in") live.push({home, away, hScore:hS, aScore:aS, clock, roundLabel, gameDate, location});
        // Process both completed AND live games for standings (live scores treated as current result)
        if(!done && st !== "in") continue;
        let rk = null;
        if(rl.includes("group"))   rk = "group";
        else if(rl.includes("32")) rk = "r32";
        else if(rl.includes("16")) rk = "r16";
        else if(rl.includes("quarter")) rk = "r8";
        else if(rl.includes("semi"))    rk = "r4";
        else if(rl.includes("final") && !rl.includes("semi") && !rl.includes("quarter")) rk = "final";
        if(!rk) continue;
        const nHome = normalize(home), nAway = normalize(away);
        if(!tr[nHome]) tr[nHome] = {};
        if(!tr[nAway]) tr[nAway] = {};
        if(rk === "group"){
          const hg = Object.keys(tr[nHome]).filter(k=>k[0]==="g").length + 1;
          const ag = Object.keys(tr[nAway]).filter(k=>k[0]==="g").length + 1;
          if(hS > aS){ tr[nHome]["g"+Math.min(hg,3)]="W"; tr[nAway]["g"+Math.min(ag,3)]="L"; }
          else if(aS > hS){ tr[nAway]["g"+Math.min(ag,3)]="W"; tr[nHome]["g"+Math.min(hg,3)]="L"; }
          else { tr[nHome]["g"+Math.min(hg,3)]="D"; tr[nAway]["g"+Math.min(ag,3)]="D"; }
        } else {
          if(hS > aS){ tr[nHome][rk]="W"; tr[nAway][rk]="L"; }
          else if(aS > hS){ tr[nAway][rk]="W"; tr[nHome][rk]="L"; }
        }
      }
      setD({games, live, teamResults:tr, lastFetch:new Date(), loading:false, source:games.length?"espn":"static"});
    } catch(e){
      setD(p => ({...p, loading:false, source:"static", lastFetch:new Date()}));
    }
  }, []);
  useEffect(() => {
    run();
    const t = setInterval(run, 60000);
    return () => clearInterval(t);
  }, [run]);
  return {espnData:d, refetch:run};
}

// ─── POOL-BALL LOTTERY MACHINE ───────────────────────────────────
// Classic billiard pool ball aesthetics: solid color + white number circle stripe
// Real pool ball colors for balls 1-6
const POOL_BALLS = [
  { solid:"#F5C518", stripe:false, shadow:"rgba(200,155,10,0.6)" },  // 1 = yellow
  { solid:"#1A4FA0", stripe:false, shadow:"rgba(20,60,140,0.6)" },   // 2 = blue
  { solid:"#CC2020", stripe:false, shadow:"rgba(160,20,20,0.6)" },   // 3 = red
  { solid:"#6B2C8A", stripe:false, shadow:"rgba(80,30,110,0.6)" },   // 4 = purple
  { solid:"#E06818", stripe:false, shadow:"rgba(180,80,10,0.6)" },   // 5 = orange
  { solid:"#1C8A38", stripe:false, shadow:"rgba(20,100,40,0.6)" },   // 6 = green
  { solid:"#7A1A1A", stripe:false, shadow:"rgba(100,20,20,0.6)" },   // 7 = maroon
  { solid:"#1A1A1A", stripe:false, shadow:"rgba(0,0,0,0.6)" },       // 8 = black
];

function PoolBall({seat, size=44, glow=false, animate="none", style:extraStyle={}}){
  const b = POOL_BALLS[seat % POOL_BALLS.length];
  const num = seat + 1;
  const s2 = size * 0.42;  // white circle diameter
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", position:"relative", flexShrink:0,
      background:`radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55) 0%, ${b.solid} 45%, rgba(0,0,0,0.35) 100%)`,
      boxShadow: glow
        ? `0 0 0 2px rgba(255,255,255,0.3), 0 4px 16px ${b.shadow}, 0 0 32px ${b.solid}88, inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 4px 6px rgba(255,255,255,0.25)`
        : `0 3px 10px ${b.shadow}, inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 3px 5px rgba(255,255,255,0.2)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      animation: animate,
      ...extraStyle,
    }}>
      {/* White number disc — classic pool ball look */}
      <div style={{
        width:s2, height:s2, borderRadius:"50%",
        background:"rgba(255,255,255,0.92)",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"inset 0 1px 3px rgba(0,0,0,0.15)",
        position:"relative", zIndex:1,
      }}>
        <span style={{fontSize:size*0.22,fontWeight:900,color:"#1A1A1A",lineHeight:1,letterSpacing:-0.5}}>{num}</span>
      </div>
      {/* Top specular highlight */}
      <div style={{
        position:"absolute", top:"8%", left:"20%", width:"40%", height:"22%",
        borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 100%)",
        pointerEvents:"none",
      }}/>
    </div>
  );
}

function LotteryModal({playerNames, onConfirm, onClose, serverOrder, onComplete}){
  // serverOrder: if provided, auto-starts with this predetermined order (no shuffle, no re-roll)
  const autoMode = !!serverOrder;
  const [phase, setPhase]             = useState(autoMode ? "shaking" : "idle");
  const [result, setResult]           = useState(null);
  const [revealed, setRevealed]       = useState([]);
  const [currentBall, setCurrentBall] = useState(null);
  const [popupSeat, setPopupSeat]     = useState(null);
  const [ballsLeft, setBallsLeft]     = useState(playerNames.map((_,i)=>i));
  const [tick, setTick]               = useState(0);

  useEffect(()=>{
    if(phase!=="shaking") return;
    const id = setInterval(()=>setTick(t=>t+1), 80);
    return ()=>clearInterval(id);
  },[phase]);

  function shuffle(arr){
    const a=arr.slice();
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }

  const BASE_SLOTS = [
    {x:-55,y:20},{x:-18,y:32},{x:18,y:32},{x:55,y:20},
    {x:-42,y:-14},{x:0,y:-28},{x:42,y:-14},{x:0,y:4},
  ];

  function slotPos(idx, shaking){
    const base = BASE_SLOTS[idx % BASE_SLOTS.length];
    if(!shaking) return base;
    const freq = [1.1,0.9,1.3,0.7,1.0,0.85,1.15,0.8][idx%8];
    return {
      x: base.x + Math.sin(tick * freq * 0.35 + idx * 1.2) * 7,
      y: base.y + Math.cos(tick * freq * 0.28 + idx * 0.9) * 7,
    };
  }

  async function runAnimation(order){
    setPhase("shaking");
    setRevealed([]); setResult(null); setCurrentBall(null); setPopupSeat(null);
    setBallsLeft(playerNames.map((_,i)=>i));
    await new Promise(r=>setTimeout(r, 2000));

    for(let i=0; i<order.length; i++){
      const seat = order[i];
      setPhase("drawing"); setCurrentBall(seat);
      await new Promise(r=>setTimeout(r, 1100));
      setCurrentBall(null);
      setPopupSeat(seat);
      await new Promise(r=>setTimeout(r, 1800));
      setPopupSeat(null);
      setRevealed(prev=>[...prev,{pos:i,seat}]);
      setBallsLeft(prev=>prev.filter(s=>s!==seat));
      if(i < order.length-1){
        setPhase("shaking");
        await new Promise(r=>setTimeout(r, 600));
      }
    }
    setResult(order);
    setPhase("done");
  }

  // Auto-start when serverOrder is provided
  useEffect(()=>{
    if(autoMode && serverOrder){
      runAnimation(serverOrder);
    }
  },[]);

  function startLottery(){
    const order = shuffle(playerNames.map((_,i)=>i));
    runAnimation(order);
  }

  function reroll(){
    setPhase("idle");
    setRevealed([]); setResult(null); setCurrentBall(null); setPopupSeat(null);
    setBallsLeft(playerNames.map((_,i)=>i));
    setTimeout(startLottery, 120);
  }

  const isShaking = phase==="shaking";
  const isDrawing = phase==="drawing";
  const isDone    = phase==="done";
  const isIdle    = phase==="idle";

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,12,20,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}
         onClick={isIdle?onClose:undefined}>
      <div style={{
        background:"linear-gradient(180deg,#1C2030 0%,#141824 100%)",
        borderRadius:28,width:"100%",maxWidth:400,
        boxShadow:"0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)",
        overflow:"hidden",position:"relative",
      }} onClick={e=>e.stopPropagation()}>

        {/* ── PICK REVEAL POPUP — floats over everything when a ball is drawn ── */}
        {popupSeat !== null && (
          <div style={{
            position:"absolute",inset:0,zIndex:50,
            display:"flex",alignItems:"center",justifyContent:"center",
            background:"rgba(10,12,20,0.72)",
            animation:"popupFadeIn 0.2s ease both",
          }}>
            <div style={{
              display:"flex",flexDirection:"column",alignItems:"center",gap:16,
              background:"linear-gradient(160deg,#232840,#181C28)",
              borderRadius:24,padding:"32px 40px",
              border:"1px solid rgba(255,255,255,0.1)",
              boxShadow:"0 20px 60px rgba(0,0,0,0.6)",
              animation:"popupSlideUp 0.3s cubic-bezier(0.2,0.8,0.4,1) both",
            }}>
              {/* Big pool ball */}
              <div style={{animation:"popupBallIn 0.45s cubic-bezier(0.2,1.4,0.4,1) both"}}>
                <PoolBall seat={popupSeat} size={80} glow={true}/>
              </div>
              {/* Pick number */}
              <div style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"rgba(250,250,248,0.35)"}}>
                Pick #{revealed.length + 1}
              </div>
              {/* Player name — big reveal */}
              <div style={{
                fontSize:26,fontWeight:800,color:"#FAFAF8",letterSpacing:0.3,textAlign:"center",
                lineHeight:1.15,
                animation:"popupNameIn 0.3s ease 0.15s both",
              }}>
                {playerNames[popupSeat]}
              </div>
              {/* Drafts first / snake note */}
              {revealed.length===0 && (
                <div style={{fontSize:11,fontWeight:700,color:POOL_BALLS[popupSeat%8].solid,background:`${POOL_BALLS[popupSeat%8].solid}22`,border:`1px solid ${POOL_BALLS[popupSeat%8].solid}44`,borderRadius:20,padding:"4px 14px"}}>
                  Picks First!
                </div>
              )}
              {revealed.length===playerNames.length-1 && (
                <div style={{fontSize:11,color:"rgba(250,250,248,0.4)",textAlign:"center"}}>
                  Gets picks #{playerNames.length} &amp; #{playerNames.length+1} (snake)
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── HEADER ── */}
        <div style={{padding:"22px 24px 12px",textAlign:"center"}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"rgba(250,250,248,0.3)",marginBottom:6}}>FIFA WC 2026</div>
          <div style={{fontSize:22,fontWeight:800,color:"#FAFAF8",letterSpacing:0.5}}>Draft Lottery</div>
          <div style={{fontSize:11,color:"rgba(250,250,248,0.38)",marginTop:4,lineHeight:1.5}}>
            One ball per player · last pick gets {playerNames.length} &amp; {playerNames.length+1} (snake)
          </div>
        </div>

        {/* ── MACHINE ── */}
        <div style={{position:"relative",margin:"0 auto",width:320,height:258}}>
          {/* Felt glow */}
          <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",width:260,height:14,background:"radial-gradient(ellipse,rgba(45,91,255,0.22) 0%,transparent 70%)",filter:"blur(6px)"}}/>

          {/* ── GLASS DRUM ── */}
          <div style={{
            position:"absolute",left:"50%",top:12,transform:"translateX(-50%)",
            width:200,height:172,borderRadius:"50%",
            background:"radial-gradient(ellipse at 38% 35%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.25) 100%)",
            border:"1.5px solid rgba(255,255,255,0.13)",
            boxShadow:"0 12px 40px rgba(0,0,0,0.5), inset 0 2px 12px rgba(255,255,255,0.07), inset 0 -6px 16px rgba(0,0,0,0.35)",
            overflow:"hidden",
          }}>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:"28%",background:"linear-gradient(180deg,transparent,rgba(30,60,30,0.3))",borderRadius:"0 0 100px 100px"}}/>
            <div style={{position:"absolute",top:"6%",left:"18%",width:"64%",height:"28%",background:"radial-gradient(ellipse,rgba(255,255,255,0.08) 0%,transparent 80%)",borderRadius:"50%"}}/>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 80%,rgba(45,91,255,0.16) 0%,transparent 65%)",opacity:isShaking?1:0,transition:"opacity 0.4s"}}/>
            {ballsLeft.map((seat,idx)=>{
              const {x,y} = slotPos(idx, isShaking||isDrawing);
              return (
                <div key={seat} style={{position:"absolute",left:"50%",top:"50%",transform:`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,transition:isShaking?"none":"transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",zIndex:2}}>
                  <PoolBall seat={seat} size={40} glow={false}/>
                </div>
              );
            })}
          </div>

          {/* ── TUBE ── */}
          <div style={{position:"absolute",left:"50%",top:0,transform:"translateX(-50%)",width:48,height:22,zIndex:6}}>
            <div style={{position:"absolute",left:0,top:0,width:4,height:"100%",background:"linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08))",borderRadius:"3px 0 0 0"}}/>
            <div style={{position:"absolute",right:0,top:0,width:4,height:"100%",background:"linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.06))",borderRadius:"0 3px 0 0"}}/>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"rgba(255,255,255,0.2)",borderRadius:"3px 3px 0 0"}}/>
          </div>

          {/* ── RISING BALL ── */}
          {currentBall !== null && (
            <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",zIndex:10,animation:"poolBallRise 1.0s cubic-bezier(0.15,0.85,0.35,1.0) forwards"}}>
              <PoolBall seat={currentBall} size={44} glow={true}/>
            </div>
          )}

          {/* ── STAND ── */}
          <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:24,height:14,background:"linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.04))",borderRadius:"0 0 4px 4px"}}/>
            <div style={{width:130,height:12,background:"linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))",borderRadius:"0 0 8px 8px",border:"1px solid rgba(255,255,255,0.09)"}}/>
          </div>

          {/* ── STATUS ── */}
          <div style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:isShaking?"#8FAF87":isDrawing?"#F5C518":isDone?"rgba(250,250,248,0.65)":"rgba(250,250,248,0.22)",whiteSpace:"nowrap",transition:"color 0.3s"}}>
            {isIdle&&"Ready to draw"}{isShaking&&"Mixing balls…"}{isDrawing&&"Drawing…"}{isDone&&`All ${playerNames.length} picks drawn`}
          </div>
        </div>

        {/* ── REVEALED LIST ── */}
        {revealed.length > 0 && (
          <div style={{margin:"8px 20px 0",maxHeight:162,overflowY:"auto"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:"rgba(250,250,248,0.28)",marginBottom:7,paddingLeft:4}}>Draft Order</div>
            {revealed.map(({pos,seat})=>(
              <div key={pos} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",borderRadius:10,marginBottom:3,background:"linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))",border:"1px solid rgba(255,255,255,0.06)",animation:"poolRowIn 0.4s cubic-bezier(0.2,0.8,0.4,1) both"}}>
                <div style={{width:18,height:18,borderRadius:5,background:"rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontWeight:700,color:"rgba(250,250,248,0.38)",flexShrink:0}}>{pos+1}</div>
                <PoolBall seat={seat} size={28} glow={false}/>
                <span style={{fontSize:12.5,fontWeight:600,color:"#FAFAF8",flex:1}}>{playerNames[seat]}</span>
                {pos===0&&<span style={{fontSize:8.5,fontWeight:700,color:POOL_BALLS[seat%8].solid,background:`${POOL_BALLS[seat%8].solid}22`,border:`1px solid ${POOL_BALLS[seat%8].solid}44`,borderRadius:5,padding:"2px 7px",flexShrink:0}}>Picks 1st</span>}
                {pos===playerNames.length-1&&<span style={{fontSize:8.5,fontWeight:600,color:"rgba(250,250,248,0.35)",background:"rgba(255,255,255,0.05)",borderRadius:5,padding:"2px 7px",flexShrink:0,whiteSpace:"nowrap"}}>#{pos+1}&amp;{pos+2}</span>}
              </div>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div style={{padding:"14px 20px 22px",display:"flex",flexDirection:"column",gap:8}}>
          {isIdle && !autoMode && (
            <>
              <button style={{width:"100%",background:"linear-gradient(135deg,#2D5BFF,#6A7D55)",color:"#FAFAF8",border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 6px 20px rgba(45,91,255,0.4)",letterSpacing:0.4}} onClick={startLottery}>
                Draw Lottery Balls
              </button>
              <button style={{background:"none",border:"none",cursor:"pointer",color:"rgba(250,250,248,0.28)",fontSize:12,padding:"3px",textAlign:"center"}} onClick={onClose}>Cancel</button>
            </>
          )}
          {isDone && !autoMode && (
            <div style={{display:"flex",gap:8}}>
              <button style={{flex:1,background:"rgba(255,255,255,0.07)",color:"#FAFAF8",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px",fontSize:13,fontWeight:600,cursor:"pointer"}} onClick={reroll}>Re-draw ↺</button>
              <button style={{flex:2,background:"linear-gradient(135deg,#FAFAF8,#F5F0E8)",color:"#1A1F2E",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 16px rgba(250,250,248,0.2)"}} onClick={()=>onConfirm(result)}>Lock Order ✓</button>
            </div>
          )}
          {isDone && autoMode && (
            <button style={{width:"100%",background:"linear-gradient(135deg,#FAFAF8,#F5F0E8)",color:"#1A1F2E",border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 16px rgba(250,250,248,0.2)",letterSpacing:0.3}} onClick={()=>onComplete ? onComplete() : onConfirm && onConfirm(result)}>
              Start Drafting →
            </button>
          )}
        </div>

        {/* ── KEYFRAMES ── */}
        <style>{`
          @keyframes poolBallRise {
            0%   { top:188px; opacity:0.2; transform:translateX(-50%) scale(0.7); }
            18%  { opacity:1; }
            58%  { top:6px;   transform:translateX(-50%) scale(1.1); }
            78%  { top:1px;   transform:translateX(-50%) scale(1.04); }
            100% { top:4px;   opacity:1; transform:translateX(-50%) scale(1); }
          }
          @keyframes poolRowIn {
            from { opacity:0; transform:translateX(-10px) scale(0.95); }
            to   { opacity:1; transform:translateX(0) scale(1); }
          }
          @keyframes popupFadeIn {
            from { opacity:0; } to { opacity:1; }
          }
          @keyframes popupSlideUp {
            from { opacity:0; transform:translateY(24px) scale(0.92); }
            to   { opacity:1; transform:translateY(0) scale(1); }
          }
          @keyframes popupBallIn {
            from { transform:scale(0.4) rotate(-20deg); opacity:0; }
            to   { transform:scale(1) rotate(0deg); opacity:1; }
          }
          @keyframes popupNameIn {
            from { opacity:0; transform:translateY(8px); }
            to   { opacity:1; transform:translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}

// ─── TEAM CARD (Modern Minimalist) ───────────────────────────────
function TeamCard({team, picked, onClick, size=90}){
  const [imgErr, setImgErr] = useState(false);
  const oc = ovrColor(team.ovr);

  return (
    <div
      onClick={onClick}
      style={{cursor:picked?"default":"pointer",transition:"transform 0.2s ease, box-shadow 0.2s ease"}}
      onMouseEnter={e=>{ if(!picked){ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 25px rgba(0,0,0,0.08)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.06)"; }}
    >
      <div style={{
        borderRadius:14,
        overflow:"hidden",
        background:"#FFFFFF",
        border:"1px solid rgba(0,0,0,0.06)",
        boxShadow:picked?"none":"0 1px 3px rgba(0,0,0,0.06)",
        opacity:picked?0.3:1,
        transition:"opacity 0.2s",
        position:"relative",
      }}>
        {/* Flag */}
        <div style={{height:size*0.58,position:"relative",overflow:"hidden",background:"#F4F4F5"}}>
          {!imgErr ? (
            <img src={flagUrl(team.iso2)} alt={team.name} onError={()=>setImgErr(true)}
                 style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
          ) : (
            <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#E4E4E7"}}>
              <span style={{fontSize:size*0.32,lineHeight:1}}>{flagEmoji(team.iso2)}</span>
            </div>
          )}
          {picked && (
            <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"#1A1A1A",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{padding:"7px 8px 8px"}}>
          <div style={{fontSize:Math.max(9,size*0.11),fontWeight:600,color:"#1A1A1A",textAlign:"center",lineHeight:1.2,marginBottom:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {team.name}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>
            <span style={{fontSize:9,color:"#9CA3AF",fontWeight:500}}>#{team.fifaRank}</span>
            <span style={{fontSize:7,color:"#D4D4D8"}}>•</span>
            <span style={{fontSize:10,fontWeight:700,color:oc}}>{team.ovr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MINI CARD (Minimalist) ──────────────────────────────────────
function MiniCard({team, size=30}){
  const [err, setErr] = useState(false);
  return (
    <div style={{width:size,height:size,borderRadius:size*0.3,background:"#F4F4F5",overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
      {!err ? (
        <img src={flagUrl(team.iso2)} alt={team.name} onError={()=>setErr(true)}
             style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
      ) : (
        <span style={{fontSize:size*0.5,lineHeight:1}}>{flagEmoji(team.iso2)}</span>
      )}
    </div>
  );
}

// ─── AVATAR (Minimalist) ─────────────────────────────────────────
function Avatar({idx, size}){
  const bg = PLAYER_COLORS[idx % PLAYER_COLORS.length];
  return (
    <div style={{width:size,height:size,borderRadius:size*0.35,background:bg+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,fontWeight:700,color:bg,flexShrink:0}}>
      {idx+1}
    </div>
  );
}

// ─── SINGLE-COLOR SVG ICON SYSTEM ────────────────────────────────
// All icons share one color prop — clean outlined geometric style
function Icon({id, size=20, color}){
  const s = {width:size,height:size,display:"block",flexShrink:0};
  const c = color || "currentColor";
  const sw = size<=16?"1.6":"1.8";
  switch(id){
    case "ball": return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth={sw}/><path d="M12 3C9.5 5.5 9 9 9 12s.5 6.5 3 9" stroke={c} strokeWidth={sw} strokeLinecap="round"/><path d="M12 3c2.5 2.5 3 6 3 9s-.5 6.5-3 9" stroke={c} strokeWidth={sw} strokeLinecap="round"/><path d="M3.5 8.5h17M3.5 15.5h17" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case "trophy": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 3h12v8a6 6 0 01-12 0V3z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M6 5H3s0 5 3 5M18 5h3s0 5-3 5" stroke={c} strokeWidth={sw} strokeLinecap="round"/><path d="M12 17v3M8 20h8" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case "bars": return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="13" width="4" height="8" rx="1" fill={c}/><rect x="10" y="8" width="4" height="13" rx="1" fill={c}/><rect x="17" y="3" width="4" height="18" rx="1" fill={c}/></svg>;
    case "bolt": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h7.5L11 22l9-12h-7.5L13 2z" fill={c} stroke={c} strokeWidth="0.5" strokeLinejoin="round"/></svg>;
    case "gear": return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth={sw}/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={c} strokeWidth={sw}/></svg>;
    case "clock": return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth={sw}/><path d="M12 7v5l3.5 3.5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "star": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={c} stroke={c} strokeWidth="0.5" strokeLinejoin="round"/></svg>;
    case "history": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 109-9H3" stroke={c} strokeWidth={sw} strokeLinecap="round"/><path d="M3 7v5h5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8v4l3 3" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case "globe": return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth={sw}/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case "moon": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill={c} stroke={c} strokeWidth="0.5" strokeLinejoin="round"/></svg>;
    case "sun": return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill={c}/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case "back": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "reset": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 009 9 9 9 0 006.36-2.64" stroke={c} strokeWidth={sw} strokeLinecap="round"/><path d="M3 12a9 9 0 019-9 9 9 0 016.36 2.64" stroke={c} strokeWidth={sw} strokeLinecap="round"/><path d="M21 3v5h-5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "shuffle": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4l5 5" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case "dice": return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3.5" stroke={c} strokeWidth={sw}/><circle cx="8.5" cy="8.5" r="1.4" fill={c}/><circle cx="15.5" cy="8.5" r="1.4" fill={c}/><circle cx="8.5" cy="15.5" r="1.4" fill={c}/><circle cx="15.5" cy="15.5" r="1.4" fill={c}/><circle cx="12" cy="12" r="1.4" fill={c}/></svg>;
    case "wand": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M15 4l5 5-10 10-5-5L15 4z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M4 20l2-2M19 4l1-1M4 8l-1-1M16 20l1 1" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case "users": return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke={c} strokeWidth={sw}/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={c} strokeWidth={sw} strokeLinecap="round"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case "shield": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v5c0 5-3.5 9.7-8 11-4.5-1.3-8-6-8-11V6l8-4z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>;
    case "signal": return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M2 12h2M20 12h2" stroke={c} strokeWidth={sw} strokeLinecap="round"/><circle cx="12" cy="12" r="3" fill={c}/><path d="M6.34 6.34a8 8 0 000 11.32M17.66 6.34a8 8 0 010 11.32" stroke={c} strokeWidth={sw} strokeLinecap="round"/><path d="M3.51 3.51a15 15 0 000 16.97M20.49 3.51a15 15 0 010 16.97" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    default: return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth={sw}/></svg>;
  }
}

// ─── MOCK TOURNAMENT 2026 — full simulated results ─────────────────
// Argentina win the trophy; Germany runners-up
// These are applied as teamResults when mock draft loads
const MOCK_RESULTS = {
  // GROUP STAGE — W/D/L for matches 1,2,3
  "Argentina":      {g1:"W",g2:"W",g3:"W",r32:"W",r16:"W",r8:"W",r4:"W",final:"W"},
  "France":         {g1:"W",g2:"D",g3:"W",r32:"W",r16:"W",r8:"W",r4:"W",final:"L"},
  "Brazil":         {g1:"W",g2:"W",g3:"D",r32:"W",r16:"W",r8:"W",r4:"L"},
  "England":        {g1:"W",g2:"W",g3:"D",r32:"W",r16:"W",r8:"W",r4:"L"},
  "Spain":          {g1:"W",g2:"W",g3:"W",r32:"W",r16:"W",r8:"L"},
  "Portugal":       {g1:"W",g2:"W",g3:"W",r32:"W",r16:"W",r8:"L"},
  "Germany":        {g1:"W",g2:"D",g3:"W",r32:"W",r16:"W",r8:"W",r4:"W",final:"L"},
  "Netherlands":    {g1:"W",g2:"W",g3:"D",r32:"W",r16:"W",r8:"L"},
  "Colombia":       {g1:"W",g2:"W",g3:"D",r32:"W",r16:"W",r8:"L"},
  "Croatia":        {g1:"W",g2:"D",g3:"W",r32:"W",r16:"L"},
  "Morocco":        {g1:"W",g2:"W",g3:"W",r32:"W",r16:"W",r8:"W",r4:"L"},
  "Japan":          {g1:"W",g2:"W",g3:"D",r32:"W",r16:"L"},
  "Belgium":        {g1:"W",g2:"W",g3:"D",r32:"W",r16:"W",r8:"L"},
  "Mexico":         {g1:"W",g2:"D",g3:"W",r32:"W",r16:"L"},
  "United States":  {g1:"D",g2:"W",g3:"W",r32:"W",r16:"L"},
  "Uruguay":        {g1:"W",g2:"W",g3:"D",r32:"W",r16:"L"},
  "Switzerland":    {g1:"D",g2:"W",g3:"W",r32:"L"},
  "Ecuador":        {g1:"W",g2:"D",g3:"W",r32:"L"},
  "Senegal":        {g1:"W",g2:"W",g3:"L",r32:"L"},
  "Korea Republic": {g1:"W",g2:"L",g3:"W",r32:"L"},
  "Canada":         {g1:"W",g2:"W",g3:"L",r32:"L"},
  "Austria":        {g1:"D",g2:"W",g3:"W",r32:"L"},
  "Norway":         {g1:"W",g2:"D",g3:"L",r32:"L"},
  "Australia":      {g1:"D",g2:"W",g3:"L",r32:"L"},
  "Turkiye":        {g1:"W",g2:"L",g3:"W",r32:"L"},
  "Sweden":         {g1:"W",g2:"D",g3:"L"},
  "Egypt":          {g1:"D",g2:"W",g3:"L"},
  "Cote d'Ivoire":  {g1:"W",g2:"L",g3:"D"},
  "Scotland":       {g1:"L",g2:"W",g3:"W"},
  "Iran":           {g1:"W",g2:"L",g3:"D"},
  "Czechia":        {g1:"D",g2:"L",g3:"W"},
  "Algeria":        {g1:"W",g2:"D",g3:"L"},
  "Bosnia":         {g1:"L",g2:"D",g3:"W"},
  "Tunisia":        {g1:"D",g2:"W",g3:"L"},
  "Paraguay":       {g1:"L",g2:"W",g3:"D"},
  "Ghana":          {g1:"W",g2:"L",g3:"L"},
  "Panama":         {g1:"L",g2:"D",g3:"L"},
  "Qatar":          {g1:"D",g2:"L",g3:"L"},
  "Saudi Arabia":   {g1:"L",g2:"D",g3:"L"},
  "Uzbekistan":     {g1:"L",g2:"L",g3:"D"},
  "South Africa":   {g1:"L",g2:"L",g3:"W"},
  "DR Congo":       {g1:"L",g2:"D",g3:"L"},
  "Jordan":         {g1:"L",g2:"L",g3:"D"},
  "Iraq":           {g1:"D",g2:"L",g3:"L"},
  "Cape Verde":     {g1:"L",g2:"L",g3:"L"},
  "New Zealand":    {g1:"L",g2:"L",g3:"D"},
  "Haiti":          {g1:"L",g2:"L",g3:"L"},
  "Curacao":        {g1:"L",g2:"L",g3:"L"},
};

// Snake-ordered mock picks — distribute all 48 teams across 8 players
// Power-weighted: better teams go earlier in draft
function buildMockDraft(playerNames){
  const ranked = ALL_TEAMS.slice().sort((a,b)=>b.ovr-a.ovr);
  const n = playerNames.length;
  const snakeOrder = buildSnakeOrder(n, PICKS_PER_PLAYER, null);
  return ranked.map((team,idx) => ({
    playerIndex: snakeOrder[idx] ?? 0,
    team,
    pickIndex: idx,
  }));
}

// ─── DRAFT APP (UI shell — works local OR multiplayer) ────────────
// Multiplayer props (all optional; when absent the app runs in local mode):
//   mp = { mySeat, room, members, online, onPick, onLottery, onReset, onLeave, signOut }
function DraftApp({ mp }){
  const [screen,   setScreen]  = useState(mp ? "draft" : "setup");
  const [dark,     setDark]    = useState(false);
  const [names,    setNames]   = useState(DEFAULT_NAMES.slice());
  const [picks,    setPicks]   = useState([]);
  const [pickIdx,  setPickIdx] = useState(0);
  const [search,   setSearch]  = useState("");
  const [confF,    setConfF]   = useState("All");
  const [sortMode, setSortMode]= useState("group"); // group | rank | ovr
  const [manual,   setManual]  = useState({});
  const [lottery,  setLottery] = useState(null);   // null = default order
  const [showLottery,setShowLottery]=useState(false);
  const [lotteryDone,setLotteryDone]=useState(false);
  const [tab,      setTab]     = useState("standings");
  const [expanded, setExpanded]= useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [gameDetails, setGameDetails] = useState({});
  const [histF,    setHistF]   = useState("all");
  const [pwView,   setPwView]  = useState("all");

  const {espnData} = useESPN();
  const T = dark ? DARK : LIGHT;

  // ── MULTIPLAYER OVERRIDES ──
  const isMP = !!mp;
  const mpNames   = isMP ? mp.members.map(m=>m.team_name) : null;
  const mpPicks   = isMP ? mp.picks : null;
  const mpOrder   = isMP ? mp.draftOrder : null;
  const mpPickIdx = isMP ? mp.currentPick : null;

  // In MP mode, use the room's actual player/pick counts (not the hardcoded constants)
  const numPlayers   = isMP ? mp.room.num_players : NUM_PLAYERS;
  const picksPerPlayer = isMP ? (mp.room.picks_each || Math.floor(48/mp.room.num_players)) : PICKS_PER_PLAYER;
  const totalPicks   = numPlayers * picksPerPlayer;

  // Effective values (server in MP mode, local state otherwise)
  const effNames   = isMP ? mpNames : names;
  const effPicks   = isMP ? mpPicks : picks;
  const effPickIdx = isMP ? mpPickIdx : pickIdx;
  const effLottery = isMP ? mpOrder : lottery;

  const teamResults = useMemo(()=>{
    const m = {};
    for(const k in espnData.teamResults) m[k] = {...espnData.teamResults[k]};
    for(const k in manual) m[k] = {...(m[k]||{}), ...manual[k]};
    return m;
  }, [espnData.teamResults, manual]);

  const snakeOrder = useMemo(()=>buildSnakeOrder(numPlayers, picksPerPlayer, effLottery), [numPlayers, picksPerPlayer, effLottery]);
  const isDone = effPickIdx >= totalPicks;
  const curSeat = snakeOrder[effPickIdx] != null ? snakeOrder[effPickIdx] : 0;
  const round = Math.floor(effPickIdx / numPlayers) + 1;
  const isRev = Math.floor(effPickIdx / numPlayers) % 2 === 1;
  const pickedNames = useMemo(()=> new Set(effPicks.map(p=>p.team.name)), [effPicks]);
  const playerPicks = pi => effPicks.filter(p=>p.playerIndex===pi).map(p=>p.team);
  const scores = useMemo(()=>computeScores(effNames,effPicks,teamResults),[effNames,effPicks,teamResults]);

  // In MP mode, this device can only pick on its own seat's turn
  const myTurn = isMP ? (curSeat === mp.mySeat && !isDone) : true;

  function loadMockDraft(){
    const mockPicks = buildMockDraft(names);
    setPicks(mockPicks);
    setPickIdx(TOTAL_PICKS);
    setManual({...MOCK_RESULTS});
    setLottery(null);
    setLotteryDone(false);
    setScreen("board");
    setTab("standings");
  }

  function pickTeam(team){
    if(pickedNames.has(team.name) || isDone) return;
    if(isMP){
      if(!myTurn) return;
      mp.onPick(team);
      setSearch("");
      return;
    }
    setPicks(prev=>[...prev,{playerIndex:curSeat, team, pickIndex:pickIdx}]);
    setPickIdx(i=>i+1);
    setSearch("");
  }
  function setRes(name,field,val){
    setManual(prev=>{ const n={...prev}; n[name]={...n[name]}; n[name][field]=val; return n; });
  }
  function reset(){
    if(isMP){ mp.onReset && mp.onReset(); return; }
    setPicks([]); setPickIdx(0); setSearch(""); setManual({}); setLottery(null); setLotteryDone(false); setScreen("setup");
  }
  function confirmLottery(order){
    if(isMP){ mp.onLottery && mp.onLottery(order); setShowLottery(false); return; }
    setLottery(order);
    setLotteryDone(true);
    setShowLottery(false);
  }
  function ownerOf(teamName){
    for(let i=0;i<effNames.length;i++){ if(playerPicks(i).some(t=>t.name===teamName)) return {name:effNames[i],idx:i}; }
    return null;
  }

  // Build available + sorted list
  let avail = ALL_TEAMS.filter(t=>
    t.name.toLowerCase().includes(search.toLowerCase()) &&
    (confF==="All" || t.conf===confF)
  );
  if(sortMode==="rank") avail = avail.slice().sort((a,b)=>a.fifaRank-b.fifaRank);
  else if(sortMode==="ovr") avail = avail.slice().sort((a,b)=>b.ovr-a.ovr);

  // Auto-navigate to board when draft completes
  useEffect(()=>{
    if(isDone && screen==="draft"){
      setScreen("board");
      setTab("standings");
    }
  },[isDone]);

  const css = `
    @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    @keyframes yourTurnPulse{0%,100%{box-shadow:0 0 0 0 ${T.olive}33}50%{box-shadow:0 0 0 12px ${T.olive}00}}
    @keyframes yourTurnGlow{0%,100%{border-color:${T.olive}44}50%{border-color:${T.olive}15}}
    @keyframes yourTurnBadge{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.8;transform:scale(1.03)}}
    * { box-sizing:border-box; margin:0; padding:0; }
    body { background:${T.cream}; color:${T.navy}; font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; }
    .btn { cursor:pointer; border:none; font-family:inherit; border-radius:10px; padding:10px 20px; font-weight:600; font-size:13px; transition:all 0.15s ease; }
    .btn:hover { opacity:0.88; }
    .chip { cursor:pointer; border:${T.border}; background:${T.white}; color:${T.navy}; border-radius:20px; padding:5px 14px; font-size:11px; font-weight:500; white-space:nowrap; font-family:inherit; transition:all 0.15s; }
    .chip:hover { background:${T.creamDk}; }
    .chip.on { background:${T.navy}; color:${T.cream}; border-color:transparent; font-weight:600; }
    .navtab { cursor:pointer; border:none; background:transparent; font-size:12px; font-weight:500; padding:12px 16px; color:${T.textSub}; border-bottom:2px solid transparent; white-space:nowrap; font-family:inherit; transition:color 0.15s; }
    .navtab.on { color:${T.navy}; border-bottom-color:${T.olive}; font-weight:600; }
    .botbtn { cursor:pointer; border:none; background:transparent; display:flex; flex-direction:column; align-items:center; gap:3px; padding:7px 10px; font-size:10px; color:${T.textSub}; flex:1; font-family:inherit; font-weight:500; transition:color 0.15s; }
    .botbtn.on { color:${T.olive}; font-weight:600; }
    input { background:${T.white}; border:${T.border}; color:${T.navy}; border-radius:10px; padding:11px 14px; font-size:14px; outline:none; width:100%; font-family:inherit; transition:border-color 0.15s,box-shadow 0.15s; }
    input:focus { border-color:${T.olive}; box-shadow:0 0 0 3px ${T.olive}12; }
    input::placeholder { color:${T.textSub}; }
    select { background:${T.white}; border:${T.border}; color:${T.navy}; border-radius:8px; padding:5px 8px; font-size:11px; outline:none; cursor:pointer; font-family:inherit; }
    .row:hover { background:${T.creamDk}!important; }
    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-thumb { background:${T.navy}18; border-radius:4px; }
    .card { background:${T.card}; border:${T.border}; border-radius:16px; box-shadow:${T.shadow}; }
  `;

  const medals = ["🥇","🥈","🥉"], mColors = [T.olive, T.navyLt, "#8B5E3C"];

  // ────────────────── SETUP ──────────────────────────────────────
  // In multiplayer mode the lobby handles names/joining, so skip setup.
  if(screen==="setup" && !isMP) return (
    <div style={{minHeight:"100vh",background:T.cream,color:T.navy,padding:"36px 18px 80px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <style>{css}</style>
      <button className="btn" style={{position:"fixed",top:14,right:14,background:T.creamDk,color:T.navy,border:"1.5px solid "+T.navy+"22",padding:"8px",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDark(d=>!d)}>
        <Icon id={dark?"sun":"moon"} size={18} color={T.navy}/>
      </button>

      <div style={{display:"flex",gap:10,marginBottom:18}}>
        {[["ball","#1A1A1A"],["trophy","#2D5BFF"],["globe","#1A1A1A"]].map(([ic,bg],i)=>(
          <div key={i} style={{width:64,height:64,borderRadius:16,background:bg,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 12px "+bg+"44"}}>
            <Icon id={ic} size={30} color="#FAFAF8"/>
          </div>
        ))}
      </div>

      <h1 style={{fontSize:28,fontWeight:800,textAlign:"center",marginBottom:4}}>FIFA World Cup 2026</h1>
      <p style={{fontSize:13,color:T.textSub,marginBottom:26}}>Snake Draft · 8 teams · 6 picks each · 48 nations</p>

      <div className="card" style={{width:"100%",maxWidth:440,padding:"18px 20px",marginBottom:20}}>
        <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
          <Icon id="users" size={14} color={T.textSub}/> Participants
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {names.map((n,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
              <Avatar idx={i} size={28}/>
              <input value={n} onChange={e=>{const u=names.slice();u[i]=e.target.value||"Player "+(i+1);setNames(u);}} placeholder={"Player "+(i+1)}/>
            </div>
          ))}
        </div>
      </div>

      <button className="btn" style={{background:T.navy,color:T.cream,fontSize:15,padding:"13px 50px",marginBottom:12,display:"flex",alignItems:"center",gap:8}} onClick={()=>setScreen("draft")}>
        <Icon id="ball" size={18} color={T.cream}/> Start Draft
      </button>

      {/* Mock Draft button */}
      <button className="btn" style={{background:"transparent",color:T.olive,fontSize:13,padding:"10px 28px",marginBottom:28,border:"1.5px solid "+T.olive+"66",display:"flex",alignItems:"center",gap:7}} onClick={loadMockDraft}>
        <Icon id="wand" size={15} color={T.olive}/> Load Mock 2026 Tournament
      </button>

      <div className="card" style={{width:"100%",maxWidth:440,padding:"14px 16px"}}>
        <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          <Icon id="bars" size={14} color={T.textSub}/> Scoring System
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px 16px",fontSize:12,color:T.navyLt}}>
          {[["W=3 D=1","Group"],["5","R32"],["6","R16"],["7","QF"],["8","SF"],["10","Final"]].map(([p,l])=>(
            <span key={l}><strong style={{color:T.navy}}>{p}</strong> {l}</span>
          ))}
        </div>
      </div>
    </div>
  );

  // ────────────────── DRAFT ──────────────────────────────────────
  if(screen==="draft") return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.cream,color:T.navy}}>
      <style>{css}</style>
      {showLottery && <LotteryModal T={T} playerNames={effNames} onConfirm={confirmLottery} onClose={()=>setShowLottery(false)}/>}

      {/* Top bar */}
      <div style={{background:T.creamDk,borderBottom:"1.5px solid "+T.navy+"18",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:T.navy,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon id="ball" size={18} color={T.cream}/>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800}}>
              FIFA WC 2026{isMP && <span style={{color:T.olive}}> · Room {mp.room.code}</span>}
            </div>
            <div style={{fontSize:9.5,color:T.textSub}}>
              {espnData.source==="espn"?"ESPN Live":"Static mode"}
              {(isMP?mp.draftOrder:lotteryDone)?" · Lottery set":""}
              {isMP && <span> · You: {effNames[mp.mySeat]}</span>}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          {/* Lottery button: only in local/single-device mode (MP runs it automatically on start) */}
          {!isMP && !isDone && !lotteryDone && (
            <button className="btn" style={{background:T.olive,color:"#FAFAF8",padding:"7px 12px",fontSize:11.5,display:"flex",alignItems:"center",gap:5}} onClick={()=>setShowLottery(true)}>
              <Icon id="dice" size={15} color="#FAFAF8"/> Lottery
            </button>
          )}
          {isMP && (
            <button className="btn" style={{background:"transparent",border:"1.5px solid "+T.navy+"33",color:T.navy,padding:"7px 11px",fontSize:11.5}} onClick={()=>mp.onLeave && mp.onLeave()}>Leave</button>
          )}
          <button className="btn" style={{background:"transparent",border:"1.5px solid "+T.navy+"33",color:T.navy,padding:"7px 9px",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDark(d=>!d)}>
            <Icon id={dark?"sun":"moon"} size={17} color={T.navy}/>
          </button>
        </div>
      </div>

      {/* Pick banner */}
      {!isDone ? (()=>{
        // Compute current player's full pick schedule
        const allPicksForSeat = snakeOrder
          .map((seat,idx) => ({seat, pickNum:idx+1}))
          .filter(({seat}) => seat === curSeat);
        const remaining = allPicksForSeat.filter(p => p.pickNum > effPickIdx+1);
        const nextPickNum = remaining[0]?.pickNum ?? null;

        // Queue: next 5 picks globally (showing who picks)
        const queue = [];
        for(let i=1; i<=5; i++){
          const ni = effPickIdx+i;
          if(ni < totalPicks) queue.push({pickNum:ni+1, seat:snakeOrder[ni]});
        }

        return (
          <div style={{background: (isMP && myTurn) ? T.olive+"12" : T.creamLt, borderBottom: (isMP && myTurn) ? "2.5px solid "+T.olive : "1.5px solid "+T.navy+"14", flexShrink:0, transition:"background 0.3s, border-color 0.3s", animation: (isMP && myTurn) ? "yourTurnGlow 1.8s ease-in-out infinite" : "none"}}>
            {/* YOUR TURN badge — only in MP when it's this user's turn */}
            {isMP && myTurn && (
              <div style={{padding:"8px 14px 0",display:"flex",alignItems:"center",gap:8}}>
                <div style={{background:T.olive, color:"#FAFAF8", borderRadius:8, padding:"5px 14px", fontSize:11, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", animation:"yourTurnBadge 1.5s ease-in-out infinite", boxShadow:"0 2px 12px rgba(45,91,255,0.35)"}}>
                  Your turn to pick!
                </div>
              </div>
            )}
            {/* Main banner row */}
            <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{position:"relative"}}>
                <Avatar idx={curSeat} size={40}/>
                {isMP && myTurn && <div style={{position:"absolute",inset:-3,borderRadius:14,border:"2.5px solid "+T.olive,animation:"yourTurnPulse 2s ease-in-out infinite"}}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:800,color:T.navy}}>
                  {effNames[curSeat]}
                  <span style={{color:PLAYER_COLORS[curSeat%8],fontWeight:600}}>{isMP && myTurn ? "" : " is on the clock"}</span>
                </div>
                <div style={{fontSize:10,color:T.textSub,marginTop:2,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span>Round {round} of {picksPerPlayer}</span>
                  <span style={{opacity:0.3}}>·</span>
                  <span>Pick <strong style={{color:T.navy}}>{effPickIdx+1}</strong> of {totalPicks}</span>
                  <span style={{opacity:0.3}}>·</span>
                  <span>{isRev ? "← Reversing" : "→ Forward"}</span>
                  {nextPickNum && <>
                    <span style={{opacity:0.3}}>·</span>
                    <span>Next pick: <strong style={{color:PLAYER_COLORS[curSeat%8]}}>#{nextPickNum}</strong></span>
                  </>}
                </div>
              </div>
              {/* Remaining picks for this player */}
              <div style={{flexShrink:0,textAlign:"right"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.textSub,marginBottom:3}}>Their picks</div>
                <div style={{display:"flex",gap:3,justifyContent:"flex-end",flexWrap:"wrap",maxWidth:140}}>
                  {allPicksForSeat.map(({pickNum})=>{
                    const done = pickNum <= effPickIdx;
                    const isCurrent = pickNum === effPickIdx+1;
                    return (
                      <div key={pickNum} style={{
                        width:22,height:22,borderRadius:5,
                        background: done ? PLAYER_COLORS[curSeat%8]+"44"
                          : isCurrent ? PLAYER_COLORS[curSeat%8]
                          : T.navy+"14",
                        border: isCurrent ? "2px solid "+PLAYER_COLORS[curSeat%8] : "1.5px solid "+T.navy+"20",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:8.5,fontWeight:isCurrent?900:600,
                        color: done ? T.textSub : isCurrent ? "#fff" : T.navyLt,
                        position:"relative",
                      }}>
                        {pickNum}
                        {done && <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:PLAYER_COLORS[curSeat%8]}}>✓</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Up-next queue strip */}
            {queue.length > 0 && (
              <div style={{padding:"0 14px 9px",display:"flex",alignItems:"center",gap:6,overflowX:"auto"}}>
                <span style={{fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:T.textSub,flexShrink:0}}>Up next:</span>
                {queue.map(({pickNum,seat})=>(
                  <div key={pickNum} style={{display:"flex",alignItems:"center",gap:4,background:T.cream,border:"1.5px solid "+T.navy+"14",borderRadius:7,padding:"3px 7px",flexShrink:0}}>
                    <div style={{width:15,height:15,borderRadius:4,background:PLAYER_COLORS[seat%8],display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#fff"}}>{seat+1}</div>
                    <span style={{fontSize:9.5,fontWeight:600,color:T.navy}}>{effNames[seat]}</span>
                    <span style={{fontSize:9,color:T.textSub}}>#{pickNum}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })() : (
        <div style={{padding:"12px",textAlign:"center",background:T.creamLt,borderBottom:"1.5px solid "+T.navy+"14",fontWeight:700,fontSize:14}}>
          Draft Complete! Loading Leaderboard…
        </div>
      )}

      {/* Sidebar + Grid */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* Sidebar roster */}
        <div style={{width:192,flexShrink:0,background:T.cream,borderRight:"1.5px solid "+T.navy+"14",overflowY:"auto",padding:"8px 7px"}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,padding:"2px 6px 8px",display:"flex",alignItems:"center",gap:4}}>
            <Icon id="shield" size={11} color={T.textSub}/> Rosters
          </div>
          {effNames.map((name,i)=>{
            const roster = playerPicks(i);
            const isCur = !isDone && curSeat===i;
            const isMe  = isMP && i === mp.mySeat;
            // Find this player's next upcoming pick number
            const nextPick = snakeOrder
              .map((seat,idx)=>({seat,pickNum:idx+1}))
              .find(({seat,pickNum})=>seat===i && pickNum>effPickIdx);
            const picksLeft = picksPerPlayer - roster.length;
            const onlineDot = isMP && mp.online && mp.online.has(i);
            return (
              <div key={i} style={{marginBottom:6,borderRadius:10,background:isCur?T.creamDk:T.creamLt,border:"1.5px solid "+(isCur?PLAYER_COLORS[i%8]+"77":isMe?T.olive+"66":T.navy+"14"),padding:"7px 8px",transition:"all 0.2s"}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                  <Avatar idx={i} size={18}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,fontWeight:isCur?700:500,color:isCur?PLAYER_COLORS[i%8]:T.navyLt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {name}{isMe && <span style={{color:T.olive,fontWeight:700}}> (you)</span>}
                    </div>
                    {!isDone && (
                      <div style={{fontSize:8,color:T.textSub,marginTop:1}}>
                        {isCur
                          ? <span style={{color:PLAYER_COLORS[i%8],fontWeight:700}}>Picking now</span>
                          : nextPick
                            ? <span>Next: <strong style={{color:T.navy}}>pick #{nextPick.pickNum}</strong></span>
                            : <span style={{color:T.textSub}}>Done</span>
                        }
                        {picksLeft>0 && <span style={{color:T.textSub}}> · {picksLeft} left</span>}
                      </div>
                    )}
                  </div>
                  {isMP && <div title={onlineDot?"online":"offline"} style={{width:6,height:6,borderRadius:"50%",background:onlineDot?"#4CAF50":T.navy+"33",flexShrink:0}}/>}
                  {isCur && <div style={{width:6,height:6,borderRadius:"50%",background:T.olive,flexShrink:0,boxShadow:"0 0 0 3px "+T.olive+"33"}}/>}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                  {roster.map((t,j)=><MiniCard key={j} team={t} size={20}/>)}
                  {Array.from({length:picksPerPlayer-roster.length}).map((_,j)=>(
                    <div key={j} style={{width:20,height:20,borderRadius:5,border:"1.5px dashed "+T.navy+"22",background:T.cream}}/>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main */}
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>

          {/* Search + filter */}
          <div style={{padding:"9px 11px",flexShrink:0,borderBottom:"1.5px solid "+T.navy+"14",background:T.creamLt}}>
            <div style={{display:"flex",gap:7,marginBottom:7}}>
              <input placeholder="Search teams..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}}/>
              {/* Sort toggles */}
              <button className={"chip"+(sortMode==="rank"?" on":"")} onClick={()=>setSortMode(s=>s==="rank"?"group":"rank")} style={sortMode==="rank"?{background:T.navy,color:T.cream}:{}}>FIFA #</button>
              <button className={"chip"+(sortMode==="ovr"?" on":"")} onClick={()=>setSortMode(s=>s==="ovr"?"group":"ovr")} style={sortMode==="ovr"?{background:T.olive,color:"#FAFAF8"}:{}}>OVR</button>
            </div>
            <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:2}}>
              {["All","UEFA","CONMEBOL","CAF","CONCACAF","AFC","OFC"].map(g=>(
                <button key={g} className={"chip"+(confF===g?" on":"")} onClick={()=>setConfF(g)}>{g}</button>
              ))}
            </div>
          </div>

          {/* Team grid — available teams on top, picked teams at bottom */}
          <div style={{flex:1,overflowY:"auto",padding:"12px 11px",background:T.cream,position:"relative"}}>
            {isMP && !myTurn && !isDone && (
              <div style={{position:"sticky",top:0,zIndex:5,background:T.navy,color:T.cream,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
                <Icon id="clock" size={15} color={T.cream}/>
                Waiting for {effNames[curSeat]} to pick… You'll be notified on your turn.
              </div>
            )}
            {/* Available teams — full interactive cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:11,opacity:(isMP && !myTurn && !isDone)?0.55:1,pointerEvents:(isMP && !myTurn && !isDone)?"none":"auto"}}>
              {avail.filter(t=>!pickedNames.has(t.name)).map(team=>(
                <TeamCard key={team.name} team={team} picked={false} onClick={()=>pickTeam(team)} size={90}/>
              ))}
            </div>
            {avail.filter(t=>!pickedNames.has(t.name)).length===0 && avail.filter(t=>pickedNames.has(t.name)).length===0 && (
              <div style={{textAlign:"center",padding:40,color:T.textSub}}>No teams match</div>
            )}

            {/* Picked teams section — shown at bottom as compact dimmed row */}
            {pickedNames.size > 0 && (
              <div style={{marginTop:20}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{flex:1,height:1,background:T.navy+"18"}}/>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,whiteSpace:"nowrap"}}>
                    Drafted — {pickedNames.size} of {ALL_TEAMS.length}
                  </div>
                  <div style={{flex:1,height:1,background:T.navy+"18"}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:11}}>
                  {avail.filter(t=>pickedNames.has(t.name)).map(team=>{
                    // Find who drafted this team
                    const pick = picks.find(p=>p.team.name===team.name);
                    const ownerIdx = pick ? pick.playerIndex : -1;
                    const ownerColor = ownerIdx>=0 ? PLAYER_COLORS[ownerIdx%8] : "transparent";
                    const ownerName = ownerIdx>=0 ? names[ownerIdx] : "";
                    return (
                      <div key={team.name} style={{display:"flex",flexDirection:"column",position:"relative"}}>
                        <TeamCard team={team} picked={true} onClick={()=>{}} size={90}/>
                        {/* Owner badge */}
                        <div style={{position:"absolute",top:4,right:4,background:ownerColor,borderRadius:5,padding:"1px 5px",fontSize:7.5,fontWeight:800,color:"#fff",lineHeight:1.5,maxWidth:50,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {ownerName}
                        </div>
                      </div>
                    );
                  })}
                  {/* Also show picked teams that don't match current filter */}
                  {Array.from(pickedNames)
                    .filter(name=>!avail.find(t=>t.name===name))
                    .map(name=>{
                      const team = ALL_TEAMS.find(t=>t.name===name);
                      if(!team) return null;
                      const pick = picks.find(p=>p.team.name===name);
                      const ownerIdx = pick ? pick.playerIndex : -1;
                      const ownerColor = ownerIdx>=0 ? PLAYER_COLORS[ownerIdx%8] : "transparent";
                      const ownerName = ownerIdx>=0 ? names[ownerIdx] : "";
                      return (
                        <div key={name} style={{display:"flex",flexDirection:"column",position:"relative"}}>
                          <TeamCard team={team} picked={true} onClick={()=>{}} size={90}/>
                          <div style={{position:"absolute",top:4,right:4,background:ownerColor,borderRadius:5,padding:"1px 5px",fontSize:7.5,fontWeight:800,color:"#fff",lineHeight:1.5,maxWidth:50,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {ownerName}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{background:T.creamDk,borderTop:"1.5px solid "+T.navy+"18",display:"flex",paddingTop:4,paddingBottom:4,flexShrink:0}}>
        <button className="botbtn on" style={{color:T.olive}}>
          <Icon id="ball" size={20} color={T.olive}/><span>Draft</span>
        </button>
        <button className="botbtn" onClick={()=>setScreen("board")}>
          <Icon id="trophy" size={20} color={T.navyLt}/><span>Board</span>
        </button>
        {(!isMP || mp.isHost) && (
          <button className="botbtn" onClick={reset}>
            <Icon id="reset" size={20} color={T.navyLt}/><span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );

  // ────────────────── BOARD ──────────────────────────────────────
  const NAV = [
    {key:"standings", iconId:"bars",    label:"Standings"},
    {key:"live",      iconId:"bolt",    label:"Live"},
    {key:"results",   iconId:"gear",    label:"Results"},
    {key:"bracket",   iconId:"trophy",  label:"Bracket"},
    {key:"history",   iconId:"history", label:"History"},
    {key:"power",     iconId:"star",    label:"Rankings"},
  ];
  const allGames  = espnData.games;

  // Helper: find team object from a display name (ESPN names may differ from ours)
  function findTeamByName(displayName){
    if(!displayName) return null;
    const dn = displayName.toLowerCase().trim();
    return ALL_TEAMS.find(t=>
      t.name.toLowerCase()===dn ||
      dn.includes(t.name.toLowerCase()) ||
      t.name.toLowerCase().includes(dn) ||
      (t.name==="Korea Republic" && dn.includes("korea")) ||
      (t.name==="Turkiye" && (dn.includes("turkey")||dn.includes("türkiye"))) ||
      (t.name==="Cote d'Ivoire" && (dn.includes("ivory")||dn.includes("côte"))) ||
      (t.name==="Czechia" && dn.includes("czech")) ||
      (t.name==="Bosnia" && dn.includes("bosnia")) ||
      (t.name==="DR Congo" && dn.includes("congo")) ||
      (t.name==="United States" && (dn.includes("usa")||dn.includes("united states"))) ||
      (t.name==="Curacao" && (dn.includes("curaçao")||dn.includes("curacao")))
    ) || null;
  }

  const histPicks = histF==="all" ? effPicks : effPicks.filter(p=>p.playerIndex===parseInt(histF));
  const pwSorted  = ALL_TEAMS.slice().sort((a,b)=>b.ovr-a.ovr);
  const pwByPlayer = effNames.map((name,pi)=>{
    const ts = playerPicks(pi);
    return {name,pi,teams:ts,avg:ts.length?Math.round(ts.reduce((s,t)=>s+t.ovr,0)/ts.length):0};
  }).sort((a,b)=>b.avg-a.avg);

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.cream,color:T.navy}}>
      <style>{css}</style>

      {/* Header */}
      <div style={{background:T.creamDk,borderBottom:"1.5px solid "+T.navy+"18",padding:"10px 14px 0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:T.olive,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon id="trophy" size={19} color="#FAFAF8"/>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:800}}>Leaderboard</div>
              <div style={{fontSize:10,color:T.textSub}}>FIFA WC 2026{espnData.source==="espn"?" · ESPN Live":""}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button className="btn" style={{background:T.creamLt,color:T.navy,border:"1.5px solid "+T.navy+"22",padding:"7px 11px",fontSize:12,display:"flex",alignItems:"center",gap:5}} onClick={()=>setScreen("draft")}>
              <Icon id="back" size={14} color={T.navy}/> Draft
            </button>
            <button className="btn" style={{background:"transparent",border:"1.5px solid "+T.navy+"22",color:T.navy,padding:"7px 9px",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDark(d=>!d)}>
              <Icon id={dark?"sun":"moon"} size={17} color={T.navy}/>
            </button>
          </div>
        </div>
        <div style={{display:"flex",overflowX:"auto"}}>
          {NAV.map(n=>(
            <button key={n.key} className={"navtab"+(tab===n.key?" on":"")} onClick={()=>setTab(n.key)} style={{display:"flex",alignItems:"center",gap:5}}>
              <Icon id={n.iconId} size={13} color={tab===n.key?T.olive:T.navyLt}/> {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",background:T.cream}}>

        {/* ─ STANDINGS ─ */}
        {tab==="standings" && (
          <div style={{maxWidth:680,margin:"0 auto",padding:"18px 14px"}}>
            {/* Bar chart — all teams 1st to 8th */}
            {scores.length>=2 && (()=>{
              const maxPts = Math.max(...scores.map(s=>s.total), 1);
              return (
                <div className="card" style={{padding:"16px 12px 12px",marginBottom:14}}>
                  <div style={{fontSize:9.5,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:T.textSub,marginBottom:14,textAlign:"center"}}>Leaderboard</div>
                  <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:6,height:140}}>
                    {scores.map((s,rank)=>{
                      const barH = Math.max(8, Math.round((s.total/maxPts)*120));
                      const col = PLAYER_COLORS[s.pi%8];
                      return (
                        <div key={s.pi} style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1,maxWidth:64,minWidth:0}}>
                          {rank===0 && <div style={{fontSize:16,marginBottom:2}}>🥇</div>}
                          {rank===1 && <div style={{fontSize:16,marginBottom:2}}>🥈</div>}
                          <div style={{fontSize:12,fontWeight:800,color:s.total>0?T.navy:T.textSub,marginBottom:3}}>{s.total}</div>
                          <div style={{width:"100%",height:barH,background:col,borderRadius:"5px 5px 0 0",minHeight:8,transition:"height 0.3s"}}/>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:6}}>
                    {scores.map((s,rank)=>(
                      <div key={s.pi} style={{flex:1,maxWidth:64,minWidth:0,textAlign:"center"}}>
                        <div style={{fontSize:8,fontWeight:700,color:PLAYER_COLORS[s.pi%8],overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                        <div style={{fontSize:7,color:T.textSub,fontWeight:600}}>{rank===0?"1st":rank===1?"2nd":rank===2?"3rd":(rank+1)+"th"}</div>
                        {rank<2 && <div style={{marginTop:2,fontSize:12}}>{rank===0?"🥇":"🥈"}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Scoring System */}
            <div className="card" style={{padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:9.5,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:T.textSub,marginBottom:8}}>Scoring System</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"4px 16px",fontSize:11.5,color:T.navyLt}}>
                {[["W=3 D=1","Group"],["5","R32"],["6","R16"],["7","QF"],["8","SF"],["10","Final"]].map(([p,l])=>(
                  <span key={l}><strong style={{color:T.navy}}>{p}</strong> {l}</span>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="card" style={{overflow:"hidden",marginBottom:14}}>
              {scores.map((s,rank)=>(
                <div key={s.pi}>
                  <div className="row" style={{display:"grid",gridTemplateColumns:"38px 1fr 54px 60px",padding:"11px 14px",borderBottom:"1px solid "+T.navy+"14",cursor:"pointer",transition:"background 0.15s"}} onClick={()=>setExpanded(expanded===s.pi?null:s.pi)}>
                    <div style={{display:"flex",alignItems:"center",fontSize:rank<2?17:12,fontWeight:700,color:rank<2?mColors[rank]:T.textSub}}>{rank<2?medals[rank]:rank+1}</div>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <Avatar idx={s.pi} size={27}/>
                      <div>
                        <div style={{fontSize:12.5,fontWeight:700}}>{s.name}</div>
                        <div style={{display:"flex",gap:3,marginTop:2}}>{s.teams.map((t,j)=><MiniCard key={j} team={t} size={16}/>)}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end",fontSize:22,fontWeight:800,color:rank===0?T.olive:T.navy}}>{s.total}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                      <div style={{width:48,height:5,background:T.navy+"18",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:Math.round(s.total/Math.max(...scores.map(x=>x.total),1)*100)+"%",height:"100%",background:PLAYER_COLORS[s.pi%8]}}/>
                      </div>
                    </div>
                  </div>
                  {expanded===s.pi && (
                    <div style={{background:T.creamDk,borderBottom:"1px solid "+T.navy+"14",padding:"10px 14px"}}>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(176px,1fr))",gap:7}}>
                        {s.breakdown.map((b,j)=>{
                          const res=b.res||{};
                          let sl={l:"Group",c:T.textSub};
                          if(res.final==="W") sl={l:"🏆 Champion",c:T.olive};
                          else if(res.final==="L") sl={l:"🥈 Finalist",c:T.navy};
                          else if(res.r4==="W") sl={l:"SF Win",c:T.olive};
                          else if(res.r8==="W") sl={l:"QF Win",c:T.olive};
                          else if(res.r16==="W") sl={l:"R16 Win",c:T.navyLt};
                          else if(res.r32==="W") sl={l:"R32 Win",c:T.navyLt};
                          const teamKey = s.pi+"-"+b.team.name;
                          const isOpen = expanded===s.pi && selectedTeam===teamKey;
                          // Find all games for this team from ESPN
                          const teamGames = allGames.filter(g=>{
                            const nH = findTeamByName(g.home);
                            const nA = findTeamByName(g.away);
                            return (nH && nH.name===b.team.name) || (nA && nA.name===b.team.name);
                          }).filter(g=>g.completed || g.status==="in");
                          return (
                            <div key={j}>
                              <div style={{display:"flex",alignItems:"center",gap:8,background:T.card,border:"1.5px solid "+(isOpen?T.olive:b.pts>0?T.olive+"55":T.cardBorder),borderRadius:9,padding:"7px 9px",cursor:"pointer",transition:"border-color 0.15s"}}
                                   onClick={()=>setSelectedTeam(isOpen?null:teamKey)}>
                                <MiniCard team={b.team} size={30}/>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.team.name}</div>
                                  <div style={{fontSize:8.5,color:sl.c,fontWeight:600}}>{sl.l}</div>
                                  <div style={{fontSize:8,color:T.textSub}}>OVR {b.team.ovr} · #{b.team.fifaRank}</div>
                                </div>
                                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                  <div style={{fontSize:16,fontWeight:800,color:b.pts>0?T.olive:T.textSub}}>{b.pts}</div>
                                  <div style={{fontSize:7,color:T.textSub}}>{teamGames.length>0?teamGames.length+" game"+(teamGames.length!==1?"s":""):""}</div>
                                </div>
                              </div>
                              {/* Expanded game history for this team */}
                              {isOpen && teamGames.length>0 && (
                                <div style={{margin:"4px 0 6px",padding:"0 4px"}}>
                                  {teamGames.map((g,gi)=>{
                                    const isHome = (findTeamByName(g.home)||{}).name===b.team.name;
                                    const opp = isHome ? g.away : g.home;
                                    const oppTeam = findTeamByName(opp);
                                    const myScore = isHome ? g.hScore : g.aScore;
                                    const oppScore = isHome ? g.aScore : g.hScore;
                                    const won = myScore>oppScore;
                                    const draw = myScore===oppScore;
                                    const resultLabel = won?"W":draw?"D":"L";
                                    const resultColor = won?T.olive:draw?"#F59E0B":T.danger;
                                    return (
                                      <div key={gi} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 6px",borderBottom:gi<teamGames.length-1?"1px solid "+T.navy+"0a":"",fontSize:11}}>
                                        <span style={{fontWeight:800,color:resultColor,width:14,flexShrink:0}}>{resultLabel}</span>
                                        {oppTeam && <MiniCard team={oppTeam} size={18}/>}
                                        <span style={{flex:1,color:T.navyLt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.status==="in"?"vs ":"vs "}{opp}</span>
                                        <span style={{fontWeight:700,color:T.navy}}>{myScore}–{oppScore}</span>
                                        {g.status==="in" && <span style={{fontSize:8,color:T.danger,fontWeight:700}}>LIVE</span>}
                                        <span style={{fontSize:8,color:T.textSub}}>{g.roundLabel}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {isOpen && teamGames.length===0 && (
                                <div style={{padding:"6px 8px",fontSize:10,color:T.textSub,fontStyle:"italic"}}>No games played yet</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─ LIVE ─ */}
        {/* ─ LIVE ─ */}
        {tab==="live" && (()=>{
          // Group games by day
          const dayGroups = {};
          for(const g of allGames){
            const d = g.gameDate ? new Date(g.gameDate).toLocaleDateString("en-US",{timeZone:"America/New_York",weekday:"long",month:"long",day:"numeric",year:"numeric"}) : "Date TBD";
            if(!dayGroups[d]) dayGroups[d] = [];
            dayGroups[d].push(g);
          }
          // Sort games within each day by time
          for(const d in dayGroups){
            dayGroups[d].sort((a,b)=>new Date(a.gameDate||0)-new Date(b.gameDate||0));
          }
          // Sort days chronologically
          const sortedDays = Object.keys(dayGroups).sort((a,b)=>{
            if(a==="Date TBD") return 1; if(b==="Date TBD") return -1;
            return new Date(dayGroups[a][0].gameDate||0)-new Date(dayGroups[b][0].gameDate||0);
          });

          async function fetchGameDetails(eventId){
            if(!eventId || gameDetails[eventId]) return;
            try{
              const r = await fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event="+eventId);
              const j = await r.json();
              const events = [];
              // Parse key events (goals, cards)
              for(const ke of (j.keyEvents||j.commentary||[])){
                const type = (ke.type&&ke.type.text)||ke.text||"";
                const clock = ke.clock&&ke.clock.displayValue||ke.time&&ke.time.displayValue||"";
                const team = ke.team&&ke.team.displayName||"";
                const players = (ke.participants||[]).map(p=>p.athlete&&p.athlete.displayName||"").filter(Boolean);
                const tl = type.toLowerCase();
                let icon = "";
                if(tl.includes("goal")||tl.includes("score")) icon = "⚽";
                else if(tl.includes("yellow")) icon = "🟨";
                else if(tl.includes("red")||tl.includes("second yellow")) icon = "🟥";
                else if(tl.includes("substitution")||tl.includes("sub")) icon = "🔄";
                else if(tl.includes("penalty")||tl.includes("pen")) icon = "⚽";
                if(icon) events.push({icon, clock, team, players, type});
              }
              // Fallback: parse from boxscore/roster details if keyEvents empty
              if(events.length===0 && j.boxscore){
                for(const team of (j.boxscore.teams||[])){
                  const teamName = team.team&&team.team.displayName||"";
                  for(const stat of (team.statistics||[])){
                    if(stat.name==="goals"||stat.label==="Goals"){
                      for(const a of (stat.athletes||[])){
                        events.push({icon:"⚽",clock:"",team:teamName,players:[a.athlete&&a.athlete.displayName||""],type:"Goal"});
                      }
                    }
                  }
                }
              }
              setGameDetails(prev=>({...prev,[eventId]:events.length>0?events:[{icon:"ℹ️",clock:"",team:"",players:[],type:"No detailed events available yet"}]}));
            }catch(e){
              setGameDetails(prev=>({...prev,[eventId]:[{icon:"⚠️",clock:"",team:"",players:[],type:"Could not load match details"}]}));
            }
          }

          function GameCard({g}){
            const homeTeam = findTeamByName(g.home);
            const awayTeam = findTeamByName(g.away);
            const hO = homeTeam ? ownerOf(homeTeam.name) : null;
            const aO = awayTeam ? ownerOf(awayTeam.name) : null;
            const isLive = g.status==="in";
            const fin = g.completed;
            const hW = g.hScore > g.aScore;
            const aW = g.aScore > g.hScore;
            const etTime = g.gameDate ? new Date(g.gameDate).toLocaleTimeString("en-US",{timeZone:"America/New_York",hour:"numeric",minute:"2-digit",timeZoneName:"short"}) : "";
            const isOpen = selectedGameId===g.eventId && g.eventId;
            const details = g.eventId ? gameDetails[g.eventId] : null;

            function handleTap(){
              if(!g.eventId || g.status==="pre") return;
              if(isOpen){ setSelectedGameId(null); return; }
              setSelectedGameId(g.eventId);
              fetchGameDetails(g.eventId);
            }

            return (
              <div className="card" style={{padding:"12px 14px",marginBottom:8,borderColor:isLive?T.danger+"55":"",cursor:(g.eventId&&g.status!=="pre")?"pointer":"default"}} onClick={handleTap}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:10,color:isLive?T.danger:T.textSub,fontWeight:isLive?700:500}}>
                    {isLive ? "● LIVE · "+g.clock : fin ? "Final" : etTime || "TBD"}
                  </span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {(fin||isLive)&&g.eventId&&<span style={{fontSize:8,color:T.textSub}}>{isOpen?"▲":"▼"}</span>}
                    {g.roundLabel && <span style={{fontSize:9,color:T.olive,fontWeight:600}}>{g.roundLabel}</span>}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8}}>
                    <div style={{textAlign:"right",minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:(fin&&hW)?700:500,color:(fin&&hW)?T.navy:fin?T.textSub:T.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.home||"TBD"}</div>
                      {hO && <div style={{fontSize:8.5,fontWeight:600,color:PLAYER_COLORS[hO.idx%8],textAlign:"right"}}>{hO.name}</div>}
                    </div>
                    {homeTeam ? <MiniCard team={homeTeam} size={28}/> : <div style={{width:28,height:28,borderRadius:8,background:T.creamDk,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:T.textSub,flexShrink:0}}>?</div>}
                  </div>
                  <div style={{flexShrink:0,minWidth:56,textAlign:"center"}}>
                    {(isLive||fin) ? (
                      <div style={{background:isLive?T.danger:T.navy,color:isLive?"#fff":T.cream,borderRadius:8,padding:"4px 10px",fontSize:16,fontWeight:700,display:"inline-block"}}>{g.hScore} – {g.aScore}</div>
                    ) : (
                      <div style={{fontSize:11,color:T.textSub,fontWeight:500}}>vs</div>
                    )}
                  </div>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
                    {awayTeam ? <MiniCard team={awayTeam} size={28}/> : <div style={{width:28,height:28,borderRadius:8,background:T.creamDk,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:T.textSub,flexShrink:0}}>?</div>}
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:(fin&&aW)?700:500,color:(fin&&aW)?T.navy:fin?T.textSub:T.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.away||"TBD"}</div>
                      {aO && <div style={{fontSize:8.5,fontWeight:600,color:PLAYER_COLORS[aO.idx%8]}}>{aO.name}</div>}
                    </div>
                  </div>
                </div>
                {g.location && <div style={{textAlign:"center",marginTop:8,fontSize:8.5,color:T.textSub}}>📍 {g.location}</div>}

                {/* Expanded match events */}
                {isOpen && (
                  <div style={{marginTop:10,borderTop:"1px solid "+T.navy+"10",paddingTop:8}} onClick={e=>e.stopPropagation()}>
                    {!details && <div style={{textAlign:"center",fontSize:11,color:T.textSub,padding:8}}>Loading match events…</div>}
                    {details && details.map((ev,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"4px 0",borderBottom:i<details.length-1?"1px solid "+T.navy+"08":""}}>
                        <span style={{fontSize:14,flexShrink:0,width:20,textAlign:"center"}}>{ev.icon}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:11,fontWeight:600,color:T.navy}}>{ev.players.length>0?ev.players.join(", "):ev.type}</div>
                          {ev.team && <div style={{fontSize:9,color:T.textSub}}>{ev.team}</div>}
                        </div>
                        {ev.clock && <span style={{fontSize:10,color:T.textSub,fontWeight:600,flexShrink:0}}>{ev.clock}'</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Find today's date string to scroll to
          const todayStr = new Date().toLocaleDateString("en-US",{timeZone:"America/New_York",weekday:"long",month:"long",day:"numeric",year:"numeric"});
          const todayRef = (el) => {
            if(el) setTimeout(()=>el.scrollIntoView({behavior:"smooth",block:"start"}), 100);
          };

          return (
            <div style={{maxWidth:720,margin:"0 auto",padding:"18px 14px"}}>
              {allGames.length===0 && !espnData.loading && (
                <div className="card" style={{padding:"20px 16px",textAlign:"center"}}>
                  <div style={{fontSize:13,color:T.textSub,lineHeight:1.6}}>Match data will appear here once the FIFA World Cup 2026 begins. Auto-refreshes every 60s.</div>
                </div>
              )}
              {espnData.loading && <div style={{textAlign:"center",padding:40,color:T.textSub}}>Loading matches…</div>}
              {sortedDays.map(day=>{
                const gms = dayGroups[day];
                const hasLive = gms.some(g=>g.status==="in");
                const allDone = gms.every(g=>g.completed);
                const isToday = day === todayStr;
                return (
                  <div key={day} ref={isToday ? todayRef : null} style={{marginBottom:24}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      {hasLive && <div style={{width:8,height:8,borderRadius:"50%",background:T.danger,flexShrink:0}}/>}
                      <div style={{fontSize:12,fontWeight:700,color:hasLive?T.danger:isToday?T.olive:T.navy}}>
                        {day}{isToday ? " — Today" : ""}
                      </div>
                      <div style={{flex:1,height:1,background:T.navy+"12"}}/>
                      <span style={{fontSize:10,color:allDone?T.olive:T.textSub,fontWeight:allDone?600:400}}>{gms.length} match{gms.length!==1?"es":""}{allDone?" ✓":""}</span>
                    </div>
                    {gms.map((g,i)=><GameCard key={i} g={g}/>)}
                  </div>
                );
              })}
            </div>
          );
        })()}
        {/* ─ RESULTS ─ */}
        {tab==="results" && (()=>{
          const STAGE_COLS = [
            {key:"group", label:"Group Stage", sub:"W=3  D=1",  winPts:3, drawPts:1},
            {key:"r32",   label:"R32", sub:"Win = 5",   winPts:5, drawPts:0},
            {key:"r16",   label:"R16", sub:"Win = 6",   winPts:6, drawPts:0},
            {key:"r8",    label:"QF",  sub:"Win = 7",   winPts:7, drawPts:0},
            {key:"r4",    label:"SF",  sub:"Win = 8",   winPts:8, drawPts:0},
            {key:"final", label:"Final",sub:"Win = 10", winPts:10,drawPts:0},
          ];
          function stagePts(res, key){
            if(key==="group"){
              let p=0;
              for(let g=1;g<=3;g++){ if(res["g"+g]==="W") p+=3; else if(res["g"+g]==="D") p+=1; }
              return p;
            }
            const col = STAGE_COLS.find(s=>s.key===key);
            return res[key]==="W" ? col.winPts : 0;
          }
          function totalPts(res){ return STAGE_COLS.reduce((s,c)=>s+stagePts(res,c.key), 0); }
          function OutcomeBadge({val}){
            if(!val || val==="—") return <span style={{fontSize:11,color:T.textSub,opacity:0.35}}>—</span>;
            const cfg = {
              W:{label:"W",bg:T.olive+"18",border:T.olive+"44",color:T.olive},
              L:{label:"L",bg:T.danger+"14",border:T.danger+"33",color:T.danger},
              D:{label:"D",bg:"#F59E0B18",border:"#F59E0B44",color:"#F59E0B"},
            }[val] || {label:val,bg:"transparent",border:T.navy+"22",color:T.textSub};
            return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:24,height:20,borderRadius:5,background:cfg.bg,border:"1px solid "+cfg.border,fontSize:10,fontWeight:700,color:cfg.color}}>{cfg.label}</span>;
          }
          function PtsCell({pts,highlight}){
            if(pts===0) return <span style={{fontSize:11,color:T.textSub,opacity:0.25}}>—</span>;
            return <span style={{fontSize:12,fontWeight:700,color:highlight?T.olive:T.navy}}>{pts}</span>;
          }

          // Group teams by WC Group
          const groups = {};
          for(const team of ALL_TEAMS){
            const g = team.wcGroup;
            if(!groups[g]) groups[g] = [];
            groups[g].push(team);
          }
          // Sort groups alphabetically, teams by OVR within each group
          const sortedGroupKeys = Object.keys(groups).sort();
          for(const g of sortedGroupKeys) groups[g].sort((a,b)=>b.ovr-a.ovr);

          return (
            <div style={{maxWidth:720,margin:"0 auto",padding:"16px 14px 40px"}}>
              <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
                <div style={{minWidth:520}}>
                  {sortedGroupKeys.map(groupKey=>(
                    <div key={groupKey} style={{marginBottom:20}}>
                      {/* Group header */}
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,padding:"0 12px"}}>
                        <div style={{background:T.navy,color:T.cream,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700}}>Group {groupKey}</div>
                        <div style={{flex:1,height:1,background:T.navy+"12"}}/>
                      </div>
                      {/* Column headers — repeated per group */}
                      <div style={{display:"grid",gridTemplateColumns:"minmax(130px,1fr) 24px 24px 24px 42px 30px 24px 24px 24px 24px 24px 36px",gap:3,alignItems:"center",padding:"4px 12px 6px"}}>
                        <div style={{fontSize:8,fontWeight:700,color:T.textSub,letterSpacing:1,textTransform:"uppercase"}}>Team</div>
                        {["M1","M2","M3"].map(l=><div key={l} style={{fontSize:7,fontWeight:700,color:T.textSub,textAlign:"center"}}>{l}</div>)}
                        <div style={{fontSize:7,fontWeight:700,color:T.textSub,textAlign:"center"}}>W-D-L</div>
                        <div style={{fontSize:7,fontWeight:700,color:T.textSub,textAlign:"center"}}>GRP</div>
                        {["R32","R16","QF","SF","F"].map(l=><div key={l} style={{fontSize:7,fontWeight:700,color:T.textSub,textAlign:"center"}}>{l}</div>)}
                        <div style={{fontSize:7,fontWeight:700,color:T.textSub,textAlign:"center"}}>TOT</div>
                      </div>
                      {/* Teams in this group */}
                      {groups[groupKey].map((team,ri)=>{
                        const res = teamResults[team.name]||{};
                        const o = ownerOf(team.name);
                        const tot = totalPts(res);
                        const gW = [1,2,3].filter(g=>res["g"+g]==="W").length;
                        const gD = [1,2,3].filter(g=>res["g"+g]==="D").length;
                        const gL = [1,2,3].filter(g=>res["g"+g]==="L").length;
                        const gPts = gW*3+gD;
                        const drafterColor = o ? PLAYER_COLORS[o.idx%8] : "transparent";
                        return (
                          <div key={team.name} className="card" style={{display:"grid",gridTemplateColumns:"minmax(130px,1fr) 24px 24px 24px 42px 30px 24px 24px 24px 24px 24px 36px",gap:3,alignItems:"center",padding:"8px 12px",marginBottom:4,borderLeft:"3px solid "+drafterColor}}>
                            {/* Team */}
                            <div style={{display:"flex",alignItems:"center",gap:7,minWidth:0}}>
                              <MiniCard team={team} size={28}/>
                              <div style={{minWidth:0,overflow:"hidden"}}>
                                <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{team.name}</div>
                                <div style={{fontSize:8,color:o?drafterColor:T.textSub,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o?o.name:"Undrafted"}</div>
                              </div>
                            </div>
                            {/* M1 M2 M3 */}
                            {[1,2,3].map(g=><div key={g} style={{textAlign:"center"}}><OutcomeBadge val={res["g"+g]}/></div>)}
                            {/* W-D-L */}
                            <div style={{fontSize:9,fontWeight:600,color:T.navy,textAlign:"center"}}>
                              {gW>0||gD>0||gL>0 ? `${gW}-${gD}-${gL}` : <span style={{color:T.textSub,opacity:0.4}}>—</span>}
                            </div>
                            {/* Group pts */}
                            <div style={{textAlign:"center"}}><PtsCell pts={gPts} highlight={gPts>0}/></div>
                            {/* Knockout R32 R16 QF SF F */}
                            {["r32","r16","r8","r4","final"].map(k=><div key={k} style={{textAlign:"center"}}><OutcomeBadge val={res[k]}/></div>)}
                            {/* Total */}
                            <div style={{textAlign:"center"}}>
                              <span style={{fontSize:13,fontWeight:700,color:tot>0?T.olive:T.textSub}}>{tot>0?tot:"—"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ─ BRACKET ─ */}
        {/* ─ BRACKET ─ */}
        {tab==="bracket" && (()=>{
          function getGamesForRound(rk){
            return allGames.filter(g=>g.roundLabel===rk).sort((a,b)=>new Date(a.gameDate||0)-new Date(b.gameDate||0));
          }
          const r32=getGamesForRound("Round of 32"), r16=getGamesForRound("Round of 16");
          const qf=getGamesForRound("Quarter-Finals"), sf=getGamesForRound("Semi-Finals");
          const fin=getGamesForRound("Final"), third=getGamesForRound("3rd Place");
          const L={r32:r32.slice(0,8),r16:r16.slice(0,4),qf:qf.slice(0,2),sf:sf.slice(0,1)};
          const R={r32:r32.slice(8,16),r16:r16.slice(4,8),qf:qf.slice(2,4),sf:sf.slice(1,2)};

          const MH=62; // match card height

          function MC({game}){
            if(!game) return (
              <div style={{height:MH,background:T.card,border:"1px solid "+T.navy+"0a",borderRadius:8,padding:"4px 8px",display:"flex",flexDirection:"column",justifyContent:"center",width:"100%"}}>
                <div style={{fontSize:7,color:T.textSub,marginBottom:1}}>TBD</div>
                <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:T.textSub}}>
                  <div style={{width:16,height:12,borderRadius:2,background:T.creamDk}}/>TBD<span style={{marginLeft:"auto"}}>–</span>
                </div>
                <div style={{height:1,background:T.navy+"08",margin:"3px 0"}}/>
                <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:T.textSub}}>
                  <div style={{width:16,height:12,borderRadius:2,background:T.creamDk}}/>TBD<span style={{marginLeft:"auto"}}>–</span>
                </div>
              </div>
            );
            const ht=findTeamByName(game.home),at=findTeamByName(game.away);
            const hO=ht?ownerOf(ht.name):null,aO=at?ownerOf(at.name):null;
            const live=game.status==="in",done=game.completed;
            const hW=game.hScore>game.aScore,aW=game.aScore>game.hScore;
            const etD=game.gameDate?new Date(game.gameDate).toLocaleDateString("en-US",{timeZone:"America/New_York",month:"short",day:"numeric"}):"";
            const etT=game.gameDate?new Date(game.gameDate).toLocaleTimeString("en-US",{timeZone:"America/New_York",hour:"numeric",minute:"2-digit"}):"";
            return (
              <div style={{height:MH,background:T.card,border:"1px solid "+(live?T.danger+"44":T.navy+"0a"),borderRadius:8,padding:"4px 8px",display:"flex",flexDirection:"column",justifyContent:"center",width:"100%",boxShadow:live?"0 0 6px "+T.danger+"18":"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}>
                  <span style={{fontSize:7,color:live?T.danger:T.textSub,fontWeight:live?700:400}}>{live?"● LIVE "+game.clock:done?"Final":etD+" "+etT}</span>
                  {game.roundLabel&&<span style={{fontSize:6,color:T.olive,fontWeight:700}}>{game.roundLabel==="Round of 32"?"R32":game.roundLabel==="Round of 16"?"R16":game.roundLabel==="Quarter-Finals"?"QF":game.roundLabel==="Semi-Finals"?"SF":game.roundLabel}</span>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  {ht?<MiniCard team={ht} size={14}/>:<div style={{width:16,height:12,borderRadius:2,background:T.creamDk}}/>}
                  <span style={{flex:1,fontSize:9,fontWeight:(done&&hW)?700:400,color:(done&&hW)?T.navy:done?T.textSub:T.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{game.home||"TBD"}</span>
                  {hO&&<span style={{fontSize:6,color:PLAYER_COLORS[hO.idx%8],fontWeight:600,marginRight:2}}>{hO.name}</span>}
                  <span style={{fontSize:12,fontWeight:700,color:(done&&hW)?T.olive:T.navy,width:14,textAlign:"right"}}>{(live||done)?game.hScore:"–"}</span>
                </div>
                <div style={{height:1,background:T.navy+"08",margin:"2px 0"}}/>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  {at?<MiniCard team={at} size={14}/>:<div style={{width:16,height:12,borderRadius:2,background:T.creamDk}}/>}
                  <span style={{flex:1,fontSize:9,fontWeight:(done&&aW)?700:400,color:(done&&aW)?T.navy:done?T.textSub:T.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{game.away||"TBD"}</span>
                  {aO&&<span style={{fontSize:6,color:PLAYER_COLORS[aO.idx%8],fontWeight:600,marginRight:2}}>{aO.name}</span>}
                  <span style={{fontSize:12,fontWeight:700,color:(done&&aW)?T.olive:T.navy,width:14,textAlign:"right"}}>{(live||done)?game.aScore:"–"}</span>
                </div>
                {game.location&&<div style={{fontSize:5.5,color:T.textSub,textAlign:"center",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📍 {game.location}</div>}
              </div>
            );
          }

          // Bracket column: renders N match cards with proper spacing
          function BCol({games,slots,w}){
            const filled=[];for(let i=0;i<slots;i++)filled.push(games[i]||null);
            return (
              <div style={{display:"flex",flexDirection:"column",justifyContent:"space-around",width:w||140,flexShrink:0,gap:0,padding:"0 2px"}}>
                {filled.map((g,i)=><MC key={i} game={g}/>)}
              </div>
            );
          }

          // Connector lines between rounds
          function Conn({pairs,dir}){
            return (
              <div style={{display:"flex",flexDirection:"column",justifyContent:"space-around",width:14,flexShrink:0}}>
                {Array.from({length:pairs}).map((_,i)=>(
                  <div key={i} style={{flex:1,position:"relative"}}>
                    {/* Vertical bar connecting the pair */}
                    <div style={{position:"absolute",top:"25%",bottom:"25%",[dir==="r"?"right":"left"]:0,width:0,borderLeft:"1.5px solid "+T.navy+"18"}}/>
                    {/* Top horizontal tick */}
                    <div style={{position:"absolute",top:"25%",[dir==="r"?"right":"left"]:0,width:7,borderTop:"1.5px solid "+T.navy+"18"}}/>
                    {/* Bottom horizontal tick */}
                    <div style={{position:"absolute",bottom:"25%",[dir==="r"?"right":"left"]:0,width:7,borderTop:"1.5px solid "+T.navy+"18"}}/>
                    {/* Middle output line */}
                    <div style={{position:"absolute",top:"calc(50% - 1px)",[dir==="r"?"left":"right"]:0,width:7,borderTop:"1.5px solid "+T.navy+"18"}}/>
                  </div>
                ))}
              </div>
            );
          }

          const finalGame=fin[0]||null;
          const champ=finalGame&&finalGame.completed?(finalGame.hScore>finalGame.aScore?finalGame.home:finalGame.away):null;
          const champT=champ?findTeamByName(champ):null;
          const champO=champT?ownerOf(champT.name):null;

          return (
            <div style={{padding:"10px 0"}}>
              {/* Header labels */}
              <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",padding:"0 6px"}}>
                <div style={{display:"flex",alignItems:"center",minWidth:1060,marginBottom:6}}>
                  {[{l:"ROUND OF 32",w:140},{l:"",w:14},{l:"ROUND OF 16",w:140},{l:"",w:14},{l:"QUARTERFINALS",w:140},{l:"",w:14},{l:"SEMIFINALS",w:130},{l:"",w:10},{l:"FINAL",w:130},{l:"",w:10},{l:"SEMIFINALS",w:130},{l:"",w:14},{l:"QUARTERFINALS",w:140},{l:"",w:14},{l:"ROUND OF 16",w:140},{l:"",w:14},{l:"ROUND OF 32",w:140}].map((h,i)=>(
                    <div key={i} style={{width:h.w,flexShrink:0,textAlign:"center",fontSize:7,fontWeight:700,letterSpacing:1,color:h.l==="FINAL"?T.olive:T.textSub,padding:"0 2px"}}>{h.l}</div>
                  ))}
                </div>
              </div>
              {/* Bracket body */}
              <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",padding:"0 6px 14px"}}>
                <div style={{display:"flex",alignItems:"stretch",minWidth:1060,minHeight:8*(MH+8)}}>
                  {/* LEFT HALF */}
                  <BCol games={L.r32} slots={8}/>
                  <Conn pairs={4} dir="r"/>
                  <BCol games={L.r16} slots={4}/>
                  <Conn pairs={2} dir="r"/>
                  <BCol games={L.qf} slots={2}/>
                  <Conn pairs={1} dir="r"/>
                  <BCol games={L.sf} slots={1} w={130}/>

                  {/* CENTER — Final + Champion */}
                  <div style={{width:130,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 4px",gap:8}}>
                    <MC game={finalGame}/>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:24}}>🏆</div>
                      {champT?(
                        <>
                          <MiniCard team={champT} size={32}/>
                          <div style={{fontSize:10,fontWeight:800,color:T.navy,marginTop:3}}>{champ}</div>
                          {champO&&<div style={{fontSize:8,fontWeight:700,color:PLAYER_COLORS[champO.idx%8]}}>{champO.name}</div>}
                        </>
                      ):<div style={{fontSize:8,color:T.textSub,marginTop:2}}>TBD</div>}
                    </div>
                  </div>

                  {/* RIGHT HALF */}
                  <BCol games={R.sf} slots={1} w={130}/>
                  <Conn pairs={1} dir="l"/>
                  <BCol games={R.qf} slots={2}/>
                  <Conn pairs={2} dir="l"/>
                  <BCol games={R.r16} slots={4}/>
                  <Conn pairs={4} dir="l"/>
                  <BCol games={R.r32} slots={8}/>
                </div>
              </div>

              {/* 3rd Place */}
              {third.length>0&&(
                <div style={{maxWidth:180,margin:"8px auto 0"}}>
                  <div style={{fontSize:7,fontWeight:700,letterSpacing:1,color:T.textSub,textAlign:"center",marginBottom:4}}>3RD PLACE</div>
                  <MC game={third[0]}/>
                </div>
              )}
            </div>
          );
        })()}


        {tab==="history" && (
          <div style={{maxWidth:620,margin:"0 auto",padding:"18px 14px"}}>
            <div style={{display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:3}}>
              <button className={"chip"+(histF==="all"?" on":"")} style={histF==="all"?{background:T.navy,color:T.cream}:{}} onClick={()=>setHistF("all")}>All Picks</button>
              {effNames.map((name,pi)=>(
                <button key={pi} className={"chip"+(histF===String(pi)?" on":"")}
                  style={histF===String(pi)?{background:PLAYER_COLORS[pi%8],color:"#fff",borderColor:PLAYER_COLORS[pi%8]}:{}}
                  onClick={()=>setHistF(String(pi))}>{name}</button>
              ))}
            </div>
            {histPicks.length===0 && <div style={{textAlign:"center",padding:48,color:T.textSub}}>No picks yet.</div>}
            {histPicks.map((p,i)=>{
              const r = Math.floor((p.pickIndex!=null?p.pickIndex:i)/numPlayers)+1;
              const gi = p.pickIndex!=null?p.pickIndex:i;
              return (
                <div key={i} className="card" style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",marginBottom:7,borderLeft:"4px solid "+PLAYER_COLORS[p.playerIndex%8]}}>
                  <MiniCard team={p.team} size={36}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700}}>{p.team.name}</div>
                    <div style={{fontSize:10,color:T.textSub}}>
                      <span style={{color:PLAYER_COLORS[p.playerIndex%8],fontWeight:600}}>{effNames[p.playerIndex]}</span>
                      {" · Round "}{r}{" · Pick #"}{gi+1}{" · G"}{p.team.wcGroup}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:14,fontWeight:800,color:T.olive}}>OVR {p.team.ovr}</div>
                    <div style={{fontSize:9.5,color:T.textSub}}>FIFA #{p.team.fifaRank}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─ POWER RANKINGS ─ */}
        {tab==="power" && (
          <div style={{maxWidth:720,margin:"0 auto",padding:"18px 14px"}}>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <button className="btn" style={{padding:"7px 14px",fontSize:12,background:pwView==="all"?T.navy:T.creamDk,color:pwView==="all"?T.cream:T.navy,border:"1.5px solid "+T.navy+"22"}} onClick={()=>setPwView("all")}>All 48 Teams</button>
              <button className="btn" style={{padding:"7px 14px",fontSize:12,background:pwView==="player"?T.navy:T.creamDk,color:pwView==="player"?T.cream:T.navy,border:"1.5px solid "+T.navy+"22"}} onClick={()=>setPwView("player")}>By Drafter</button>
            </div>

            {pwView==="all" ? (
              <div className="card" style={{overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"34px 44px 1fr 44px 80px",padding:"7px 12px",borderBottom:"1px solid "+T.navy+"14",fontSize:9,color:T.textSub,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,background:T.creamDk}}>
                  <span>#</span><span></span><span>Nation</span><span style={{textAlign:"center"}}>OVR</span><span>Power Bar</span>
                </div>
                {pwSorted.map((team,i)=>{
                  const o = ownerOf(team.name);
                  const oc = ovrColor(team.ovr);
                  return (
                    <div key={team.name} style={{display:"grid",gridTemplateColumns:"34px 44px 1fr 44px 80px",padding:"8px 12px",borderBottom:"1px solid "+T.navy+"10",alignItems:"center",background:i%2===0?T.card:T.creamLt}}>
                      <span style={{fontSize:11,fontWeight:700,color:T.textSub}}>{i+1}</span>
                      <MiniCard team={team} size={32}/>
                      <div style={{paddingLeft:8}}>
                        <div style={{fontSize:12,fontWeight:700}}>{team.name}</div>
                        <div style={{fontSize:9.5,color:T.textSub}}>FIFA #{team.fifaRank}{o?" · "+o.name:""}</div>
                      </div>
                      <div style={{textAlign:"center",fontWeight:800,fontSize:15,color:oc}}>{team.ovr}</div>
                      <div style={{paddingLeft:4}}>
                        <div style={{height:6,background:T.navy+"18",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:Math.round((team.ovr-54)/42*100)+"%",height:"100%",background:oc,borderRadius:3}}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                {pwByPlayer.map(p=>(
                  <div key={p.pi} className="card" style={{padding:15,marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
                      <Avatar idx={p.pi} size={34}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:700}}>{p.name}</div>
                        <div style={{fontSize:10,color:T.textSub}}>{p.teams.length} teams drafted</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:24,fontWeight:800,color:PLAYER_COLORS[p.pi%8]}}>{p.avg}</div>
                        <div style={{fontSize:9,color:T.textSub,textTransform:"uppercase"}}>Avg OVR</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                      {p.teams.slice().sort((a,b)=>b.ovr-a.ovr).map(t=>(
                        <div key={t.name} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                          <MiniCard team={t} size={32}/>
                          <span style={{fontSize:8.5,fontWeight:700,color:ovrColor(t.ovr)}}>{t.ovr}</span>
                        </div>
                      ))}
                      {p.teams.length===0 && <span style={{fontSize:12,color:T.textSub}}>No picks yet</span>}
                    </div>
                    <div style={{height:5,background:T.navy+"18",borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:Math.round((p.avg-54)/42*100)+"%",height:"100%",background:PLAYER_COLORS[p.pi%8]}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom nav */}
      <div style={{background:T.creamDk,borderTop:"1.5px solid "+T.navy+"18",display:"flex",paddingTop:4,paddingBottom:4,flexShrink:0}}>
        {NAV.map(n=>(
          <button key={n.key} className={"botbtn"+(tab===n.key?" on":"")} onClick={()=>setTab(n.key)} style={tab===n.key?{color:T.olive}:{}}>
            <Icon id={n.iconId} size={20} color={tab===n.key?T.olive:T.navyLt}/>
            <span>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MULTIPLAYER WRAPPER — auth, lobby, realtime sync
// ═══════════════════════════════════════════════════════════════════

// Small shared style block for auth/lobby screens
function mpCss(){
  return `
    * { box-sizing:border-box; margin:0; padding:0; }
    body { background:#FAFAF8; font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; }
    .mp-input { width:100%; background:#fff; border:1px solid rgba(0,0,0,0.1); color:#1A1A1A; border-radius:10px; padding:13px 16px; font-size:15px; outline:none; font-family:inherit; transition:border-color 0.15s,box-shadow 0.15s; }
    .mp-input:focus { border-color:#2D5BFF; box-shadow:0 0 0 3px rgba(45,91,255,0.1); }
    .mp-btn { width:100%; cursor:pointer; border:none; border-radius:10px; padding:14px; font-size:15px; font-weight:600; font-family:inherit; transition:opacity 0.15s; }
    .mp-btn:hover { opacity:0.88; }
    .mp-btn:disabled { opacity:0.4; cursor:not-allowed; }
    .card { background:#fff; border:1px solid rgba(0,0,0,0.06); border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04); }
  `;
}

export default function App(){
  const [session, setSession]   = useState(null);
  const [guestEmail, setGuestEmail] = useState(null);  // for invited friends (no OTP)
  const [authReady, setReady]   = useState(false);
  const [roomId, setRoomId]     = useState(null);

  // Bootstrap auth session
  useEffect(()=>{
    if(!SUPABASE_READY){ setReady(true); return; }
    supabase.auth.getSession().then(({data})=>{ setSession(data.session); setReady(true); });
    const {data:sub} = supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    // Also check localStorage for guest email (invited friends)
    const saved = localStorage.getItem("wc_guest_email");
    const savedRoom = localStorage.getItem("wc_guest_room");
    if(saved) setGuestEmail(saved);
    if(savedRoom) setRoomId(savedRoom);
    return ()=>sub.subscription.unsubscribe();
  },[]);

  if(!SUPABASE_READY) return <DraftApp mp={null}/>;

  if(!authReady){
    return <div style={{minHeight:"100vh",background:LIGHT.cream,display:"flex",alignItems:"center",justifyContent:"center",color:LIGHT.navyLt,fontFamily:"-apple-system,sans-serif"}}>Loading…</div>;
  }

  const isAdmin = session && session.user && session.user.email === ADMIN_EMAIL;

  // No session and no stored guest room → show sign-in
  if(!session && !guestEmail) return <AuthScreen onGuestAccess={(email, rid)=>{ setGuestEmail(email); setRoomId(rid); localStorage.setItem("wc_guest_email",email); localStorage.setItem("wc_guest_room",rid); }}/>;

  // Waiting for anon auth session to propagate after guest sign-in
  if(!session && guestEmail){
    return <div style={{minHeight:"100vh",background:LIGHT.cream,display:"flex",alignItems:"center",justifyContent:"center",color:LIGHT.navyLt,fontFamily:"-apple-system,sans-serif"}}>Joining draft room…</div>;
  }

  // Admin flow → admin panel or room
  if(isAdmin){
    if(!roomId) return <AdminPanel session={session} onEnter={setRoomId}/>;
    return <RoomScreen session={session} roomId={roomId} onLeave={()=>setRoomId(null)} guestEmail={null}/>;
  }

  // Authenticated user (anon guest or other) → lobby or room
  if(session){
    if(!roomId) return <LobbyScreen session={session} onEnter={setRoomId}/>;
    return <RoomScreen session={session} roomId={roomId} onLeave={()=>{ setRoomId(null); setGuestEmail(null); localStorage.removeItem("wc_guest_email"); localStorage.removeItem("wc_guest_room"); }} guestEmail={guestEmail}/>;
  }

  return <AuthScreen onGuestAccess={(email, rid)=>{ setGuestEmail(email); setRoomId(rid); localStorage.setItem("wc_guest_email",email); localStorage.setItem("wc_guest_room",rid); }}/>;
}

// ─── AUTH SCREEN: admin OTP or invited friend email-only ──────────
function AuthScreen({onGuestAccess}){
  const T = LIGHT;
  const [email, setEmail]   = useState("");
  const [step, setStep]     = useState("email");   // email | code | checking
  const [code, setCode]     = useState("");
  const [busy, setBusy]     = useState(false);
  const [err, setErr]       = useState("");

  async function handleSubmit(){
    setErr("");
    const e = email.trim().toLowerCase();

    // Easter egg: typing the admin code directly → instant admin login
    if(e === "052305" || e === ADMIN_EMAIL){
      setBusy(true);
      // Try password sign-in (works on any device once account exists)
      const {error:signInErr} = await supabase.auth.signInWithPassword({email:ADMIN_EMAIL, password:"052305"});
      if(!signInErr){ setBusy(false); return; }

      // Account doesn't exist yet — create it (first-ever login)
      const {data:signUpData, error:signUpErr} = await supabase.auth.signUp({
        email:ADMIN_EMAIL, password:"052305",
        options:{ data:{role:"admin"} }
      });
      if(signUpErr && signUpErr.message.toLowerCase().includes("already")){
        await supabase.auth.signInWithOtp({email:ADMIN_EMAIL});
        setBusy(false);
        setErr("Check your email for a one-time verification link. After that, your code works on all devices.");
        return;
      }
      if(signUpErr){ setBusy(false); setErr(signUpErr.message); return; }
      if(signUpData && signUpData.session){ setBusy(false); return; }
      const {error:retryErr} = await supabase.auth.signInWithPassword({email:ADMIN_EMAIL, password:"052305"});
      setBusy(false);
      if(retryErr){
        await supabase.auth.signInWithOtp({email:ADMIN_EMAIL});
        setErr("Check your email for a one-time verification link. After that, your code works permanently.");
      }
      return;
    }

    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)){ setErr("Enter a valid email address."); return; }
    setBusy(true);

    // Everyone else → check if they're invited
    setStep("checking");
    const {data:invite} = await supabase.from("invites").select("*,rooms(id,code,status)").eq("email",e).maybeSingle();

    if(!invite || !invite.rooms){
      setBusy(false);
      setStep("email");
      setErr("You haven't been invited to a draft yet. Ask the draft admin to add your email.");
      return;
    }

    // They're invited! Sign in anonymously (invisible — gives them a real Supabase session)
    const {data:anonData, error:anonErr} = await supabase.auth.signInAnonymously();
    if(anonErr){
      setBusy(false); setStep("email");
      setErr("Could not sign in: "+anonErr.message);
      return;
    }

    const anonUid = anonData.session.user.id;
    const teamName = e.split("@")[0];

    // Claim the invite
    await supabase.from("invites").update({user_id:anonUid, claimed:true, team_name:teamName}).eq("id",invite.id);

    // Create room_member if not already there
    const {data:existing} = await supabase.from("room_members").select("*").eq("room_id",invite.room_id).eq("seat",invite.seat).maybeSingle();
    if(!existing){
      await supabase.from("room_members").insert({room_id:invite.room_id, user_id:anonUid, seat:invite.seat, team_name:teamName});
    } else if(!existing.user_id || existing.user_id !== anonUid){
      await supabase.from("room_members").update({user_id:anonUid, team_name:teamName}).eq("id",existing.id);
    }

    setBusy(false);
    onGuestAccess(e, invite.room_id);
  }

  async function verifyCode(){
    setErr(""); setBusy(true);
    const trimmed = code.trim();
    // OTP verify (non-admin fallback only)
    const {error} = await supabase.auth.verifyOtp({ email:email.trim(), token:trimmed, type:"email" });
    setBusy(false);
    if(error){ setErr(error.message); }
  }

  return (
    <div style={{minHeight:"100vh",background:T.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 22px"}}>
      <style>{mpCss()}</style>
      <div style={{display:"flex",gap:10,marginBottom:22}}>
        {[["ball","#1A1A1A"],["trophy","#2D5BFF"],["globe","#1A1A1A"]].map(([ic,bg],i)=>(
          <div key={i} style={{width:58,height:58,borderRadius:15,background:bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon id={ic} size={28} color="#FAFAF8"/>
          </div>
        ))}
      </div>
      <h1 style={{fontSize:26,fontWeight:800,color:T.navy,textAlign:"center",marginBottom:4}}>FIFA World Cup 2026</h1>
      <p style={{fontSize:13,color:T.textSub,marginBottom:30,textAlign:"center"}}>Snake Draft · enter your email to join</p>

      <div className="card" style={{width:"100%",maxWidth:380,background:"#fff",border:"1.5px solid "+T.navy+"18",borderRadius:18,padding:24}}>
        {step==="email" && (
          <>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:12}}>Enter your email</div>
            <input className="mp-input" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email}
                   onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            <p style={{fontSize:11,color:T.textSub,margin:"10px 0 16px",lineHeight:1.5}}>If you've been invited, you'll be taken straight to your draft room. No codes or passwords needed.</p>
            <button className="mp-btn" style={{background:T.navy,color:T.cream}} disabled={busy} onClick={handleSubmit}>{busy?"Checking…":"Continue"}</button>
          </>
        )}
        {step==="checking" && (
          <div style={{textAlign:"center",padding:20,color:T.textSub}}>Checking invite list…</div>
        )}
        {step==="code" && (
          <>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:12}}>Admin sign-in</div>
            <p style={{fontSize:12,color:T.navy,marginBottom:14,lineHeight:1.6}}>Enter your 6-digit admin code to sign in.</p>
            <input className="mp-input" type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                   value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,""))}
                   onKeyDown={e=>e.key==="Enter"&&verifyCode()}
                   style={{textAlign:"center",fontSize:26,letterSpacing:8,fontWeight:800}}/>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button className="mp-btn" style={{background:T.creamDk,color:T.navy,flex:1}} onClick={()=>{setStep("email");setCode("");setErr("");}}>Back</button>
              <button className="mp-btn" style={{background:T.olive,color:T.cream,flex:2}} disabled={busy||code.length<6} onClick={verifyCode}>{busy?"Signing in…":"Sign in"}</button>
            </div>
          </>
        )}
        {err && <p style={{marginTop:14,fontSize:12,color:T.danger}}>{err}</p>}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL: create room, invite friends, set date/time ──────
function AdminPanel({session, onEnter}){
  const T = LIGHT;
  const uid = session.user.id;
  const [emails, setEmails] = useState(Array(7).fill(""));
  const [teamName, setTeamName] = useState("Commissioner");
  const [draftDate, setDraftDate] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [created, setCreated] = useState(null);
  const [myRooms, setMyRooms] = useState([]);
  const [archivedRooms, setArchivedRooms] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(()=>{ loadRooms(); },[]);
  async function loadRooms(){
    const {data} = await supabase.from("room_members").select("seat,team_name,rooms(id,code,status,archived)").eq("user_id",uid);
    const all = (data||[]).filter(r=>r.rooms);
    setMyRooms(all.filter(r=>!r.rooms.archived));
    setArchivedRooms(all.filter(r=>r.rooms.archived));
  }

  async function archiveRoom(roomId){
    await supabase.from("rooms").update({archived:true}).eq("id",roomId);
    loadRooms();
  }
  async function unarchiveRoom(roomId){
    await supabase.from("rooms").update({archived:false}).eq("id",roomId);
    loadRooms();
  }
  async function deleteRoom(roomId){
    if(!confirm("Permanently delete this room and all its data? This cannot be undone.")) return;
    await supabase.from("picks").delete().eq("room_id",roomId);
    await supabase.from("invites").delete().eq("room_id",roomId);
    await supabase.from("room_members").delete().eq("room_id",roomId);
    await supabase.from("rooms").delete().eq("id",roomId);
    loadRooms();
  }

  function setEmail(idx, val){ const n=emails.slice(); n[idx]=val; setEmails(n); }
  const genCode = ()=> "WC"+Math.floor(1000+Math.random()*9000);
  const validEmails = emails.filter(e=> /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim()));

  function getInviteText(){
    const siteUrl = window.location.origin;
    const dateStr = (draftDate && draftTime)
      ? new Date(draftDate+"T"+draftTime).toLocaleString("en-US",{weekday:"long",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})
      : "TBD";
    return `🏆 You're invited to the FIFA WC 2026 Snake Draft!\n\nDraft date: ${dateStr}\n\nTo join:\n1. Go to: ${siteUrl}\n2. Enter your email address (the one this was sent to)\n3. You'll be taken straight to the draft room — no codes or passwords needed.\n\nSee you on draft day!`;
  }

  async function copyInvite(){
    try {
      await navigator.clipboard.writeText(getInviteText());
      setCopied(true);
      setTimeout(()=>setCopied(false), 2500);
    } catch(e){
      // Fallback: select text
      const ta = document.createElement("textarea");
      ta.value = getInviteText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(()=>setCopied(false), 2500);
    }
  }

  async function nativeShare(){
    const text = getInviteText();
    if(navigator.share){
      try {
        await navigator.share({title:"FIFA WC 2026 Snake Draft Invite", text});
      } catch(e){ /* user cancelled */ }
    } else {
      copyInvite();
    }
  }

  function openMailto(){
    const friendList = validEmails.map(e=>e.trim()).join(",");
    const subject = encodeURIComponent("You're invited to the FIFA WC 2026 Snake Draft!");
    const body = encodeURIComponent(getInviteText());
    window.open(`mailto:${friendList}?subject=${subject}&body=${body}`,"_blank");
  }

  async function createDraft(){
    setErr(""); setBusy(true);
    if(validEmails.length === 0){ setBusy(false); setErr("Add at least one friend's email."); return; }

    const name = teamName.trim() || "Commissioner";
    await supabase.from("profiles").upsert({id:uid,email:session.user.email,display_name:name});

    const roomCode = genCode();
    const draftAt = (draftDate && draftTime) ? new Date(draftDate+"T"+draftTime).toISOString() : null;
    const {data:room,error} = await supabase.from("rooms")
      .insert({code:roomCode, host_id:uid, status:"lobby", num_players:validEmails.length+1, picks_each:Math.floor(48/(validEmails.length+1)), current_pick:0, draft_date:draftAt, archived:false})
      .select().single();
    if(error){ setBusy(false); setErr(error.message); return; }

    await supabase.from("room_members").insert({room_id:room.id, user_id:uid, seat:0, team_name:name});

    for(let i=0; i<validEmails.length; i++){
      const friendEmail = validEmails[i].trim().toLowerCase();
      await supabase.from("invites").upsert({room_id:room.id, email:friendEmail, seat:i+1}, {onConflict:"room_id,email"});
    }

    setBusy(false);
    setCreated({room, roomCode});
  }

  return (
    <div style={{minHeight:"100vh",background:T.cream,display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 60px"}}>
      <style>{mpCss()}</style>

      <div style={{width:"100%",maxWidth:480,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:T.navy}}>Admin Panel</div>
          <div style={{fontSize:11,color:T.textSub,marginTop:2}}>Signed in as {session.user.email}</div>
        </div>
        <button style={{background:T.creamDk,border:"1.5px solid "+T.navy+"22",color:T.navy,borderRadius:9,padding:"7px 13px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>supabase.auth.signOut()}>Sign out</button>
      </div>

      {/* Active rooms */}
      {myRooms.length > 0 && (
        <div className="card" style={{width:"100%",maxWidth:480,background:"#fff",border:"1.5px solid "+T.navy+"18",borderRadius:16,padding:16,marginBottom:18}}>
          <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:10}}>Active rooms</div>
          {myRooms.map(r=>(
            <div key={r.rooms.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 8px",borderRadius:10}}>
              <div onClick={()=>onEnter(r.rooms.id)} style={{display:"flex",alignItems:"center",gap:10,flex:1,cursor:"pointer"}}>
                <div style={{width:38,height:38,borderRadius:10,background:T.navy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff"}}>{r.rooms.code.slice(-4)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:T.navy}}>Room {r.rooms.code}</div>
                  <div style={{fontSize:11,color:T.textSub}}>{r.rooms.status}</div>
                </div>
                <span style={{fontSize:18,color:T.textSub}}>→</span>
              </div>
              <button onClick={()=>archiveRoom(r.rooms.id)} style={{background:"none",border:"1px solid "+T.navy+"33",borderRadius:7,padding:"5px 10px",fontSize:10,color:T.textSub,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Archive</button>
            </div>
          ))}
        </div>
      )}

      {/* Archived rooms */}
      {archivedRooms.length > 0 && (
        <div className="card" style={{width:"100%",maxWidth:480,background:"#fff",border:"1.5px solid "+T.navy+"12",borderRadius:16,padding:16,marginBottom:18,opacity:0.75}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:showArchived?10:0,cursor:"pointer"}} onClick={()=>setShowArchived(p=>!p)}>
            <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub}}>Archived ({archivedRooms.length})</div>
            <span style={{fontSize:14,color:T.textSub}}>{showArchived?"▾":"▸"}</span>
          </div>
          {showArchived && archivedRooms.map(r=>(
            <div key={r.rooms.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 8px",borderRadius:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:T.navy+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>{r.rooms.code.slice(-4)}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:T.navyLt}}>Room {r.rooms.code}</div>
                <div style={{fontSize:10.5,color:T.textSub}}>{r.rooms.status} · archived</div>
              </div>
              <button onClick={()=>unarchiveRoom(r.rooms.id)} style={{background:"none",border:"1px solid "+T.olive+"44",borderRadius:7,padding:"4px 8px",fontSize:9.5,color:T.olive,cursor:"pointer",fontFamily:"inherit"}}>Restore</button>
              <button onClick={()=>deleteRoom(r.rooms.id)} style={{background:"none",border:"1px solid "+T.danger+"44",borderRadius:7,padding:"4px 8px",fontSize:9.5,color:T.danger,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* Create new draft */}
      {!created ? (
        <div className="card" style={{width:"100%",maxWidth:480,background:"#fff",border:"1.5px solid "+T.navy+"18",borderRadius:18,padding:24}}>
          <div style={{fontSize:16,fontWeight:800,color:T.navy,marginBottom:18}}>Create a New Draft</div>

          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:8}}>Your team name</div>
          <input className="mp-input" placeholder="Commissioner" value={teamName} onChange={e=>setTeamName(e.target.value)} style={{marginBottom:18}}/>

          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:8}}>Draft date & time</div>
          <div style={{display:"flex",gap:10,marginBottom:18}}>
            <input className="mp-input" type="date" value={draftDate} onChange={e=>setDraftDate(e.target.value)} style={{flex:1}}/>
            <input className="mp-input" type="time" value={draftTime} onChange={e=>setDraftTime(e.target.value)} style={{flex:1}}/>
          </div>

          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:8}}>Invite your friends (up to 7)</div>
          <p style={{fontSize:11,color:T.textSub,marginBottom:12,lineHeight:1.5}}>Enter each friend's email. They'll be able to join just by entering their email — no sign-up or verification needed.</p>
          {emails.map((e,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:24,height:24,borderRadius:6,background:PLAYER_COLORS[(i+1)%8],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff",flexShrink:0}}>{i+2}</div>
              <input className="mp-input" type="email" placeholder={`Friend ${i+1}'s email`} value={e} onChange={ev=>setEmail(i,ev.target.value)}/>
            </div>
          ))}
          <p style={{fontSize:11,color:T.olive,fontWeight:600,marginTop:6,marginBottom:18}}>{validEmails.length} of 7 emails entered · {validEmails.length+1} total players · {Math.floor(48/(validEmails.length+1))} picks each</p>

          <button className="mp-btn" style={{background:T.olive,color:"#FAFAF8"}} disabled={busy||validEmails.length===0} onClick={createDraft}>
            {busy ? "Creating…" : "Create Draft Room"}
          </button>
          {err && <p style={{marginTop:14,fontSize:12,color:T.danger}}>{err}</p>}
        </div>
      ) : (
        /* Room created — share invites */
        <div className="card" style={{width:"100%",maxWidth:480,background:"#fff",border:"1.5px solid "+T.navy+"18",borderRadius:18,padding:24,textAlign:"center"}}>
          <div style={{fontSize:14,fontWeight:700,color:T.olive,marginBottom:6}}>Draft room created!</div>
          <div style={{fontSize:42,fontWeight:900,letterSpacing:6,color:T.navy,marginBottom:6}}>{created.roomCode}</div>
          <p style={{fontSize:12,color:T.textSub,marginBottom:16,lineHeight:1.5}}>
            {validEmails.length} friend{validEmails.length!==1?"s":""} invited. Share the invite message below so they know how to join.
          </p>

          {/* Invite message preview */}
          <div style={{textAlign:"left",background:T.cream,borderRadius:12,padding:14,marginBottom:16,fontSize:12,color:T.navy,lineHeight:1.6,whiteSpace:"pre-line",border:"1.5px solid "+T.navy+"14"}}>
            {getInviteText()}
          </div>

          {/* Share buttons */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <button className="mp-btn" style={{background:T.navy,color:T.cream,flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={copyInvite}>
              {copied ? "✓ Copied!" : "Copy invite text"}
            </button>
            <button className="mp-btn" style={{background:T.olive,color:T.cream,flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={nativeShare}>
              Share invite
            </button>
          </div>
          <button className="mp-btn" style={{background:T.creamDk,color:T.navy,marginBottom:8,fontSize:12}} onClick={openMailto}>
            Open in email app
          </button>

          {/* Invited list */}
          <div style={{textAlign:"left",background:T.cream,borderRadius:12,padding:14,marginBottom:16}}>
            <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:8}}>Invited players</div>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
              <div style={{width:22,height:22,borderRadius:6,background:PLAYER_COLORS[0],display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff"}}>1</div>
              <span style={{fontSize:12,fontWeight:700,color:T.navy}}>{session.user.email} (you)</span>
            </div>
            {validEmails.map((e,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
                <div style={{width:22,height:22,borderRadius:6,background:PLAYER_COLORS[(i+1)%8],display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff"}}>{i+2}</div>
                <span style={{fontSize:12,color:T.navy}}>{e.trim()}</span>
              </div>
            ))}
          </div>

          <button className="mp-btn" style={{background:T.olive,color:T.cream}} onClick={()=>onEnter(created.room.id)}>
            Enter draft room →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── LOBBY (fallback for non-admin authenticated users) ───────────
function LobbyScreen({session, onEnter}){
  const T = LIGHT;
  const uid = session.user.id;
  const defaultName = session.user.email ? session.user.email.split("@")[0] : "Player";
  const [teamName,setTeamName] = useState("");
  const [joinCode,setJoinCode] = useState("");
  const [busy,setBusy]   = useState(false);
  const [err,setErr]     = useState("");
  const [myRooms,setMyRooms] = useState([]);

  useEffect(()=>{ loadRooms(); },[]);
  async function loadRooms(){
    const {data} = await supabase.from("room_members").select("seat,team_name,rooms(id,code,status)").eq("user_id",uid);
    setMyRooms((data||[]).filter(r=>r.rooms));
  }

  async function joinRoom(){
    setErr(""); const name=(teamName||defaultName).trim();
    if(!joinCode.trim()){ setErr("Enter a room code"); return; }
    setBusy(true);
    await supabase.from("profiles").upsert({id:uid,email:session.user.email,display_name:name});
    const {data:room,error} = await supabase.from("rooms").select("*").eq("code",joinCode.trim().toUpperCase()).single();
    if(error||!room){ setBusy(false); setErr("Room not found"); return; }
    const {data:existing} = await supabase.from("room_members").select("*").eq("room_id",room.id).eq("user_id",uid).maybeSingle();
    if(existing){ setBusy(false); onEnter(room.id); return; }
    if(room.status!=="lobby"){ setBusy(false); setErr("That draft has already started"); return; }
    const {data:members} = await supabase.from("room_members").select("seat").eq("room_id",room.id);
    const taken = new Set((members||[]).map(m=>m.seat));
    if(taken.size>=room.num_players){ setBusy(false); setErr("Room is full"); return; }
    let seat=0; while(taken.has(seat)) seat++;
    const {error:mErr} = await supabase.from("room_members").insert({room_id:room.id,user_id:uid,seat,team_name:name});
    setBusy(false);
    if(mErr){ setErr(mErr.message); return; }
    onEnter(room.id);
  }

  return (
    <div style={{minHeight:"100vh",background:T.cream,display:"flex",flexDirection:"column",alignItems:"center",padding:"30px 20px 60px"}}>
      <style>{mpCss()}</style>
      <div style={{width:"100%",maxWidth:420,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div style={{fontSize:22,fontWeight:800,color:T.navy}}>Draft Lobby</div>
        <button style={{background:T.creamDk,border:"1.5px solid "+T.navy+"22",color:T.navy,borderRadius:9,padding:"7px 13px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>supabase.auth.signOut()}>Sign out</button>
      </div>
      {myRooms.length>0 && (
        <div className="card" style={{width:"100%",maxWidth:420,background:"#fff",border:"1.5px solid "+T.navy+"18",borderRadius:16,padding:16,marginBottom:16}}>
          <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:10}}>Your rooms</div>
          {myRooms.map(r=>(
            <div key={r.rooms.id} onClick={()=>onEnter(r.rooms.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 8px",borderRadius:10,cursor:"pointer"}}>
              <div style={{width:34,height:34,borderRadius:9,background:T.navy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff"}}>{r.rooms.code.slice(-2)}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:T.navy}}>Room {r.rooms.code}</div>
                <div style={{fontSize:10.5,color:T.textSub}}>You: {r.team_name} · {r.rooms.status}</div>
              </div>
              <span style={{fontSize:18,color:T.textSub}}>→</span>
            </div>
          ))}
        </div>
      )}
      <div className="card" style={{width:"100%",maxWidth:420,background:"#fff",border:"1.5px solid "+T.navy+"18",borderRadius:16,padding:22}}>
        <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:10}}>Join a draft</div>
        <input className="mp-input" placeholder="Your team name" value={teamName} onChange={e=>setTeamName(e.target.value)} style={{marginBottom:10}}/>
        <input className="mp-input" placeholder="Room code (e.g. WC4821)" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} style={{textTransform:"uppercase",marginBottom:12}}/>
        <button className="mp-btn" style={{background:T.olive,color:T.cream}} disabled={busy} onClick={joinRoom}>{busy?"Joining…":"Join room →"}</button>
        {err && <p style={{marginTop:14,fontSize:12,color:T.danger}}>{err}</p>}
      </div>
    </div>
  );
}

// ─── ROOM SCREEN (for all authenticated users — admin + guests) ──
function RoomScreen({session, roomId, onLeave}){
  const T = LIGHT;
  const uid = session.user.id;
  const [room,setRoom]       = useState(null);
  const [members,setMembers] = useState([]);
  const [picks,setPicks]     = useState([]);
  const [loading,setLoading] = useState(true);
  const [online,setOnline]   = useState(new Set());
  const [lotteryWatched, setLotteryWatched] = useState(false);

  const loadAll = useCallback(async ()=>{
    const [{data:r},{data:m},{data:p}] = await Promise.all([
      supabase.from("rooms").select("*").eq("id",roomId).single(),
      supabase.from("room_members").select("*").eq("room_id",roomId).order("seat"),
      supabase.from("picks").select("*").eq("room_id",roomId).order("pick_index"),
    ]);
    setRoom(r); setMembers(m||[]); setPicks(p||[]); setLoading(false);
  },[roomId]);

  useEffect(()=>{ loadAll(); },[loadAll]);

  useEffect(()=>{
    const ch = supabase.channel("room:"+roomId, {config:{presence:{key:uid}}})
      .on("postgres_changes",{event:"*",schema:"public",table:"rooms",filter:"id=eq."+roomId},loadAll)
      .on("postgres_changes",{event:"*",schema:"public",table:"room_members",filter:"room_id=eq."+roomId},loadAll)
      .on("postgres_changes",{event:"*",schema:"public",table:"picks",filter:"room_id=eq."+roomId},loadAll)
      .on("presence",{event:"sync"},()=>{
        const state = ch.presenceState();
        setOnline(new Set(Object.keys(state)));
      })
      .subscribe(async (status)=>{
        if(status==="SUBSCRIBED") await ch.track({uid});
      });
    return ()=>{ supabase.removeChannel(ch); };
  },[roomId,uid,loadAll]);

  if(loading || !room){
    return <div style={{minHeight:"100vh",background:T.cream,display:"flex",alignItems:"center",justifyContent:"center",color:T.navyLt,fontFamily:"-apple-system,sans-serif"}}>Loading room…</div>;
  }

  const mySeat = (members.find(m=>m.user_id===uid)||{}).seat;
  const isHost = room.host_id===uid;
  const onlineSeats = new Set(members.filter(m=>online.has(m.user_id)).map(m=>m.seat));

  if(room.status==="lobby"){
    return <RoomLobby T={T} room={room} members={members} isHost={isHost} uid={uid} onLeave={onLeave}/>;
  }

  const appPicks = picks.map(p=>({
    playerIndex: p.seat,
    team: ALL_TEAMS.find(t=>t.name===p.team_key),
    pickIndex: p.pick_index,
  })).filter(p=>p.team);

  const draftOrder = Array.isArray(room.draft_order) ? room.draft_order.map(Number) : null;

  // Show lottery animation when draft just started (no picks yet) and we haven't watched it
  const shouldShowLottery = draftOrder && room.current_pick === 0 && appPicks.length === 0 && !lotteryWatched;

  if(shouldShowLottery){
    const memberNames = Array.from({length:room.num_players},(_,i)=>{
      const m = members.find(x=>x.seat===i);
      return m ? m.team_name : "Player "+(i+1);
    });
    return (
      <LotteryModal
        T={T}
        playerNames={memberNames}
        serverOrder={draftOrder}
        onComplete={()=>setLotteryWatched(true)}
        onConfirm={()=>setLotteryWatched(true)}
        onClose={()=>setLotteryWatched(true)}
      />
    );
  }

  async function onPick(team){
    const {error} = await supabase.rpc("make_pick",{p_room_id:roomId,p_team_key:team.name});
    if(error) console.error(error);
  }
  async function onLottery(order){
    await supabase.rpc("run_lottery",{p_room_id:roomId});
  }
  async function onReset(){
    if(!isHost) return;
    if(!confirm("Reset the entire draft for everyone?")) return;
    await supabase.from("picks").delete().eq("room_id",roomId);
    await supabase.from("rooms").update({current_pick:0,status:"lobby",draft_order:null}).eq("id",roomId);
  }

  return (
    <DraftApp mp={{
      mySeat, room, members, picks:appPicks,
      currentPick:room.current_pick, draftOrder,
      isHost, online:onlineSeats,
      onPick, onLottery, onReset, onLeave,
    }}/>
  );
}

// ─── ROOM LOBBY: waiting room + host start ────────────────────────
function RoomLobby({T, room, members, isHost, uid, onLeave}){
  const [busy,setBusy] = useState(false);
  const [err,setErr]   = useState("");
  const [now, setNow]  = useState(Date.now());

  // Countdown timer — updates every second
  useEffect(()=>{
    if(!room.draft_date) return;
    const id = setInterval(()=>setNow(Date.now()), 1000);
    return ()=>clearInterval(id);
  },[room.draft_date]);

  const draftTime = room.draft_date ? new Date(room.draft_date).getTime() : null;
  const diff = draftTime ? Math.max(0, draftTime - now) : null;
  const days    = diff !== null ? Math.floor(diff / 86400000) : 0;
  const hours   = diff !== null ? Math.floor((diff % 86400000) / 3600000) : 0;
  const minutes = diff !== null ? Math.floor((diff % 3600000) / 60000) : 0;
  const seconds = diff !== null ? Math.floor((diff % 60000) / 1000) : 0;
  const draftStarted = diff !== null && diff <= 0;
  const myMember = members.find(m=>m.user_id===uid);
  const [editName, setEditName] = useState(myMember ? myMember.team_name : "");
  const [saving, setSaving] = useState(false);

  // Keep editName in sync if member data reloads
  useEffect(()=>{
    if(myMember && editName === "") setEditName(myMember.team_name || "");
  },[myMember]);

  async function saveName(){
    if(!myMember || !editName.trim()) return;
    setSaving(true);
    await supabase.from("room_members").update({team_name:editName.trim()}).eq("room_id",room.id).eq("user_id",uid);
    setSaving(false);
  }

  async function start(){
    setErr(""); setBusy(true);
    // Run lottery first to set the draft order
    const {error:lErr} = await supabase.rpc("run_lottery",{p_room_id:room.id});
    if(lErr){ setBusy(false); setErr(lErr.message); return; }
    // Then start the draft
    const {data,error} = await supabase.rpc("start_draft",{p_room_id:room.id});
    setBusy(false);
    if(error){ setErr(error.message); return; }
    if(data && !data.ok){ setErr(data.error||"Could not start"); }
  }
  return (
    <div style={{minHeight:"100vh",background:T.cream,padding:"28px 20px 60px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <style>{mpCss()}</style>
      <div style={{width:"100%",maxWidth:420}}>
        <div className="card" style={{background:"#fff",border:"1.5px solid "+T.navy+"18",borderRadius:18,padding:24,textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:8}}>Room code</div>
          <div style={{fontSize:46,fontWeight:900,letterSpacing:6,color:T.navy}}>{room.code}</div>
          {room.draft_date && (
            <div style={{marginTop:16}}>
              {/* Date line */}
              <div style={{fontSize:13,fontWeight:700,color:T.navy,marginBottom:8}}>
                {new Date(room.draft_date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} at {new Date(room.draft_date).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}
              </div>
              {/* Countdown boxes */}
              {!draftStarted ? (
                <div style={{display:"flex",justifyContent:"center",gap:8}}>
                  {[{val:days,label:"Days"},{val:hours,label:"Hrs"},{val:minutes,label:"Min"},{val:seconds,label:"Sec"}].map(({val,label})=>(
                    <div key={label} style={{background:T.navy,borderRadius:10,padding:"10px 6px",minWidth:52,textAlign:"center"}}>
                      <div style={{fontSize:22,fontWeight:900,color:"#FAFAF8",lineHeight:1}}>{String(val).padStart(2,"0")}</div>
                      <div style={{fontSize:8,fontWeight:700,color:"rgba(250,250,248,0.5)",letterSpacing:1.5,textTransform:"uppercase",marginTop:3}}>{label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{background:T.olive,color:"#FAFAF8",borderRadius:10,padding:"10px 18px",fontSize:14,fontWeight:800,display:"inline-block",animation:"yourTurnBadge 1.5s ease-in-out infinite"}}>
                  Draft time! Ready to start
                </div>
              )}
            </div>
          )}
          <p style={{fontSize:12,color:T.textSub,marginTop:10,lineHeight:1.5}}>Friends enter this code to join from any device. Up to 8 teams.</p>
        </div>

        {/* Editable team name for current user */}
        {myMember && (
          <div className="card" style={{background:"#fff",border:"1.5px solid "+T.olive+"44",borderRadius:16,padding:18,marginBottom:18}}>
            <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:8}}>Your team name</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input className="mp-input" value={editName} onChange={e=>setEditName(e.target.value)}
                     onBlur={saveName} onKeyDown={e=>{ if(e.key==="Enter") saveName(); }}
                     placeholder="Enter your team name" style={{flex:1}}/>
              <button style={{background:T.olive,color:"#FAFAF8",border:"none",borderRadius:10,padding:"10px 16px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}
                      disabled={saving || !editName.trim() || editName.trim()===myMember.team_name}
                      onClick={saveName}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}

        <div className="card" style={{background:"#fff",border:"1.5px solid "+T.navy+"18",borderRadius:16,padding:18,marginBottom:18}}>
          <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textSub,marginBottom:12}}>Players ({members.length}/{room.num_players})</div>
          {members.map(m=>(
            <div key={m.user_id||m.seat} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 6px"}}>
              <Avatar idx={m.seat} size={30}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:m.user_id===uid?T.olive:T.navy}}>{m.team_name}{m.user_id===uid?" (you)":""}</div>
                <div style={{fontSize:10.5,color:T.textSub}}>Seat {m.seat+1}{m.user_id===room.host_id?" · Host":""}</div>
              </div>
            </div>
          ))}
          {Array.from({length:Math.max(0,room.num_players-members.length)}).map((_,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 6px",opacity:0.5}}>
              <div style={{width:30,height:30,borderRadius:8,border:"1.5px dashed "+T.navy+"33"}}/>
              <div style={{fontSize:12,color:T.textSub}}>Waiting for player…</div>
            </div>
          ))}
        </div>

        {isHost ? (
          <>
            <button className="mp-btn" style={{background:T.olive,color:T.cream}} disabled={busy||members.length<2} onClick={start}>
              {busy?"Starting…":`Start draft (${members.length} player${members.length>1?"s":""}) →`}
            </button>
            {members.length<2 && <p style={{fontSize:11,color:T.textSub,textAlign:"center",marginTop:8}}>Need at least 2 players to start.</p>}
          </>
        ) : (
          <p style={{fontSize:13,color:T.textSub,textAlign:"center"}}>Waiting for the host to start the draft…</p>
        )}
        {err && <p style={{fontSize:12,color:T.danger,textAlign:"center",marginTop:10}}>{err}</p>}
        <button onClick={onLeave} style={{display:"block",margin:"18px auto 0",background:"none",border:"none",color:T.textSub,fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Leave room</button>
      </div>
    </div>
  );
}

