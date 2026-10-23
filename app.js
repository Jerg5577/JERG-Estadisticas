/* FÚTBOL STATS · panel de últimos cinco partidos conectado a Google Sheets */
const API_URL = "https://script.google.com/macros/s/AKfycbwgN0-2sA6GFMLO2sJgG7rO9FihSOy0oWPWV5Osrj0bOna-mJqW24WjZjzPCWhAQvCl/exec";
let matches = [], selectedLocation = "all";
const $ = id => document.getElementById(id);
const n = v => v === "" || v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v);
const safe = v => String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const teamIds = {"Arsenal":57,"Aston Villa":58,"Bournemouth":1044,"Brentford":402,"Brighton & Hove Albion":397,"Brighton":397,"Burnley":328,"Chelsea":61,"Crystal Palace":354,"Everton":62,"Fulham":63,"Ipswich Town":349,"Leicester City":338,"Liverpool":64,"Manchester City":65,"Manchester United":66,"Newcastle United":67,"Newcastle":67,"Nottingham Forest":351,"Southampton":340,"Tottenham Hotspur":73,"Tottenham":73,"West Ham United":563,"Wolverhampton Wanderers":76,"Wolves":76,"Barcelona":81,"Real Madrid":86,"Atlético de Madrid":78,"Atletico Madrid":78,"Sevilla":559,"Valencia":95,"Villarreal":94,"Bayern Munich":5,"Bayern München":5,"Borussia Dortmund":4,"RB Leipzig":721,"Bayer Leverkusen":3,"Inter":108,"Inter Milan":108,"Milan":98,"AC Milan":98,"Juventus":109,"Napoli":113,"Roma":100,"Lazio":110,"Atalanta":102,"Paris Saint-Germain":524,"PSG":524,"Lyon":523,"Ajax":678,"PSV":674,"Feyenoord":675,"Benfica":1903,"Porto":503,"Sporting CP":498,"VfB Stuttgart":10,"Stuttgart":10,"Borussia Mönchengladbach":18,"Borussia Monchengladbach":18,"Mönchengladbach":18,"Monchengladbach":18,"M'gladbach":18,"Borussia Mönchengladbach":18,"Torino":586,"Torino FC":586,"Monza":5911,"AC Monza":5911,"Brest":512,"Stade Brestois":512,"Stade Brestois 29":512,"Nice":522,"OGC Nice":522,"Deportivo Alavés":263,"Deportivo Alaves":263,"Alavés":263,"Alaves":263,"Málaga":573,"Malaga":573,"Real Sociedad":92,"Sociedad":92,"Espanyol":80,"RCD Espanyol":80,"Getafe":546,"Celta":558,"Parma":523,"Udinese":115,"Bologna":103,"Fiorentina":99,"Hoffenheim":2,"TSG Hoffenheim":2,"FC Köln":1,"Koln":1,"Hamburg":7,"Hamburger SV":7,"Paderborn":1005,"Mainz":15,"Angers":532,"Auxerre":519,"Le Havre":533,"Lille":521,"Strasbourg":576,"Nantes":543,"Coventry":1076,"Elversberg":1009,"Osasuna":79,"Cagliari":104,"Sassuolo":471};
const leagueCodes = {"Premier League":"PL","LaLiga":"PD","Bundesliga":"BL1","Serie A":"SA","Ligue 1":"FL1","Eredivisie":"DED","Primeira Liga":"PPL","Super Liga de Grecia":"GRE"};
const statRows = [
 {type:"attack",title:"Ataque",icon:"🎯"},
 {key:"shots",label:"Remates totales",icon:"⚽",forHome:"Tiros_Totales_Local",forAway:"Tiros_Totales_Visitante",againstHome:"Tiros_Totales_Visitante",againstAway:"Tiros_Totales_Local"},
 {key:"sot",label:"Remates a puerta",icon:"🥅",forHome:"Tiros_Puerta_Local",forAway:"Tiros_Puerta_Visitante",againstHome:"Tiros_Puerta_Visitante",againstAway:"Tiros_Puerta_Local"},
 {key:"goals",label:"Goles",icon:"⚽",forHome:"Goles_Local",forAway:"Goles_Visitante",againstHome:"Goles_Visitante",againstAway:"Goles_Local"},
 {key:"xg",label:"Goles esperados (xG)",icon:"📈",forHome:"Goles_Esperados_Local",forAway:"Goles_Esperados_Visitante",againstHome:"Goles_Esperados_Visitante",againstAway:"Goles_Esperados_Local",decimals:2},
 {key:"corners",label:"Córners a favor",icon:"🚩",forHome:"Corners_Local",forAway:"Corners_Visitante",againstHome:"Corners_Visitante",againstAway:"Corners_Local"},
 {type:"defense",title:"Defensa",icon:"🛡️"},
 {key:"shotsAgainst",label:"Remates totales en contra",icon:"⚽",againstOnly:true,forHome:"Tiros_Totales_Visitante",forAway:"Tiros_Totales_Local",decimals:1},
 {key:"sotAgainst",label:"Remates a puerta en contra",icon:"🥅",againstOnly:true,forHome:"Tiros_Puerta_Visitante",forAway:"Tiros_Puerta_Local",decimals:1},
 {key:"goalsAgainst",label:"Goles en contra",icon:"⚽",againstOnly:true,forHome:"Goles_Visitante",forAway:"Goles_Local",decimals:1},
 {key:"xga",label:"Goles esperados en contra (xGA)",icon:"📉",againstOnly:true,forHome:"Goles_Esperados_Visitante",forAway:"Goles_Esperados_Local",decimals:2},
 {key:"cornersAgainst",label:"Córners en contra",icon:"🚩",againstOnly:true,forHome:"Corners_Visitante",forAway:"Corners_Local",decimals:1},
 {type:"discipline",title:"Disciplina",icon:"🟨"},
 {key:"fouls",label:"Faltas cometidas",icon:"👟",forHome:"Faltas_Local",forAway:"Faltas_Visitante",againstHome:"Faltas_Visitante",againstAway:"Faltas_Local"},
 {key:"yellow",label:"Tarjetas amarillas",icon:"🟨",forHome:"Amarillas_Local",forAway:"Amarillas_Visitante",againstHome:"Amarillas_Visitante",againstAway:"Amarillas_Local"},
 {key:"red",label:"Tarjetas rojas",icon:"🟥",forHome:"Rojas_Local",forAway:"Rojas_Visitante",againstHome:"Rojas_Visitante",againstAway:"Rojas_Local"}
];
function parseDate(v){if(!v)return null;if(v instanceof Date)return v;const s=String(v).trim();let m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);let d;if(m)d=new Date(+m[3],+m[1]-1,+m[2],12);else d=new Date(s);return Number.isNaN(d.getTime())?null:d;}
function dateLabel(v){const d=parseDate(v);return d?d.toLocaleDateString("es-HN",{day:"2-digit",month:"short",year:"numeric"}).replace(/\./g,""):safe(v||"Fecha desconocida");}
function sortRecent(arr){return arr.slice().sort((a,b)=>(parseDate(b.Fecha)?.getTime()||0)-(parseDate(a.Fecha)?.getTime()||0));}
function normalizeTeamName(name){
 return String(name||"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase()
  .replace(/[^a-z0-9]+/g," ").trim()
  .replace(/^(fc|cf|afc|sc|rcd|ac|as|club) /,"")
  .replace(/ (fc|cf|afc|sc|rcd|ac|as)$/,"");
}
function teamId(name){
 if(teamIds[name]) return teamIds[name];
 const target=normalizeTeamName(name);
 const entry=Object.entries(teamIds).find(([label])=>normalizeTeamName(label)===target);
 return entry?entry[1]:null;
}
function teamLogo(name){const id=teamId(name);return id?`https://crests.football-data.org/${id}.png`:"";}
function leagueLogo(name){const code=leagueCodes[name];return code?`https://crests.football-data.org/${code}.png`:"";}
function initials(name){return String(name||"?").split(/\\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase();}
function crestHTML(name,cls=""){
 const url=teamLogo(name);
 if(!url)return `<span class="mini-fallback ${cls}">${safe(initials(name))}</span>`;
 return `<img class="${cls} team-crest" src="${url}" data-crest-id="${teamId(name)}" alt="Escudo de ${safe(name)}" loading="lazy" onerror="crestFallback(this)">`;
}
function crestFallback(img){
 if(!img)return;
 if(img.dataset.crestId && !img.dataset.triedSvg){
  img.dataset.triedSvg="1";
  img.src=`https://crests.football-data.org/${img.dataset.crestId}.svg`;
  return;
 }
 const fallback=document.createElement("span");
 fallback.className="mini-fallback";
 fallback.textContent=initials(img.alt.replace(/^Escudo de /,""));
 img.replaceWith(fallback);
}
function teamMatches(team,league=""){return sortRecent(matches.filter(m=>(m.Equipo_Local===team||m.Equipo_Visitante===team)&&(!league||m.Liga===league)&& (selectedLocation==="all"||(selectedLocation==="home"?m.Equipo_Local===team:m.Equipo_Visitante===team))));}
function selectedLeague(){return $("leagueSelect").value||"";}
function selectedTeam(){return $("teamSelect").value||"";}
function selectedGames(){return teamMatches(selectedTeam(),selectedLeague()).slice(0,5);}
function statValue(m,team,row){const home=m.Equipo_Local===team;const key=home?row.forHome:row.forAway;return key?n(m[key]):null;}
function avg(vals){const v=vals.filter(x=>x!==null&&Number.isFinite(x));return v.length?v.reduce((a,b)=>a+b,0)/v.length:null;}
function fmt(v,dec=0){return v===null||v===undefined?"—":Number(v).toFixed(dec);}
function matchScore(m,team){return m.Equipo_Local===team?`${fmt(n(m.Goles_Local))} – ${fmt(n(m.Goles_Visitante))}`:`${fmt(n(m.Goles_Visitante))} – ${fmt(n(m.Goles_Local))}`;}
function getOpponent(m,team){return m.Equipo_Local===team?m.Equipo_Visitante:m.Equipo_Local;}
function getResult(m,team){const own=n(m.Equipo_Local===team?m.Goles_Local:m.Goles_Visitante),opp=n(m.Equipo_Local===team?m.Goles_Visitante:m.Goles_Local);if(own===null||opp===null)return {label:"—",cls:"result-draw"};return own>opp?{label:"G",cls:"result-win"}:own<opp?{label:"P",cls:"result-loss"}:{label:"E",cls:"result-draw"};}
function setImg(img,url,fallback){if(!img)return;img.classList.remove("loaded");img.onerror=()=>{img.style.display="none";if(fallback)fallback.style.display="grid";};img.onload=()=>{img.classList.add("loaded");if(fallback)fallback.style.display="none";};img.src=url||"";if(!url){img.style.display="none";if(fallback)fallback.style.display="grid";}else img.style.display="block";}
function fillSelectors(){const oldLeague=selectedLeague(),oldTeam=selectedTeam();const leagues=[...new Set(matches.map(m=>m.Liga).filter(Boolean))].sort();$("leagueSelect").innerHTML='<option value="">Todas las ligas</option>'+leagues.map(l=>`<option value="${safe(l)}">${safe(l)}</option>`).join("");if(leagues.includes(oldLeague))$("leagueSelect").value=oldLeague;let teams=[...new Set(matches.filter(m=>!selectedLeague()||m.Liga===selectedLeague()).flatMap(m=>[m.Equipo_Local,m.Equipo_Visitante]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));$("teamSelect").innerHTML='<option value="">Selecciona equipo</option>'+teams.map(t=>`<option value="${safe(t)}">${safe(t)}</option>`).join("");if(teams.includes(oldTeam))$("teamSelect").value=oldTeam;else if(teams.length)$("teamSelect").value=teams[0];}
function renderProfile(games){const team=selectedTeam(),league=selectedLeague()||(games[0]?.Liga||"");$("teamName").textContent=team||"Selecciona un equipo";$("leagueName").textContent=league||"Selecciona una liga para comenzar";const tLogo=$("teamLogo"),tFallback=$("teamLogoFallback"),tUrl=teamLogo(team);tLogo.onerror=()=>{tLogo.style.display="none";if(tFallback)tFallback.style.display="grid";};tLogo.onload=()=>{tLogo.style.display="block";if(tFallback)tFallback.style.display="none";};tLogo.src=tUrl||"";if(!tUrl){tLogo.style.display="none";if(tFallback){tFallback.textContent=initials(team)||"⚽";tFallback.style.display="grid";}}const lImg=$("leagueLogo"),lFallback=$("leagueFallback");setImg(lImg,leagueLogo(league),lFallback);const goals=games.map(m=>n(m.Equipo_Local===team?m.Goles_Local:m.Goles_Visitante)).filter(v=>v!==null),shots=games.map(m=>n(m.Equipo_Local===team?m.Tiros_Totales_Local:m.Tiros_Totales_Visitante)).filter(v=>v!==null);$("teamGoals").textContent=goals.reduce((a,b)=>a+b,0);$("teamShots").textContent=fmt(avg(shots),1);$("teamPlayed").textContent=`${games.length}/5`;}
function marketValue(m,market,team){
 const home=m.Equipo_Local===team;
 const ownGoals=n(home?m.Goles_Local:m.Goles_Visitante);
 const oppGoals=n(home?m.Goles_Visitante:m.Goles_Local);
 const ownShots=n(home?m.Tiros_Totales_Local:m.Tiros_Totales_Visitante);
 const oppShots=n(home?m.Tiros_Totales_Visitante:m.Tiros_Totales_Local);
 const ownSot=n(home?m.Tiros_Puerta_Local:m.Tiros_Puerta_Visitante);
 const oppSot=n(home?m.Tiros_Puerta_Visitante:m.Tiros_Puerta_Local);
 const sum=(a,b)=>a!==null&&b!==null?a+b:null;
 if(market==="teamShots")return ownShots;
 if(market==="opponentShots")return oppShots;
 if(market==="teamSot")return ownSot;
 if(market==="opponentSot")return oppSot;
 if(market==="teamGoals")return ownGoals;
 if(market==="opponentGoals")return oppGoals;
 if(market==="goals")return sum(ownGoals,oppGoals);
 if(market==="btts")return ownGoals!==null&&oppGoals!==null?(ownGoals>0&&oppGoals>0?1:0):null;
 const fields={shots:["Tiros_Totales_Local","Tiros_Totales_Visitante"],sot:["Tiros_Puerta_Local","Tiros_Puerta_Visitante"],corners:["Corners_Local","Corners_Visitante"]}[market]||[];
 const values=fields.map(k=>n(m[k]));
 return values.length&&values.every(v=>v!==null)?values.reduce((a,b)=>a+b,0):null;
}
function marketLabel(market){
 return ({teamShots:"remates totales del equipo seleccionado",opponentShots:"remates totales del rival",shots:"remates totales del partido",teamSot:"remates a puerta del equipo seleccionado",opponentSot:"remates a puerta del rival",sot:"remates a puerta del partido",teamGoals:"goles del equipo seleccionado",opponentGoals:"goles del rival",goals:"goles totales del partido",btts:"ambos equipos marcan",corners:"córners totales del partido"})[market]||"mercado";
}
function renderCompliance(){
 const panel=$("compliancePanel");if(!panel)return;
 const team=selectedTeam(),games=selectedGames(),market=$("marketSelect").value||"teamShots",line=n($("marketLine").value),isBtts=market==="btts";
 if(!team){$("complianceContent").innerHTML='<p class="empty">Selecciona un equipo para calcular el cumplimiento de línea.</p>';return;}
 const vals=games.map(m=>({match:m,value:marketValue(m,market,team)})).filter(x=>x.value!==null);
 if(!isBtts&&(line===null||line<0)){$("complianceContent").innerHTML='<p class="empty">Introduce una línea válida.</p>';return;}
 if(!vals.length){$("complianceContent").innerHTML='<p class="empty">No hay valores numéricos suficientes para este mercado.</p>';return;}
 const hits=vals.filter(x=>isBtts?x.value===1:x.value>line).length;
 const rate=Math.round(hits/vals.length*100),average=avg(vals.map(x=>x.value)),margin=isBtts?null:average-line;
 let verdict=isBtts
  ? (rate>=80?"Ambos marcaron en la mayoría de los partidos de esta muestra.":rate>=60?"La frecuencia de ambos marcan es mixta en esta muestra.":"Ambos marcaron en pocos partidos de esta muestra.")
  : (rate>=80?"La línea se superó con frecuencia en esta muestra.":rate>=60?"La muestra ofrece una señal mixta; conviene revisar cada partido.":"La línea se superó pocas veces en esta muestra.");
 if(vals.length<5)verdict+=` Solo hay ${vals.length} partidos con datos válidos.`;
 const list=vals.map(({match,value})=>{
  const home=match.Equipo_Local===team;
  const own=n(home?match.Goles_Local:match.Goles_Visitante),opp=n(home?match.Goles_Visitante:match.Goles_Local);
  const hit=isBtts?value===1:value>line;
  const display=isBtts?`${fmt(n(match.Goles_Local))}-${fmt(n(match.Goles_Visitante))} · ${hit?"Sí":"No"}`:fmt(value,0);
  return `<div class="compliance-match"><span>${safe(dateLabel(match.Fecha))} · ${safe(match.Equipo_Local)} ${fmt(n(match.Goles_Local))}-${fmt(n(match.Goles_Visitante))} ${safe(match.Equipo_Visitante)}<small class="market-detail">${safe(team)} (${home?"local":"visitante"}) · ${safe(marketLabel(market))}</small></span><b class="${hit?'hit':'miss'}">${display} ${hit?'✓':'×'}</b></div>`;
 }).join("");
 const averageLabel=isBtts?"Partidos con ambos marcando":"Promedio de la selección";
 const averageValue=isBtts?`${hits}/${vals.length}`:fmt(average,1);
 const secondSmall=isBtts?"Frecuencia observada en la muestra":`Línea: ${fmt(line,1)} · Diferencia: ${margin>=0?'+':''}${fmt(margin,1)}`;
 $("complianceContent").innerHTML=`<div class="compliance-summary"><div><span class="muted-label">Cumplimiento histórico</span><strong>${hits}/${vals.length}</strong><small>${rate}% de la muestra</small></div><div><span class="muted-label">${averageLabel}</span><strong>${averageValue}</strong><small>${secondSmall}</small></div></div><div class="progress-track"><div class="progress-fill" style="width:${rate}%"></div></div><p class="smart-note"><b>Lectura automática:</b> ${verdict} Se evalúa ${safe(marketLabel(market))}; el porcentaje resume solo los partidos visibles, no garantiza el próximo encuentro.</p><div class="compliance-list">${list}</div>`;
}
function renderCards(games){const team=selectedTeam(),out=$("recentCards");if(!team){out.innerHTML='<div class="loading-card">Selecciona un equipo para ver sus partidos.</div>';return;}if(!games.length){out.innerHTML='<div class="loading-card">No encontramos partidos del equipo con estos filtros.</div>';return;}out.innerHTML=games.map((m,i)=>{const opp=getOpponent(m,team),res=getResult(m,team),home=m.Equipo_Local===team;return `<article class="match-card ${res.cls}"><div class="match-date"><span>${dateLabel(m.Fecha)}</span><span class="ordinal">P${i+1}</span></div><div class="match-teams"><div class="mini-team">${crestHTML(home?team:opp)}<span>${safe(home?team:opp)}</span></div><strong class="match-score">${matchScore(m,team)}</strong><div class="mini-team">${crestHTML(home?opp:team)}<span>${safe(home?opp:team)}</span></div></div><span class="match-status">${res.label} · ${home?"Local":"Visitante"}</span></article>`;}).join("");}
function headerMatch(m,team,i){const opp=getOpponent(m,team),home=m.Equipo_Local===team;return `<div class="match-head">${crestHTML(opp)}<div><b><span class="match-index">P${i+1}</span>${dateLabel(m.Fecha)}</b><small>vs ${safe(opp)} (${home?"L":"V"})</small></div></div>`;}
function renderTable(games){const team=selectedTeam(),head=$("statsHead"),body=$("statsBody");if(!team){head.innerHTML="";body.innerHTML='<tr><td class="empty">Selecciona un equipo.</td></tr>';return;}head.innerHTML=`<tr><th>ESTADÍSTICA</th>${games.map((m,i)=>`<th>${headerMatch(m,team,i)}</th>`).join("")}<th>PROMEDIO<br><small>(${games.length} partidos)</small></th></tr>`;if(!games.length){body.innerHTML='<tr><td colspan="7" class="empty">No hay partidos disponibles con este filtro.</td></tr>';return;}body.innerHTML=statRows.map(row=>{if(row.type)return `<tr class="category-row ${row.type}"><td colspan="${games.length+2}">${row.icon} &nbsp; ${row.title}</td></tr>`;const vals=games.map(m=>statValue(m,team,row)),dec=row.decimals??0,average=avg(vals);return `<tr><td><span class="stat-label"><span class="stat-emoji">${row.icon}</span>${row.label}</span></td>${vals.map(v=>`<td>${fmt(v,dec)}</td>`).join("")}<td class="average-cell">${fmt(average,dec)}</td></tr>`;}).join("");}
function renderAll(){const games=selectedGames();renderProfile(games);renderCards(games);renderTable(games);renderCompliance();}
function loadData(){return new Promise((resolve,reject)=>{const cb="footballStatsUI_"+Date.now(),script=document.createElement("script");let finished=false;const timeout=setTimeout(()=>finish(new Error("Tiempo de espera agotado al conectar con Google Sheets.")),20000);function finish(err,payload){if(finished)return;finished=true;clearTimeout(timeout);delete window[cb];script.remove();if(err)return reject(err);if(!payload||payload.ok!==true||!Array.isArray(payload.data))return reject(new Error(payload?.error||"La API no devolvió datos válidos."));resolve(payload.data);}window[cb]=payload=>finish(null,payload);script.onerror=()=>finish(new Error("No se pudo cargar Apps Script. Revisa la URL /exec y los permisos."));script.src=API_URL+(API_URL.includes("?")?"&":"?")+"callback="+encodeURIComponent(cb)+"&_="+Date.now();document.body.appendChild(script);});}
async function refreshData(){const status=$("dataStatus");status.textContent="Conectando datos…";try{matches=await loadData();status.textContent=`Google Sheets conectado · ${matches.length} partidos`;status.parentElement.classList.remove("error");fillSelectors();renderAll();}catch(err){console.error("Error al cargar partidos:",err);status.textContent="Error de conexión";status.parentElement.classList.add("error");$("recentCards").innerHTML=`<div class="loading-card">${safe(err.message)}<br>Comprueba la implementación de Apps Script.</div>`;$("statsBody").innerHTML=`<tr><td class="empty">${safe(err.message)}</td></tr>`;}}
$("leagueSelect").addEventListener("change",()=>{fillSelectors();renderAll();});$("teamSelect").addEventListener("change",renderAll);$("marketSelect").addEventListener("change",()=>{
 const market=$("marketSelect").value;
 const defaults={teamShots:10.5,opponentShots:10.5,shots:20.5,teamSot:3.5,opponentSot:3.5,sot:7.5,teamGoals:0.5,opponentGoals:0.5,goals:2.5,corners:8.5};
 if(market!=="btts"&&defaults[market]!==undefined)$("marketLine").value=defaults[market];
 const lineLabel=$("marketLine").closest("label");
 if(lineLabel)lineLabel.style.display=market==="btts"?"none":"grid";
 renderCompliance();
});$("marketLine").addEventListener("input",renderCompliance);document.querySelectorAll("[data-location]").forEach(btn=>btn.addEventListener("click",()=>{selectedLocation=btn.dataset.location;document.querySelectorAll("[data-location]").forEach(b=>b.classList.toggle("active",b===btn));renderAll();}));$("year").textContent=new Date().getFullYear();refreshData();
