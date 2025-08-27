/* ====================
   player.js — اللاعب
   ==================== */

async function P_overview(){
  $('#p-kpi-load')    ?.textContent = '430 AU';
  $('#p-kpi-sessions')?.textContent = '3';
  $('#p-kpi-last')    ?.textContent = '4.2 / 5';
}

async function P_schedule(){
  const data = await FakeAPI.playerSchedule();
  const tb = $('#p-tbody'); if(!tb) return;
  tb.innerHTML = data.map(s=>`
    <tr>
      <td>${escapeHtml(s.date)}</td>
      <td>${escapeHtml(s.title)}</td>
      <td>${escapeHtml(s.dur)}</td>
      <td>${escapeHtml(s.target)}</td>
      <td><button class="btn secondary" data-rpe="${escapeHtml(s.date)}">تسجيل RPE</button></td>
    </tr>
  `).join('');

  // اللاعب يسجل RPE لنفسه — التقييم الفني يُنشئه المدرب فقط
  $$('[data-rpe]', tb).forEach(btn=>btn.onclick=()=>{
    const when = btn.dataset.rpe;
    const form = el(`
      <form class="form-grid">
        <label><span class="lbl">الجلسة</span><input class="input" value="${escapeHtml(when)}" disabled></label>
        <label><span class="lbl">RPE (0–10)</span><input type="number" min="0" max="10" value="6" class="input" id="rpe"></label>
        <label><span class="lbl">الدقائق</span><input type="number" min="0" value="60" class="input" id="min"></label>
      </form>
    `);
    AppModal.open({title:'تسجيل RPE', body:form, onOk:()=>Toast.show('تم التسجيل')});
  });
}

function P_alerts(){
  const ul = $('#p-alerts'); if(!ul) return;
  ul.innerHTML = [
    'تذكير: نومك أقل من 7 ساعات ليلتين متتاليتين.',
    'موعد تقييم شهري خلال الأسبوع القادم (يظهر عند الإنشاء من مدربك).'
  ].map(t=>`<li>${t}</li>`).join('');
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await P_overview();
  await P_schedule();
  P_alerts();
});