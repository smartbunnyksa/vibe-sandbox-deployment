/* =========================================================
   common.js — أدوات مشتركة + FakeAPI + EventBus + Charts
   ========================================================= */

// ======= Helpers
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const el = (html) => { const d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstElementChild; };
const escapeHtml = (x='') => String(x).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const formatSAR = (n) => `${Number(n||0).toLocaleString('ar-SA')} ﷼`;
const cls = (cond, a, b='') => cond ? a : b;
const wait = (ms)=>new Promise(r=>setTimeout(r,ms));

// شارات حالة عامة (نشط/متوقف، مدفوع/متأخر…).
const badge = (txt) => {
  const t = (txt||'').trim();
  const good = ['نشط','مدفوع','مكتمل','منخفض'];
  const warn = ['متوسط','بانتظار','مفتوحة'];
  const bad  = ['متوقف','متأخر','مرتفع'];
  const kind = good.includes(t) ? 'success' : warn.includes(t) ? 'warning' : bad.includes(t) ? 'danger' : 'muted';
  return `<span class="status ${kind}">${escapeHtml(t||'—')}</span>`;
};

// ======= EventBus بسيط
const Bus = (()=> {
  const map = new Map();
  return {
    on(evt, fn){ (map.get(evt) || map.set(evt,[]).get(evt)).push(fn); },
    emit(evt, payload){ (map.get(evt)||[]).forEach(fn=>fn(payload)); }
  };
})();

// ======= FakeAPI (مصدر بيانات موحّد) — بدون ربط حقيقي
const FakeAPI = (() => {
  // فروع + بيانات أداء يومية
  let branches = [
    { id:1, name:'فرع الدمام', city:'الدمام', status:'متوقف', capacity:90,  manager:'—',            phone:'—' },
    { id:2, name:'فرع الرياض', city:'الرياض', status:'نشط',   capacity:180, manager:'أحمد السبيعي', phone:'055-123-4567' },
    { id:3, name:'فرع الطائف', city:'الطائف', status:'متوقف', capacity:70,  manager:'—',            phone:'—' },
    { id:4, name:'فرع القصيم', city:'القصيم', status:'نشط',   capacity:95,  manager:'سالم المطيري', phone:'055-987-6543' },
  ];

  const genSeries = (days=30, a=1500, b=8000) => {
    const out=[], now=new Date();
    for(let i=days-1;i>=0;i--){
      const d = new Date(now); d.setDate(now.getDate()-i);
      const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0');
      const date=`${dd}/${mm}`;
      const revenue = Math.round(a + Math.random()*(b-a));
      const activePlayers = Math.round(40 + Math.random()*160);
      const avgRating = +(3 + Math.random()*2).toFixed(2);
      const ticketsOpen = Math.round(Math.random()*6);
      const ticketsClosed = Math.round(Math.random()*8);
      const newSubs = Math.round(Math.random()*6);
      out.push({date, revenue, activePlayers, avgRating, ticketsOpen, ticketsClosed, newSubs});
    }
    return out;
  };

  const perf = { 1: genSeries(30,1200,3200), 2: genSeries(30,3000,9000), 3: genSeries(30,1000,2600), 4: genSeries(30,2200,7000) };

  // قوائم افتراضية للمدرب/اللاعب/المدير
  const coachPlayers = [
    {id:101, name:'علي القحطاني',  group:'U12-A', load:370, rpe:6},
    {id:102, name:'ماجد الزهراني', group:'U12-A', load:410, rpe:7},
    {id:103, name:'تميم العبدالله',group:'U12-B', load:280, rpe:5},
  ];
  const adminPlayers = [
    {id:201, name:'سالم الحربي', group:'U14-A', state:'نشط',    rpe:6},
    {id:202, name:'ناصر الشهري', group:'U14-A', state:'نشط',    rpe:5},
    {id:203, name:'خالد العتيبي', group:'U14-B', state:'متوقف', rpe:'—'},
  ];
  const playerSchedule = [
    {date:'الاثنين',  title:'قدرة هوائية',     dur:'60د', target:'RPE 6'},
    {date:'الأربعاء', title:'تكتيك جماعي',     dur:'75د', target:'RPE 5'},
    {date:'الجمعة',   title:'سرعة وانطلاقات',  dur:'45د', target:'RPE 7'},
  ];

  return {
    // فروع
    async listBranches(){ await wait(180); return JSON.parse(JSON.stringify(branches)); },
    async createBranch(payload){ await wait(120); const id=(branches.at(-1)?.id||0)+1; const row={id,...payload}; branches.push(row); Bus.emit('branches:changed'); return row; },
    async updateBranch(id, payload){ await wait(120); const i=branches.findIndex(b=>b.id===id); if(i>-1){ branches[i]={...branches[i],...payload}; Bus.emit('branches:changed'); return branches[i]; } throw Error('not found'); },
    async deleteBranch(id){ await wait(120); branches = branches.filter(b=>b.id!==id); Bus.emit('branches:changed'); return true; },

    // أداء الفروع
    async branchPerf(branchId){ await wait(160); return JSON.parse(JSON.stringify(perf[branchId]||[])); },

    // مدير/مدرب/لاعب
    async adminPlayers(){ await wait(140); return JSON.parse(JSON.stringify(adminPlayers)); },
    async coachPlayers(){ await wait(140); return JSON.parse(JSON.stringify(coachPlayers)); },
    async playerSchedule(){ await wait(100); return JSON.parse(JSON.stringify(playerSchedule)); },

    // تقييم — المدرب فقط يكتب، اللاعب يطّلع
    async submitEvaluation({playerId, score, note}){ await wait(150); console.log('Evaluation saved', {playerId, score, note}); return true; }
  };
})();

// ======= مودال موحّد
const AppModal = (() => {
  let overlay = null;
  const close = ()=> overlay && overlay.remove();

  const open = ({title='حوار', body='', okText='حفظ', cancelText='إلغاء', size='md', onOk} = {}) => {
    close();
    const sizes = { sm:'420px', md:'680px', lg:'980px' };
    overlay = el(`
      <div class="modal-overlay">
        <div class="modal" style="max-width:${sizes[size]||sizes.md}">
          <div class="modal-header">
            <button class="btn secondary" data-close>إغلاق</button>
            <h3 class="chart-title" style="margin:0">${escapeHtml(title)}</h3>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button class="btn" data-ok>${escapeHtml(okText)}</button>
            <button class="btn secondary" data-close>${escapeHtml(cancelText)}</button>
          </div>
        </div>
      </div>
    `);
    document.body.appendChild(overlay);

    const bodyHost = $('.modal-body', overlay);
    if(body instanceof Element){ bodyHost.appendChild(body); } else { bodyHost.innerHTML = String(body||''); }

    overlay.addEventListener('click', (e)=>{ if(e.target.matches('[data-close]') || e.target===overlay) close(); });
    $('[data-ok]', overlay).addEventListener('click', async ()=>{
      if(typeof onOk==='function'){ try{ await onOk(); }catch(e){ console.error(e); return; } }
      close(); Toast.show('تم الحفظ');
    });
  };

  const confirm = ({title='تأكيد', body='متأكد؟', okText='موافق', cancelText='إلغاء', size='sm'} = {}) =>
    new Promise((resolve)=>{
      open({ title, body, okText, cancelText, size, onOk:()=>resolve(true) });
      $('[data-close]', overlay).addEventListener('click', ()=>resolve(false), {once:true});
      $('.modal-overlay', overlay)?.addEventListener('click', (e)=>{ if(e.target===overlay) resolve(false); }, {once:true});
    });

  return { open, close, confirm };
})();

// ======= Toast
const Toast = (() => {
  let host;
  const ensure = () => { if(!host){ host = el(`<div style="position:fixed;inset-inline:0;bottom:18px;display:grid;place-items:center;z-index:9999"></div>`); document.body.appendChild(host);} };
  return { show(msg='تم', ms=1600){ ensure(); const box=el(`<div style="padding:10px 14px;border-radius:10px;background:#0009;color:#fff;font-weight:700;backdrop-filter:blur(4px)">${escapeHtml(msg)}</div>`); host.appendChild(box); setTimeout(()=>box.remove(), ms); } };
})();

// ======= Charts SVG خفيفة
const Charts = {
  line(svg, rows, accessor, {min=0, max=null, className='line'}={}){
    if(!svg) return;
    const W=600,H=240,m={t:16,r:14,b:26,l:34};
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.innerHTML='';
    const iw=W-m.l-m.r, ih=H-m.t-m.b;
    const xs=(i)=>m.l + iw*(i/(rows.length-1||1));
    const vals=rows.map(accessor); const vMax=max ?? Math.max(...vals,1); const vMin=min;
    const ys=(v)=>m.t + ih * (1 - ((v-vMin)/Math.max(vMax-vMin,1)));
    for(let i=0;i<=4;i++){ const y=m.t+ih*(i/4); const ln=document.createElementNS('http://www.w3.org/2000/svg','line'); ln.setAttribute('x1',m.l); ln.setAttribute('x2',m.l+iw); ln.setAttribute('y1',y); ln.setAttribute('y2',y); ln.setAttribute('class','gridline'); ln.setAttribute('opacity', i===0||i===4?'0.8':'0.4'); svg.appendChild(ln); }
    const d=rows.map((r,i)=>`${i?'L':'M'} ${xs(i)} ${ys(accessor(r))}`).join(' ');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d',d); path.setAttribute('class',className); svg.appendChild(path);
    rows.forEach((r,i)=>{ const c=document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('cx',xs(i)); c.setAttribute('cy',ys(accessor(r))); c.setAttribute('r',3.5); c.setAttribute('class','dot'); svg.appendChild(c); });
  },
  bars(svg, rows, accessor, {max=null, color='var(--primary)'}={}){
    if(!svg) return;
    const W=600,H=240,m={t:16,r:14,b:26,l:34};
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.innerHTML='';
    const iw=W-m.l-m.r, ih=H-m.t-m.b;
    const vals=rows.map(accessor); const vMax=max ?? Math.max(...vals,1);
    const bw = iw/(rows.length||1)*0.6; const gap=iw/(rows.length||1)*0.4; const x0=m.l+gap/2;
    for(let i=0;i<=4;i++){ const y=m.t+ih*(i/4); const ln=document.createElementNS('http://www.w3.org/2000/svg','line'); ln.setAttribute('x1',m.l); ln.setAttribute('x2',m.l+iw); ln.setAttribute('y1',y); ln.setAttribute('y2',y); ln.setAttribute('class','gridline'); ln.setAttribute('opacity', i===0||i===4?'0.8':'0.4'); svg.appendChild(ln); }
    rows.forEach((r,i)=>{ const v=accessor(r); const h=ih*(v/Math.max(vMax,1)); const x=x0+(bw+gap)*i; const y=m.t+ih-h; const rect=document.createElementNS('http://www.w3.org/2000/svg','rect'); rect.setAttribute('x',x); rect.setAttribute('y',y); rect.setAttribute('width',bw); rect.setAttribute('height',h); rect.setAttribute('fill',color); rect.setAttribute('rx','4'); svg.appendChild(rect); });
  }
};

// ======= حقن CSS للمودال/شبكة النماذج إن لم تكن موجودة
(function injectCss(){
  if($('#__modal_css__')) return;
  const s = document.createElement('style'); s.id='__modal_css__';
  s.textContent = `
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:grid;place-items:center;z-index:9998;padding:16px}
  .modal{width:100%;background:var(--card);border:1px solid var(--ring);border-radius:16px;box-shadow:var(--shadow)}
  .modal-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--ring)}
  .modal-body{padding:16px}
  .modal-footer{display:flex;gap:8px;justify-content:flex-end;padding:12px 14px;border-top:1px solid var(--ring)}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .form-grid label{display:grid;gap:6px}
  .form-grid .lbl{font-weight:700}
  .input,.select,textarea{width:100%;padding:10px;border:1px solid var(--ring);border-radius:10px;background:var(--bg);color:var(--text)}
  .chart{width:100%;height:auto}
  svg .line{fill:none;stroke:var(--primary);stroke-width:2}
  svg .line.alt{stroke:#9bc1ff}
  svg .gridline{stroke:var(--ring);stroke-width:1}
  svg .dot{fill:var(--primary)}
  .status{padding:4px 8px;border-radius:8px;font-size:.85em;font-weight:700}
  .status.success{background:#27ae60;color:#fff}
  .status.warning{background:#f2994a;color:#fff}
  .status.danger{background:#eb5757;color:#fff}
  .status.muted{background:#e0e7ef;color:#2a2f3b}
  @media (max-width:720px){ .form-grid{grid-template-columns:1fr} }
  `;
  document.head.appendChild(s);
})();