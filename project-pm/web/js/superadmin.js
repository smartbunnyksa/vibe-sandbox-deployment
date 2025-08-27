const { $, $$, el, AppModal } = window.App;

/* بيانات الفروع */
let branches=[
  { id:1,name:"فرع الدمام", city:"الدمام", status:"متوقف", capacity:90,  manager:"—",            phone:"—" },
  { id:2,name:"فرع الرياض", city:"الرياض", status:"نشط",   capacity:180, manager:"أحمد السبيعي", phone:"055-123-4567" },
  { id:3,name:"فرع الطائف", city:"الطائف", status:"متوقف", capacity:70,  manager:"—",            phone:"—" },
  { id:4,name:"فرع القصيم", city:"القصيم", status:"نشط",   capacity:95,  manager:"سالم المطيري", phone:"055-987-6543" },
];

function statusBadge(s){const c=s==='نشط'?'active':'inactive';return `<span class="status ${c}">${s}</span>`;}

function updateKPIs(){
  $('#kpi-branches').textContent = branches.length;
  $('#kpi-players').textContent  = '520';
  $('#kpi-revenue').textContent  = '245,000 ﷼';
}

function renderBranches(){
  const tb = $('#tbl-branches'); if(!tb) return;
  tb.innerHTML = branches.map(b=>`
    <tr>
      <td>${b.name}</td>
      <td>${b.city}</td>
      <td>${statusBadge(b.status)}</td>
      <td>${b.capacity}</td>
      <td>${b.manager||'—'}</td>
      <td class="phone">${b.phone||'—'}</td>
      <td>
        <button class="btn secondary small" data-edit="${b.id}">تعديل</button>
        <button class="btn danger small" data-del="${b.id}">حذف</button>
      </td>
    </tr>
  `).join('');

  tb.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openEdit(+b.dataset.edit));
  tb.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>deleteBranch(+b.dataset.del));
}

function buildBranchForm(data={}){
  const {name="",city="الرياض",status="نشط",capacity=120,manager="",phone=""}=data;
  const form=el(`
    <form class="form-grid" dir="rtl">
      <label><span class="lbl">الاسم</span><input class="input" id="b-name" value="${name}" placeholder="اسم الفرع"></label>
      <label><span class="lbl">المدينة</span>
        <select class="select" id="b-city">
          <option>الرياض</option><option>جدة</option><option>مكة</option><option>المدينة</option>
          <option>القصيم</option><option>الطائف</option><option>تبوك</option><option>الدمام</option>
        </select>
      </label>
      <label><span class="lbl">الحالة</span>
        <select class="select" id="b-status"><option value="نشط">نشط</option><option value="متوقف">متوقف</option></select>
      </label>
      <label><span class="lbl">السعة</span><input type="number" min="0" class="input" id="b-cap" value="${capacity}"></label>
      <label><span class="lbl">مدير الفرع</span><input class="input" id="b-manager" value="${manager}" placeholder="اسم المدير"></label>
      <label><span class="lbl">رقم الجوال</span><input class="input" id="b-phone" value="${phone}" placeholder="05xxxxxxxx" inputmode="numeric"></label>
    </form>
  `);
  form.querySelector('#b-city').value=city;
  form.querySelector('#b-status').value=status;
  return form;
}

$('#btn-add-branch')?.addEventListener('click',()=>{
  const form=buildBranchForm();
  AppModal.open({
    title:'إضافة فرع', body:form, okText:'حفظ', cancelText:'إلغاء',
    onOk:()=>{
      const payload={
        name:$('#b-name',form).value.trim()||'بدون اسم',
        city:$('#b-city',form).value,
        status:$('#b-status',form).value,
        capacity:parseInt($('#b-cap',form).value||'0',10),
        manager:$('#b-manager',form).value.trim(),
        phone:$('#b-phone',form).value.trim()
      };
      const newId=(branches.at(-1)?.id||0)+1;
      branches.push({id:newId,...payload});
      updateKPIs(); renderBranches(); refreshPerfOptions();
    }
  });
});

function openEdit(id){
  const row=branches.find(b=>b.id===id); if(!row) return;
  const form=buildBranchForm(row);
  AppModal.open({
    title:'تعديل فرع', body:form, okText:'تحديث', cancelText:'إلغاء',
    onOk:()=>{
      Object.assign(row,{
        name:$('#b-name',form).value.trim()||'بدون اسم',
        city:$('#b-city',form).value,
        status:$('#b-status',form).value,
        capacity:parseInt($('#b-cap',form).value||'0',10),
        manager:$('#b-manager',form).value.trim(),
        phone:$('#b-phone',form).value.trim()
      });
      updateKPIs(); renderBranches(); refreshPerfOptions();
    }
  });
}

async function deleteBranch(id){
  const row=branches.find(b=>b.id===id); if(!row) return;
  const ok=await AppModal.confirm({title:'تأكيد الحذف', body:`حذف <b>${row.name}</b>؟`, okText:'حذف', cancelText:'إلغاء'});
  if(!ok) return;
  branches = branches.filter(b=>b.id!==id);
  updateKPIs(); renderBranches(); refreshPerfOptions();
}

/* ===== أداء الفروع (رسوم SVG مبسطة) ===== */
const perfData = {
  2: genSeries(30, 5000, 9000),
  4: genSeries(30, 3000, 6500),
  1: genSeries(30, 1500, 3000),
  3: genSeries(30, 1200, 2500),
};
let perfState = { branchId: 2, range: 7 };

function genSeries(days=30, revMin=2000, revMax=8000){
  const out=[]; const now=new Date();
  for(let i=days-1;i>=0;i--){
    const d=new Date(now); d.setDate(now.getDate()-i);
    const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0');
    const date=`${dd}/${mm}`;
    const revenue = Math.round(revMin + Math.random()*(revMax-revMin));
    const activePlayers = Math.round(40 + Math.random()*120);
    const avgRating = +(3 + Math.random()*2).toFixed(2);
    const ticketsOpen = Math.round(Math.random()*6);
    const ticketsClosed = Math.round(Math.random()*8);
    const newSubs = Math.round(Math.random()*6);
    out.push({date, revenue, activePlayers, avgRating, ticketsOpen, ticketsClosed, newSubs});
  }
  return out;
}

function refreshPerfOptions(){
  const sel=$('#perf-branch'); if(!sel) return;
  sel.innerHTML = branches.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
  if(!perfData[perfState.branchId]) perfState.branchId = +sel.value;
  sel.value = String(perfState.branchId);
}

function slice(series, days){ return series.slice(-days); }

function drawLine(svgId, rows, accessor, {min=0, max=null, cls='line'}={}){
  const svg=$(svgId); if(!svg) return;
  const W=600,H=240, m={t:16,r:14,b:26,l:34};
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.innerHTML='';
  const innerW=W-m.l-m.r, innerH=H-m.t-m.b;
  const xs=(i)=>m.l + innerW*(i/(rows.length-1||1));
  const vals=rows.map(accessor);
  const vMax = max ?? Math.max(...vals,1);
  const vMin = min;
  const ys=(v)=>m.t + innerH * (1-( (v-vMin)/Math.max(vMax-vMin,1) ));
  for(let i=0;i<=4;i++){
    const y=m.t + innerH*(i/4);
    const ln=document.createElementNS('http://www.w3.org/2000/svg','line');
    ln.setAttribute('x1',m.l);ln.setAttribute('x2',m.l+innerW);
    ln.setAttribute('y1',y);ln.setAttribute('y2',y);
    ln.setAttribute('stroke','var(--ring)');ln.setAttribute('stroke-width','1');ln.setAttribute('opacity', i===0||i===4 ? '0.8':'0.4');
    svg.appendChild(ln);
  }
  const d = rows.map((r,i)=>`${i?'L':'M'} ${xs(i)} ${ys(accessor(r))}`).join(' ');
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d',d); path.setAttribute('fill','none'); path.setAttribute('stroke','var(--primary)'); path.setAttribute('stroke-width','2.5');
  svg.appendChild(path);
  rows.forEach((r,i)=>{
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',xs(i)); c.setAttribute('cy',ys(accessor(r))); c.setAttribute('r',3.5);
    c.setAttribute('fill','var(--primary)'); svg.appendChild(c);
  });
}

function drawBars(svgId, rows, accessor){
  const svg=$(svgId); if(!svg) return;
  const W=600,H=240, m={t:16,r:14,b:26,l:34};
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.innerHTML='';
  const innerW=W-m.l-m.r, innerH=H-m.t-m.b;
  const vals=rows.map(accessor);
  const vMax = Math.max(...vals,1);
  const bw = innerW/(rows.length||1) * 0.6;
  const gap = innerW/(rows.length||1) * 0.4;
  const x0 = m.l + gap/2;
  for(let i=0;i<=4;i++){
    const y=m.t + innerH*(i/4);
    const ln=document.createElementNS('http://www.w3.org/2000/svg','line');
    ln.setAttribute('x1',m.l);ln.setAttribute('x2',m.l+innerW);
    ln.setAttribute('y1',y);ln.setAttribute('y2',y);
    ln.setAttribute('stroke','var(--ring)');ln.setAttribute('stroke-width','1');ln.setAttribute('opacity', i===0||i===4 ? '0.8':'0.4');
    svg.appendChild(ln);
  }
  rows.forEach((r,i)=>{
    const v=accessor(r);
    const h = innerH * (v/Math.max(vMax,1));
    const x = x0 + (bw+gap)*(i);
    const y = m.t + innerH - h;
    const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('x',x); rect.setAttribute('y',y);
    rect.setAttribute('width',bw); rect.setAttribute('height',h);
    rect.setAttribute('fill','var(--primary)'); rect.setAttribute('rx','4');
    svg.appendChild(rect);
  });
}

function renderPerfTable(rows){
  const tb=$('#tbl-perf'); if(!tb) return;
  tb.innerHTML = rows.map(r=>`
    <tr>
      <td>${r.date}</td>
      <td>${r.revenue.toLocaleString('ar-SA')}</td>
      <td>${r.activePlayers}</td>
      <td>${r.avgRating.toFixed(2)}</td>
      <td>${r.ticketsOpen}</td>
      <td>${r.ticketsClosed}</td>
      <td>${r.newSubs}</td>
    </tr>
  `).join('');
}

function refreshBranchPerformance(){
  const sel=$('#perf-branch'); if(!sel) return;
  const id = +sel.value;
  const range = +$('#perf-range').value;
  const all = perfData[id] || [];
  const rows = all.slice(-range);

  const agg = {
    totalRev: rows.reduce((s,r)=>s+r.revenue,0),
    totalActive: Math.round(rows.reduce((s,r)=>s+r.activePlayers,0)/(rows.length||1)),
    avgRating:(rows.reduce((s,r)=>s+r.avgRating,0)/(rows.length||1)).toFixed(2),
  };
  $('#kpi-perf-rev').textContent   = `${agg.totalRev.toLocaleString('ar-SA')} ﷼`;
  $('#kpi-perf-active').textContent= agg.totalActive.toLocaleString('ar-SA');
  $('#kpi-perf-rating').textContent= agg.avgRating;
  $('#perf-range-label').textContent = range===7?'آخر 7 أيام':range===30?'آخر 30 يوم':'آخر 90 يوم';

  drawLine('#chart-revenue', rows, r=>r.revenue);
  drawBars('#chart-active', rows, r=>r.activePlayers);
  drawLine('#chart-rating', rows, r=>r.avgRating, {min:0,max:5});

  // تذاكر مفتوحة/مغلقة خطين بسيطين
  const svgT = $('#chart-tickets'); if(svgT){ 
    const W=600,H=240, m={t:16,r:14,b:26,l:34};
    svgT.setAttribute('viewBox',`0 0 ${W} ${H}`); svgT.innerHTML='';
    const innerW=W-m.l-m.r, innerH=H-m.t-m.b;
    const xs=(i)=>m.l + innerW*(i/(rows.length-1||1));
    const valsO=rows.map(r=>r.ticketsOpen), valsC=rows.map(r=>r.ticketsClosed);
    const max=Math.max(...valsO,...valsC,1);
    const ys=(v)=>m.t + innerH*(1-(v/max));
    for(let i=0;i<=4;i++){
      const y=m.t + innerH*(i/4);
      const ln=document.createElementNS('http://www.w3.org/2000/svg','line');
      ln.setAttribute('x1',m.l);ln.setAttribute('x2',m.l+innerW);
      ln.setAttribute('y1',y);ln.setAttribute('y2',y);
      ln.setAttribute('stroke','var(--ring)');ln.setAttribute('stroke-width','1');ln.setAttribute('opacity', i===0||i===4 ? '0.8':'0.4');
      svgT.appendChild(ln);
    }
    const dO=rows.map((r,i)=>`${i?'L':'M'} ${xs(i)} ${ys(r.ticketsOpen)}`).join(' ');
    const dC=rows.map((r,i)=>`${i?'L':'M'} ${xs(i)} ${ys(r.ticketsClosed)}`).join(' ');
    const pathO=document.createElementNS('http://www.w3.org/2000/svg','path');
    pathO.setAttribute('d',dO); pathO.setAttribute('fill','none'); pathO.setAttribute('stroke','var(--primary)'); pathO.setAttribute('stroke-width','2.5');
    const pathC=document.createElementNS('http://www.w3.org/2000/svg','path');
    pathC.setAttribute('d',dC); pathC.setAttribute('fill','none'); pathC.setAttribute('stroke','#8B5CF6'); pathC.setAttribute('stroke-width','2.5');
    svgT.appendChild(pathO); svgT.appendChild(pathC);
  }

  renderPerfTable(rows);
}

$('#perf-branch')?.addEventListener('change',()=>refreshBranchPerformance());
$('#perf-range')?.addEventListener('change',()=>refreshBranchPerformance());

/* تشغيل */
updateKPIs();
renderBranches();
refreshPerfOptions();
refreshBranchPerformance();