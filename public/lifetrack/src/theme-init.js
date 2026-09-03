// Runs before first paint (classic script, no module) to avoid a theme flash.
(function () {
  try {
    var t = localStorage.getItem('lifetrack:theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) { /* ignore */ }
})();
