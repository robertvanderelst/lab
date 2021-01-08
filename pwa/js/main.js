window.onload = () => {
  'use strict';

  console.log('MAIN');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwa/js/sw.js');
  }
}
