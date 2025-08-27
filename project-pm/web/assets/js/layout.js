// بسيط: إدارة الثيم، initLayout لعرض/إخفاء الصفحات وربط روابط الشريط الجانبي
(function(){
  // theme init & toggle
  const root = document.body;
  const stored = localStorage.getItem('theme');
  if(stored) root.setAttribute('data-theme', stored);
  function setTheme(t){ root.setAttribute('data-theme', t); localStorage.setItem('theme', t); }
  function toggleTheme(){ setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
  window.toggleTheme = toggleTheme;
  // bind any theme buttons
  document.addEventListener('click', (e)=>{
    if(!e.target) return;
    if(e.target.id === 'themeToggle' || e.target.id === 'btn-theme') toggleTheme();
  });

  // Simple page router for ".page" sections and nav links
  function showPage(id){
    const pages = document.querySelectorAll('main .page, main > section.page');
    pages.forEach(p => p.style.display = (p.id === id) ? '' : 'none');
    // highlight nav
    document.querySelectorAll('aside nav a').forEach(a=>{
      const href = a.getAttribute('href') || '';
      a.classList.toggle('active', href === '#' + id);
    });
    // update hash without scrolling
    if(location.hash !== '#' + id) history.replaceState(null,'', '#' + id);
  }

  function handleNavClicks(){
    document.querySelectorAll('aside nav a').forEach(a=>{
      a.addEventListener('click', (ev)=>{
        const href = a.getAttribute('href') || '';
        if(href.startsWith('#')){
          ev.preventDefault();
          const id = href.slice(1);
          showPage(id);
        }
      });
    });
  }

  window.initLayout = function(defaultPage){
    document.addEventListener('DOMContentLoaded', ()=>{
      handleNavClicks();
      const hash = (location.hash || '').replace('#','');
      const start = hash || defaultPage || document.querySelector('main .page')?.id || 'dashboard';
      showPage(start);
      window.addEventListener('hashchange', ()=> {
        const h = (location.hash || '').replace('#','');
        if(h) showPage(h);
      });
    });
  };
})();
