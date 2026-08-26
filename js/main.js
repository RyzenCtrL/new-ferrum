/* ============================================================================
   FERRUM · Интерактив
   Всё уважает prefers-reduced-motion. Никаких зависимостей.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Оркестрованный вход hero (сигнатурная линия) ─── */
  document.documentElement.classList.add('is-loaded');

  /* ─── Навбар: solid при скролле ─── */
  var nav = document.querySelector('[data-nav]');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-solid', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── Мобильное меню ─── */
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-mobile-menu]');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (menu) {
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ─── Reveal секций + запуск счётчиков ─── */
  var revealEls = document.querySelectorAll('.reveal');
  var stepEls = document.querySelectorAll('.step');
  var counterEls = document.querySelectorAll('[data-count]');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    stepEls.forEach(function (el) { el.classList.add('is-visible'); });
    runAllCounters();
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        // каскад для группы карточек/шагов внутри общего родителя
        if (el.classList.contains('reveal')) {
          var siblings = Array.prototype.filter.call(
            el.parentElement ? el.parentElement.children : [],
            function (c) { return c.classList && c.classList.contains('reveal'); }
          );
          var idx = siblings.indexOf(el);
          el.style.transitionDelay = (idx > 0 ? Math.min(idx, 6) * 70 : 0) + 'ms';
          el.classList.add('is-visible');
        }
        if (el.classList.contains('step')) el.classList.add('is-visible');

        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
    stepEls.forEach(function (el) { io.observe(el); });

    // счётчики — отдельный наблюдатель на каждый элемент (работает и в hero, вне .reveal)
    var counterIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counterEls.forEach(function (el) { counterIO.observe(el); });
  }

  /* ─── Счётчики ─── */
  function animateCounter(node) {
    if (node.dataset.done) return;
    node.dataset.done = '1';
    var target = parseInt(node.getAttribute('data-count'), 10) || 0;
    var suffix = node.getAttribute('data-suffix') || '';
    if (prefersReduced) { node.textContent = format(target) + suffix; return; }

    var dur = 1200, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      node.textContent = format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function format(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // тонкий разделитель тысяч
  }
  function runAllCounters() {
    document.querySelectorAll('[data-count]').forEach(animateCounter);
  }

  /* ─── FAQ аккордеон ─── */
  document.querySelectorAll('[data-acc]').forEach(function (btn) {
    var panel = btn.nextElementSibling;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      // закрыть остальные
      document.querySelectorAll('[data-acc]').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.height = '0px';
        }
      });
      btn.setAttribute('aria-expanded', String(!open));
      panel.style.height = open ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* ─── Фильтры проектов (визуальное состояние) ─── */
  document.querySelectorAll('.filters .filter').forEach(function (f) {
    f.addEventListener('click', function () {
      f.parentElement.querySelectorAll('.filter').forEach(function (x) { x.classList.remove('is-active'); });
      f.classList.add('is-active');
      // Реальная фильтрация появится вместе с настоящими проектами.
    });
  });

  /* ─── Форма расчёта: валидация + экран успеха (заглушка) ─── */
  var form = document.querySelector('[data-form]');
  var success = document.querySelector('[data-success]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var ok = input.value && input.value.trim() !== '';
        input.classList.toggle('is-error', !ok);
        if (!ok && valid) { input.focus(); valid = false; }
      });
      if (!valid) return;

      /* TODO: здесь подключается реальная отправка лида
         (email / Telegram-бот / CRM). Сейчас — заглушка. */
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
      }
    });

    // снимаем ошибку при вводе
    form.querySelectorAll('[required]').forEach(function (input) {
      input.addEventListener('input', function () { input.classList.remove('is-error'); });
    });
  }
})();
