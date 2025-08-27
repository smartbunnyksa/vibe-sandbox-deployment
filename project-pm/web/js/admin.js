const { $ } = window.App;
$('#a-kpi-members').textContent='240';
$('#a-kpi-dues').textContent='12';
$('#a-kpi-sessions').textContent='18';

const rows=[
  { g:'U14 أ', coach:'سالم', days:'س/ث/خ', time:'7:00م', status:'نشط' },
  { g:'U12 ب', coach:'أحمد', days:'أ/ث/خ', time:'5:30م', status:'نشط' },
  { g:'U10 ج', coach:'زياد', days:'س/ث',   time:'6:00م', status:'متوقف' },
];
$('#a-tbl').innerHTML = rows.map(r=>{
  const b = r.status==='نشط' ? `<span class="status active">نشط</span>` : `<span class="status inactive">متوقف</span>`;
  return `<tr><td>${r.g}</td><td>${r.coach}</td><td>${r.days}</td><td>${r.time}</td><td>${b}</td></tr>`;
}).join('');