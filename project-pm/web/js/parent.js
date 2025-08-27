/* =====================
   parent.js — وليّ الأمر
   ===================== */

const kids = [
  {name:'محمد', group:'U12-A', last:'4.1/5', att:'92%'},
  {name:'أحمد', group:'U10-B', last:'3.8/5', att:'88%'},
];

function PA_overview(){
  $('#pa-kpi-kids') ?.textContent = kids.length;
  $('#pa-kpi-up')   ?.textContent = 4;
  $('#pa-kpi-due')  ?.textContent = formatSAR(320);
}

function PA_table(){
  const tb = $('#pa-tbody'); if(!tb) return;
  tb.innerHTML = kids.map(k=>`
    <tr>
      <td>${escapeHtml(k.name)}</td>
      <td>${escapeHtml(k.group)}</td>
      <td>${escapeHtml(k.last)}</td>
      <td>${escapeHtml(k.att)}</td>
      <td><button class="btn secondary">تفاصيل</button></td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', ()=>{
  PA_overview();
  PA_table();
});