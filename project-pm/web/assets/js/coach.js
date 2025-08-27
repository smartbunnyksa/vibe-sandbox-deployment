// ملئ بيانات وهمية للمدرب
(function(){
  const players = [
    {name:'عبدالله', group:'أ', rpe:6, load:34, status:'نشط'},
    {name:'ناصر', group:'ب', rpe:7, load:40, status:'نشط'},
    {name:'فهد', group:'أ', rpe:5, load:28, status:'مرهق'}
  ];
  document.addEventListener('DOMContentLoaded', ()=>{
    const el1 = document.getElementById('kpi-my-players'); if(el1) el1.textContent = players.length;
    const el2 = document.getElementById('kpi-week-sessions'); if(el2) el2.textContent = 8;
    const el3 = document.getElementById('kpi-pending-evals'); if(el3) el3.textContent = 3;
    // alerts
    const alerts = document.getElementById('alerts-list');
    if(alerts) alerts.innerHTML = ['تذكير: فحص تأمين', 'جلسة إضافية يوم الجمعة'].map(t=>`<li>${t}</li>`).join('');
    // today sessions table
    const tbl = document.getElementById('tbl-today');
    if(tbl) tbl.innerHTML = [
      {time:'08:00', group:'أ', type:'تمارين قوة', dur:'60'},
      {time:'10:00', group:'ب', type:'تكتيك', dur:'90'}
    ].map(r=>`<tr><td>${r.time}</td><td>${r.group}</td><td>${r.type}</td><td>${r.dur}د</td><td><button class="btn small">تفاصيل</button></td></tr>`).join('');
    // players summary
    const ptbl = document.getElementById('tbl-players');
    if(ptbl) ptbl.innerHTML = players.map(p=>`<tr><td>${p.name}</td><td>${p.group}</td><td>${p.rpe}</td><td>${p.load}</td><td><span class="status ${p.status==='نشط'?'active':'inactive'}">${p.status}</span></td></tr>`).join('');
  });
})();
