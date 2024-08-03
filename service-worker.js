importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
var baseUrl = '/live/';
var appVersion = '2.6.4-114';
var dataVersion = '9';
var vendorVersion = '10';
var bgVersion = '8';

// Detailed logging is very useful during development
workbox.setConfig({
  debug: true,
});

// Updating SW lifecycle to update the app after user triggered refresh
workbox.core.skipWaiting();
workbox.core.clientsClaim();
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
  {
    url: toUrl('assets/images/alert1.png'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/images/alert2.gif'),
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
    url: toUrl('assets/analog-clock/analog-clock.js'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/css/app.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/analog-clock/analog-clock.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/css/theme-default.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/analog-clock/analog-clock-layout.css'),
    revision: appVersion,
  },
  // 'prayer-data-*.js',
  // 'assets/**/*.{css,js}',
];

var backgroundsList = [];
for (var i = 0; i <= 59; i++) {
  backgroundsList.push({
    url: toUrl('backgrounds/' + i + '.jpg'),
    revision: bgVersion,
  });
}
precacheList = precacheList.concat(backgroundsList);

var analogClockThemes = ['default', 'modern'];
var analogClockThemeFileNames = [
  'clock-face.png',
  'clock-hand-hours.png',
  'clock-hand-minutes.png',
  'clock-hand-seconds.png',
  'clock-center-circle.png',
];

var analogClockThemeFiles = [];
for (var i = 0; i < analogClockThemes.length; i++) {
  for (var j = 0; j < analogClockThemeFileNames.length; j++) {
    analogClockThemeFiles.push({
      url: toUrl('assets/analog-clock/themes/' + analogClockThemes[i] + '/' + analogClockThemeFileNames[j]),
      revision: vendorVersion,
    });
  }
}
precacheList = precacheList.concat(analogClockThemeFiles);

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
