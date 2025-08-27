// ملئ بيانات وهمية لمدير الفرع
(function(){
  const groups = [
    {name:'مجموعة الصباح', coach:'سعيد', days:'الثلاثاء،الخميس', time:'08:30', status:'نشط'},
    {name:'مبتدئين', coach:'نوف', days:'السبت', time:'17:00', status:'نشط'}
  ];
  document.addEventListener('DOMContentLoaded', ()=>{
    const a1 = document.getElementById('a-kpi-members'); if(a1) a1.textContent = 312;
    const a2 = document.getElementById('a-kpi-dues'); if(a2) a2.textContent = common.formatCurrency(4300);
    const a3 = document.getElementById('a-kpi-sessions'); if(a3) a3.textContent = 12;
    const tbody = document.getElementById('a-tbl');
    if(tbody) tbody.innerHTML = groups.map(g=>`<tr><td>${g.name}</td><td>${g.coach}</td><td>${g.days}</td><td>${g.time}</td><td><span class="status active">${g.status}</span></td></tr>`).join('');
  });
})();
