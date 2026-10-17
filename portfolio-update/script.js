(function () {
  // Mobile menu
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('navLinks');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? 'Close' : 'Menu';
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target) && !btn.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Project media popup
  var media = {
    companion: { t: 'Smart Student Companion: app screens', imgs: [
      ['media/companion-1.png', 'Login screen of the Smart Student Companion app'],
      ['media/companion-2.png', 'Task list with progress bar and add-task form'],
      ['media/companion-3.png', 'Study timer screen']] },
    finance: { t: 'Personal Finance Crisis Manager: demo', video: 'media/finance-demo.mp4', poster: 'media/finance-poster.jpg' },
    ambulance: { t: 'AI-Powered Smart Ambulance System: demo', video: 'media/ambulance-demo.mp4', poster: 'media/ambulance-poster.jpg' }
  };
  var mm = document.getElementById('mediaModal');
  var mmBody = document.getElementById('mmBody');
  var lastBtn = null;
  function closeMedia() {
    var v = mmBody.querySelector('video'); if (v) v.pause();
    if (mm.close) mm.close(); else mm.removeAttribute('open');
  }
  document.querySelectorAll('.media-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var m = media[b.getAttribute('data-media')];
      lastBtn = b;
      document.getElementById('mmTitle').textContent = m.t;
      mmBody.innerHTML = '';
      if (m.video) {
        var v = document.createElement('video');
        v.controls = true; v.preload = 'metadata'; v.setAttribute('playsinline', '');
        v.poster = m.poster; v.src = m.video;
        mmBody.appendChild(v);
      } else {
        var d = document.createElement('div'); d.className = 'shots';
        m.imgs.forEach(function (i) {
          var im = document.createElement('img'); im.src = i[0]; im.alt = i[1]; im.loading = 'lazy';
          d.appendChild(im);
        });
        mmBody.appendChild(d);
      }
      if (mm.showModal) mm.showModal(); else mm.setAttribute('open', '');
    });
  });
  document.getElementById('mmClose').addEventListener('click', closeMedia);
  mm.addEventListener('click', function (e) { if (e.target === mm) closeMedia(); });
  mm.addEventListener('close', function () { var v = mmBody.querySelector('video'); if (v) v.pause(); if (lastBtn) lastBtn.focus(); });

  // Scroll reveal
  var items = document.querySelectorAll('.paper, .polaroid, .timeline li');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  // Active nav link
  var links = document.querySelectorAll('.links a');
  var secs = document.querySelectorAll('main section[id]');
  window.addEventListener('scroll', function () {
    var y = window.scrollY + 120, cur = '';
    secs.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
    links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur); });
  }, { passive: true });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
