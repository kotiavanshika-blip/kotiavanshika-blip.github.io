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

  // Mumbai Memories: random photos from the "pictures" folder (1.jpg, 2.jpg ...)
  var PHOTO_TOTAL = 50;   // change this if you have a different number of photos
  var PHOTO_SHOW = 10;
  var collage = document.getElementById('collage');
  var memSection = document.getElementById('memories');
  function shuffleList(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var k = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[k]; a[k] = t;
    }
    return a;
  }
  var renderId = 0;
  function renderMemories() {
    var myId = ++renderId;
    var order = [], pos = 0, loaded = 0, failed = 0;
    for (var n = 1; n <= PHOTO_TOTAL; n++) order.push(n);
    shuffleList(order);
    collage.innerHTML = '';
    function add(slot) {
      if (myId !== renderId) return;
      if (pos >= order.length) { if (!loaded && failed >= order.length) memSection.hidden = true; return; }
      var num = order[pos++];
      var fig = document.createElement('figure');
      fig.className = 'memory';
      fig.style.setProperty('--r', (Math.random() * 8 - 4).toFixed(1) + 'deg');
      fig.style.setProperty('--d', (slot * 0.05).toFixed(2) + 's');
      var img = document.createElement('img');
      img.alt = 'A memory from Mumbai';
      img.loading = 'lazy';
      img.onload = function () { loaded++; };
      img.onerror = function () { if (myId !== renderId) return; failed++; fig.remove(); add(slot); };
      img.src = 'pictures/' + num + '.jpg';
      fig.appendChild(img);
      collage.appendChild(fig);
    }
    for (var s = 0; s < PHOTO_SHOW; s++) add(s);
  }
  document.getElementById('shuffleBtn').addEventListener('click', renderMemories);
  renderMemories();

  // Mumbai memories: 5 random photos out of the pictures folder
  var TOTAL = 35, SHOW = 5, PREFIX = 'pictures/', EXTS = ['.jpeg', '.jpg', '.JPEG', '.JPG'];
  var collage = document.getElementById('collage');
  var shuffleBtn = document.getElementById('shuffleBtn');
  var memSection = document.getElementById('memories');
  var busy = false;
  function shuffleArr(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var k = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[k]; a[k] = t;
    }
    return a;
  }
  function probe(id) {
    return new Promise(function (res) {
      var k = 0;
      (function next() {
        if (k >= EXTS.length) return res(null);
        var im = new Image();
        im.onload = function () { res(im.src); };
        im.onerror = function () { next(); };
        im.src = PREFIX + id + EXTS[k++];
      })();
    });
  }
  function render(list) {
    collage.innerHTML = '';
    list.forEach(function (src, i) {
      var f = document.createElement('figure'); f.className = 'snap';
      f.style.animationDelay = (i * 0.08) + 's';
      var tape = document.createElement('span'); tape.className = 'tape';
      var im = document.createElement('img');
      im.src = src; im.alt = 'A moment from Mumbai'; im.loading = 'lazy';
      f.appendChild(tape); f.appendChild(im); collage.appendChild(f);
    });
  }
  async function loadMemories() {
    if (busy) return;
    busy = true; shuffleBtn.textContent = 'Shuffling…';
    var ids = [], got = [];
    for (var n = 1; n <= TOTAL; n++) ids.push(n);
    shuffleArr(ids);
    while (got.length < SHOW && ids.length) {
      var batch = ids.splice(0, SHOW - got.length);
      var res = await Promise.all(batch.map(probe));
      res.forEach(function (s) { if (s) got.push(s); });
    }
    if (got.length) { render(got); memSection.hidden = false; } else { memSection.hidden = true; }
    shuffleBtn.textContent = 'Shuffle memories';
    busy = false;
  }
  shuffleBtn.addEventListener('click', loadMemories);
  loadMemories();

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
