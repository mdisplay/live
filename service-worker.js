importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
if (workbox) {
  console.log('Yay! Workbox is loaded 🎉');
} else {
  console.log("Boo! Workbox didn't load 😬");
}
var baseUrl = '/live/';
var appVersion = '3.0.23-233';
var dataVersion = '10';
var vendorVersion = '71';
var bgVersion = '9';

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
  {
    url: toUrl('prayernew-data.js'),
    revision: appVersion,
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
    url: toUrl('assets/images/alert-phone-moonlight.svg'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/images/alert2.gif'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/images/galaxy-bg1.svg'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/images/sunrise-bg.svg'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/images/night-sky-bg.svg'),
    revision: vendorVersion,
  },
  {
    url: toUrl('assets/images/cosmic-bg.svg'),
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
    url: toUrl('assets/css/common.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/css/reset.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/css/app-settings.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/css/theme-base.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/analog-clock/analog-clock.css'),
    revision: appVersion,
  },
  {
    url: toUrl('assets/analog-clock/analog-clock-layout.css'),
    revision: appVersion,
  },
  // 'prayer-data-*.js',
  // 'assets/**/*.{css,js}',
];

// theme CSS files (one file per theme)
var themeCssFiles = ['theme-digital-default.css', 'theme-sunrise.css', 'theme-moonlight-common.css', 'theme-moonlight-flat.css', 'theme-moonlight-basic.css', 'theme-moonlight-analog-basic.css', 'theme-moonlight-gradient.css', 'theme-moonlight.css', 'theme-moonlight-analog.css', 'theme-night-sky.css', 'theme-cosmic.css', 'theme-cosmic-analog.css'];
for (var themeIndex = 0; themeIndex < themeCssFiles.length; themeIndex++) {
  precacheList.push({
    url: toUrl('assets/css/' + themeCssFiles[themeIndex]),
    revision: vendorVersion,
  });
}

// analog clock faces that ship their own SVG file
var analogThemes = ['sunrise', 'galaxy', 'cosmic'];
for (var analogIndex = 0; analogIndex < analogThemes.length; analogIndex++) {
  precacheList.push({
    url: toUrl('assets/analog-clock/themes/' + analogThemes[analogIndex] + '/face.svg'),
    revision: vendorVersion,
  });
}

var backgroundsList = [];
for (var i = 0; i <= 59; i++) {
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
