importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

var appVersion = '1.15.0-70';
var dataVersion = '6';
var vendorVersion = '6';
var bgVersion = '7';

// Detailed logging is very useful during development
workbox.setConfig({ debug: true });

// Updating SW lifecycle to update the app after user triggered refresh
workbox.core.skipWaiting();
workbox.core.clientsClaim();

var baseUrl = '/live/';
// var baseUrl = '/mdisplay/live/';

function toUrl(url) {
  return baseUrl + url;
}

var precacheList = [
  {
    url: toUrl(''),
    revision: appVersion,
  },
  {
    url: toUrl('index.html'),
    revision: appVersion,
  },
  {
    url: toUrl('prayer-data.js'),
    revision: dataVersion,
  },
  // vendors
  {
    url: toUrl('assets/vendors/vue.min.js'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/vendors/moment.min.js'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/vendors/hijri.js'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/vendors/reboot.css'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/vendors/workbox-window.prod.umd.js'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/vendors/jquery-3.6.0.min.js'),
    revision: vendorVersion,
  },
  // /icons
  {
    url: toUrl('assets/images/icon.png'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/images/favicon.png'),
    revision: vendorVersion,
  },
  // /app
  {
    url: toUrl('assets/js/translations.js'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/js/app.js'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/js/analog-clock.js'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/css/app.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/css/analog-clock.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/css/theme-default.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/css/analog-clock-theme.css'),
    revision: appVersion,
  },
  // 'prayer-data-*.js',
  // 'assets/**/*.{css,js}',
];

var backgroundsList = [];

for (var i = 1; i <= 11; i++) {
  backgroundsList.push({
    url: toUrl('backgrounds/' + i + '.jpg'),
    revision: bgVersion,
  });
}

precacheList = precacheList.concat(backgroundsList);

// precache all the site files
workbox.precaching.precacheAndRoute(precacheList, {
  ignoreURLParametersMatching: [/.*/],
});

// workbox.routing.registerRoute(
//   new RegExp(toUrl('backgrounds/.+.jpg')),
//   new workbox.strategies.CacheFirst({
//     // Use a custom cache name
//     cacheName: 'md-bg-' + bgVersion,
//   }),
// );
