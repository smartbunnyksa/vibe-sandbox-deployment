// أدوات عامة
const $  = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>Array.from(c.querySelectorAll(s));
const el = (h)=>{const d=document.createElement('div');d.innerHTML=h.trim();return d.firstElementChild;};
const escapeHtml=(x='')=>String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&gt;",">":"&gt;".replace(">","&gt;"),'"':"&quot;","'":"&#39;"}[m]));

// Modal بسيط
const AppModal={
  open({title='عنوان',body='',okText='حفظ',cancelText='إلغاء',onOk}={}){
    const backdrop=el(`<div class="modal-backdrop"></div>`);
    const modal=el(`
      <div class="modal" role="dialog" aria-modal="true">
        <header>
          <h3 class="title">${title}</h3>
          <button class="btn secondary small" data-close>إغلاق</button>
        </header>
        <div class="body"></div>
        <footer>
          <button class="btn secondary" data-close>${cancelText}</button>
          <button class="btn" data-ok>${okText}</button>
        </footer>
      </div>
    `);
    $('.body',modal).append(body instanceof HTMLElement?body:el(`<div>${body}</div>`));
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    const close=()=>backdrop.remove();
    backdrop.addEventListener('click',e=>{if(e.target===backdrop)close();});
    $$('[data-close]',modal).forEach(b=>b.onclick=close);
    $('[data-ok]',modal).onclick=()=>{try{onOk&&onOk();}finally{close();}};
    return {close};
  },
  confirm({title='تأكيد',body='هل أنت متأكد؟',okText='موافق',cancelText='إلغاء'}={}){
    return new Promise(resolve=>{
      const ref=this.open({title,body,okText,cancelText,onOk:()=>resolve(true)});
      // إغلاق بالنقر خارج = إلغاء
      document.querySelector('.modal-backdrop')?.addEventListener('click',e=>{ if(e.target.classList.contains('modal-backdrop')) resolve(false); }, {once:true});
      $$('[data-close]').forEach(b=>b.addEventListener('click',()=>resolve(false),{once:true}));
    });
  }
};

// ثيم
function initThemeToggle(){
  const KEY='bl-theme';
  const saved=localStorage.getItem(KEY);
  if(saved){document.body.setAttribute('data-theme',saved);}
  const btn=$('#themeToggle');
  if(btn){
    btn.onclick=()=>{
      const cur=document.body.getAttribute('data-theme')==='dark'?'light':'dark';
      document.body.setAttribute('data-theme',cur);
      localStorage.setItem(KEY,cur);
    };
  }
}

// تنقل الصفحات (Hash Router)
function initNavRouting(defaultSection='dashboard'){
  const pages=$$('.page');
  const side=$('aside nav');
  function show(id){
    pages.forEach(p=>p.style.display=(p.id===id?'block':'none'));
    if(side){
      side.querySelectorAll('a').forEach(a=>{
        const t=a.getAttribute('href')?.replace('#','');
        a.classList.toggle('active',t===id);
      });
    }
    location.hash=id;
  }
  const wanted=location.hash?.replace('#','')||defaultSection;
  show(wanted);
  if(side){
    side.addEventListener('click',e=>{
      const a=e.target.closest('a[href^="#"]'); if(!a) return;
      e.preventDefault(); show(a.getAttribute('href').slice(1));
    });
  }
  window.addEventListener('hashchange',()=>show(location.hash.replace('#','')||defaultSection));
}

// فحص تحميل الـ CSS
function sanityCheck(){
  const val=getComputedStyle(document.body).getPropertyValue('--bg');
  if(!val) console.warn('⚠️ لم يتم تحميل theme.css — تحقق من المسار.');
}

window.App={ $, $$, el, escapeHtml, AppModal, initThemeToggle, initNavRouting, sanityCheck };
window.initLayout=function(defaultSection='dashboard'){ sanityCheck(); initThemeToggle(); initNavRouting(defaultSection); };