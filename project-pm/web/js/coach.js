const { $ } = window.App;

/* بيانات */
const todaySessions = [
  { time:'5:00م', group:'U14 أ', type:'تكتيك', dur:'75د' },
  { time:'7:00م', group:'U12 ب', type:'قوة',   dur:'60د' },
];

const myPlayers = [
  { name:'سالم المطيري',   group:'U14 أ', lastRpe:7, load:420, status:'جاهز' },
  { name:'زياد الشهري',    group:'U14 أ', lastRpe:8, load:510, status:'مرتفع' },
  { name:'بدر الحارثي',    group:'U12 ب', lastRpe:5, load:300, status:'جاهز' },
  { name:'خالد القحطاني',   group:'U12 ب', lastRpe:3, load:180, status:'تعافي' },
];

/* KPIs */
$('#kpi-my-players').textContent   = String(myPlayers.length);
$('#kpi-week-sessions').textContent= '12';
$('#kpi-pending-evals').textContent= '5';

/* جلسات اليوم */
const tb1 = $('#tbl-today');
if(tb1) tb1.innerHTML = todaySessions.map(s=>`
  <tr>
    <td>${s.time}</td>
    <td>${s.group}</td>
    <td>${s.type}</td>
    <td>${s.dur}</td>
    <td><button class="btn secondary small">فتح</button></td>
  </tr>
`).join('');

/* ملخص اللاعبين */
const tb2 = $('#tbl-players');
if(tb2) tb2.innerHTML = myPlayers.map(p=>{
  const badge = p.status==='مرتفع'
    ? `<span class="status inactive">مرتفع</span>`
    : `<span class="status active">${p.status}</span>`;
  return `
    <tr>
      <td>${p.name}</td>
      <td>${p.group}</td>
      <td>${p.lastRpe}</td>
      <td>${p.load}</td>
      <td>${badge}</td>
    </tr>
  `;
}).join('');

/* تنبيهات */
const alerts = [
  'ACWR الأسبوعي مرتفع للاعبين 2 — قلل الحمل 20%',
  'جلسة U14 اليوم 7م — أضف جزء تعافي خفيف',
];
const ul = document.getElementById('alerts-list');
if (ul) ul.innerHTML = alerts.map(a=>`<li>${a}</li>`).join('');