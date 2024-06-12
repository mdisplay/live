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
      absolute: self.absolute
    };
  };
}
IqamahTime.fromRaw = function (raw) {
  return new IqamahTime(raw.minutes, raw.hours, raw.absolute);
};
function App() {
  var self = this;
  self.sunriseSupport = !!localStorage.getItem('mdisplay.sunriseSupport');
  if(!localStorage.getItem('mdisplay.lang')) {
    // temp: @TODO: remove in next version
    localStorage.setItem('mdisplay.lang', 'ta');
  }
  self.lang = localStorage.getItem('mdisplay.lang') || 'ta';
  if (!localStorage.getItem('mdisplay.prayerDataId')) {
    localStorage.setItem('mdisplay.prayerDataId', 'Puttalam'); // @TODO: remove in next version
  }
  self.prayerDataId = localStorage.getItem('mdisplay.prayerDataId') || 'Puttalam';
  self.checkInternetJsonp = {
    jsonpCallback: 'checkInternet',
    url: 'https://mdisplay.github.io/live/check-internet.js'
    // url: 'http://192.168.1.11/mdisplay/live/check-internet.js',
  };

  var timeServerIp = '192.168.1.1';
  var timeServerApi = 'http://' + timeServerIp + '/api';
  self.timeServerApi = timeServerApi;
  self.data = {
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
      Jummah: new IqamahTime(45)
    },
    appUdate: {
      enabled: false,
      checking: false,
      updated: false,
      updating: false,
      error: false
    },
    kioskMode: {
      available: false,
      enabled: false,
      isHome: false,
      switchLauncher: function switchLauncher() {
        alert('Kiosk not available');
      }
    },
    toasts: [],
    timeOriginMode: 'device',
    // or 'network'
    networkMode: 'network',
    // or 'timeserver',
    networkTimeApiUrl: timeServerApi,
    isFriday: false,
    selectedLanguage: self.lang,
    selectedPrayerDataId: self.prayerDataId,
    languages: [
      { id: 'si', label: 'Sinhala' },
      { id: 'ta', label: 'Tamil' },
      { id: 'en', label: 'English' }
    ],
    prayerDataList: [
      { id: 'Colombo', label: 'Sri Lanka Standard' },
      { id: 'Puttalam', label: 'Puttalam Grand Masjid' },
      { id: 'Mannar', label: 'Mannar' },
      { id: 'Eastern', label: 'Eastern', parent: 'Colombo', timeAdjustmentMinutes: -6 },
      { id: 'Central', label: 'Central (Kandy, Akurana) - beta' },
    ],
    clockThemes: [
      {id: 'digitalDefault', label: 'Classic Digital'},
      {id: 'digitalModern', label: 'Modern Digital'},
      {id: 'analogDefault', label: 'Classic Analog'},
      {id: 'analogModern', label: 'Modern Analog'},
    ],
    analogClockActive: false,
    alertEnabled: true,
    analogClockTheme: 'default',
    digitalClockTheme: 'modern',
    activeClockTheme: 'digitalModern',
    networkTimeInitialized: false,
    timeIsValid: false,
    timeFetchingMessage: undefined,
    timeAdjustmentMinutes: 0,
    timeServerSSID: localStorage.getItem('mdisplay.ssid') || 'NodeMCU TimeServer',
    timeServerSSIDs: ['NodeMCU TimeServer', 'MDisplay TimeServer'],
    network: {
      status: 'Unknown',
      connecting: undefined,
      internetStatus: 'Unknown',
      internetAvailable: undefined,
      showInternetAvailability: false
    },
    lastKnownTime: undefined,
    timeOverrideEnabled: false,
    timeOverridden: false,
    time24Format: false,
    sunriseSupport: self.sunriseSupport,
    showSunriseNow: false,
    expanded: {
      prayerTimesData: false,
      clockThemes: false,
      languages: false,
    },
  };
  self.computed = {
    showAlert: function() {
      var shouldShow = self.data.prayerInfo === 'iqamah';
      if(!shouldShow) {
        return false;
      }
      return self.data.alertEnabled && (self.data.currentPrayerWaiting || self.data.currentPrayerAfter);
    },
    currentlyShowingAlert: function() {
      var shouldShow = self.data.prayerInfo === 'iqamah';
      var alerts = [
        'alert1.png',
        'alert2.gif'
      ];
      if (!window._mdCurrentAlert) {
        window._mdCurrentAlert = 0;
      }
      if (shouldShow) {
        window._mdCurrentAlert += 1;
        if(window._mdCurrentAlert > alerts.length) {
          window._mdCurrentAlert = 1;
        }
      }
      return alerts[window._mdCurrentAlert - 1] || alerts[0];
    },
    prayersListDisplay: function() {
      return self.data.prayers.filter(function(prayer) {
        return prayer.name != 'Sunrise';
      });
    },
  };
  self.selectedPrayerDataDetails = self.data.prayerDataList.filter(function(pData) {
    return pData.id == self.prayerDataId;
  })[0] || self.prayerDataList[0];

  self.prayerData = [];
  var prayerData = window.PRAYER_DATA[(self.selectedPrayerDataDetails && self.selectedPrayerDataDetails.parent) || self.prayerDataId];
  if (!prayerData) {
    alert('Invalid Prayer Data. Falling back to default');
    prayerData = window.PRAYER_DATA['Colombo'];
  }
  for (var month in prayerData) {
    if (prayerData.hasOwnProperty(month)) {
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

  self.languageChanged = function () {
    localStorage.setItem('mdisplay.lang', self.data.selectedLanguage);
    self.closeSettings();
  };
  self.ssidChanged = function () {
    localStorage.setItem('mdisplay.ssid', self.data.timeServerSSID);
    self.closeSettings();
  };
  self.checkNetworkStatus = function () {
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
    self.data.network.status = states[networkState];
    if (networkState == Connection.WIFI && typeof WifiWizard2 !== 'undefined') {
      self.data.network.status = 'Checking WiFi SSID...';
      WifiWizard2.getConnectedSSID().then(function (ssid) {
        self.data.network.status = states[Connection.WIFI] + ' (' + ssid + ')';
      }, function (err) {
        self.data.network.status = states[Connection.WIFI] + ' (SSID err: ' + err + ')';
      });
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
      }
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
    window.codePush.checkForUpdate(function (update) {
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
    }, function (error) {
      self.data.appUdate.checking = false;
      self.data.appUdate.updating = false;
      self.data.appUdate.updated = false;
      self.data.appUdate.error = error;
    });
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
      if(self.initialTestTime) {
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
      }  else {
        self.data.time = new Date();
      }
      self.data.time.setTime(self.data.time.getTime() - 1000);
      // if (self.data.timeOriginMode == 'network') {
      //   self.data.time.setFullYear(1970);
      // }
    }

    if (self.data.timeOverridden || self.data.timeOriginMode == 'network') {
      self.data.time = new Date(self.data.time.getTime() + 1000);
    } else {
      self.data.time = new Date();
    }
    var lastKnownYear = 2021;
    self.data.timeIsValid = self.data.time.getFullYear() >= lastKnownYear;
    if (!self.initialTestTime && !self.data.timeIsValid) {
      var d = new Date();
      if (d.getFullYear() >= lastKnownYear /* && d.getSeconds() > 30 */) {
        // fallback mode
        // self.data.time = d;
      }
      // self.checkNetworkStatusUntilTimeIsValid();
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
    if (self.selectedPrayerDataDetails && self.selectedPrayerDataDetails.timeAdjustmentMinutes) {
      m.add(self.selectedPrayerDataDetails.timeAdjustmentMinutes, 'minutes');
    }
    var timeAdjustmentMinutes = self.data.timeAdjustmentMinutes;
    if (!isNaN(timeAdjustmentMinutes) && timeAdjustmentMinutes != 0) {
      timeAdjustmentMinutes = parseInt(timeAdjustmentMinutes);
      m.add(timeAdjustmentMinutes, 'minutes'); // when timeAdjustmentMinutes is < 0, it's substracted automatically
    }

    return m.toDate();
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
    return {
      Subah: times[0],
      Sunrise: times[1],
      Luhar: times[2],
      Asr: times[3],
      Magrib: times[4],
      Isha: times[5]
    };
  };
  self.getIqamahTimes = function (prayerTimes, monthParam, dayParam) {
    var iqamahTimes = {};
    for (var name in self.data.iqamahTimes) {
      var prayerName = name == 'Jummah' ? 'Luhar' : name;
      var iqamahTime = self.data.iqamahTimes[name];
      if (iqamahTime.absolute) {
        iqamahTimes[name] = self.getTime(prayerTimes[prayerName].getFullYear(), monthParam, dayParam, iqamahTime.toTime() + (name == 'Subah' ? 'a' : 'p'));
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
    var d = moment(self.data.time);
    var dayOfWeek = parseInt(d.format('d'));
    var day = translations[self.lang].days[dayOfWeek];
    self.data.isFriday = dayOfWeek === 5;
    var month = translations[self.lang].months[self.data.time.getMonth()];
    console.log('all the times', times);
    var iqamahTimes = self.getIqamahTimes(times, dateParams[1], dateParams[2]);
    var time24Format = self.data.time24Format;
    self.todayPrayers = [
      new Prayer('Subah', times.Subah, iqamahTimes.Subah, self.lang, time24Format),
      // new Prayer('Sunrise', times[1], 10, self.lang),
      // new Prayer('Luhar', times.Luhar, iqamahTimes.Luhar, self.lang),
      new Prayer('Sunrise', times.Sunrise, iqamahTimes.Subah /* should be less than sunrise time (no iqamah) */, self.lang, time24Format),
      new Prayer(
        self.data.isFriday ? 'Jummah' : 'Luhar',
        times.Luhar,
        self.data.isFriday ? iqamahTimes.Jummah : iqamahTimes.Luhar,
        self.lang,
        time24Format
      ),
      new Prayer('Asr', times.Asr, iqamahTimes.Asr, self.lang, time24Format),
      new Prayer('Magrib', times.Magrib, iqamahTimes.Magrib, self.lang, time24Format),
      new Prayer('Isha', times.Isha, iqamahTimes.Isha, self.lang, time24Format)
    ];
    if (!self.sunriseSupport) {
      self.todayPrayers.splice(1, 1);
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
      new Prayer('Isha', tomorrowTimes.Isha, tomorrowIqamahTimes.Isha, self.lang, time24Format)
    ];
    if (!self.sunriseSupport) {
      self.nextDayPrayers.splice(1, 1);
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
    self.data.hijriDateDisplay = padZero(hijriDate.day) + ' ' + translations[self.lang].hijriMonths[hijriDate.month - 1] + ' ' + hijriDate.year;
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
          seconds: pause ? '00' : padZero(duration.seconds())
        };
        self.data.currentPrayerWaiting = false;
      } else {
        if(currentPrayer.name === 'Isha'){
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
          seconds: '00' // padZero(duration.seconds()),
        };

        return;
      }
      var _duration = moment.duration(iqamahTime - nowTime, 'milliseconds');
      self.data.currentPrayerWaiting = {
        minutes: padZero(_duration.minutes()),
        colon: self.data.currentPrayerWaiting && self.data.currentPrayerWaiting.colon == ':' ? '' : ':',
        seconds: padZero(_duration.seconds())
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
    if (self.data.time.getMinutes() % checkInternetInMinutes === 0 && self.data.time.getSeconds() === 0) {
      checkInternetNow = true;
    }
    // every 10 seconds
    if (!self.data.settingsMode && self.data.time.getSeconds()%10 === 0) {
      // self.data.lastKnownTime = moment(self.data.time).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
      // localStorage.setItem('mdisplay.lastKnownTime', self.data.lastKnownTime);
    }

    // self.data.network.showInternetAvailability = self.data.time.getSeconds() % 10 < 5;

    // if (self.data.time.getSeconds() % 2 === 1) {
    self.data.network.showInternetAvailability = !self.data.network.showInternetAvailability;
    // }
    if (self.data.timeOriginMode == 'network' && self.data.networkTimeApiUrl == self.timeServerApi) {
      self.tryConnectingToTimeServer();
    } else {
      if (checkInternetNow) {
        self.checkInternetAvailability(function () {}, 10, function () {
          self.setFetchingStatus('No Internet', 'error', false, 999);
        });
      } else if (self.data.network.internetAvailable === undefined) {
        self.checkInternetAvailability(function () {}, 0, function () {});
      }
    }
    if (self.data.time.getSeconds() % 2 === 0) {
      self.data.prayerInfo = self.data.prayerInfo === 'athan' ? 'iqamah' : 'athan';
      if (self.data.prayerInfo === 'iqamah') {
        self.data.showSunriseNow = self.sunriseSupport && !self.data.showSunriseNow;
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
          nextPrayer = prayer;
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
        seconds: '00' // padZero(duration.seconds()),
      };
    } else if (nextTime - nowTime < self.beforeSeconds * 1000) {
      self.data.currentPrayer = self.data.nextPrayer;
      var duration = moment.duration(nextTime - nowTime, 'milliseconds');
      self.data.currentPrayerBefore = {
        minutes: padZero(duration.minutes()),
        colon: self.data.currentPrayerBefore && self.data.currentPrayerBefore.colon == ':' ? '' : ':',
        seconds: padZero(duration.seconds())
      };
      self.data.currentPrayerAfter = false;
      self.data.currentPrayerWaiting = false;
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
    self.checkForKioskMode();
  };
  self.closeSettings = function () {
    self.data.settingsMode = false;
    var reloadOnSettings = true;
    if (reloadOnSettings || self.shouldReload) {
      window.location.reload();
    }
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
  self.mounted = function () {
    self.showToast('Application loaded.', 3000);
    // self.simulateTime = 50;
    self.updateTime();
    if (self.analogClock && self.data.analogClockActive) {
      self.analogClock.init(document.getElementById('analog-clock-container'), self.initialTestTime);
    }
    if (self.data.timeOriginMode == 'network' && self.simulateTime) {
      alert('Warning: simulateTime feature is not compatible with network time');
    }
    window._theInterval = window.setInterval(function () {
      self.nextTick();
    }, self.simulateTime ? self.simulateTime : 1000);
    setTimeout(function () {
      self.data.showSplash = false;
    }, 1000);
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
      if (settings.timeOriginMode == 'device' || settings.timeOriginMode == 'network') {
        self.data.timeOriginMode = settings.timeOriginMode;
      }
      var timeAdjustmentMinutes = parseInt(settings.timeAdjustmentMinutes);
      if (!isNaN(timeAdjustmentMinutes)) {
        self.data.timeAdjustmentMinutes = timeAdjustmentMinutes;
      }
      if (settings.analogClockActive) {
        self.data.analogClockActive = true;
      }
      if (settings.alertEnabled === false) {
        self.data.alertEnabled = false;
      }
      if (settings.time24Format) {
        self.data.time24Format = true;
      }
      if (settings.timeOverrideEnabled) {
        self.data.timeOverrideEnabled = true;
      }
      self.data.lastKnownTime = localStorage.getItem('mdisplay.lastKnownTime');
      if(self.data.lastKnownTime === 'undefined') {
        self.data.lastKnownTime = undefined;
      }
      if(typeof settings.activeClockTheme === 'string') {
        self.data.activeClockTheme = settings.activeClockTheme;
        switch (settings.activeClockTheme) {
          case 'digitalDefault':
            self.data.analogClockActive = false;
            self.data.digitalClockTheme = 'default';
            break;
          case 'analogDefault':
            self.data.analogClockActive = true;
            self.data.analogClockTheme = 'default';
            break;
          case 'analogModern':
            self.data.analogClockActive = true;
            self.data.analogClockTheme = 'modern';
            break;
          default:
            // invalid or digitalModern
            self.data.analogClockActive = false;
            self.data.digitalClockTheme = 'modern';
            break;
        }
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
      analogClockActive: self.data.analogClockActive,
      activeClockTheme: self.data.activeClockTheme,
      alertEnabled: self.data.alertEnabled,
      time24Format: self.data.time24Format,
      timeOverrideEnabled: self.data.timeOverrideEnabled,
    };
    localStorage.setItem('mdisplay.iqamahTimes', JSON.stringify(iqamahTimes));
    localStorage.setItem('mdisplay.iqamahTimesConfigured', 1);
    localStorage.setItem('mdisplay.settings', JSON.stringify(settings));
    localStorage.setItem('mdisplay.lastKnownTime', self.data.lastKnownTime || '');


    localStorage.setItem('mdisplay.lang', self.data.selectedLanguage);
    localStorage.setItem('mdisplay.prayerDataId', self.data.selectedPrayerDataId);
    localStorage.setItem('mdisplay.sunriseSupport', self.data.sunriseSupport ? 1 : '');

    if (callback) {
      callback();
    }
  };
  self.updateSettings = function () {
    self.writeStorage();
    self.shouldReload = true;
  };
  self.backupSettings = function () {
    var backupData = {
      'mdisplay.lang': self.data.selectedLanguage,
      'mdisplay.prayerDataId': self.data.selectedPrayerDataId,
      'mdisplay.iqamahTimes': localStorage.getItem('mdisplay.iqamahTimes'),
      'mdisplay.settings': localStorage.getItem('mdisplay.settings'),
      'mdisplay.backupTime': self.data.time.getTime(),
    };
    console.log('backupSettings', JSON.stringify(backupData));
  };
  self.initShortcuts = function () {
    var KEY_CODES = {
      ENTER: 13,
      ARROW_LEFT: 37,
      ARROW_UP: 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN: 40
    };
    var body = document.querySelector('body');
    body.onkeydown = function (event) {
      if (!event.metaKey) {
        // e.preventDefault();
      }
      var keyCode = event.keyCode;
      // alert('keyCode: ' + keyCode);
      if (keyCode == KEY_CODES.ENTER) {
        event.preventDefault();
        if (self.data.settingsMode) {
          self.closeSettings();
        } else {
          self.openSettings();
        }
        return;
      }
      if (!self.data.settingsMode) {
        return;
      }
      var rows = document.querySelectorAll('.times-config .time-config');
      if (keyCode == KEY_CODES.ARROW_DOWN || keyCode == KEY_CODES.ARROW_UP) {
        event.preventDefault();
        var lastSelectedRow = self.lastSelectedRow || 0;
        var lastSelectedCol = self.lastSelectedCol || 1;
        lastSelectedRow += keyCode == KEY_CODES.ARROW_UP ? -1 : 1;
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
      if (keyCode == KEY_CODES.ARROW_LEFT || keyCode == KEY_CODES.ARROW_RIGHT) {
        event.preventDefault();
        var _lastSelectedRow = self.lastSelectedRow || 1;
        var _lastSelectedCol = self.lastSelectedCol || 0;
        if (_lastSelectedRow < 1) {
          _lastSelectedRow = rows.length;
        }
        if (_lastSelectedRow > rows.length) {
          _lastSelectedRow = 1;
        }
        var _row = rows[_lastSelectedRow - 1];
        var _cols = _row.querySelectorAll('input');
        _lastSelectedCol += keyCode == KEY_CODES.ARROW_LEFT ? -1 : 1;
        if (_lastSelectedCol < 1) {
          _lastSelectedCol = _cols.length;
        }
        if (_lastSelectedCol > _cols.length) {
          _lastSelectedCol = 1;
        }
        var _col = _cols[_lastSelectedCol - 1];
        console.log('SHOULD FOCUS: ', _col.value, _col);
        _col.focus();
        self.lastSelectedRow = _lastSelectedRow;
        self.lastSelectedCol = _lastSelectedCol;
      }
    };
  };
  self.setFetchingStatus = function (message, mode, status, timeout) {
    var colors = {
      init: '#ffff20',
      error: '#ff1919',
      success: '#49ff50'
    };
    setTimeout(function () {
      self.data.timeFetchingMessage = {
        color: colors[mode],
        text: message
      };
    }, timeout ? 500 : 0);
    setTimeout(function () {
      self.fetchingInternetTime = status;
    }, timeout || 0);
  };
  self.updateInternetTime = function () {
    if (self.fetchingInternetTime) {
      return;
    }
    if (self.data.timeOriginMode != 'network') {
      // console.log('Internet time mode disabled');
      return;
    }
    if (self.data.networkTimeInitialized) {
      // console.log('Internet time mode already active');
      return;
    }
    console.log('Internet time mode fetching from...', self.data.networkTimeApiUrl);
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
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: self.data.networkTimeApiUrl + '',
      jsonp: 'callback',
      contentType: 'application/json; charset=utf-8',
      success: function success(response) {
        // console.log('Result received', response);
        if (!response /* && response.timestamp */) {
          console.log('Invalid response', response);
          self.setFetchingStatus('INVALID response', 'error', false, 999);
          return;
        }
        var timestamp = response.timestamp;
        var time = response.time;
        if (!timestamp && !time) {
          self.setFetchingStatus('MISSING timestamp or time from response', 'error', false, 999);
          console.log('Invalid timestamp/time response', response);
          return;
        }
        if (timestamp) {
          var timestampMillis = timestamp * 1000;
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
          // possibility for time inaccuracy. Hence recheck in 10 seconds.
          self.data.networkTimeInitialized = false;
        }, 10 * 1000);
        console.log('network data: ', response);
        self.setFetchingStatus('OK. Updated time from network', 'success', false, 1);
      },
      error: function error(err) {
        console.log('err: ', err);
        // alert('err: ' + err);
        self.setFetchingStatus('FAILED to update time from network', 'error', false, 999);
      }
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
    WifiWizard2.connect(timeServerSSID, bindAll, '1234567890', 'WPA', isHiddenSSID).then(function (res) {
      self.data.network.connecting = false;
      self.data.network.status = 'Connected to ' + timeServerSSID;
      self.checkNetworkStatus();
    }, function (err) {
      self.data.network.status = 'ERR ' + timeServerSSID + ' - ' + err;
      setTimeout(function () {
        self.tryConnectingToTimeServer(retryCount + 1);
      }, 1000);
    });
  };
  self.getSelected = function(options, selectedId) {
    var selected = options.filter(function(option) {
      return option.id == selectedId;
    })[0];
    return selected ? selected.label : 'Not Selected';
  };
  self.deviceReady = function () {
    self.isDeviceReady = true;
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
}
window.mdApp = new App();