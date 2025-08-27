// ملئ بيانات وهمية لوليّ الأمر
(function(){
  const kids = [
    {name:'ريان', group:'أ', lastEval:7, attend:'8/10'},
    {name:'لين', group:'ب', lastEval:6.5, attend:'9/10'}
  ];
  document.addEventListener('DOMContentLoaded', ()=>{
    const k1 = document.getElementById('kpi-pa-kids'); if(k1) k1.textContent = kids.length;
    const k2 = document.getElementById('kpi-pa-upcoming'); if(k2) k2.textContent = 2;
    const k3 = document.getElementById('kpi-pa-due'); if(k3) k3.textContent = common.formatCurrency(150);
    const tbl = document.getElementById('tbl-parent-kids');
    if(tbl) tbl.innerHTML = kids.map(k=>`<tr><td>${k.name}</td><td>${k.group}</td><td>${k.lastEval}</td><td>${k.attend}</td><td><button class="btn small">عرض</button></td></tr>`).join('');
    const alerts = document.getElementById('parent-alerts');
    if(alerts) alerts.innerHTML = ['فاتورة مستحقة', 'اجتماع مدرسي'].map(t=>`<li>${t}</li>`).join('');
  });
})();
