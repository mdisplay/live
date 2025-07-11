// WARNING: do not use ES6 syntax
// The code should only be authored in ES5
// to support older generation Android TV boxes

var padZero = function padZero(number) {
  number = parseInt(number);
  if (number < 10) {
    return '0' + number;
  }
  return '' + number;
};
function Toast(message) {
  var self = this;
  self.message = message;
}
function Prayer(name, time, iqamahTime, lang, time24Format) {
  var self = this;
  self.name = name;
  self.nameDisplay = translations[lang][self.name];
  self.time = time;
  // self.iqamah = iqamahTime;
  // self.iqamah = 100;
  self.iqamahTime = iqamahTime; //new Date(self.time.getTime() + self.iqamah * 60 * 1000);
  var d = moment(self.time);
  self.timeDisplay = d.format(time24Format ? 'HH:mm' : 'hh:mm');
  self.timeAmPm = time24Format ? '' : d.format('A');
  self.timeHours = d.format(time24Format ? 'HH' : 'hh');
  self.timeMinutes = d.format('mm');
  var id = moment(self.iqamahTime);
  self.iqamahTimeDisplay = id.format(time24Format ? 'HH:mm' : 'hh:mm');
  self.iqamahTimeHours = id.format(time24Format ? 'HH' : 'hh');
  self.iqamahTimeMinutes = id.format('mm');
  self.iqamahTimeAmPm = time24Format ? '' : id.format('A');
}
function IqamahTime(minutes, hours, absolute) {
  var self = this;
  self.minutes = padZero(minutes || 0);
  hours = parseInt(hours);
  self.hours = hours ? padZero(hours) : '';
  self.absolute = !!absolute;
  self.toTime = function () {
    return self.hours + ':' + self.minutes;
  };
  self.toRaw = function () {
    return {
      hours: self.hours,
      minutes: self.minutes,
      absolute: self.absolute,
    };
  };
}
IqamahTime.fromRaw = function (raw) {
  return new IqamahTime(raw.minutes, raw.hours, raw.absolute);
};
function App() {
  var self = this;
  self.sunriseSupport = localStorage.getItem('mdisplay.sunriseSupport') !== '0';
  self.lang = localStorage.getItem('mdisplay.lang') || 'en';
  self.prayerDataId = localStorage.getItem('mdisplay.prayerDataId') || 'Colombo';
  self.prayerNewDataId = localStorage.getItem('mdisplay.prayerNewDataId') || 'NONE';
  self.checkInternetJsonp = {
    jsonpCallback: 'checkInternet',
    url: 'https://mdisplay.github.io/live/check-internet.js',
    // url: ' http://192.168.1.10:3000/live/check-internet.js'
  };

  var timeServerIp = '192.168.1.1';
  var timeServerApi = 'http://' + timeServerIp + '/api';
  var internetTimeApi = 'https://api.allorigins.win/raw?url=http%3A%2F%2Fworldtimeapi.org%2Fapi%2Ftimezone%2Futc&_=_timestamp_';
  self.timeServerApi = timeServerApi;
  self.retryWifiCount = 0;
  self.retryLastMillis = 0;
  self.useDeviceTimeOnly = false;

  var mdLauncher_SETTINGS_STORAGE_KEY = 'mdisplay-launcher.settings2';
  self.launcherSettings = undefined;
  if (window.location.protocol == 'file:') {
    try {
      self.launcherSettings = JSON.parse(localStorage.getItem(mdLauncher_SETTINGS_STORAGE_KEY));
    } catch(e) {}
  }

  self.data = {
    appVersion: {
      fullVersion: '?v=0.0.0-000',
      versionString: '0.0.0',
      versionNumber: 0,
    },
    showSplash: true,
    // currentPrayerWaiting: false,
    // time: new Date(),
    // timeDisplay:
    // prayers: [],
    settingsMode: false,
    iqamahTimesConfigured: false,
    iqamahTimes: {
      Subah: new IqamahTime(20),
      Luhar: new IqamahTime(15),
      Asr: new IqamahTime(15),
      Magrib: new IqamahTime(10),
      Isha: new IqamahTime(15),
      Jummah: new IqamahTime(45),
      Tarawih: new IqamahTime(45),
    },
    appUdate: {
      enabled: false,
      checking: false,
      updated: false,
      updating: false,
      error: false,
    },
    kioskMode: {
      available: false,
      enabled: false,
      isHome: false,
      switchLauncher: function switchLauncher() {
        alert('Kiosk not available');
      },
    },
    toasts: [],
    timeOriginMode: 'auto',
    // or 'network'
    networkMode: 'network',
    // or 'timeserver',
    networkTimeApiUrl: timeServerApi,
    isFriday: false,
    selectedLanguage: self.lang,
    selectedPrayerDataId: self.prayerDataId,
    selectedPrayerNewDataId: self.prayerNewDataId,
    languages: [
      { id: 'si', label: 'Sinhala' },
      { id: 'ta', label: 'Tamil' },
      { id: 'en', label: 'English' },
    ],
    prayerDataList: [
      { id: 'Colombo', label: 'Sri Lanka Standard' },
      { id: 'Puttalam', label: 'Puttalam Grand Masjid' },
      { id: 'Mannar', label: 'Mannar' },
      { id: 'Eastern', label: 'Eastern', parent: 'Colombo', timeAdjustmentMinutes: -6 },
      { id: 'Central', label: 'Central (Kandy, Akurana) - beta' },
    ],
    prayerNewDataList: [
      { id: 'NONE', label: 'None', type: 'NEW'},
      { id: 'ZONE2', label: 'Zone 02: Jaffna & Nallur', type: 'NEW'},
      { id: 'ZONE3', label: 'Zone 03: Mullaitivu District (Except Nallurs, Kilinochchi, Vavuniya District)', type: 'NEW'},
      { id: 'ZONE4', label: 'Zone 04: Mannar & Puttalam District', type: 'NEW'},
      { id: 'ZONE5', label: 'Zone 05: Anuradhapura & Polonnaruwa District', type: 'NEW'},
      { id: 'ZONE6', label: 'Zone 06: Kurunegala District', type: 'NEW'},
      { id: 'ZONE7', label: 'Zone 07: Kandy, Matale & Nuwara Eliya District', type: 'NEW'},
      { id: 'ZONE8', label: 'Zone 08: Batticaloa & Ampara District', type: 'NEW'},
      { id: 'ZONE9', label: 'Zone 09: Trincomalee District', type: 'NEW'},
      { id: 'ZONE10', label: 'Zone 10: Badulla & Monaragala District, Dehiaththakandiya, Embilipitiya', type: 'NEW'},
      { id: 'ZONE11', label: 'Zone 11: Ratnapura & Kegalle District', type: 'NEW'},
      { id: 'ZONE12', label: 'Zone 12: Galle & Matara District', type: 'NEW'},
      { id: 'ZONE13', label: 'Zone 13: Hambantota District', type: 'NEW'},
    ],
    clockThemes: [
      { id: 'digitalDefault', label: 'Classic Digital' },
      { id: 'digitalModern', label: 'Modern Digital' },
      { id: 'analogDefault', label: 'Classic Analog' },
      { id: 'analogModern', label: 'Modern Analog' },
    ],
    timeOriginModes: [
      { id: 'auto', label: 'Auto (NTP first)' },
      { id: 'device', label: 'Device Only' },
      { id: 'network', label: 'Network (HTTP jsonp)' },
    ],
    analogClockActive: false,
    alertEnabled: true,
    analogClockTheme: 'default',
    digitalClockTheme: 'default',
    activeClockTheme: 'digitalDefault',
    networkTimeInitialized: false,
    timeIsValid: false,
    timeFetchingMessage: undefined,
    timeAdjustmentMinutes: 0,
    timeAdjustNew: {
      Subah: 0,
      Sunrise: 0,
      Luhar: 0,
      Asr: 0,
      Magrib: 0,
      Isha: 0,
    },
    timeServerSSID: localStorage.getItem('mdisplay.ssid') || 'MDisplay TimeServer',
    timeServerSSIDs: ['NodeMCU TimeServer', 'MDisplay TimeServer'],
    network: {
      status: 'Unknown',
      connecting: undefined,
      internetStatus: 'Unknown',
      internetAvailable: true,
      showInternetAvailability: false,
    },
    lastKnownTime: undefined,
    timeOverrideEnabled: false,
    timeOverridden: false,
    time24Format: false,
    sunriseSupport: self.sunriseSupport,
    tarawihEnabled: false,
    showSunriseNow: false,
    expanded: {
      prayerTimesData: false,
      prayerNewTimesData: false,
      clockThemes: false,
      languages: false,
      timeOriginModes: false,
      timeAdjustNew: false,
    },
    focusActiveTimer: false,
    showRememberWifiSetting: false,
    rememberWifi: false,
    disconnectWifi: true,
    connectedWifiSSID: undefined,
    rememberedWifiSSID: '~',
    isCordovaReady: false,
    isDownloadsListOpen: false,
    downloadedFiles: [],
    alertImages: ['alert1.png', 'alert2.gif'],
    showSunriseLabel: false,
    splashScreenMillis: 4000,
    isPrayerNewDataApplied: false,
  };
  self.computed = {
    showAlert: function () {
      var shouldShow = self.data.prayerInfo === 'iqamah';
      if (!shouldShow) {
        return false;
      }
      return self.data.alertEnabled && (self.data.currentPrayerWaiting || self.data.currentPrayerAfter);
    },
    currentlyShowingAlert: function () {
      var shouldShow = self.data.prayerInfo === 'iqamah';
      var alerts = self.data.alertImages;
      if (!window._mdCurrentAlert) {
        window._mdCurrentAlert = 0;
      }
      if (shouldShow) {
        window._mdCurrentAlert += 1;
        if (window._mdCurrentAlert > alerts.length) {
          window._mdCurrentAlert = 1;
        }
      }
      return alerts[window._mdCurrentAlert - 1] || alerts[0];
    },
    prayersListDisplay: function () {
      return self.data.prayers.filter(function (prayer) {
        return prayer.name != 'Sunrise' && prayer.name != 'Tarawih';
      });
    },
    showTarawihNext: function () {
      return self.data.nextPrayer && self.data.nextPrayer.name == 'Isha' && self.data.tarawihEnabled && self.data.prayers[6] 
      && (self.data.showSunriseNow);
    },
  };

  self.showToast = function (message, duration) {
    duration = duration || 3000;
    var toast = new Toast(message);
    self.data.toasts.push(toast);
    setTimeout(function () {
      var i = self.data.toasts.indexOf(toast);
      if (i !== -1) {
        self.data.toasts.splice(i, 1);
      }
    }, duration);
  };

  self.selectedPrayerDataDetails = 
    self.data.prayerDataList.filter(function (pData) {
      return pData.id == self.prayerDataId;
    })[0] || self.prayerDataList[0];

  self.selectedPrayerNewDataDetails =
    self.data.prayerNewDataList.filter(function (pData) {
      return pData.id == self.prayerNewDataId;
    })[0] || self.prayerNewDataList[0];

  self.prayerNewDataAvailableMonths = {};

  self.prayerData = [];
  var prayerData =
    window.PRAYER_DATA[(self.selectedPrayerDataDetails && self.selectedPrayerDataDetails.parent) || self.prayerDataId];
  if (!prayerData) {
    self.showToast('Invalid Prayer Data. Falling back to default', 6000); 
    prayerData = window.PRAYER_DATA['Colombo'];
  }

  var prayerNewData =
    window.PRAYER_DATA[(self.selectedPrayerNewDataDetails && self.selectedPrayerNewDataDetails.parent) || self.prayerNewDataId];
  for (var month in prayerData) {
    self.prayerNewDataAvailableMonths[month] = false;
    if(prayerNewData && prayerNewData.hasOwnProperty(month)) {
      self.prayerNewDataAvailableMonths[month] = true;
      self.prayerData.push(prayerNewData[month]);
    }
    else if (prayerData.hasOwnProperty(month)) {
      if (prayerNewData) {
        self.showToast('Zone Data not available for ' + month + '. Falling back to old Prayer Data', 6000);
      }
      self.prayerData.push(prayerData[month]);
    }
  }

  self.isDeviceReady = false;
  self.isInitial = true;
  self.beforeSeconds = 5 * 60;
  // self.beforeSeconds = 1*60;
  self.afterSeconds = 5 * 60;
  // self.afterSeconds = 1;
  // self.afterSeconds = 1*60;
  self.afterSeconds = 2 * 60;
  self.pauseSeconds = 15;
  self.data.bgVersion = '7';

  // METHODS begin

  self.getDeviceTimeFormatted = function() {
    var m = moment();
    var time24Format = self.data.time24Format;
    return m.format('DD MMM YYYY, ' + (time24Format ? 'HH:mm:ss' : 'h:mm:ss A'));
  };
  self.languageChanged = function () {
    localStorage.setItem('mdisplay.lang', self.data.selectedLanguage);
    self.saveAndCloseSettings();
  };
  self.ssidChanged = function () {
    localStorage.setItem('mdisplay.ssid', self.data.timeServerSSID);
    self.updateSettings();
    // self.closeSettings();
  };
  self.checkNetworkStatus = function (isInitial) {
    if (!self.isDeviceReady || typeof Connection === 'undefined') {
      return;
    }
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown Connection';
    states[Connection.ETHERNET] = 'Ethernet Connection';
    states[Connection.WIFI] = 'WiFi Connection';
    states[Connection.CELL_2G] = 'Cell 2G Connection';
    states[Connection.CELL_3G] = 'Cell 3G Connection';
    states[Connection.CELL_4G] = 'Cell 4G Connection';
    states[Connection.CELL] = 'Cell Generic Connection';
    states[Connection.NONE] = 'No Network Connection';
    if (!self.data.network.connecting) {
      // self.data.network.status = states[networkState];
    }
    if (typeof WifiWizard2 === 'undefined') {
      return;
    }
    self.data.showRememberWifiSetting = true;
    if (networkState == Connection.WIFI) {
      if (!self.data.network.connecting) {
        self.data.network.status = 'Checking WiFi SSID...';
        WifiWizard2.getConnectedSSID().then(
          function (ssid) {
            self.data.network.status = states[Connection.WIFI] + ' (' + ssid + ')';
            self.data.connectedWifiSSID = ssid;
            self.data.network.connecting = undefined;
          },
          function (err) {
            self.data.network.status = states[Connection.WIFI] + ' (SSID err: ' + err + ')';
            self.data.network.connecting = undefined;
          }
        );
      }
    } else {
      if (self.data.rememberWifi) {
        var currentMillis = (new Date()).getTime();
        var retryAfter = 30 * 1000; // 30 seconds
        if(currentMillis > self.retryLastMillis + retryAfter) {
          self.retryLastMillis = currentMillis;
          self.retryWifiCount += 1;
          self.tryConnectingToWiFiSSID(self.data.rememberedWifiSSID, self.retryWifiCount);
        }
      }
    }

    // alert('Connection type: ' + states[networkState]);
  };

  self.checkNetworkStatusUntilTimeIsValid = function () {
    console.log('checkNetworkStatusUntilTimeIsValid');
    self.checkNetworkStatus();
    if (self.data.timeIsValid) {
      return;
    }
    setTimeout(function () {
      self.checkNetworkStatusUntilTimeIsValid();
    }, 3000);
  };

  self.appExpired = function() {
    if(!(window.cordova && window.location.protocol == 'file:')) {
      var notificationSeconds = 3000;
      self.showToast('Application updated. Reloading...', notificationSeconds);
      setTimeout(function () {
        window.location.reload();
      }, notificationSeconds);
      return;
    }
    if (!self.isDeviceReady) {
      return;
    }
    resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dataDir) {
      dataDir.getDirectory('app', {
        create: false,
        exclusive: false
      }, function (dirEntry) {
        console.log('yes dir');
        dirEntry.getDirectory('live-master', {
          create: false
        }, function (dirEntry) {
            console.log('yes zippy');
            dirEntry.getFile('_expired', {
            create: true
          }, function (entry) {
            console.log('_expired file created!');
            window.history.go(-1);
          }, function (err) {
              console.error('Could not create _expired file');
          });
        }, function (err) {
          console.error('Could not get zipDirectory: live-master');
        });
      }, function (err) {
        console.error('Could not get/create directory: app');
      });
    }, function (err) {
      console.error('Could not resolve data directory for: app');
    });
  }

  self.checkInternetAvailability = function (okCallback, retryCount, failCallback) {
    retryCount = retryCount || 0;
    self.setFetchingStatus('Checking Internet Connection...', 'init', true);
    var retry = function retry(okCallback) {
      if (retryCount <= 0) {
        failCallback();
        return;
      }
      setTimeout(function () {
        self.checkInternetAvailability(okCallback, retryCount - 1, failCallback);
      }, 3000);
    };

    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: self.checkInternetJsonp.url,
      jsonpCallback: self.checkInternetJsonp.jsonpCallback,
      contentType: 'application/json; charset=utf-8',
      success: function success(response) {
        // console.log('Result received', response);
        if (response && response.result == 'ok') {
          self.setFetchingStatus('Internet Connection OK ', 'success', false, 999);
          setTimeout(function () {
            self.data.network.internetAvailable = true;
            if(response.v) {
              var newVersion = self.parseVersion(response.v);
              if (newVersion && newVersion.versionNumber > self.data.appVersion.versionNumber) {
                self.appExpired();
              } else {
                self.noUpdateAvailable = true;
              }
            }
            okCallback();
            // self.data.network.checking = false;
          }, 2000);
          return;
        }
        self.data.network.internetAvailable = false;
        self.setFetchingStatus('INVALID response', 'error', false, 999);
        retry(okCallback);
      },
      error: function error(err) {
        // console.log('err: ', err);
        // // alert('err: ' + err);
        self.data.network.internetAvailable = false;
        self.setFetchingStatus('Internet Connection FAILED', 'error', false, 999);
        retry(okCallback);
      },
    });
  };
  self.checkForUpdates = function () {
    if (window.codePush === undefined) {
      console.log('codePush not available');
      alert('AUTO UPDATE not available!');
      return;
    }
    self.data.appUdate.enabled = true;
    // if(self.data.appUdate.updated) {
    //   return;
    // }
    self.data.appUdate.error = false;
    self.data.appUdate.checking = true;
    self.data.appUdate.updated = false;
    self.data.appUdate.updating = false;
    window.codePush.checkForUpdate(
      function (update) {
        self.data.appUdate.error = false;
        self.data.appUdate.checking = false;
        self.data.appUdate.updating = false;
        self.data.appUdate.updated = false;
        if (!update) {
          // alert("The app is up to date.");
          self.data.appUdate.updated = true;
        } else {
          self.data.appUdate.updating = true;
          window.askAndAutoUpdate();
          // alert("An update is available! Should we download it?");
          // window.codePush.restartApplication();
        }
      },
      function (error) {
        self.data.appUdate.checking = false;
        self.data.appUdate.updating = false;
        self.data.appUdate.updated = false;
        self.data.appUdate.error = error;
      }
    );
  };
  self.checkForKioskMode = function () {
    if (window.Kiosk === undefined) {
      self.data.kioskMode.available = false;
      self.data.kioskMode.enabled = false;
      self.data.kioskMode.isHome = false;
      console.log('Kiosk not available');
      return;
    }
    self.data.kioskMode.available = true;
    Kiosk.isInKiosk(function (isInKiosk) {
      self.data.kioskMode.enabled = isInKiosk;
    });
    Kiosk.isSetAsLauncher(function (isSetAsLauncher) {
      self.data.kioskMode.isHome = isSetAsLauncher;
    });
    self.data.kioskMode.switchLauncher = function () {
      Kiosk.switchLauncher();
    };
    // self.data.kioskMode.enabled = true;
    // kioskMode;
  };

  self.getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  };
  self.updateTime = function () {
    if (!self.data.time) {
      if (self.initialTestTime) {
        self.data.time = self.initialTestTime;
        self.data.timeOverridden = true;
      } else if (self.data.timeOverrideEnabled && self.data.lastKnownTime) {
        self.data.time = moment(self.data.lastKnownTime, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS).toDate();
        self.data.timeOverridden = true;
        var newDate = new Date();
        if (self.data.time.getTime() < newDate.getTime()) {
          // if the device time is updated, use it instead
          self.data.time = newDate;
          self.data.timeOverridden = false;
        }
        self.data.timeOverrideEnabled = false;
        self.writeStorage(); // make sure override is disabled in next page load
      } else {
        self.data.time = new Date();
      }
      self.data.time.setTime(self.data.time.getTime() - 1000);
      // if (self.data.timeOriginMode == 'network') {
      //   self.data.time.setFullYear(1970);
      // }
    }

    if (!self.useDeviceTimeOnly && (self.data.timeOverridden || self.data.timeOriginMode == 'auto' || self.data.timeOriginMode == 'network')) {
      self.data.time = new Date(self.data.time.getTime() + 1000);
    } else {
      self.data.time = new Date();
    }
    var lastKnownDate = new Date(2024, 8, 12, 21, 15);
    self.data.timeIsValid = self.data.time.getTime() >= lastKnownDate.getTime();
    if (!self.initialTestTime && !self.data.timeIsValid) {
      var d = new Date();
      if (d.getFullYear() >= lastKnownDate.getFullYear() /* && d.getSeconds() > 30 */) {
        // fallback mode
        // self.data.time = d;
      }
      // self.checkNetworkStatusUntilTimeIsValid();
    }

    if(!self.useDeviceTimeOnly && !self.data.timeOverridden) {
      var curr = new Date();
      var isDeviceTimeValid = (curr).getTime() >= lastKnownDate.getTime();
      if(isDeviceTimeValid) {
        self.showToast('isDeviceTimeValid: ' + isDeviceTimeValid, 1000);
        self.useDeviceTimeOnly = true; // should not persist to timeOriginMode. So using a temp prop to use in current page load
        // self.data.timeOriginMode = 'device';
        self.data.time = curr;
        self.data.timeIsValid = true;
      }
    }

    if (!self.data.timeIsValid) {
      // if (self.data.timeOriginMode != 'network' && self.data.network.internetAvailable === undefined) {
      //   self.checkInternetAvailability(
      //     () => {},
      //     0,
      //     () => {}
      //   );
      // }
      if (!(self.data.timeOriginMode == 'network' && self.data.networkTimeApiUrl == self.timeServerApi)) {
        self.checkNetworkStatus();
      } else {
        if (self.data.network.connecting === false) {
          self.checkNetworkStatus();
        }
      }
    } else {
      // time is valid
      if (
        self.useDeviceTimeOnly &&
        self.data.disconnectWifi &&
        self.launcherSettings && self.launcherSettings.zipFirst && !self.launcherSettings.zipCheckInternet &&
        self.data.rememberWifi && self.data.rememberedWifiSSID &&
        !self.wifiDisabled && self.noUpdateAvailable && self.isDeviceReady && self.data.timeIsValid && typeof WifiWizard2 !== 'undefined'
      ) {
        self.wifiDisabled = true;
        console.log('Disabling wifi in 10 seconds...');
        self.showToast('Disconnecting WiFi in 10 seconds...', 3000);
        setTimeout(function() {
          WifiWizard2.setWifiEnabled(false);
          // WifiWizard2.disconnect();
          console.log('Wifi Disabled');
          self.showToast('WiFi Disconnected', 3000);
          // self.data.time.setSeconds(58);
        }, 10 * 1000);
      }
    }
    var m = moment(self.data.time);
    var time24Format = self.data.time24Format;
    self.data.timeFormatted = m.format('DD MMM YYYY, ' + (time24Format ? 'HH:mm:ss' : 'h:mm:ss A'));
    self.data.timeDisplay = m.format(time24Format ? 'HH:mm' : 'hh:mm');
    self.data.timeDisplayHours = m.format(time24Format ? 'HH' : 'hh');
    self.data.timeDisplayMinutes = m.format('mm');
    self.data.timeDisplaySeconds = m.format('ss');
    self.data.timeDisplayColon = self.data.timeDisplayColon == ':' ? '' : ':';
    self.data.timeDisplayAmPm = time24Format ? '' : m.format('A');
    self.updateInternetTime();
  };
  self.getDateParams = function (date) {
    return [date.getFullYear(), date.getMonth(), date.getDate()];
  };
  self.getTime = function (yearParam, monthParam, dayParam, time) { 
    var timeParts = time.split(':');
    var hoursAdd = 0;
    if (timeParts[1].indexOf('p') != -1) {
      hoursAdd = 12;
    }
    var hours = hoursAdd + parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1].replace('a', '').replace('p', ''));
    console.log(time);
    // var m = moment(yearParam + ' ' + (monthParam + 1) + ' ' + dayParam + ' ' + time + 'm', 'YYYY M D hh:mma');
    var m = moment(yearParam + ' ' + (monthParam + 1) + ' ' + dayParam + ' ' + time, 'YYYY M D HH:mm');
    var monthName = translations.en.months[monthParam];
    if (self.selectedPrayerDataDetails && self.selectedPrayerDataDetails.timeAdjustmentMinutes && !self.prayerNewDataAvailableMonths[monthName]) {
      m.add(self.selectedPrayerDataDetails.timeAdjustmentMinutes, 'minutes');
      // support manual time adjustment
      var timeAdjustOld = self.data.timeAdjustmentMinutes;
      if (!isNaN(timeAdjustOld) && timeAdjustOld != 0) {
        timeAdjustOld = parseInt(timeAdjustOld);
        m.add(timeAdjustOld, 'minutes'); // when adjustment is < 0, it's substracted automatically
      }
    }

    return m.toDate();
  };
  self.adjustTimesNew = function(times) {
    for(var name in times) {
      var adjustMinutes = self.data.timeAdjustNew[name];
      if(!adjustMinutes || isNaN(adjustMinutes)) {
        continue;
      }
      var m = moment(times[name]);
      if (adjustMinutes != 0) {
        adjustMinutes = parseInt(adjustMinutes);
        m.add(adjustMinutes, 'minutes'); // when adjustMinutes is < 0, it's substracted automatically
      }
      times[name] = m.toDate();
    }
    return times;
  };
  self.getTimes = function (yearParam, monthParam, dayParam) {
    var times = [];
    for (var i = 0; i < self.prayerData[monthParam].length; i++) {
      var segment = self.prayerData[monthParam][i];
      if (segment.range[0] <= dayParam && segment.range[1] >= dayParam) {
        for (var j = 0; j < segment.times.length; j++) {
          var time = segment.times[j];
          times.push(self.getTime(yearParam, monthParam, dayParam, time));
        }
        break;
      }
    }
    if (!times.length) {
      return false;
    }
    return self.adjustTimesNew({
      Subah: times[0],
      Sunrise: times[1],
      Luhar: times[2],
      Asr: times[3],
      Magrib: times[4],
      Isha: times[5],
      Tarawih: new Date(times[5].getTime() + 1),
    });
  };
  self.getIqamahTimes = function (prayerTimes, monthParam, dayParam) {
    var iqamahTimes = {};
    for (var name in self.data.iqamahTimes) {
      var prayerName = name == 'Jummah' ? 'Luhar' : name;
      var iqamahTime = self.data.iqamahTimes[name];
      if (iqamahTime.absolute) {
        iqamahTimes[name] = self.getTime(
          prayerTimes[prayerName].getFullYear(),
          monthParam,
          dayParam,
          iqamahTime.toTime()
        );
      } else {
        iqamahTimes[name] = new Date(prayerTimes[prayerName].getTime() + parseInt(iqamahTime.minutes) * 60 * 1000);
      }
    }
    return iqamahTimes;
  };
  self.showNextDayPrayers = function () {
    self.data.prayers = self.nextDayPrayers.concat([]);
  };
  self.onDayUpdate = function () {
    var dateParams = self.getDateParams(self.data.time);
    self.currentDateParams = dateParams;
    // console.log();
    var times;
    var fallbackToNextDayOnFail = false;
    for (var i = 0; i < 100; i++) {
      // try few more times!; - why? - fallback if data is not available for a particular day
      times = self.getTimes(dateParams[0], dateParams[1], dateParams[2]);
      if (times || !fallbackToNextDayOnFail) {
        break;
      }
      var _d = new Date(self.data.time.getTime());
      _d.setDate(_d.getDate() + 1);
      dateParams = self.getDateParams(_d);
    }
    
    var monthName = translations.en.months[dateParams[1]];
    self.data.isPrayerNewDataApplied = !!self.prayerNewDataAvailableMonths[monthName];

    var d = moment(self.data.time);
    var dayOfWeek = parseInt(d.format('d'));
    var day = translations[self.lang].days[dayOfWeek];
    self.data.isFriday = dayOfWeek === 5;
    var month = translations[self.lang].months[self.data.time.getMonth()];
    console.log('all the times', times);
    var iqamahTimes = self.getIqamahTimes(times, dateParams[1], dateParams[2]);
    times.Tarawih = new Date(iqamahTimes.Tarawih.getTime() - (self.beforeSeconds * 1000));
    var time24Format = self.data.time24Format;
    self.todayPrayers = [
      new Prayer('Subah', times.Subah, iqamahTimes.Subah, self.lang, time24Format),
      // new Prayer('Sunrise', times[1], 10, self.lang),
      // new Prayer('Luhar', times.Luhar, iqamahTimes.Luhar, self.lang),
      new Prayer(
        'Sunrise',
        times.Sunrise,
        iqamahTimes.Subah /* should be less than sunrise time (no iqamah) */,
        self.lang,
        time24Format
      ),
      new Prayer(
        self.data.isFriday ? 'Jummah' : 'Luhar',
        times.Luhar,
        self.data.isFriday ? iqamahTimes.Jummah : iqamahTimes.Luhar,
        self.lang,
        time24Format
      ),
      new Prayer('Asr', times.Asr, iqamahTimes.Asr, self.lang, time24Format),
      new Prayer('Magrib', times.Magrib, iqamahTimes.Magrib, self.lang, time24Format),
      new Prayer('Isha', times.Isha, iqamahTimes.Isha, self.lang, time24Format),
      new Prayer(
        'Tarawih',
        times.Tarawih,
        iqamahTimes.Tarawih,
        self.lang,
        time24Format
      ),
    ];
    if (!self.sunriseSupport) {
      self.todayPrayers.splice(1, 1);
    }
    if(!self.data.tarawihEnabled) {
      self.todayPrayers.splice(self.todayPrayers.length - 1, 1);
    }
    self.data.prayers = self.todayPrayers;
    var tomorrowParams = self.getDateParams(new Date(self.data.time.getTime() + 24 * 60 * 60 * 1000));
    var tomorrowTimes = self.getTimes(tomorrowParams[0], tomorrowParams[1], tomorrowParams[2]);
    if (!tomorrowTimes) {
      tomorrowTimes = times;
    }
    var tomorrowIqamahTimes = self.getIqamahTimes(tomorrowTimes, tomorrowParams[1], tomorrowParams[2]);
    self.nextDayPrayers = [
      new Prayer('Subah', tomorrowTimes.Subah, tomorrowIqamahTimes.Subah, self.lang, time24Format),
      new Prayer('Sunrise', tomorrowTimes.Sunrise, tomorrowIqamahTimes.Subah, self.lang, time24Format),
      new Prayer('Luhar', tomorrowTimes.Luhar, tomorrowIqamahTimes.Luhar, self.lang, time24Format),
      new Prayer('Asr', tomorrowTimes.Asr, tomorrowIqamahTimes.Asr, self.lang, time24Format),
      new Prayer('Magrib', tomorrowTimes.Magrib, tomorrowIqamahTimes.Magrib, self.lang, time24Format),
      new Prayer('Isha', tomorrowTimes.Isha, tomorrowIqamahTimes.Isha, self.lang, time24Format),
      new Prayer('Tarawih', tomorrowTimes.Isha, tomorrowIqamahTimes.Isha, self.lang, time24Format),
    ];
    if (!self.sunriseSupport) {
      self.nextDayPrayers.splice(1, 1);
    }
    if(!self.data.tarawihEnabled) {
      self.nextDayPrayers.splice(self.nextDayPrayers.length - 1, 1);
    }
    // self.data.nextPrayer = self.data.prayers[0];
    self.data.currentPrayer = undefined;
    self.data.currentPrayerBefore = false;
    self.data.currentPrayerAfter = false;
    self.data.currentPrayerWaiting = false;
    self.data.currentPrayerDescription = '';
    // self.data.nextPrayerNear = false;
    // self.data.currentIqamah = undefined;
    // self.data.currentIqamah
    // self.data.dateDisplay = d.format('ddd, DD MMM YYYY');
    self.data.weekDayDisplay = day;
    self.data.dateDisplay = padZero(self.data.time.getDate()) + ' ' + month + ' ' + self.data.time.getFullYear(); //day + ', ' +
    var hijriMonth = parseInt(d.format('iM'));
    // self.data.hijriDateDisplay = d.format('iDD, ___ (iMM) iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // const hijriDate = new HijriDate(self.data.time.getTime());
    var hijriDate = HijriJS.gregorianToHijri(
      self.data.time.getFullYear(),
      self.data.time.getMonth() + 1,
      self.data.time.getDate()
    );
    // self.data.hijriDateDisplay = d.format('iDD ___ iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // self.data.hijriDateDisplay = padZero(hijriDate.getDate()) + ' ' + translations.ta.months[hijriDate.getMonth()] + ' ' + hijriDate.getFullYear();
    self.data.hijriDateDisplay =
      /* padZero(hijriDate.day) + ' ' + */ translations[self.lang].hijriMonths[hijriDate.month - 1] +
      ' ' +
      hijriDate.year;
    // self.data.hijriDateDisplay = hijriDate.toFormat('dd mm YYYY');

    self.data.hijriDate = hijriDate;
    self.data.prayerInfo = 'athan';
    self.updateBackground(true);
  };
  self.updateBackground = function (isInit) {
    if (!isInit) {
      // return;
    }
    // const backgroundImages = [
    //   'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max',
    // ];
    // return (self.data.backgroundImage = backgroundImages[0]);
    self.data.backgroundImage = 'backgrounds/' + self.data.time.getMinutes() + '.jpg?v=' + self.data.bgVersion;
  };
  self.commitCurrentPrayer = function () {
    if (!self.data.currentPrayer) {
      self.data.currentPrayerDescription = '';
      return;
    }
    if (self.data.currentPrayerWaiting) {
      self.data.currentPrayerDescription = translations[self.lang].currentPrayerWaiting;
    } else if (self.data.currentPrayerBefore) {
      self.data.currentPrayerDescription = translations[self.lang].currentPrayerBefore;
    } else if (self.data.currentPrayerAfter) {
      self.data.currentPrayerDescription = translations[self.lang].currentPrayerAfter;
    }
  };
  self.checkCurrentPrayer = function (currentPrayer) {
    var nowTime = self.data.time.getTime();
    var iqamahTime = currentPrayer.iqamahTime.getTime();
    if (nowTime >= iqamahTime) {
      if (nowTime - iqamahTime < self.afterSeconds * 1000) {
        self.data.currentPrayer = currentPrayer;
        self.data.currentPrayerBefore = false;
        // self.data.currentPrayerAfter = true;
        var duration = moment.duration(nowTime - iqamahTime, 'milliseconds');
        // self.data.currentPrayerAfter = padZero(duration.minutes()) + ':' + padZero(duration.seconds());
        var pause = nowTime - iqamahTime < self.pauseSeconds * 1000;
        pause = true;
        self.data.currentPrayerAfter = {
          minutes: pause ? '00' : padZero(duration.minutes()),
          colon: self.data.currentPrayerAfter && self.data.currentPrayerAfter.colon == ':' ? ':' : ':',
          seconds: pause ? '00' : padZero(duration.seconds()),
        };
        self.data.currentPrayerWaiting = false;
      } else {
        if (currentPrayer.name === 'Isha') {
          self.showNextDayPrayers();
        }
        self.data.currentPrayer = undefined;
        self.data.currentPrayerBefore = false;
        self.data.currentPrayerAfter = false;
        self.data.currentPrayerWaiting = false;
      }
    } else {
      self.data.currentPrayer = currentPrayer;
      self.data.currentPrayerBefore = false;
      self.data.currentPrayerAfter = false;
      if (nowTime - currentPrayer.time.getTime() < self.pauseSeconds * 1000) {
        self.data.currentPrayerWaiting = false;
        self.data.currentPrayerBefore = {
          minutes: '00', // padZero(duration.minutes()),
          colon: self.data.currentPrayerBefore && self.data.currentPrayerBefore.colon == ':' ? ':' : ':',
          seconds: '00', // padZero(duration.seconds()),
        };

        return;
      }
      var _duration = moment.duration(iqamahTime - nowTime, 'milliseconds');
      self.data.currentPrayerWaiting = {
        minutes: padZero(_duration.minutes()),
        colon: self.data.currentPrayerWaiting && self.data.currentPrayerWaiting.colon == ':' ? '' : ':',
        seconds: padZero(_duration.seconds()),
      };
    }
  };
  self.nextTick = function () {
    self.updateTime();
    var dateParams = self.getDateParams(self.data.time);
    if (
      !(
        self.currentDateParams &&
        dateParams[0] === self.currentDateParams[0] &&
        dateParams[1] === self.currentDateParams[1] &&
        dateParams[2] === self.currentDateParams[2]
      )
    ) {
      self.onDayUpdate();
    }
    var changeBackgroundInMinutes = 1;
    if (self.data.time.getMinutes() % changeBackgroundInMinutes === 0 && self.data.time.getSeconds() === 0) {
      self.updateBackground();
    }
    var checkInternetInMinutes = 1;
    var checkInternetNow = false;
    if (!self.wifiDisabled && self.data.time.getMinutes() % checkInternetInMinutes === 0 && self.data.time.getSeconds() === 0) {
      checkInternetNow = true;
    }
    // every 10 seconds
    if (!self.data.settingsMode && self.data.time.getSeconds() % 10 === 0) {
      // self.data.lastKnownTime = moment(self.data.time).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
      // localStorage.setItem('mdisplay.lastKnownTime', self.data.lastKnownTime);
    }

    // self.data.network.showInternetAvailability = self.data.time.getSeconds() % 10 < 5;

    // if (self.data.time.getSeconds() % 2 === 1) {
    self.data.network.showInternetAvailability = !self.wifiDisabled && !self.data.network.showInternetAvailability;
    // }
    if (self.data.timeOriginMode == 'network' && self.data.networkTimeApiUrl == self.timeServerApi) {
      self.tryConnectingToTimeServer();
    } else {
      // if (self.data.rememberWifi) {
      //   self.tryConnectingToWiFiSSID(self.data.rememberedWifiSSID);
      // }
      if (checkInternetNow) {
        self.checkInternetAvailability(
          function () {},
          10,
          function () {
            self.setFetchingStatus('No Internet', 'error', false, 999);
          }
        );
      } else if (self.data.network.internetAvailable === undefined) {
        self.checkInternetAvailability(
          function () {},
          0,
          function () {}
        );
      }
    }
    if (self.data.time.getSeconds() % 2 === 0) {
      self.data.prayerInfo = self.data.prayerInfo === 'athan' ? 'iqamah' : 'athan';
      if (self.data.prayerInfo === 'iqamah') {
        self.data.showSunriseNow = self.sunriseSupport && !self.data.showSunriseNow;
        self.data.showSunriseLabel = self.data.showSunriseNow;
        setTimeout(function() {
          if(self.data.showSunriseLabel) {
            self.data.showSunriseLabel = false;
          }
        }, 2000);
      }
    }
    var nowTime = self.data.time.getTime();
    var nextTime = self.data.nextPrayer ? self.data.nextPrayer.time.getTime() : 0;
    // console.log('nextTick');
    if (nowTime >= nextTime + 1000) {
      console.log('coming next');
      var nextPrayer;
      for (var i = 0; i < self.todayPrayers.length; i++) {
        var prayer = self.todayPrayers[i];
        if (nowTime < prayer.time.getTime()) {
          // if (prayer.name !== 'Tarawih') {
            nextPrayer = prayer;
          // }
          break;
        }
      }
      if (!nextPrayer) {
        if (!(self.nextDayPrayers[0] && nowTime < self.nextDayPrayers[0].time.getTime())) {
          // self.onDayUpdate();
          // return self.nextTick();
        }
        nextPrayer = self.nextDayPrayers[0];
        // self.showNextDayPrayers();
      }
      console.log('recalculate next prayer!', nextPrayer);
      self.data.nextPrayer = nextPrayer;
      nextTime = self.data.nextPrayer.time.getTime();

      // self.data.currentPrayer = self.data.nextPrayer;
      self.data.currentPrayerBefore = false;
      self.data.currentPrayerAfter = false;
      self.data.currentPrayerWaiting = false;
      self.data.currentPrayerBefore = {
        minutes: '00', // padZero(duration.minutes()),
        colon: self.data.currentPrayerBefore && self.data.currentPrayerBefore.colon == ':' ? ':' : ':',
        seconds: '00', // padZero(duration.seconds()),
      };
    } else if (nextTime - nowTime < self.beforeSeconds * 1000) {
      self.data.currentPrayer = self.data.nextPrayer;
      var duration = moment.duration(nextTime - nowTime, 'milliseconds');
      if(self.data.nextPrayer.name != 'Tarawih') {
      self.data.currentPrayerBefore = {
        minutes: padZero(duration.minutes()),
        colon: self.data.currentPrayerBefore && self.data.currentPrayerBefore.colon == ':' ? '' : ':',
        seconds: padZero(duration.seconds()),
      };
      self.data.currentPrayerAfter = false;
      self.data.currentPrayerWaiting = false;
      }
    } else {
      if (self.data.currentPrayer) {
        self.checkCurrentPrayer(self.data.currentPrayer);
      } else {
        if (self.isInitial) {
          console.log('is isInitial');
          // if (nowTime < ) {}
          var prevPrayer;
          if (self.data.nextPrayer === self.nextDayPrayers[0]) {
            prevPrayer = self.todayPrayers[self.todayPrayers.length - 1];
          } else {
            var idx = self.todayPrayers.indexOf(self.data.nextPrayer);
            if (idx > 0) {
              // not subah
              prevPrayer = self.todayPrayers[idx - 1];
            }
          }
          if (prevPrayer) {
            self.checkCurrentPrayer(prevPrayer);
          }
          self.isInitial = false;
        } else {
          self.data.currentPrayer = undefined;
          self.data.currentPrayerBefore = false;
          self.data.currentPrayerAfter = false;
          self.data.currentPrayerWaiting = false;
        }
      }
    }
    if (self.analogClock && self.data.analogClockActive) {
      self.analogClock.nextTick(self.data.time);
    }
    self.commitCurrentPrayer();
  };
  self.forceTimeUpdate = function (newDate) {
    self.data.time = newDate;
    // self.onDayUpdate();
  };

  self.translate = function (text) {
    return translations[self.lang][text] || text;
  };
  self.openSettings = function () {
    self.data.settingsMode = true;
    if(self.backbuttonEventListener) {
      document.addEventListener('backbutton', self.backbuttonEventListener, false);
    }
    self.checkForKioskMode();
  };
  self.saveAndCloseSettings = function () {
    self.updateSettings();
    self.data.settingsMode = false;
    var reloadOnSettings = true;
    if (reloadOnSettings || self.shouldReload) {
      window.location.reload();
    }
  };
  self.closeSettingsWithoutSaving = function() {
    if(confirm('Are you sure to close Settings page without saving? All changes will be lost')) {
      self.data.settingsMode = false;
      window.location.reload();
    }
  };
  self.mounted = function () {
    self.showToast('Application loaded.', 3000);
    // self.simulateTime = 50;
    self.updateTime();
    if (self.analogClock && self.data.analogClockActive) {
      self.analogClock.init(document.getElementById('analog-clock-container'), self.initialTestTime);
    }
    if ((self.data.timeOriginMode == 'auto' || self.data.timeOriginMode == 'network') && self.simulateTime) {
      console.warn('Warning: simulateTime feature is not compatible with network time');
    }
    window._theInterval = window.setInterval(
      function () {
        self.nextTick();
      },
      self.simulateTime ? self.simulateTime : 1000
    );
    var splashScreenMillis = self.data.splashScreenMillis || 4000;
    setTimeout(function () {
      self.data.showSplash = false;
    }, splashScreenMillis);
  };
  self.created = function () {
    if (window._theInterval) {
      window.clearInterval(window._theInterval);
    }
  };
  self.initStorage = function (callback) {
    var iqamahTimes;
    var settings;
    try {
      settings = JSON.parse(localStorage.getItem('mdisplay.settings'));
    } catch (e) {}
    try {
      iqamahTimes = JSON.parse(localStorage.getItem('mdisplay.iqamahTimes'));
    } catch (e) {}
    if (!iqamahTimes) {
      return callback();
    }
    var iqamahTimesConfigured = localStorage.getItem('mdisplay.iqamahTimesConfigured');
    for (var name in iqamahTimes) {
      self.data.iqamahTimes[name] = IqamahTime.fromRaw(iqamahTimes[name]);
    }
    self.data.iqamahTimesConfigured = !!iqamahTimesConfigured;
    if (settings) {
      self.data.timeOriginMode = settings.timeOriginMode;
      if (settings.timeOriginMode == 'auto' || settings.timeOriginMode == 'device') {
        self.data.timeOriginMode = 'auto'; // settings.timeOriginMode; // @TODO: remove in next version: hard coded value
      }
      if(settings.networkTimeApiUrl) {
        self.data.networkTimeApiUrl = settings.networkTimeApiUrl;
      }
      var timeAdjustmentMinutes = parseInt(settings.timeAdjustmentMinutes);
      if (!isNaN(timeAdjustmentMinutes)) {
        self.data.timeAdjustmentMinutes = timeAdjustmentMinutes;
      }
      if (settings.timeAdjustNew && settings.timeAdjustNew.Subah) {
        self.data.timeAdjustNew = settings.timeAdjustNew;
      }
      if (settings.analogClockActive) {
        self.data.analogClockActive = true;
      }
      if (settings.alertEnabled === false) {
        self.data.alertEnabled = false;
      }
      if (settings.tarawihEnabled) {
        self.data.tarawihEnabled = true;
      }
      if (settings.time24Format) {
        self.data.time24Format = true;
      }
      // if (settings.focusActiveTimer) {
      //   self.data.focusActiveTimer = true;
      // }
      if (settings.timeOverrideEnabled) {
        self.data.timeOverrideEnabled = true;
      }
      if (settings.rememberWifi) {
        self.data.rememberWifi = true;
      }
      if (settings.disconnectWifi === false) {
        self.data.disconnectWifi = false;
      }
      if (settings.rememberedWifiSSID) {
        self.data.rememberedWifiSSID = settings.rememberedWifiSSID;
      }
      self.data.lastKnownTime = localStorage.getItem('mdisplay.lastKnownTime');
      if (self.data.lastKnownTime === 'undefined') {
        self.data.lastKnownTime = undefined;
      }
      var splashScreenMillis = parseInt(settings.splashScreenMillis);
      if (!isNaN(splashScreenMillis) && splashScreenMillis) {
        self.data.splashScreenMillis = splashScreenMillis;
      }
      if (typeof settings.activeClockTheme2 === 'string') {
        // self.data.activeClockTheme = settings.activeClockTheme2;
        // switch (settings.activeClockTheme2) {
        //   case 'digitalModern':
        //     self.data.analogClockActive = false;
        //     self.data.digitalClockTheme = 'modern';
        //     break;
        //   case 'analogDefault':
        //     self.data.analogClockActive = true;
        //     self.data.analogClockTheme = 'default';
        //     break;
        //   case 'analogModern':
        //     self.data.analogClockActive = true;
        //     self.data.analogClockTheme = 'modern';
        //     break;
        //   default:
        //     // invalid or digitalDefault
        //     self.data.analogClockActive = false;
        //     self.data.digitalClockTheme = 'default';
        //     break;
        // }
      }
      // ...
    }

    callback();
  };
  self.writeStorage = function (callback) {
    var iqamahTimes = {};
    for (var name in self.data.iqamahTimes) {
      iqamahTimes[name] = self.data.iqamahTimes[name].toRaw();
    }
    self.data.iqamahTimesConfigured = true;
    var settings = {
      timeOriginMode: self.data.timeOriginMode,
      timeAdjustmentMinutes: self.data.timeAdjustmentMinutes,
      timeAdjustNew: self.data.timeAdjustNew,
      analogClockActive: self.data.analogClockActive,
      activeClockTheme: 'digitalDefault', // reset to default for possible later usage
      activeClockTheme2: self.data.activeClockTheme,
      alertEnabled: self.data.alertEnabled,
      focusActiveTimer: self.data.focusActiveTimer,
      time24Format: self.data.time24Format,
      timeOverrideEnabled: self.data.timeOverrideEnabled,
      networkTimeApiUrl: self.data.networkTimeApiUrl,
      rememberWifi: self.data.rememberWifi,
      disconnectWifi: self.data.disconnectWifi,
      rememberedWifiSSID: self.data.rememberedWifiSSID,
      tarawihEnabled: self.data.tarawihEnabled,
      splashScreenMillis: self.data.splashScreenMillis,
    };
    if (!self.data.rememberWifi) {
      settings.rememberedWifiSSID = undefined;
    }
    if (self.data.rememberWifi && self.data.connectedWifiSSID) {
      settings.rememberedWifiSSID = self.data.connectedWifiSSID;
    }
    localStorage.setItem('mdisplay.iqamahTimes', JSON.stringify(iqamahTimes));
    localStorage.setItem('mdisplay.iqamahTimesConfigured', 1);
    localStorage.setItem('mdisplay.settings', JSON.stringify(settings));
    localStorage.setItem('mdisplay.lastKnownTime', self.data.lastKnownTime || '');

    localStorage.setItem('mdisplay.lang', self.data.selectedLanguage);
    localStorage.setItem('mdisplay.prayerDataId', self.data.selectedPrayerDataId);
    localStorage.setItem('mdisplay.prayerNewDataId', self.data.selectedPrayerNewDataId);
    localStorage.setItem('mdisplay.sunriseSupport', self.data.sunriseSupport ? 1 : 0);

    if (callback) {
      callback();
    }
  };
  self.updateSettings = function () {
    self.writeStorage();
    self.shouldReload = true;
  };
  self.backupSettings = function (writeExisting, doneCallback) {
    if(writeExisting) {
      self.writeStorage();
    }

    var backupData = {
      'mdisplay.ssid': localStorage.getItem('mdisplay.ssid') || 'MDisplay TimeServer',
      'mdisplay.backupTime': self.data.time.getTime(),
      'mdisplay.backupVersion': 1,
    };

    for (var key in {
      'mdisplay.iqamahTimes': true,
      'mdisplay.iqamahTimesConfigured': true,
      'mdisplay.settings': true,
      'mdisplay.lastKnownTime': true,

      'mdisplay.lang': true,
      'mdisplay.prayerDataId': true,
      'mdisplay.sunriseSupport': true,
    }) {
      backupData[key] = localStorage.getItem(key);
    }

    var fileName = 'mdisplay.backup-' + moment(self.data.time).format('YYYY-MM-DD HH mm ss') + '.txt';
    var fileContent = JSON.stringify(backupData, null, 2);

    console.log('backupSettings', JSON.stringify(fileContent), backupData);

    if(window.cordova && window.cordova.plugins && window.cordova.plugins.saveDialog) {
      var blob = new Blob([fileContent], {type: "text/plain"});
      window.cordova.plugins.saveDialog.saveFile(blob, fileName).then(function(uri) {
        console.log("The file has been successfully saved to", uri);
        if(doneCallback) {
          doneCallback();
        }
      }).catch(function(reason) {
        console.log(reason);
        if(doneCallback) {
          doneCallback();
        }
      });
    } else if(window.cordova) {
      var errorCallback = function (e) {
        console.log('Error: ' + e);
        alert('FAILED to save file: ' + e);
        if(doneCallback) {
          doneCallback();
        }
      };

      window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (fileSystem) {
        fileSystem.getDirectory('Download', { create: true, exclusive: false }, function (directory) {
          //You need to put the name you would like to use for the file here.
          directory.getFile(fileName, { create: true, exclusive: false },
            function (fileEntry) {
              fileEntry.createWriter(function (writer) {
                writer.onwriteend = function () {
                  console.log('File written to downloads');
                  alert('Backup file saved to downloads');
                  if(doneCallback) {
                    doneCallback();
                  }          
                };
                writer.seek(0);
                writer.write(
                  new Blob([fileContent], {
                    type: 'text/plain',
                  })
                ); //You need to put the file, blob or base64 representation here.
            }, errorCallback);
            }, errorCallback);
          }, errorCallback);
      }, errorCallback);
    } else {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(
        new Blob([fileContent], {
          type: 'text/plain',
        })
      );
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if(doneCallback) {
        setTimeout(function() {
          doneCallback();
        }, 1000);
      }
    }
  };

  self.restoreSettings = function (backupDataString) {
    var backupData;
    try {
      backupData = JSON.parse(backupDataString);
    } catch (e) {
      backupData = {};
      console.error('Invalid restoration data', e);
      alert('Invalid restoration data: ' + e);
    }
    for (key in backupData) {
      if (key == 'mdisplay.backupVersion') {
        continue;
      }
      localStorage.setItem(key, backupData[key]);
    }
    window.location.reload();
  };
  self.onRestoreFileClick = function(dFile) {
    if(!confirm('Restore file "' + dFile.name + '"? The current settings will be overwritten!')) {
      return;
    }
    var errorHandler = function(err) {
      alert('Failed to restore file' + err);
    }
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
      dirEntry.getDirectory('Download', { create: false }, function (downloadDirEntry) {
        downloadDirEntry.getFile(dFile.name, {
          create: false
        }, function (entry) {
          entry.file(function (file) {
              var reader = new FileReader();
              reader.onloadend = function() {
                console.log("Successful file read: " + this.result);
                // alert(this.result);
                self.restoreSettings(this.result);
              };
              reader.readAsText(file);
          }, errorHandler);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);

  };
  self.onRestoreSettingsClick = function() {
    self.data.isDownloadsListOpen = true;
    var errorHandler = function(err) {
      alert('Failed to read downloads directory' + err);
    }
    self.data.downloadedFiles = [];

    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
      dirEntry.getDirectory('Download', { create: false }, function (downloadDirEntry) {
          var directoryReader = downloadDirEntry.createReader();
          directoryReader.readEntries(function (entries) {
              var fileList = [];
              entries.forEach(function (entry) {
                  if (entry.isFile) {
                    fileList.push({
                      name: entry.name,
                      // fileEntry: entry
                    });
                  }
              });
              self.data.downloadedFiles = fileList;
          }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  };
  self.onRestoreFileChange = function (event) {
    var fileInput = document.getElementById('restore-settings-file-input');
    console.log('onRestoreFileChange', event);
    event.preventDefault();
    // If there's no file, do nothing
    var file = fileInput.files[0];
    if (!fileInput.value.length || !file) return;
    // Create a new FileReader() object
    var reader = new FileReader();
    // Setup the callback event to run when the file is read
    reader.onload = function (event) {
      if(!confirm('Restore file "' + file.name + '"? The current settings will be overwritten!')) {
        return;        
      }
      self.restoreSettings(event.target.result);
      var str = event.target.result;
      var json = JSON.parse(str);
      console.log('string', str);
      console.log('json', json);
    };
    // Read the file
    reader.readAsText(file);
  };
  self.scrollSettingsContent = function(direction) {
    var scrollPixels = 100;
    var useAnimation = false;
    var $scrollable = $('#settings-modal-scrollable-content');
    var newScrollTop = $scrollable.scrollTop() + (direction == 'up' ? -scrollPixels : scrollPixels);
    if(useAnimation) {
      $scrollable.animate({
        scrollTop: newScrollTop
      });
    } else {
      $scrollable.scrollTop(newScrollTop); 
    }
  };
  self.scrollUp = function() {
    self.scrollSettingsContent('up');
  };
  self.scrollDown = function() {
    self.scrollSettingsContent('down');
  };
  self.initShortcuts = function () {
    document.addEventListener('mousemove', function(event) {
      self.isMouseMoving = true;
      if(self.mouseMovingTimoutRef) {
        clearTimeout(self.mouseMovingTimoutRef);
        self.mouseMovingTimoutRef = undefined;
      }
      self.mouseMovingTimoutRef = setTimeout(function(ev) {
        self.isMouseMoving = false;
        self.mouseMovingTimoutRef = undefined;
      }, 1000);
    }, false);
    var KEY_CODES = {
      ENTER: 13,
      ARROW_LEFT: 37,
      ARROW_UP: 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN: 40,
    };
    var KEY_CODES_STR = {
      ENTER: 'Enter',
      ARROW_LEFT: 'ArrowLeft',
      ARROW_UP: 'ArrowUp',
      ARROW_RIGHT: 'ArrowRight',
      ARROW_DOWN: 'ArrowDown',
    }
    var body = document.querySelector('body');
    body.onkeydown = function (event) {
      var pressed = {
        enter: false,
        arrowLeft: false,
        arrowUp: false,
        arrowRight: false,
        arrowDown: false
      };
      if (!event.metaKey) {
        // e.preventDefault();
      }
      if(event.keyCode) {
        var code = event.keyCode;
        pressed.enter = code == KEY_CODES.ENTER;
        pressed.arrowLeft = code == KEY_CODES.ARROW_LEFT;
        pressed.arrowUp = code == KEY_CODES.ARROW_UP;
        pressed.arrowRight = code == KEY_CODES.ARROW_RIGHT;
        pressed.arrowDown = code == KEY_CODES.ARROW_DOWN;
      } else {
        var code = event.code;
        pressed.enter = code == KEY_CODES_STR.ENTER;
        pressed.arrowLeft = code == KEY_CODES_STR.ARROW_LEFT;
        pressed.arrowUp = code == KEY_CODES_STR.ARROW_UP;
        pressed.arrowRight = code == KEY_CODES_STR.ARROW_RIGHT;
        pressed.arrowDown = code == KEY_CODES_STR.ARROW_DOWN;
      }
      // alert('keyCode: ' + keyCode);
      if (pressed.enter) {
        event.preventDefault();
        if (self.data.settingsMode) {
          // self.closeSettings();
        } else {
          self.openSettings();
        }
        return;
      }
      if (!self.data.settingsMode) {
        return;
      }
      var rows = document.querySelectorAll('.times-config .config-time-input');
      if (pressed.arrowDown || pressed.arrowUp) {
        setTimeout(function() {
          if(!self.isMouseMoving) {
            event.preventDefault();
            if (pressed.arrowUp) {
              self.scrollUp();
            } else {
              self.scrollDown();
            }    
          }
        }, 500);
        return;
        var lastSelectedRow = self.lastSelectedRow || 0;
        var lastSelectedCol = self.lastSelectedCol || 1;
        lastSelectedRow += pressed.arrowUp ? -1 : 1;
        if (lastSelectedRow < 1) {
          lastSelectedRow = rows.length;
        }
        if (lastSelectedRow > rows.length) {
          lastSelectedRow = 1;
        }
        var row = rows[lastSelectedRow - 1];
        var cols = row.querySelectorAll('input');
        if (lastSelectedCol < 1) {
          lastSelectedCol = cols.length;
        }
        if (lastSelectedCol > cols.length) {
          lastSelectedCol = 1;
        }
        var col = cols[lastSelectedCol - 1];
        console.log('SHOULD FOCUS: ', col.value, col);
        col.focus();
        self.lastSelectedRow = lastSelectedRow;
        self.lastSelectedCol = lastSelectedCol;
      }
      // if (keyCode == KEY_CODES.ARROW_LEFT || keyCode == KEY_CODES.ARROW_RIGHT) {
      //   event.preventDefault();
      //   var _lastSelectedRow = self.lastSelectedRow || 1;
      //   var _lastSelectedCol = self.lastSelectedCol || 0;
      //   if (_lastSelectedRow < 1) {
      //     _lastSelectedRow = rows.length;
      //   }
      //   if (_lastSelectedRow > rows.length) {
      //     _lastSelectedRow = 1;
      //   }
      //   var _row = rows[_lastSelectedRow - 1];
      //   var _cols = _row.querySelectorAll('input');
      //   _lastSelectedCol += keyCode == KEY_CODES.ARROW_LEFT ? -1 : 1;
      //   if (_lastSelectedCol < 1) {
      //     _lastSelectedCol = _cols.length;
      //   }
      //   if (_lastSelectedCol > _cols.length) {
      //     _lastSelectedCol = 1;
      //   }
      //   var _col = _cols[_lastSelectedCol - 1];
      //   console.log('SHOULD FOCUS: ', _col.value, _col);
      //   _col.focus();
      //   self.lastSelectedRow = _lastSelectedRow;
      //   self.lastSelectedCol = _lastSelectedCol;
      // }
    };
  };
  self.setFetchingStatus = function (message, mode, status, timeout) {
    var colors = {
      init: '#ffff20',
      error: '#ff1919',
      success: '#49ff50',
    };
    setTimeout(
      function () {
        self.data.timeFetchingMessage = {
          color: colors[mode],
          text: message,
        };
      },
      timeout ? 500 : 0
    );
    setTimeout(function () {
      self.fetchingInternetTime = status;
    }, timeout || 0);
  };
  self.updateInternetTime = function () {
    if (self.useDeviceTimeOnly || self.fetchingInternetTime || self.data.timeOverridden) {
      return;
    }
    if (!(self.data.timeOriginMode == 'auto' || self.data.timeOriginMode == 'network')) {
      // console.log('Internet time mode disabled');
      return;
    }
    if (self.data.networkTimeInitialized) {
      // console.log('Internet time mode already active');
      return;
    }
    if(self.data.timeOriginMode == 'auto' && window.cordova && !self.isDeviceReady) {
      return;
    }
    self.setFetchingStatus('Requesting time from network...', 'init', true);
    function parseDateTime(datetime) {
      var parts = datetime.split(' ');
      var dateParts = parts[0].split('-');
      var timeParts = parts[1].split(':');
      return new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2]),
        parseInt(timeParts[0]),
        parseInt(timeParts[1]),
        parseInt(timeParts[2])
      );
    }
    var useSNTP = false; // do not use SNTP because of excessive data usage(doubted) @TODO: confirm
    if(useSNTP && self.data.timeOriginMode == 'auto' && window.cordova && window.cordova.plugins && window.cordova.plugins.sntp) {
      console.log('time mode auto: using NTP server pool.ntp.org');
      window.cordova.plugins.sntp.setServer("pool.ntp.org", 10000);
      window.cordova.plugins.sntp.getTime(function(time) {
        console.log("The actual amount of milliseconds since epoch is: ", time, new Date(time.time));
        var timestampMillis = time.time;
        if (timestampMillis) {
          setTimeout(function () {
            // show waiting feedback at least 1 second
            self.forceTimeUpdate(new Date(timestampMillis + 1000));
          }, 1000);
        }
        self.data.networkTimeInitialized = true;
        setTimeout(function () {
          // possibility for time inaccuracy. Hence recheck in 5 minutes.
          self.data.networkTimeInitialized = false;
        }, 5 * 60 * 1000);
        self.setFetchingStatus('OK. Updated time from NTP server', 'success', false, 1);
      }, function(errorMessage) {
          console.log("I haz error: " + errorMessage);
          self.setFetchingStatus('FAILED to update time from NTP server', 'error', false, 999);
          self.data.networkTimeInitialized = false;
      });
      return;
    }
    var apiUrl = self.data.timeOriginMode == 'auto' ? internetTimeApi : self.data.networkTimeApiUrl;
    console.log('Internet time mode fetching from...', apiUrl);
    var beforeMillis = (new Date()).getTime();
    $.ajax({
      type: 'GET',
      dataType: self.data.timeOriginMode == 'auto' ? 'json' : 'jsonp',
      url: apiUrl.replace('_timestamp_', (new Date()).getTime()) + '',
      crossDomain: true,
      // jsonp: 'callback',
      contentType: 'application/json; charset=utf-8',
      success: function success(response) {
        // console.log('Result received', response);
        if (!response /* && response.timestamp */) {
          console.log('Invalid response', response);
          self.setFetchingStatus('INVALID response', 'error', false, 999);
          self.data.networkTimeInitialized = false;
          return;
        }
        var timestamp = response.timestamp;
        var timestampMillis;
        var time = response.time;
        if (!timestamp && !time) {
          var afterMillis = (new Date()).getTime();
          var millisDiff = afterMillis - beforeMillis;
          if(response.utc_datetime) {
            var millis = moment(response.utc_datetime).toDate().getTime();
            console.log('bef', new Date(millis));
            millis += millisDiff;
            timestampMillis = millis;
            console.log('af', new Date(millis));
          } else {
            self.setFetchingStatus('MISSING timestamp or time from response', 'error', false, 999);
            console.log('Invalid timestamp/time response', response);
            self.data.networkTimeInitialized = false;
            return;
          }
        }
        if(!timestampMillis && timestamp) {
          timestampMillis = timestampMillis || timestamp * 1000;
        }
        if (timestampMillis) {
          // alert('timestampMillis: ' + timestampMillis);
          setTimeout(function () {
            // show waiting feedback at least 1 second
            self.forceTimeUpdate(new Date(timestampMillis + 1000));
          }, 1000);
        } else {
          setTimeout(function () {
            var newDate = parseDateTime(time);
            newDate.setTime(newDate.getTime() + 1000);
            self.forceTimeUpdate(newDate);
          }, 1000);
        }
        self.data.networkTimeInitialized = true;
        setTimeout(function () {
          // possibility for time inaccuracy. Hence recheck in 15 minutes.
          self.data.networkTimeInitialized = false;
        }, 10 * 60 * 1000);
        console.log('network data: ', response);
        self.setFetchingStatus('OK. Updated time from network', 'success', false, 1);
      },
      error: function error(err) {
        console.log('err: ', err);
        // alert('err: ' + err);
        self.setFetchingStatus('FAILED to update time from network', 'error', false, 999);
        self.data.networkTimeInitialized = false;
      },
    });
  };
  self.tryConnectingToTimeServer = function (retryCount) {
    var timeServerSSID = self.data.timeServerSSID;
    retryCount = retryCount || 0;
    if (!(self.data.timeOriginMode == 'network' && self.data.networkTimeApiUrl == self.timeServerApi)) {
      return;
    }
    if (!self.isDeviceReady || self.data.timeIsValid || typeof WifiWizard2 === 'undefined') {
      return;
    }
    if (!retryCount && self.data.network.connecting !== undefined) {
      return;
    }
    if (self.data.network.status == 'WiFi Connection (' + timeServerSSID + ')') {
      self.data.network.connecting = false;
      return;
    }
    var bindAll = true;
    var isHiddenSSID = false;
    self.data.network.connecting = true;
    self.data.network.status = 'Connecting to ' + timeServerSSID + ' (' + retryCount + ')...';
    WifiWizard2.connect(timeServerSSID, bindAll, '1234567890', 'WPA', isHiddenSSID).then(
      function (res) {
        self.data.network.connecting = false;
        self.data.network.status = 'Connected to ' + timeServerSSID;
        self.checkNetworkStatus();
      },
      function (err) {
        self.data.network.status = 'ERR ' + timeServerSSID + ' - ' + err;
        setTimeout(function () {
          self.tryConnectingToTimeServer(retryCount + 1);
        }, 1000);
      }
    );
  };
  self.tryConnectingToWiFiSSID = function (wifiSSID, retryCount) {
    retryCount = retryCount || 0;
    if (!wifiSSID || !self.isDeviceReady || self.data.timeIsValid || typeof WifiWizard2 === 'undefined') {
      return;
    }
    if (!retryCount && self.data.network.connecting !== undefined) {
      return;
    }
    if (self.data.network.status == 'WiFi Connection (' + wifiSSID + ')') {
      self.data.network.connecting = false;
      return;
    }
    var bindAll = true;
    var isHiddenSSID = false;
    self.data.network.connecting = true;
    self.data.network.status = 'Connecting to: ' + wifiSSID + ' (' + retryCount + ')...';
    setTimeout(function() {
      WifiWizard2.connect(wifiSSID, bindAll, undefined, 'WPA', isHiddenSSID).then(
      // WifiWizard2.enable(ssid, bindAll, waitForConnection)
      // WifiWizard2.connect(timeServerSSID, bindAll, '1234567890', 'WPA', isHiddenSSID).then(
      // WifiWizard2.enable(wifiSSID, bindAll, true).then(
        function (res) {
          self.data.network.connecting = undefined;
          self.data.network.status = 'Connected to: ' +  wifiSSID;
          // self.checkNetworkStatus();
        },
        function (err) {
          self.data.network.status = 'ERR ' + wifiSSID + ' - ' + err;
          self.data.network.connecting = undefined;
          // setTimeout(function () {
          //   self.tryConnectingToWiFiSSID(wifiSSID, retryCount + 1);
          // }, 1000);
        }
      );
    }, 1000);
  };
  self.getSelected = function (options, selectedId) {
    var selected = options.filter(function (option) {
      return option.id == selectedId;
    })[0];
    return selected ? selected.label : 'Not Selected';
  };
  self.deviceReady = function () {
    self.isDeviceReady = true;
    if (window.cordova) {
      self.data.isCordovaReady = true;
      self.backbuttonEventListener = function (event) {
        event.preventDefault();
        event.stopPropagation();  
        window.location.reload();
        return false;
      };
    }
    self.checkNetworkStatus();
  };
  self.init = function (initialTestTime, callback, analogClock) {
    self.initialTestTime = initialTestTime;
    self.analogClock = analogClock;
    self.initStorage(function () {
      self.nextTick();
      if (callback) {
        callback();
      }
      self.initShortcuts();
    });
  };
  self.parseVersion = function(fullVersion) {
    fullVersion = fullVersion.replace('?v=', '');
    var regex = /(\d+\.\d+\.\d+)-(\d+)/;
    return {
      fullVersion: fullVersion,
      versionString: fullVersion.replace(regex, '$1'),
      versionNumber: parseInt(fullVersion.replace(regex, '$2'), 10),
    };
  };
}
window.mdApp = new App();
