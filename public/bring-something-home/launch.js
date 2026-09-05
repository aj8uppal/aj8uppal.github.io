// Keep realm and expedition invitations intact when arriving via the portfolio.
const destination = new URL('https://bring-something-home.fly.dev/');
destination.search = window.location.search;
destination.hash = window.location.hash;
window.location.replace(destination.href);
