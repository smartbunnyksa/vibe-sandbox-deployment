// ملئ بيانات وهمية للاعب
(function(){
  const schedule = [
    {date:'2025-08-27', title:'تدريب قوة', dur:'60', target:'متوسط'},
    {date:'2025-08-29', title:'تدريب تكتيك', dur:'90', target:'عالي'}
  ];
  const alerts = ['تأكد من تعبئة الRPE', 'اجتماع وليّ الأمر الخميس'];
  document.addEventListener('DOMContentLoaded', ()=>{
    const k1 = document.getElementById('kpi-pl-load'); if(k1) k1.textContent = '34 أح.و';
    const k2 = document.getElementById('kpi-pl-sessions'); if(k2) k2.textContent = 4;
    const k3 = document.getElementById('kpi-pl-last'); if(k3) k3.textContent = 7.5;
    // schedule table
    const tbl = document.getElementById('tbl-player-schedule');
    if(tbl) tbl.innerHTML = schedule.map(s=>`<tr><td>${s.date}</td><td>${s.title}</td><td>${s.dur}د</td><td>${s.target}</td><td><button class="btn small">سجل</button></td></tr>`).join('');
    // alerts
    const a = document.getElementById('player-alerts');
    if(a) a.innerHTML = alerts.map(x=>`<li>${x}</li>`).join('');
  });
})();
