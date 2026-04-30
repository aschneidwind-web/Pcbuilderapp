/* eslint-disable */
// Legacy prototype logic (as-is). We'll incrementally refactor this into React.

const C={
  cpu:{label:"CPU",ib:'#E6F1FB',ic:'#185FA5',hasPM:true,icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
    opts:[{n:"Ryzen 5 7600X",s:"6-core · 4.7GHz · AM5",p:229,sk:"AM5",pm:25140},{n:"Ryzen 7 7800X3D",s:"8-core · 4.5GHz · AM5",p:449,sk:"AM5",pm:33180},{n:"Core i5-14600K",s:"14-core · 3.5GHz · LGA1700",p:289,sk:"LGA1700",pm:28900},{n:"Core i7-14700K",s:"20-core · 3.4GHz · LGA1700",p:389,sk:"LGA1700",pm:38200},{n:"Core i9-14900K",s:"24-core · 3.2GHz · LGA1700",p:549,sk:"LGA1700",pm:48500}]},
  gpu:{label:"GPU",ib:'#FCEBEB',ic:'#A32D2D',hasPM:true,icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="20" height="12" rx="2"/><circle cx="8" cy="13" r="2"/><circle cx="16" cy="13" r="2"/><path d="M6 7V4M10 7V4M14 7V4M18 7V4"/></svg>',
    opts:[{n:"RTX 4060",s:"8GB GDDR6 · 1080p",p:299,pm:18900},{n:"RTX 4070 Super",s:"12GB GDDR6X · 1440p",p:599,pm:28700},{n:"RTX 4080 Super",s:"16GB GDDR6X · 4K",p:999,pm:38500},{n:"RX 7600",s:"8GB GDDR6 · 1080p",p:269,pm:16400},{n:"RX 7900 XTX",s:"24GB GDDR6 · 4K",p:879,pm:34200}]},
  motherboard:{label:"Motherboard",ib:'#EAF3DE',ic:'#3B6D11',hasPM:false,icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="4" height="4"/><rect x="13" y="7" width="4" height="4"/><line x1="7" y1="15" x2="17" y2="15"/><line x1="7" y1="18" x2="17" y2="18"/></svg>',
    opts:[{n:"ASUS ROG B650E-F",s:"AM5 · DDR5 · ATX",p:299,sk:"AM5",vrs:4,feat:"WiFi 6E, PCIe 5.0, 14+2 VRM"},{n:"MSI MAG B650 Tomahawk",s:"AM5 · DDR5 · ATX",p:199,sk:"AM5",vrs:4,feat:"WiFi 6E, PCIe 4.0, 12+2 VRM"},{n:"ASUS ROG Maximus Z790",s:"LGA1700 · DDR5 · ATX",p:499,sk:"LGA1700",vrs:5,feat:"WiFi 6E, PCIe 5.0, 20+1 VRM"},{n:"MSI PRO Z790-A WiFi",s:"LGA1700 · DDR5 · ATX",p:249,sk:"LGA1700",vrs:5,feat:"WiFi 6, PCIe 5.0, 16+1+1 VRM"},{n:"Gigabyte B760M DS3H",s:"LGA1700 · DDR4 · mATX",p:109,sk:"LGA1700",vrs:4,feat:"No WiFi, PCIe 4.0, 8+2+1 VRM"}]},
  ram:{label:"RAM",ib:'#EEEDFE',ic:'#534AB7',hasPM:false,icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="7" width="18" height="10" rx="1"/><line x1="7" y1="7" x2="7" y2="17"/><line x1="11" y1="7" x2="11" y2="17"/><line x1="15" y1="7" x2="15" y2="17"/><line x1="3" y1="12" x2="21" y2="12"/></svg>',
    opts:[{n:"Corsair Vengeance 16GB",s:"DDR5-5600 · 2×8GB",p:79,mhz:5600,gb:16},{n:"G.Skill Trident Z5 32GB",s:"DDR5-6000 · 2×16GB",p:119,mhz:6000,gb:32},{n:"Kingston Fury 64GB",s:"DDR5-5200 · 2×32GB",p:199,mhz:5200,gb:64},{n:"TeamGroup T-Force 16GB",s:"DDR5-5200 · 2×8GB",p:65,mhz:5200,gb:16}]},
  storage:{label:"Storage",ib:'#E1F5EE',ic:'#0F6E56',hasPM:false,icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="16" cy="12" r="2"/><line x1="6" y1="12" x2="10" y2="12"/></svg>',
    opts:[{n:"Samsung 970 Evo 1TB",s:"NVMe Gen3 · 1TB",p:89,read:3500,tb:1},{n:"WD Black SN850X 2TB",s:"NVMe Gen4 · 2TB",p:179,read:7300,tb:2},{n:"Seagate Barracuda 4TB",s:"HDD · 4TB",p:69,read:220,tb:4},{n:"Sabrent Rocket 4 Plus 1TB",s:"NVMe Gen4 · 1TB",p:109,read:7000,tb:1},{n:"Samsung 990 Pro 2TB",s:"NVMe Gen4 · 2TB",p:159,read:7450,tb:2}]},
  psu:{label:"PSU",ib:'#FAEEDA',ic:'#854F0B',hasPM:false,icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M13 10l-2 4h4l-2 4"/></svg>',
    opts:[{n:"Corsair RM750x",s:"750W · 80+ Gold · Modular",p:119,watts:750},{n:"EVGA SuperNOVA 850 G6",s:"850W · 80+ Gold · Modular",p:149,watts:850},{n:"Seasonic Focus GX-1000",s:"1000W · 80+ Gold · Modular",p:189,watts:1000},{n:"be quiet! Pure Power 650W",s:"650W · 80+ Gold · Modular",p:89,watts:650}]},
  case:{label:"Case",ib:'#F1EFE8',ic:'#5F5E5A',hasPM:false,icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><circle cx="12" cy="17" r="1"/></svg>',
    opts:[{n:"Lian Li Lancool 216",s:"Mid-tower · ATX · Mesh",p:109},{n:"Fractal Design Torrent",s:"Mid-tower · ATX · Airflow",p:189},{n:"NZXT H510",s:"Mid-tower · ATX · Glass",p:89},{n:"Corsair 4000D Airflow",s:"Mid-tower · ATX · Mesh",p:104}]},
};
const TIERS=[{name:"Entry level",color:"#8E8E93",min:0,desc:"Good for web browsing, office work, and light gaming at 1080p on low settings."},{name:"Capable",color:"#FF9500",min:18000,desc:"Handles 1080p gaming, everyday multitasking, and light content creation comfortably."},{name:"Mid-range",color:"#0A84FF",min:28000,desc:"Solid 1440p gaming, smooth multitasking, and video editing up to 1080p."},{name:"Enthusiast",color:"#34C759",min:42000,desc:"Excels at 4K gaming, professional video editing, 3D rendering, and heavy workloads."},{name:"Beast",color:"#BF5AF2",min:60000,desc:"Top-tier. Handles 4K gaming, AI/ML workloads, and real-time 3D without breaking a sweat."}];
function getLabel(sc,th,lb){for(let i=th.length-1;i>=0;i--){if(sc>=th[i])return lb[i+1];}return lb[0];}
const CATS=[{id:"g1080",label:"1080p gaming",ib:'#E6F1FB',ic:'#185FA5',bar:'#0A84FF',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',score:s=>Math.min(100,Math.round((s.gpu/38500)*100)),thresholds:[30,60,80],labels:['Struggling','Playable','High','Ultra']},{id:"g1440",label:"1440p gaming",ib:'#EEEDFE',ic:'#534AB7',bar:'#534AB7',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',score:s=>Math.min(100,Math.round((s.gpu/38500)*80)),thresholds:[30,55,75],labels:['Struggling','Playable','High','Ultra']},{id:"video",label:"Video editing",ib:'#FCEBEB',ic:'#A32D2D',bar:'#FF3B30',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',score:s=>Math.min(100,Math.round((s.cpu/48500)*100)),thresholds:[30,55,80],labels:['Basic','1080p','4K capable','Pro 4K']},{id:"multi",label:"Multitasking",ib:'#EAF3DE',ic:'#3B6D11',bar:'#34C759',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',score:s=>Math.min(100,Math.round((s.cpu/48500)*100)),thresholds:[30,55,80],labels:['Light','Moderate','Heavy','Extreme']},{id:"stream",label:"Streaming",ib:'#FAEEDA',ic:'#854F0B',bar:'#FF9500',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',score:s=>Math.min(100,Math.round(((s.cpu/48500)+(s.gpu/38500))/2*100)),thresholds:[30,55,80],labels:['720p','1080p','1080p60','4K stream']},{id:"aiml",label:"AI / ML",ib:'#E1F5EE',ic:'#0F6E56',bar:'#1D9E75',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>',score:s=>Math.min(100,Math.round((s.gpu/38500)*100)),thresholds:[25,50,75],labels:['Not suited','Entry','Capable','Serious']}];
function bStyle(sc,th){if(sc>=th[2])return{bg:'#EAF3DE',c:'#3B6D11'};if(sc>=th[1])return{bg:'#E6F1FB',c:'#185FA5'};if(sc>=th[0])return{bg:'#FAEEDA',c:'#854F0B'};return{bg:'#F1EFE8',c:'#5F5E5A'};}

const YT_DEF=[{id:'UCXuqSBlHAE6Xw-yeJA0Tunw',name:'Linus Tech Tips'},{id:'UCTzLRZUgelatKZ4nyIKcAbg',name:'Hardware Unboxed'},{id:'UC0vBXGSyV14uvJ4hECDOl0Q',name:'Techquickie'},{id:'UCNUYwNznn-ZuFaHKBnBfXOQ',name:'JayzTwoCents'}];
const COLS=['#0A84FF','#34C759','#FF9500','#BF5AF2','#FF3B30','#1D9E75','#FF6B35','#007AFF'];
const NAMES=['Alex K.','Jordan M.','Sam T.','Riley P.','Casey W.','Morgan L.'];
const SAMPLE_BUILDS=[{id:'sb1',user:'Alex K.',avatar:0,time:'2h ago',buildName:'Budget 1080p Beast',caption:'First build! Under $900.',total:849,tier:{name:'Capable',color:'#FF9500'},components:[{n:'Core i5-14600K'},{n:'RTX 4060'},{n:'MSI PRO Z790-A WiFi'},{n:'Corsair Vengeance 16GB'}],likes:24},{id:'sb2',user:'Jordan M.',avatar:1,time:'5h ago',buildName:'1440p Workstation',caption:'Great for gaming and video editing.',total:1489,tier:{name:'Enthusiast',color:'#34C759'},components:[{n:'Ryzen 7 7800X3D'},{n:'RTX 4070 Super'},{n:'G.Skill Trident Z5 32GB'},{n:'WD Black SN850X 2TB'}],likes:61},{id:'sb3',user:'Sam T.',avatar:2,time:'1d ago',buildName:'The Silent Beast',caption:'Noise levels were the priority.',total:1240,tier:{name:'Mid-range',color:'#0A84FF'},components:[{n:'Core i7-14700K'},{n:'RTX 4070 Super'},{n:'Seasonic Focus GX-1000'}],likes:38}];

let sel={cpu:null,gpu:null,motherboard:null,ram:null,storage:null,psu:null,case:null};
let saves=[];let cmpCat='cpu';let sortMode='value';let communityFilter='all';let savedBuildName='';
let ytKey='';let channels=[...YT_DEF];let alikes={};let acmts={};
let sharedBuilds=[...SAMPLE_BUILDS];let user=null;let notifTimer=null;

try{
  saves=JSON.parse(localStorage.getItem('pcb11_s')||'[]');
  ytKey=localStorage.getItem('pcb11_yt')||'';
  const ch=localStorage.getItem('pcb11_ch');if(ch)channels=JSON.parse(ch);
  alikes=JSON.parse(localStorage.getItem('pcb11_al')||'{}');
  acmts=JSON.parse(localStorage.getItem('pcb11_ac')||'{}');
  const u=localStorage.getItem('pcb11_user');if(u)user=JSON.parse(u);
  const sb=localStorage.getItem('pcb11_sb');if(sb)sharedBuilds=[...JSON.parse(sb),...SAMPLE_BUILDS];
}catch(e){}

function persist(){
  try{
    localStorage.setItem('pcb11_s',JSON.stringify(saves));
    localStorage.setItem('pcb11_yt',ytKey);
    localStorage.setItem('pcb11_ch',JSON.stringify(channels));
    localStorage.setItem('pcb11_al',JSON.stringify(alikes));
    localStorage.setItem('pcb11_ac',JSON.stringify(acmts));
    if(user)localStorage.setItem('pcb11_user',JSON.stringify(user));
  }catch(e){}
}


function showNotif(msg){
  const el=document.getElementById('notif');el.textContent=msg;el.classList.add('show');
  clearTimeout(notifTimer);notifTimer=setTimeout(()=>el.classList.remove('show'),2000);
}

function openSlide(id){document.getElementById(id).classList.add('open');}
function closeSlide(id){document.getElementById(id).classList.remove('open');}

function goPage(name){
  // Close any open slide/modal when switching tabs
  document.querySelectorAll('.slide.open').forEach(s=>s.classList.remove('open'));
  document.getElementById('share-modal-bg')?.classList.remove('open');

  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.getElementById('pg-'+name).classList.add('active');
  document.getElementById('t-'+name).classList.add('on');
  if(name==='community')renderCommunity();
  if(name==='compare'){buildDropdown();renderCompare();}
  if(name==='saves')renderSaves();
  if(name==='account')renderAccount();
}

function tiles(){
  const g=document.getElementById('tile-grid');g.innerHTML='';
  const addSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  const chkSvg='<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="2,6 5,9 10,3"/></svg>';
  const chevSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>';
  Object.entries(C).forEach(([k,comp])=>{
    const v=sel[k];const d=document.createElement('div');d.className='comp-row';d.onclick=()=>openPicker(k);
    d.innerHTML=`
      <div class="comp-icon" style="background:${comp.ib};color:${comp.ic};">${comp.icon}</div>
      <div class="comp-info">
        <div class="comp-cat">${comp.label}</div>
        ${v?`<div class="comp-name">${v.n}</div><div class="comp-spec">${v.s}</div>`:''}
      </div>
      <div class="comp-right">
        ${v?`<span class="comp-price">$${v.p}</span>`:''}
        ${v?`<div class="comp-done">${chkSvg}</div>`:`<div class="comp-add">${addSvg}</div>`}
        <div class="comp-chev">${chevSvg}</div>
      </div>`;
    g.appendChild(d);
  });
}
function totals(){
  let t=0;Object.values(sel).forEach(v=>{if(v)t+=v.p;});
  document.getElementById('total-amt').textContent='$'+t.toLocaleString();
  const n=Object.values(sel).filter(Boolean).length;
  document.getElementById('build-sub').textContent=n+' / 7';
  const pf=document.getElementById('prog-fill');if(pf)pf.style.width=Math.round((n/7)*100)+'%';
  const cpu=sel.cpu,mb=sel.motherboard,pill=document.getElementById('cpill');
  if(cpu&&mb){pill.style.display='inline-block';if(cpu.sk&&mb.sk&&cpu.sk!==mb.sk){pill.textContent='Socket mismatch';pill.className='pill pill-err';}else{pill.textContent='Compatible';pill.className='pill pill-ok';}}
  else pill.style.display='none';
  updateQuickScore();
}
function openPicker(slot){
  document.getElementById('picker-title').textContent=C[slot].label;
  const body=document.getElementById('picker-body');body.innerHTML='';
  let mx=0;C[slot].opts.forEach(o=>{if(o.pm){const v=Math.round(o.pm/o.p);if(v>mx)mx=v;}});
  C[slot].opts.forEach(o=>{
    const isSel=sel[slot]===o;const ptp=o.pm?Math.round(o.pm/o.p):null;
    const row=document.createElement('div');row.className='opt-row'+(isSel?' on':'');
    row.innerHTML=`<div style="flex:1;min-width:0;"><div class="opt-name">${o.n}${ptp&&ptp===mx?'<span class="bv">best value</span>':''}</div><div class="opt-spec">${o.s}</div></div><div class="opt-r"><span class="opt-price">$${o.p}</span>${ptp?`<span class="opt-pts">${ptp} pts/$</span>`:''}</div>${isSel?'<span class="opt-chk">✓</span>':''}`;
    row.onclick=()=>{sel[slot]=o;closeSlide('picker-screen');tiles();totals();};
    body.appendChild(row);
  });
  openSlide('picker-screen');
}
function bView(v,btn){
  document.getElementById('v-grid').style.display=v==='grid'?'block':'none';
  document.getElementById('v-summary').style.display=v==='summary'?'block':'none';
  document.querySelectorAll('#pg-build .seg-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
  if(v==='summary')renderSummary();
}

function renderSummary(){
  const el=document.getElementById('v-summary');const items=Object.entries(sel).filter(([k,v])=>v);const cpu=sel.cpu,gpu=sel.gpu;
  let h='<div class="sp">';
  if(!items.length){h+=`<div class="empty-state"><div class="empty-title">Nothing selected yet</div>Head to Components to start building.</div>`;el.innerHTML=h+'</div>';return;}
  h+=`<div class="sec-hdr">Components</div>`;
  items.forEach(([k,v])=>{const comp=C[k];h+=`<div class="sum-row" onclick="openPicker('${k}')"><div class="sum-icon" style="background:${comp.ib};color:${comp.ic};">${comp.icon}</div><div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:500;color:var(--t1);">${v.n}</div><div style="font-size:11px;color:var(--t2);margin-top:1px;">${v.s}</div></div><div style="font-size:13px;font-weight:500;color:var(--t1);flex-shrink:0;">$${v.p}</div></div>`;});
  h+='</div>';
  if(cpu||gpu){
    const sc={cpu:cpu?cpu.pm:0,gpu:gpu?gpu.pm:0};const combined=Math.round(sc.cpu*0.45+sc.gpu*0.55);
    let tier=TIERS[0];for(let i=TIERS.length-1;i>=0;i--){if(combined>=TIERS[i].min){tier=TIERS[i];break;}}
    const pct=Math.min(100,Math.round((combined/80000)*100));const circ=Math.round(pct*1.885);
    h+=`<div style="padding:0 16px;"><div class="sec-hdr">Build report</div><div class="bench-hero"><div class="tier-row"><div><div class="tier-name" style="color:${tier.color};">${tier.name}</div><div class="tier-sub">Score: ${combined.toLocaleString()}</div></div><div class="ring-wrap"><svg width="68" height="68" viewBox="0 0 68 68"><circle cx="34" cy="34" r="28" fill="none" stroke="var(--bd)" stroke-width="5"/><circle cx="34" cy="34" r="28" fill="none" stroke="${tier.color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${circ} 175.9" transform="rotate(-90 34 34)"/></svg><div class="ring-pct">${pct}%</div></div></div><div class="tier-desc">${tier.desc}</div></div><div class="cat-grid">`;
    CATS.forEach(cat=>{const score=cat.score(sc);const lbl=getLabel(score,cat.thresholds,cat.labels);const bdg=bStyle(score,cat.thresholds);h+=`<div class="cat-card"><div class="cat-top"><div class="cat-ico" style="background:${cat.ib};color:${cat.ic};">${cat.icon}</div><span class="cat-badge" style="background:${bdg.bg};color:${bdg.c};">${lbl}</span></div><div class="cat-name">${cat.label}</div><div class="btr"><div class="bfill" style="width:${score}%;background:${cat.bar};"></div></div><div class="cat-pct">${score}%</div></div>`;});
    h+=`</div><div class="bk-card"><div class="bk-title">Score breakdown</div>`;
    if(cpu)h+=`<div class="bk-row"><span class="bk-lbl">CPU</span><div class="bk-bw"><div class="bk-b" style="width:${Math.min(100,Math.round((sc.cpu/48500)*100))}%;background:#0A84FF;"></div></div><span class="bk-val">${sc.cpu.toLocaleString()}</span></div>`;
    if(gpu)h+=`<div class="bk-row"><span class="bk-lbl">GPU</span><div class="bk-bw"><div class="bk-b" style="width:${Math.min(100,Math.round((sc.gpu/38500)*100))}%;background:#FF3B30;"></div></div><span class="bk-val">${sc.gpu.toLocaleString()}</span></div>`;
    h+=`<div class="bk-row"><span class="bk-lbl">Combined</span><div class="bk-bw"><div class="bk-b" style="width:${Math.min(100,Math.round((combined/80000)*100))}%;background:#8E8E93;"></div></div><span class="bk-val">${combined.toLocaleString()}</span></div></div>`;
    const ups=[];
    if(!gpu||sc.gpu<18900)ups.push('Add or upgrade your GPU — it has the biggest impact on gaming performance.');
    if(!cpu||sc.cpu<25000)ups.push('A stronger CPU will improve multitasking and workstation performance.');
    if(sel.ram&&sel.ram.n.includes('16GB')&&combined>28000)ups.push('Consider 32GB RAM for heavy workloads at this performance tier.');
    if(!sel.storage||sel.storage.s.includes('HDD'))ups.push('Upgrade to an NVMe SSD for dramatically faster load times.');
    if(ups.length){h+=`<div class="up-card"><div class="up-title">Suggested upgrades</div>`;ups.forEach(u=>h+=`<div class="up-row"><div class="up-dot"></div><div class="up-txt">${u}</div></div>`);h+=`</div>`;}
    h+='</div>';
  }
  el.innerHTML=h;
}
function updateQuickScore(){
  const el=document.getElementById('quick-score');if(!el)return;
  const cpu=sel.cpu,gpu=sel.gpu;
  if(!cpu&&!gpu){el.style.display='none';return;}
  el.style.display='block';
  const sc={cpu:cpu?cpu.pm:0,gpu:gpu?gpu.pm:0};
  const combined=Math.round(sc.cpu*0.45+sc.gpu*0.55);
  let tier=TIERS[0];for(let i=TIERS.length-1;i>=0;i--){if(combined>=TIERS[i].min){tier=TIERS[i];break;}}
  const pct=Math.min(100,Math.round((combined/80000)*100));
  const cats=[CATS[0],CATS[2],CATS[3]];
  const badges=cats.map(cat=>{const score=cat.score(sc);const lbl=getLabel(score,cat.thresholds,cat.labels);const bdg=bStyle(score,cat.thresholds);return`<span class="qs-badge" style="background:${bdg.bg};color:${bdg.c};">${cat.label}: ${lbl}</span>`;}).join('');
  el.innerHTML=`<div class="qs-top"><div><div class="qs-tier" style="color:${tier.color};">${tier.name}</div><div class="qs-meta">Score ${combined.toLocaleString()} · ${pct}% of max</div></div></div><div class="qs-cats">${badges}</div>`;
}
function getTier(){const cpu=sel.cpu,gpu=sel.gpu;if(!cpu&&!gpu)return null;const sc={cpu:cpu?cpu.pm:0,gpu:gpu?gpu.pm:0};const combined=Math.round(sc.cpu*0.45+sc.gpu*0.55);let t=TIERS[0];for(let i=TIERS.length-1;i>=0;i--){if(combined>=TIERS[i].min){t=TIERS[i];break;}}return t;}
function saveBuild(){
  const name=document.getElementById('bname').value.trim()||'My build '+(saves.length+1);
  const total=Object.values(sel).reduce((s,v)=>s+(v?v.p:0),0);
  saves.unshift({name,date:new Date().toLocaleDateString(),total,components:JSON.parse(JSON.stringify(sel))});
  persist();
  savedBuildName=name;
  document.getElementById('bname').value='';
  const title=document.getElementById('build-title');if(title)title.textContent=name;
  const btn=document.getElementById('sbtn');
  if(btn){const prev=btn.innerHTML;btn.innerHTML='✓ Saved';btn.style.background='#34C759';btn.style.borderColor='#34C759';
    setTimeout(()=>{btn.innerHTML=prev;btn.style.background='';btn.style.borderColor='';},1800);}
  showNotif('Build saved!');
}
function openShareModal(){
  const items=Object.values(sel).filter(Boolean);
  if(!items.length){showNotif('Select components first');return;}
  const name=document.getElementById('bname').value.trim()||'My build';
  const total=items.reduce((s,v)=>s+v.p,0);const tier=getTier();
  document.getElementById('share-preview').innerHTML=`<div style="font-size:13px;font-weight:500;color:var(--t1);margin-bottom:3px;">${name}</div><div style="font-size:12px;color:var(--t2);">$${total.toLocaleString()} · ${tier?tier.name:'—'} · ${items.length} components</div>`;
  document.getElementById('share-modal-bg').classList.add('open');
}
function closeShareModal(){document.getElementById('share-modal-bg').classList.remove('open');document.getElementById('share-caption').value='';}
function postBuild(){
  const name=document.getElementById('bname').value.trim()||'My build';
  const caption=document.getElementById('share-caption').value.trim();
  const total=Object.values(sel).filter(Boolean).reduce((s,v)=>s+v.p,0);
  const tier=getTier();const components=Object.values(sel).filter(Boolean).map(v=>({n:v.n}));
  const nm=user?user.name:'You';const ai=user?user.avatarIdx:0;
  const nb={id:'ub'+Date.now(),user:nm,avatar:ai,time:'Just now',buildName:name,caption,total,tier:tier||{name:'Entry level',color:'#8E8E93'},components,likes:0};
  sharedBuilds.unshift(nb);
  try{const my=JSON.parse(localStorage.getItem('pcb11_sb')||'[]');my.unshift(nb);localStorage.setItem('pcb11_sb',JSON.stringify(my));}catch(e){}
  closeShareModal();showNotif('Build shared!');
  if(document.getElementById('pg-community').classList.contains('active'))renderCommunity();
}

function renderCommunity(){
  renderCommunityFilters();
  renderBuilds(document.getElementById('feed-content'));
}
const TIER_GROUPS={budget:['Entry level','Capable'],'mid-range':['Mid-range'],'high-end':['Enthusiast','Beast']};
function renderCommunityFilters(){
  const el=document.getElementById('community-filters');if(!el)return;
  const filters=[{id:'all',label:'All'},{id:'budget',label:'Budget'},{id:'mid-range',label:'Mid-range'},{id:'high-end',label:'High-end'}];
  el.innerHTML=filters.map(f=>`<button class="filter-chip${communityFilter===f.id?' on':''}" onclick="setCommunityFilter('${f.id}')">${f.label}</button>`).join('');
}
function setCommunityFilter(f){communityFilter=f;renderCommunityFilters();renderBuilds(document.getElementById('feed-content'));}
function cloneBuild(id){
  const b=sharedBuilds.find(x=>x.id===id);if(!b)return;
  const fresh={cpu:null,gpu:null,motherboard:null,ram:null,storage:null,psu:null,case:null};
  b.components.forEach(c=>{Object.entries(C).forEach(([slot,cat])=>{const match=cat.opts.find(o=>o.n===c.n);if(match&&!fresh[slot])fresh[slot]=match;});});
  Object.assign(sel,fresh);goPage('build');tiles();totals();showNotif('Build loaded — make it yours!');
}
function renderBuilds(el){
  el.innerHTML='';
  const list=communityFilter==='all'?sharedBuilds:sharedBuilds.filter(b=>b.tier&&(TIER_GROUPS[communityFilter]||[]).includes(b.tier.name));
  if(!list.length){el.innerHTML='<div class="empty-state"><div class="empty-title">No builds here yet</div>Be the first to share one.</div>';return;}
  list.forEach(b=>{
    const liked=alikes['b_'+b.id+'_l']||false;const lc=(alikes['b_'+b.id]||0)+b.likes;
    const cmts=(acmts['b_'+b.id]||[]).length;const col=COLS[b.avatar%COLS.length];
    const comps=b.components.slice(0,4).map(c=>`<span class="bs-comp-pill">${c.n.split(' ').slice(0,2).join(' ')}</span>`).join('');
    const d=document.createElement('div');d.className='build-share-card';
    d.innerHTML=`<div class="bs-hdr"><div class="bs-av" style="background:${col}20;color:${col};">${b.user.split(' ').map(w=>w[0]).join('')}</div><div><div class="bs-user">${b.user}</div><div class="bs-time">${b.time}</div></div></div>
      <div class="bs-title">${b.buildName}</div>${b.caption?`<div class="bs-caption">${b.caption}</div>`:''}
      <div class="bs-tier-row"><span class="bs-tier-badge" style="background:${b.tier.color}20;color:${b.tier.color};">${b.tier.name}</span><span class="bs-price">$${b.total.toLocaleString()}</span></div>
      <div class="bs-comps">${comps}${b.components.length>4?`<span class="bs-comp-pill">+${b.components.length-4} more</span>`:''}</div>
      <div class="bs-footer">
        <button class="bs-action${liked?' liked':''}" onclick="event.stopPropagation();togBuildLike('${b.id}',this,${b.likes})"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span id="bslc-${b.id}">${lc}</span></button>
        <button class="bs-action" onclick="event.stopPropagation();openBuildDetail('${b.id}')"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>${cmts}</button>
        <button class="clone-btn" onclick="event.stopPropagation();cloneBuild('${b.id}')"><svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>Clone</button>
      </div>`;
    d.onclick=()=>openBuildDetail(b.id);el.appendChild(d);
  });
}
function togBuildLike(id,btn,base){const was=alikes['b_'+id+'_l']||false;alikes['b_'+id+'_l']=!was;alikes['b_'+id]=(alikes['b_'+id]||0)+(!was?1:-1);persist();btn.classList.toggle('liked',!was);const lc=document.getElementById('bslc-'+id);if(lc)lc.textContent=base+(alikes['b_'+id]||0);}
function openBuildDetail(id){
  const b=sharedBuilds.find(x=>x.id===id);if(!b)return;
  const liked=alikes['b_'+b.id+'_l']||false;const lc=(alikes['b_'+b.id]||0)+b.likes;
  const cmts=acmts['b_'+b.id]||[];const col=COLS[b.avatar%COLS.length];
  document.getElementById('art-ext').style.display='none';
  document.getElementById('article-body').innerHTML=`<div class="art-pad" style="padding-top:16px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;"><div class="av" style="background:${col}20;color:${col};width:40px;height:40px;font-size:14px;">${b.user.split(' ').map(w=>w[0]).join('')}</div><div><div style="font-size:14px;font-weight:500;color:var(--t1);">${b.user}</div><div style="font-size:12px;color:var(--t3);">${b.time}</div></div></div>
    <div class="art-title">${b.buildName}</div>${b.caption?`<div class="art-desc">${b.caption}</div>`:''}
    <div class="bs-tier-row" style="margin-bottom:12px;"><span class="bs-tier-badge" style="background:${b.tier.color}20;color:${b.tier.color};">${b.tier.name}</span><span class="bs-price">$${b.total.toLocaleString()}</span></div>
    <div style="background:var(--bg2);border-radius:12px;padding:12px;margin-bottom:14px;">${b.components.map(c=>`<div style="font-size:13px;color:var(--t1);padding:5px 0;border-bottom:0.5px solid var(--bd);">${c.n}</div>`).join('')}</div>
    <div class="like-bar"><button class="lk-big${liked?' liked':''}" id="abig-b${b.id}" onclick="togBuildLike('${b.id}',this,${b.likes})"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>Like</button><span class="lk-count">${lc} likes</span></div>
    <div class="cmts-hdr">${cmts.length} comment${cmts.length!==1?'s':''}</div>
    <div class="cmt-box"><div class="av" style="background:#0A84FF20;color:#0A84FF;">${user?user.name.split(' ').map(w=>w[0]).join(''):'Me'}</div><div class="cmt-iw"><textarea class="cmt-in" id="bci-${b.id}" rows="2" placeholder="Add a comment…"></textarea><button class="post-btn" onclick="postBuildCmt('${b.id}')">Post</button></div></div>
    <div id="bcl-${b.id}">${cmts.map(c=>{const cc=COLS[c.avatar%COLS.length];return`<div class="cmt-item"><div class="av" style="background:${cc}20;color:${cc};font-size:10px;">${c.name.split(' ').map(w=>w[0]).join('')}</div><div style="flex:1;min-width:0;"><span class="cn">${c.name}</span><span class="ct">${c.time}</span><div class="ctxt">${c.text}</div></div></div>`;}).join('')||'<div style="font-size:13px;color:var(--t3);padding:8px 0;">No comments yet.</div>'}</div>
  </div>`;
  openSlide('article-screen');
}
function postBuildCmt(bid){const inp=document.getElementById('bci-'+bid);const text=inp.value.trim();if(!text)return;const ni=Math.floor(Math.random()*NAMES.length);const cmt={id:'c'+Date.now(),name:user?user.name:NAMES[ni],avatar:user?user.avatarIdx:ni,time:'Just now',text,likes:0};if(!acmts['b_'+bid])acmts['b_'+bid]=[];acmts['b_'+bid].push(cmt);persist();inp.value='';const list=document.getElementById('bcl-'+bid);const col=COLS[cmt.avatar%COLS.length];const d=document.createElement('div');d.className='cmt-item';d.innerHTML=`<div class="av" style="background:${col}20;color:${col};font-size:10px;">${cmt.name.split(' ').map(w=>w[0]).join('')}</div><div style="flex:1;min-width:0;"><span class="cn">${cmt.name}</span><span class="ct">Just now</span><div class="ctxt">${text}</div></div></div>`;if(list.querySelector('[style*=\"No comments\"]'))list.innerHTML='';list.appendChild(d);}


function buildDropdown(){const s=document.getElementById('cmp-select');s.innerHTML='';Object.entries(C).forEach(([k,comp])=>{const opt=document.createElement('option');opt.value=k;opt.textContent=comp.label;if(k===cmpCat)opt.selected=true;s.appendChild(opt);});}
function setSort(mode){sortMode=mode;['value','perf','price'].forEach(m=>document.getElementById('sort-'+m).classList.toggle('on',m===mode));renderCompare();}
function renderCompare(){
  cmpCat=document.getElementById('cmp-select').value;const cat=C[cmpCat];document.getElementById('cmp-sub').textContent=cat.label+' comparison';const el=document.getElementById('cmp-content');
  if(!cat.hasPM){const opts=[...cat.opts];opts.sort((a,b)=>a.p-b.p);el.innerHTML='';opts.forEach((o,i)=>{const d=document.createElement('div');d.className='cmp-card'+(i===0?' winner':'');d.innerHTML=`${i===0?'<div class="w-badge">Best price</div>':''}<div class="cmp-head"><div><div class="cmp-name">${o.n}</div><div class="cmp-spec">${o.s}</div></div><div class="cmp-price">$${o.p}</div></div><div class="stats-row"><div class="stat"><div class="stat-v">$${o.p}</div><div class="stat-l">Price</div></div><div class="stat"><div class="stat-v">#${i+1}</div><div class="stat-l">rank</div></div></div>`;el.appendChild(d);});return;}
  const opts=[...cat.opts].map(o=>({...o,ptp:Math.round(o.pm/o.p)}));
  if(sortMode==='value')opts.sort((a,b)=>b.ptp-a.ptp);else if(sortMode==='perf')opts.sort((a,b)=>b.pm-a.pm);else opts.sort((a,b)=>a.p-b.p);
  const mPM=Math.max(...opts.map(o=>o.pm));const mPTP=Math.max(...opts.map(o=>o.ptp));el.innerHTML='';
  opts.forEach((o,i)=>{const pp=Math.round((o.pm/mPM)*100);const vp=Math.round((o.ptp/mPTP)*100);const d=document.createElement('div');d.className='cmp-card'+(i===0?' winner':'');
    d.innerHTML=`${i===0?`<div class="w-badge">${sortMode==='value'?'Top value':sortMode==='perf'?'Top performer':'Best price'}</div>`:''}
      <div class="cmp-head"><div><div class="cmp-name">${o.n}</div><div class="cmp-spec">${o.s}</div></div><div class="cmp-price">$${o.p}</div></div>
      <div class="br2"><span class="br2-lbl">Performance</span><div class="br2-track"><div class="br2-fill" style="width:${pp}%;background:#0A84FF;"></div></div><span class="br2-pct">${pp}%</span></div>
      <div class="br2"><span class="br2-lbl">Value score</span><div class="br2-track"><div class="br2-fill" style="width:${vp}%;background:#34C759;"></div></div><span class="br2-pct">${vp}%</span></div>
      <div class="stats-row"><div class="stat"><div class="stat-v">${o.pm.toLocaleString()}</div><div class="stat-l">PassMark</div></div><div class="stat"><div class="stat-v">${o.ptp}</div><div class="stat-l">pts per $</div></div><div class="stat"><div class="stat-v">#${i+1}</div><div class="stat-l">rank</div></div></div>`;
    el.appendChild(d);});
}

function renderSaves(){
  const el=document.getElementById('saves-content');document.getElementById('saves-count').textContent=saves.length+' build'+(saves.length!==1?'s':'');
  if(!saves.length){el.innerHTML='<div class="empty-state"><div class="empty-title">No saved builds yet</div>Build something and save it.</div>';return;}
  el.innerHTML='';saves.forEach((b,i)=>{const parts=Object.values(b.components).filter(Boolean).map(c=>c.n.split(' ').slice(0,2).join(' ')).join(' · ');const d=document.createElement('div');d.className='sv-card';d.innerHTML=`<div class="sv-name">${b.name}</div><div class="sv-meta">$${b.total.toLocaleString()} · ${b.date}</div><div class="sv-parts">${parts||'No components'}</div><div class="sv-acts"><button class="sv-btn sv-load" onclick="loadBuild(${i})">Load build</button><button class="sv-btn sv-del" onclick="delBuild(${i})">Delete</button></div>`;el.appendChild(d);});
}
function loadBuild(i){sel=Object.assign({},saves[i].components);goPage('build');tiles();totals();}
function delBuild(i){saves.splice(i,1);persist();renderSaves();}

function renderAccount(){
  const el=document.getElementById('account-main');
  const prefHtml=()=>`
    <div class="sec-hdr">Preferences</div>
    <div class="grp">
      <div class="srow" onclick="openSlide('slide-notifications')"><div class="srow-left"><div class="sico" style="background:#FAEEDA;color:#854F0B;"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div><span class="slabel">Notifications</span></div><span class="sarrow">›</span></div>
      <div class="srow" onclick="openSlide('slide-privacy')"><div class="srow-left"><div class="sico" style="background:#E1F5EE;color:#0F6E56;"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><span class="slabel">Privacy &amp; data</span></div><span class="sarrow">›</span></div>
    </div>
    <div class="sec-hdr">Support</div>
    <div class="grp">
      <div class="srow" onclick="openSlide('slide-about')"><div class="srow-left"><div class="sico" style="background:#F1EFE8;color:#5F5E5A;"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><span class="slabel">About</span></div><span class="sarrow">›</span></div>
      <div class="srow" onclick="showNotif('Thanks for the feedback!')"><div class="srow-left"><div class="sico" style="background:#E6F1FB;color:#185FA5;"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><span class="slabel">Send feedback</span></div><span class="sarrow">›</span></div>
    </div>`;

  if(!user){
    el.innerHTML=`
      <div class="navbar"><div class="nav-title">Account</div></div>
      <div style="padding:0 16px;">
        <div class="grp" style="margin-bottom:4px;">
          <div style="padding:16px 14px;">
            <div style="font-size:14px;font-weight:500;color:var(--t1);margin-bottom:3px;">Sync your builds</div>
            <div style="font-size:12px;color:var(--t2);margin-bottom:12px;line-height:1.5;">Sign in to save builds to the cloud and share with the community.</div>
            <div style="display:flex;gap:8px;">
              <button class="form-btn" style="flex:1;margin:0;padding:10px;" onclick="renderLogin()">Sign in</button>
              <button class="form-btn sec" style="flex:1;margin:0;padding:10px;" onclick="renderSignUp(document.getElementById('account-main'))">Create account</button>
            </div>
          </div>
        </div>
        ${prefHtml()}
        <div style="height:20px;"></div>
      </div>`;
    return;
  }

  const col=COLS[user.avatarIdx%COLS.length];
  const myShared=sharedBuilds.filter(b=>b.user===user.name).length;
  el.innerHTML=`
    <div class="navbar"><div class="nav-title">Account</div></div>
    <div style="padding:0 16px;">
      <div class="profile-hero">
        <div class="profile-av" style="background:${col}20;color:${col};">${user.name.split(' ').map(w=>w[0]).join('')}</div>
        <div class="profile-name">${user.name}</div>
        <div class="profile-email">${user.email}</div>
        ${user.bio?`<div style="font-size:13px;color:var(--t2);text-align:center;line-height:1.5;">${user.bio}</div>`:''}
        <div class="profile-stats">
          <div class="pstat"><div class="pstat-v">${saves.length}</div><div class="pstat-l">saved</div></div>
          <div class="pstat"><div class="pstat-v">${myShared}</div><div class="pstat-l">shared</div></div>
          <div class="pstat"><div class="pstat-v">${user.joined||'Today'}</div><div class="pstat-l">joined</div></div>
        </div>
      </div>
      <div class="sec-hdr">Profile</div>
      <div class="grp">
        <div class="srow" onclick="openEditProfile()"><div class="srow-left"><div class="sico" style="background:#E6F1FB;color:#185FA5;"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><span class="slabel">Edit profile</span></div><span class="sarrow">›</span></div>
        <div class="srow" onclick="openSlide('slide-changepass')"><div class="srow-left"><div class="sico" style="background:#EAF3DE;color:#3B6D11;"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><span class="slabel">Change password</span></div><span class="sarrow">›</span></div>
      </div>
      <div class="sec-hdr">Content</div>
      <div class="grp">
        <div class="srow" onclick="openYtKey()"><div class="srow-left"><div class="sico" style="background:#FAEEDA;color:#854F0B;"><svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg></div><span class="slabel">YouTube API key</span></div><span class="svalue" style="margin-right:6px;">${ytKey?'Connected':'Not set'}</span><span class="sarrow">›</span></div>
        <div class="srow" onclick="openFeeds()"><div class="srow-left"><div class="sico" style="background:#E1F5EE;color:#0F6E56;"><svg viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg></div><span class="slabel">Feed sources</span></div><span class="svalue" style="margin-right:6px;">${channels.length} channels</span><span class="sarrow">›</span></div>
      </div>
      ${prefHtml()}
      <div class="grp" style="margin-top:4px;">
        <div class="srow" onclick="signOut()"><div class="srow-left"><div class="sico" style="background:#FFECEB;color:#C0392B;"><svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div><span class="danger-label">Sign out</span></div></div>
      </div>
      <div style="height:20px;"></div>
    </div>`;
}

function renderSignUp(el){
  el.innerHTML=`<div class="navbar"><div class="nav-title">Account</div></div>
    <div class="auth-wrap" style="padding-top:16px;">
      <div class="auth-logo"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div class="auth-title">Create your account</div>
      <div class="auth-sub">Save builds to the cloud, share with the community, and sync across devices.</div>
      <div class="field"><label>Display name</label><input class="auth-in" id="reg-name" placeholder="Your name" type="text"/></div>
      <div class="field"><label>Email</label><input class="auth-in" id="reg-email" placeholder="you@example.com" type="email"/></div>
      <div class="field"><label>Password</label><input class="auth-in" id="reg-pass" placeholder="Min. 6 characters" type="password"/></div>
      <button class="auth-btn" onclick="signUp()">Create account</button>
      <div id="reg-err" class="err-msg"></div>
      <div class="divider"><div class="div-line"></div><span class="div-txt">or</span><div class="div-line"></div></div>
      <button class="social-btn" onclick="signInGoogle()">Continue with Google</button>
      <div class="auth-switch">Already have an account? <span onclick="renderLogin()">Sign in</span></div>
    </div>`;
}
function renderLogin(){
  const el=document.getElementById('account-main');
  el.innerHTML=`<div class="navbar"><div class="nav-title">Account</div></div>
    <div class="auth-wrap" style="padding-top:16px;">
      <div class="auth-logo"><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div class="auth-title">Welcome back</div>
      <div class="auth-sub">Sign in to your PC Builder account.</div>
      <div class="field"><label>Email</label><input class="auth-in" id="li-email" placeholder="you@example.com" type="email"/></div>
      <div class="field"><label>Password</label><input class="auth-in" id="li-pass" placeholder="Your password" type="password"/></div>
      <button class="auth-btn" onclick="signIn()">Sign in</button>
      <div id="li-err" class="err-msg"></div>
      <div class="divider"><div class="div-line"></div><span class="div-txt">or</span><div class="div-line"></div></div>
      <button class="social-btn" onclick="signInGoogle()">Continue with Google</button>
      <div class="auth-switch">Don't have an account? <span onclick="renderAccount()">Sign up</span></div>
    </div>`;
}
function signUp(){
  const name=document.getElementById('reg-name')?.value.trim();
  const email=document.getElementById('reg-email')?.value.trim();
  const pass=document.getElementById('reg-pass')?.value;
  const err=document.getElementById('reg-err');
  if(!name){err.style.display='block';err.textContent='Please enter your name.';return;}
  if(!email||!email.includes('@')){err.style.display='block';err.textContent='Please enter a valid email address.';return;}
  if(!pass||pass.length<6){err.style.display='block';err.textContent='Password must be at least 6 characters.';return;}
  user={name,email,bio:'',avatarIdx:0,joined:new Date().toLocaleDateString()};
  persist();renderAccount();showNotif('Welcome, '+name.split(' ')[0]+'!');
}
function signIn(){
  const email=document.getElementById('li-email')?.value.trim();
  const pass=document.getElementById('li-pass')?.value;
  const err=document.getElementById('li-err');
  if(!email||!pass){err.style.display='block';err.textContent='Please fill in all fields.';return;}
  if(!email.includes('@')){err.style.display='block';err.textContent='Please enter a valid email address.';return;}
  user={name:email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),email,bio:'',avatarIdx:Math.floor(Math.random()*COLS.length),joined:new Date().toLocaleDateString()};
  persist();renderAccount();showNotif('Signed in!');
}
function signInGoogle(){
  user={name:'Google User',email:'user@gmail.com',bio:'',avatarIdx:0,joined:new Date().toLocaleDateString()};
  persist();renderAccount();showNotif('Signed in with Google!');
}
function signOut(){
  if(!confirm('Sign out of your account?'))return;
  user=null;localStorage.removeItem('pcb11_user');renderAccount();showNotif('Signed out');
}
function deleteAccount(){
  if(!confirm('Delete your account? This cannot be undone.'))return;
  user=null;localStorage.clear();renderAccount();showNotif('Account deleted');
}

function openEditProfile(){
  const inp=document.getElementById('ep-name');const eml=document.getElementById('ep-email');const bio=document.getElementById('ep-bio');
  if(inp)inp.value=user?.name||'';if(eml)eml.value=user?.email||'';if(bio)bio.value=user?.bio||'';
  document.getElementById('ep-success').style.display='none';
  const container=document.getElementById('avatar-colours');
  if(container){container.innerHTML='';COLS.forEach((col,i)=>{const btn=document.createElement('button');btn.style.cssText=`width:36px;height:36px;border-radius:50%;background:${col};border:${user&&user.avatarIdx===i?'3px solid var(--t1)':'3px solid transparent'};cursor:pointer;transition:border 0.15s;`;btn.onclick=()=>{if(user)user.avatarIdx=i;document.querySelectorAll('#avatar-colours button').forEach((b,j)=>b.style.border=j===i?'3px solid var(--t1)':'3px solid transparent');};container.appendChild(btn);});}
  openSlide('slide-editprofile');
}
function saveProfile(){
  const name=document.getElementById('ep-name').value.trim();const email=document.getElementById('ep-email').value.trim();const bio=document.getElementById('ep-bio').value.trim();
  if(!name||!email){showNotif('Name and email are required');return;}
  user.name=name;user.email=email;user.bio=bio;persist();
  document.getElementById('ep-success').style.display='block';
  setTimeout(()=>{closeSlide('slide-editprofile');renderAccount();},700);
}
function changePass(){
  const oldP=document.getElementById('cp-old').value;const newP=document.getElementById('cp-new').value;const conf=document.getElementById('cp-conf').value;
  const err=document.getElementById('cp-err');const ok=document.getElementById('cp-ok');
  err.style.display='none';ok.style.display='none';
  if(!oldP){err.style.display='block';err.textContent='Enter your current password.';return;}
  if(newP.length<6){err.style.display='block';err.textContent='New password must be at least 6 characters.';return;}
  if(newP!==conf){err.style.display='block';err.textContent='Passwords do not match.';return;}
  ok.style.display='block';setTimeout(()=>{closeSlide('slide-changepass');['cp-old','cp-new','cp-conf'].forEach(id=>document.getElementById(id).value='');},900);
}
function openYtKey(){
  const inp=document.getElementById('yt-key-in');if(inp)inp.value=ytKey;
  const st=document.getElementById('yt-status');if(st)st.innerHTML=ytKey?`<span style="color:var(--t-success);">Connected</span> — real videos will load from your channels.`:`<span style="color:var(--t3);">No key set.</span> Add one to load real YouTube videos.`;
  document.getElementById('yt-ok').style.display='none';
  openSlide('slide-ytkey');
}
function saveYtKey(){
  ytKey=document.getElementById('yt-key-in').value.trim();persist();
  const st=document.getElementById('yt-status');if(st)st.innerHTML=ytKey?`<span style="color:var(--t-success);">Connected</span>`:`<span style="color:var(--t3);">No key set.</span>`;
  document.getElementById('yt-ok').style.display='block';
  setTimeout(()=>{document.getElementById('yt-ok').style.display='none';closeSlide('slide-ytkey');renderAccount();},900);
}
function openFeeds(){
  const chips=document.getElementById('ch-chips');if(chips)chips.innerHTML=channels.map((c,i)=>`<span class="ch-chip">${c.name}<button class="chip-x" onclick="rmCh(${i})">×</button></span>`).join('');
  const rss=document.getElementById('rss-list');if(rss)rss.innerHTML=RSS_SRC.map(s=>`<div style="display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:0.5px solid var(--bd);"><div style="width:8px;height:8px;border-radius:50%;background:${s.color};flex-shrink:0;"></div><span style="font-size:13px;color:var(--t1);flex:1;">${s.name}</span><span style="font-size:11px;color:var(--t-success);">Active</span></div>`).join('');
  openSlide('slide-feeds');
}
function addCh(){const id=document.getElementById('ch-id').value.trim();const nm=document.getElementById('ch-nm').value.trim();if(!id||!nm){showNotif('Enter both channel ID and name');return;}if(channels.find(c=>c.id===id)){showNotif('Channel already added');return;}channels.push({id,name:nm});persist();const chips=document.getElementById('ch-chips');if(chips)chips.innerHTML=channels.map((c,i)=>`<span class="ch-chip">${c.name}<button class="chip-x" onclick="rmCh(${i})">×</button></span>`).join('');document.getElementById('ch-id').value='';document.getElementById('ch-nm').value='';showNotif(nm+' added!');}
function rmCh(i){channels.splice(i,1);persist();const chips=document.getElementById('ch-chips');if(chips)chips.innerHTML=channels.map((c,i2)=>`<span class="ch-chip">${c.name}<button class="chip-x" onclick="rmCh(${i2})">×</button></span>`).join('');showNotif('Channel removed');}
function resetCh(){channels=[...YT_DEF];persist();const chips=document.getElementById('ch-chips');if(chips)chips.innerHTML=channels.map((c,i)=>`<span class="ch-chip">${c.name}<button class="chip-x" onclick="rmCh(${i})">×</button></span>`).join('');showNotif('Reset to defaults');}

function togBtn(btn){btn.classList.toggle('on');const thumb=btn.querySelector('.tog-thumb');if(thumb)thumb.style.left=btn.classList.contains('on')?'20px':'2px';}

tiles();totals();

// Receive Supabase session from the React parent (App.tsx posts after iframe load)
window.addEventListener('message', e => {
  if (e.data?.type === 'SUPABASE_SESSION' && !user) {
    user = e.data.user;
    persist();
    if (document.getElementById('pg-account')?.classList.contains('active')) {
      renderAccount();
    }
  }
});

// --- Event wiring (replacing inline onclick attributes) ---

// Tab bar
document.querySelectorAll('.tab[id^="t-"]').forEach(btn => {
  btn.addEventListener('click', () => goPage(btn.id.slice(2)));
});

// All back/close buttons (use data-close attribute to target the slide)
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeSlide(btn.dataset.close));
});

// Build name → header title sync
document.getElementById('bname').addEventListener('input', e => {
  const title = document.getElementById('build-title');
  if (title) title.textContent = e.target.value.trim() || savedBuildName || 'Build';
});

// Share modal: close when tapping the backdrop itself
document.getElementById('share-modal-bg').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeShareModal();
});

// Expose remaining functions used by inline onclick in dynamically-rendered HTML.
// These will be progressively replaced with event listeners as each section is
// migrated to React.
Object.assign(window, {
  openPicker, bView, setSort,
  saveBuild, openShareModal, closeShareModal, postBuild,
  togBuildLike, openBuildDetail, postBuildCmt,
  setCommunityFilter, cloneBuild,
  openEditProfile, saveProfile, changePass,
  openYtKey, saveYtKey, openFeeds, addCh, rmCh, resetCh,
  togBtn,
  renderAccount, renderLogin, signUp, signIn, signInGoogle, signOut, deleteAccount,
  loadBuild, delBuild, showNotif, openSlide, closeSlide,
});

