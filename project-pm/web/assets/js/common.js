// Helpers بسيطة لبناء صفوف الجداول
window.common = {
  formatCurrency(v){ return typeof v === 'number' ? v.toLocaleString('ar-EG') + ' ر.س' : v; },
  buildRows(rows, cols){
    return rows.map(r=>'<tr>'+cols.map(c=>`<td>${r[c] ?? ''}</td>`).join('')+'</tr>').join('');
  }
};
