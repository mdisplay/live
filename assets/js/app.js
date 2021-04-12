/* inspired by axios */
class AjaxRequest {
  createError(message, code, request, response) {
    const error = new Error(message);
    error.error = true;
    if (code) {
      error.code = code;
    }
    error.request = request;
    error.response = response;
    return error;
  }
  settle(resolve, reject, response) {
    const validateStatus = (status) => {
      return status >= 200 && status < 300;
    };
    // Note: status is not exposed by XDomainRequest
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(this.createError('Request failed with status code ' + response.status, null, response.request, response));
    }
  }
  request(method, url, formData = null, configureFn) {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line
      let request = new XMLHttpRequest();
      const loadEvent = 'onreadystatechange';
      request.open(method, url, true);
      // Listen for ready state
      request[loadEvent] = () => {
        if (!request || request.readyState !== 4) {
          return;
        }
        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // Prepare the response
        const responseHeaders = request.getAllResponseHeaders();
        let responseData = request.responseText;
        const contentType = request.getResponseHeader('Content-Type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          responseData = JSON.parse(responseData);
        } else {
          try {
            responseData = JSON.parse(responseData);
          } catch (e) {
            /* ignore, possibly non json response */
          }
        }
        const response = {
          data: responseData,
          // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
          status: request.status === 1223 ? 204 : request.status,
          statusText: request.status === 1223 ? 'No Content' : request.statusText,
          headers: responseHeaders,
          request,
        };
        this.settle(resolve, reject, response);
        // Clean up request
        request = null;
      };
      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = () => {
        if (!request) {
          return;
        }
        reject(this.createError('Request aborted', 'ECONNABORTED', request));
        // Clean up request
        request = null;
      };
      // Handle low level network errors
      request.onerror = () => {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(this.createError('Network Error', null, request));
        // Clean up request
        request = null;
      };
      // Handle timeout
      request.ontimeout = () => {
        reject(this.createError('timeout exceeded', 'ECONNABORTED', request));
        // Clean up request
        request = null;
      };
      // // Handle progress if needed
      // if (typeof config.onDownloadProgress === 'function') {
      //   request.addEventListener('progress', config.onDownloadProgress);
      // }
      // Not all browsers support upload events
      // if (typeof progressCallback === 'function' && request.upload) {
      //   request.upload.addEventListener('progress', progressCallback);
      // }
      if (typeof configureFn === 'function') {
        configureFn(request);
      }
      request.send(formData);
    });
  }
  get(url, formData, configureFn) {
    return this.request('GET', url, formData, configureFn);
  }
  post(url, formData, configureFn) {
    return this.request('POST', url, formData, configureFn);
  }
  delete(url, formData, configureFn) {
    return this.request('DELETE', url, formData, configureFn);
  }
  put(url, formData, configureFn) {
    return this.request('PUT', url, formData, configureFn);
  }
}
const ajax = new AjaxRequest();

var padZero = (number) => {
  number = parseInt(number);
  if (number < 10) {
    return '0' + number;
  }
  return '' + number;
};

class Toast {
  constructor(message) {
    this.message = message;
  }
}

class Prayer {
  constructor(name, time, iqamahTime, lang) {
    this.name = name;
    this.nameDisplay = translations[lang][this.name];
    this.time = time;
    // this.iqamah = iqamahTime;
    // this.iqamah = 100;
    this.iqamahTime = iqamahTime; //new Date(this.time.getTime() + this.iqamah * 60 * 1000);
    const d = moment(this.time);
    this.timeDisplay = d.format('hh:mm');
    this.timeAmPm = d.format('A');
    this.timeHours = d.format('hh');
    this.timeMinutes = d.format('mm');
    const id = moment(this.iqamahTime);
    this.iqamahTimeDisplay = id.format('hh:mm');
    this.iqamahTimeHours = id.format('hh');
    this.iqamahTimeMinutes = id.format('mm');
    this.iqamahTimeAmPm = id.format('A');
  }
}

class IqamahTime {
  constructor(minutes, hours, absolute) {
    this.minutes = padZero(minutes || 0);
    hours = parseInt(hours);
    this.hours = hours ? padZero(hours) : '';
    this.absolute = !!absolute;
    return;
    // const parts = (time + '').split(':');
    // this.isAbsolute = false;
    // if(parts.length === 2) {
    //   this.isAbsolute = true;
    // } else {
    //   parts[1] =
    // }

    // this.hours = parts[1] || '00';
    // this.time = parts[0];
  }
  toTime() {
    return this.hours + ':' + this.minutes;
  }
  toRaw() {
    return {
      hours: this.hours,
      minutes: this.minutes,
      absolute: this.absolute,
    };
  }
}

IqamahTime.fromRaw = function (raw) {
  return new IqamahTime(raw.minutes, raw.hours, raw.absolute);
};

// class AppUpdater {
//   constructor() {

//   }
// }

class App {
  constructor() {
    this.lang = localStorage.getItem('mdisplay.lang') || 'ta';
    this.prayerData = [];
    for (let month in window.PRAYER_DATA) {
      if (window.PRAYER_DATA.hasOwnProperty(month)) {
        this.prayerData.push(window.PRAYER_DATA[month]);
      }
    }
    this.checkInternetJsonp = {
      jsonpCallback: 'checkInternet',
      url: 'https://mdisplay.github.io/live/check-internet.js',
      // url: 'http://192.168.1.11/mdisplay/live/check-internet.js',
    };
    var timeServerIp = '192.168.1.1';
    var timeServerApi = 'http://' + timeServerIp + '/api';
    this.timeServerApi = timeServerApi;
    this.data = {
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
        switchLauncher: () => {
          alert('Kiosk not available');
        },
      },
      toasts: [],
      timeOriginMode: 'device', // or 'network'
      networkMode: 'network', // or 'timeserver',
      networkTimeApiUrl: timeServerApi,
      isFriday: false,
      selectedLanguage: this.lang,
      languages: [
        { id: 'si', label: 'Sinhala' },
        { id: 'ta', label: 'Tamil' },
        { id: 'en', label: 'English' },
      ],
      analogClockActive: false,
      networkTimeInitialized: false,
      timeIsValid: false,
      timeFetchingMessage: undefined,
      timeAdjustmentMinutes: 0,
      network: {
        status: 'Unknown',
        connecting: undefined,
        internetStatus: 'Unknown',
        internetAvailable: undefined,
        showInternetAvailability: false,
      },
    };
    this.isDeviceReady = false;
    this.isInitial = true;
    this.beforeSeconds = 5 * 60;
    // this.beforeSeconds = 1*60;
    this.afterSeconds = 5 * 60;
    // this.afterSeconds = 1;
    // this.afterSeconds = 1*60;
    this.afterSeconds = 2 * 60;
    this.data.bgVersion = '7';
  }

  languageChanged() {
    localStorage.setItem('mdisplay.lang', this.data.selectedLanguage);
    this.closeSettings();
  }

  checkNetworkStatus() {
    if (!this.isDeviceReady || typeof Connection === 'undefined') {
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

    this.data.network.status = states[networkState];
    if (networkState == Connection.WIFI && typeof WifiWizard2 !== 'undefined') {
      this.data.network.status = 'Checking WiFi SSID...';
      WifiWizard2.getConnectedSSID().then(
        (ssid) => {
          this.data.network.status = states[Connection.WIFI] + ' (' + ssid + ')';
        },
        (err) => {
          this.data.network.status = states[Connection.WIFI] + ' (SSID err: ' + err + ')';
        }
      );
    }

    // alert('Connection type: ' + states[networkState]);
  }

  checkNetworkStatusUntilTimeIsValid() {
    console.log('checkNetworkStatusUntilTimeIsValid');
    this.checkNetworkStatus();
    if (this.data.timeIsValid) {
      return;
    }
    setTimeout(() => {
      this.checkNetworkStatusUntilTimeIsValid();
    }, 3000);
  }

  checkInternetAvailability(okCallback, retryCount, failCallback) {
    retryCount = retryCount || 0;
    this.setFetchingStatus('Checking Internet Connection...', 'init', true);
    const retry = (okCallback) => {
      if (retryCount <= 0) {
        failCallback();
        return;
      }
      setTimeout(() => {
        this.checkInternetAvailability(okCallback, retryCount - 1, failCallback);
      }, 3000);
    };
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: this.checkInternetJsonp.url,
      jsonpCallback: this.checkInternetJsonp.jsonpCallback,
      contentType: 'application/json; charset=utf-8',
      success: (response) => {
        // console.log('Result received', response);
        if (response && response.result == 'ok') {
          this.setFetchingStatus('Internet Connection OK ', 'success', false, 999);
          setTimeout(() => {
            this.data.network.internetAvailable = true;
            okCallback();
            // this.data.network.checking = false;
          }, 2000);
          return;
        }
        this.data.network.internetAvailable = false;
        this.setFetchingStatus('INVALID response', 'error', false, 999);
        retry(okCallback);
      },
      error: (err) => {
        // console.log('err: ', err);
        // // alert('err: ' + err);
        this.data.network.internetAvailable = false;
        this.setFetchingStatus('Internet Connection FAILED', 'error', false, 999);
        retry(okCallback);
      },
    });
  }

  checkForUpdates() {
    if (window.codePush === undefined) {
      console.log('codePush not available');
      alert('AUTO UPDATE not available!');
      return;
    }
    this.data.appUdate.enabled = true;
    // if(this.data.appUdate.updated) {
    //   return;
    // }
    this.data.appUdate.error = false;
    this.data.appUdate.checking = true;
    this.data.appUdate.updated = false;
    this.data.appUdate.updating = false;
    window.codePush.checkForUpdate(
      (update) => {
        this.data.appUdate.error = false;
        this.data.appUdate.checking = false;
        this.data.appUdate.updating = false;
        this.data.appUdate.updated = false;
        if (!update) {
          // alert("The app is up to date.");
          this.data.appUdate.updated = true;
        } else {
          this.data.appUdate.updating = true;
          window.askAndAutoUpdate();
          // alert("An update is available! Should we download it?");
          // window.codePush.restartApplication();
        }
      },
      (error) => {
        this.data.appUdate.checking = false;
        this.data.appUdate.updating = false;
        this.data.appUdate.updated = false;
        this.data.appUdate.error = error;
      }
    );
  }

  checkForKioskMode() {
    if (window.Kiosk === undefined) {
      this.data.kioskMode.available = false;
      this.data.kioskMode.enabled = false;
      this.data.kioskMode.isHome = false;
      console.log('Kiosk not available');
      return;
    }
    this.data.kioskMode.available = true;
    Kiosk.isInKiosk((isInKiosk) => {
      this.data.kioskMode.enabled = isInKiosk;
    });
    Kiosk.isSetAsLauncher((isSetAsLauncher) => {
      this.data.kioskMode.isHome = isSetAsLauncher;
    });
    this.data.kioskMode.switchLauncher = () => {
      Kiosk.switchLauncher();
    };
    // this.data.kioskMode.enabled = true;
    // kioskMode;
  }

  getRandomNumber(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }
  updateTime() {
    if (!this.data.time) {
      this.data.time = this.initialTestTime ? this.initialTestTime : new Date();
      this.data.time.setTime(this.data.time.getTime() - 1000);
      // if (this.data.timeOriginMode == 'network') {
      //   this.data.time.setFullYear(1970);
      // }
    }
    if (this.initialTestTime || this.data.timeOriginMode == 'network') {
      this.data.time = new Date(this.data.time.getTime() + 1000);
    } else {
      this.data.time = new Date();
    }
    const lastKnownYear = 2021;
    this.data.timeIsValid = this.data.time.getFullYear() >= lastKnownYear;
    if (!this.initialTestTime && !this.data.timeIsValid) {
      const d = new Date();
      if (d.getFullYear() >= lastKnownYear /* && d.getSeconds() > 30 */) {
        // fallback mode
        // this.data.time = d;
      }
      // this.checkNetworkStatusUntilTimeIsValid();
    }
    if (!this.data.timeIsValid) {
      // if (this.data.timeOriginMode != 'network' && this.data.network.internetAvailable === undefined) {
      //   this.checkInternetAvailability(
      //     () => {},
      //     0,
      //     () => {}
      //   );
      // }
      if (!(this.data.timeOriginMode == 'network' && this.data.networkTimeApiUrl == this.timeServerApi)) {
        this.checkNetworkStatus();
      } else {
        if (this.data.network.connecting !== undefined) {
          this.checkNetworkStatus();
        }
      }
    }
    this.data.timeFormatted = moment(this.data.time).format('DD MMM YYYY, h:mm:ss A');
    this.data.timeDisplay = moment(this.data.time).format('hh:mm');
    this.data.timeDisplayHours = moment(this.data.time).format('hh');
    this.data.timeDisplayMinutes = moment(this.data.time).format('mm');
    this.data.timeDisplaySeconds = moment(this.data.time).format('ss');
    this.data.timeDisplayColon = this.data.timeDisplayColon == ':' ? '' : ':';
    this.data.timeDisplayAmPm = moment(this.data.time).format('A');
    this.updateInternetTime();
  }
  getDateParams(date) {
    return [date.getFullYear(), date.getMonth(), date.getDate()];
  }
  getTime(yearParam, monthParam, dayParam, time) {
    let timeParts = time.split(':');
    let hoursAdd = 0;
    if (timeParts[1].indexOf('p') != -1) {
      hoursAdd = 12;
    }
    const hours = hoursAdd + parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1].replace('a', '').replace('p', ''));
    const m = moment(yearParam + ' ' + (monthParam + 1) + ' ' + dayParam + ' ' + time + 'm', 'YYYY M D hh:mma');
    if (!isNaN(this.data.timeAdjustmentMinutes) && this.data.timeAdjustmentMinutes != 0) {
      const timeAdjustmentMinutes = parseInt(this.data.timeAdjustmentMinutes);
      if (timeAdjustmentMinutes < 0) {
        m.subtract(timeAdjustmentMinutes, 'minutes');
      } else {
        m.add(timeAdjustmentMinutes, 'minutes');
      }
    }
    return m.toDate();
  }
  getTimes(yearParam, monthParam, dayParam) {
    const times = [];
    for (let segment of this.prayerData[monthParam]) {
      if (segment.range[0] <= dayParam && segment.range[1] >= dayParam) {
        // this.currentSegment = segment;
        for (let time of segment.times) {
          times.push(this.getTime(yearParam, monthParam, dayParam, time));
        }
        break;
      }
    }
    if (!times.length) {
      return false;
    }
    return {
      Subah: times[0],
      Luhar: times[2],
      Asr: times[3],
      Magrib: times[4],
      Isha: times[5],
    };
  }
  getIqamahTimes(prayerTimes, monthParam, dayParam) {
    const iqamahTimes = {};
    for (const name in this.data.iqamahTimes) {
      const prayerName = name == 'Jummah' ? 'Luhar' : name;
      const iqamahTime = this.data.iqamahTimes[name];
      if (iqamahTime.absolute) {
        iqamahTimes[name] = this.getTime(monthParam, dayParam, iqamahTime.toTime() + (name == 'Subah' ? 'a' : 'p'));
      } else {
        iqamahTimes[name] = new Date(prayerTimes[prayerName].getTime() + parseInt(iqamahTime.minutes) * 60 * 1000);
      }
    }
    return iqamahTimes;
  }
  showNextDayPrayers() {
    this.data.prayers = this.nextDayPrayers;
  }
  onDayUpdate() {
    let dateParams = this.getDateParams(this.data.time);
    this.currentDateParams = dateParams;
    // console.log();
    let times;
    const fallbackToNextDayOnFail = false;
    for (let i = 0; i < 100; i++) {
      // try few more times!; - why? - fallback if data is not available for a particular day
      times = this.getTimes(dateParams[0], dateParams[1], dateParams[2]);
      if (times || !fallbackToNextDayOnFail) {
        break;
      }
      const d = new Date(this.data.time.getTime());
      d.setDate(d.getDate() + 1);
      dateParams = this.getDateParams(d);
    }

    const d = moment(this.data.time);
    const dayOfWeek = parseInt(d.format('d'));
    const day = translations[this.lang].days[dayOfWeek];
    this.data.isFriday = dayOfWeek === 5;
    const month = translations[this.lang].months[this.data.time.getMonth()];

    console.log('all the times', times);
    const iqamahTimes = this.getIqamahTimes(times, dateParams[1], dateParams[2]);
    this.todayPrayers = [
      new Prayer('Subah', times.Subah, iqamahTimes.Subah, this.lang),
      // new Prayer('Sunrise', times[1], 10, this.lang),
      // new Prayer('Luhar', times.Luhar, iqamahTimes.Luhar, this.lang),
      new Prayer(
        this.data.isFriday ? 'Jummah' : 'Luhar',
        times.Luhar,
        this.data.isFriday ? iqamahTimes.Jummah : iqamahTimes.Luhar,
        this.lang
      ),
      new Prayer('Asr', times.Asr, iqamahTimes.Asr, this.lang),
      new Prayer('Magrib', times.Magrib, iqamahTimes.Magrib, this.lang),
      new Prayer('Isha', times.Isha, iqamahTimes.Isha, this.lang),
    ];
    this.data.prayers = this.todayPrayers;

    const tomorrowParams = this.getDateParams(new Date(this.data.time.getTime() + 24 * 60 * 60 * 1000));
    let tomorrowTimes = this.getTimes(tomorrowParams[0], tomorrowParams[1], tomorrowParams[2]);
    if (!tomorrowTimes) {
      tomorrowTimes = times;
    }
    const tomorrowIqamahTimes = this.getIqamahTimes(tomorrowTimes, tomorrowParams[1], tomorrowParams[2]);
    this.nextDayPrayers = [
      new Prayer('Subah', tomorrowTimes.Subah, tomorrowIqamahTimes.Subah, this.lang),
      new Prayer('Luhar', tomorrowTimes.Luhar, tomorrowIqamahTimes.Luhar, this.lang),
      new Prayer('Asr', tomorrowTimes.Asr, tomorrowIqamahTimes.Asr, this.lang),
      new Prayer('Magrib', tomorrowTimes.Magrib, tomorrowIqamahTimes.Magrib, this.lang),
      new Prayer('Isha', tomorrowTimes.Isha, tomorrowIqamahTimes.Isha, this.lang),
    ];
    // this.data.nextPrayer = this.data.prayers[0];
    this.data.currentPrayer = undefined;
    this.data.currentPrayerBefore = false;
    this.data.currentPrayerAfter = false;
    this.data.currentPrayerWaiting = false;
    this.data.currentPrayerDescription = '';
    // this.data.nextPrayerNear = false;
    // this.data.currentIqamah = undefined;
    // this.data.currentIqamah
    // this.data.dateDisplay = d.format('ddd, DD MMM YYYY');
    this.data.weekDayDisplay = day;
    this.data.dateDisplay = padZero(this.data.time.getDate()) + ' ' + month + ' ' + this.data.time.getFullYear(); //day + ', ' +
    const hijriMonth = parseInt(d.format('iM'));
    // this.data.hijriDateDisplay = d.format('iDD, ___ (iMM) iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // const hijriDate = new HijriDate(this.data.time.getTime());
    const hijriDate = HijriJS.gregorianToHijri(
      this.data.time.getFullYear(),
      this.data.time.getMonth() + 1,
      this.data.time.getDate()
    );
    // this.data.hijriDateDisplay = d.format('iDD ___ iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // this.data.hijriDateDisplay = padZero(hijriDate.getDate()) + ' ' + translations.ta.months[hijriDate.getMonth()] + ' ' + hijriDate.getFullYear();
    this.data.hijriDateDisplay =
      padZero(hijriDate.day) + ' ' + translations[this.lang].hijriMonths[hijriDate.month - 1] + ' ' + hijriDate.year;
    // this.data.hijriDateDisplay = hijriDate.toFormat('dd mm YYYY');

    this.data.hijriDate = hijriDate;

    this.data.prayerInfo = 'athan';
    this.updateBackground(true);
  }
  updateBackground(isInit) {
    if (!isInit) {
      // return;
    }
    // const backgroundImages = [
    //   'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max',
    // ];
    // return (this.data.backgroundImage = backgroundImages[0]);
    const maxAvailableBackgrounds = 11;
    this.data.backgroundImage =
      'backgrounds/' + this.getRandomNumber(1, maxAvailableBackgrounds) + '.jpg?v=' + this.data.bgVersion;
  }
  commitCurrentPrayer() {
    if (!this.data.currentPrayer) {
      this.data.currentPrayerDescription = '';
      return;
    }
    if (this.data.currentPrayerWaiting) {
      this.data.currentPrayerDescription = translations[this.lang].currentPrayerWaiting;
    } else if (this.data.currentPrayerBefore) {
      this.data.currentPrayerDescription = translations[this.lang].currentPrayerBefore;
    } else if (this.data.currentPrayerAfter) {
      this.data.currentPrayerDescription = translations[this.lang].currentPrayerAfter;
    }
  }
  checkCurrentPrayer(currentPrayer) {
    const nowTime = this.data.time.getTime();
    const iqamahTime = currentPrayer.iqamahTime.getTime();
    if (nowTime >= iqamahTime) {
      if (nowTime - iqamahTime < this.afterSeconds * 1000) {
        this.data.currentPrayer = currentPrayer;
        this.data.currentPrayerBefore = false;
        // this.data.currentPrayerAfter = true;
        const duration = moment.duration(nowTime - iqamahTime, 'milliseconds');
        // this.data.currentPrayerAfter = padZero(duration.minutes()) + ':' + padZero(duration.seconds());
        let pause = nowTime - iqamahTime < 15 * 1000;
        pause = true;
        this.data.currentPrayerAfter = {
          minutes: pause ? '00' : padZero(duration.minutes()),
          colon: this.data.currentPrayerAfter && this.data.currentPrayerAfter.colon == ':' ? ':' : ':',
          seconds: pause ? '00' : padZero(duration.seconds()),
        };
        this.data.currentPrayerWaiting = false;
      } else {
        this.data.currentPrayer = undefined;
        this.data.currentPrayerBefore = false;
        this.data.currentPrayerAfter = false;
        this.data.currentPrayerWaiting = false;
      }
    } else {
      this.data.currentPrayer = currentPrayer;
      this.data.currentPrayerBefore = false;
      this.data.currentPrayerAfter = false;
      if (nowTime - currentPrayer.time.getTime() < 15 * 1000) {
        this.data.currentPrayerWaiting = false;
        this.data.currentPrayerBefore = {
          minutes: '00', // padZero(duration.minutes()),
          colon: this.data.currentPrayerBefore && this.data.currentPrayerBefore.colon == ':' ? ':' : ':',
          seconds: '00', // padZero(duration.seconds()),
        };
        return;
      }
      const duration = moment.duration(iqamahTime - nowTime, 'milliseconds');
      this.data.currentPrayerWaiting = {
        minutes: padZero(duration.minutes()),
        colon: this.data.currentPrayerWaiting && this.data.currentPrayerWaiting.colon == ':' ? '' : ':',
        seconds: padZero(duration.seconds()),
      };
    }
  }
  nextTick() {
    this.updateTime();
    const dateParams = this.getDateParams(this.data.time);
    if (
      !(
        this.currentDateParams &&
        dateParams[0] === this.currentDateParams[0] &&
        dateParams[1] === this.currentDateParams[1] &&
        dateParams[2] === this.currentDateParams[2]
      )
    ) {
      this.onDayUpdate();
    }
    const changeBackgroundInMinutes = 1;
    if (this.data.time.getMinutes() % changeBackgroundInMinutes === 0 && this.data.time.getSeconds() === 0) {
      this.updateBackground();
    }
    const checkInternetInMinutes = 1;
    let checkInternetNow = false;
    if (this.data.time.getMinutes() % checkInternetInMinutes === 0 && this.data.time.getSeconds() === 0) {
      checkInternetNow = true;
    }
    // this.data.network.showInternetAvailability = this.data.time.getSeconds() % 10 < 5;

    // if (this.data.time.getSeconds() % 2 === 1) {
    this.data.network.showInternetAvailability = !this.data.network.showInternetAvailability;
    // }
    if (this.data.timeOriginMode == 'network' && this.data.networkTimeApiUrl == this.timeServerApi) {
      this.tryConnectingToTimeServer();
    } else {
      if (checkInternetNow) {
        this.checkInternetAvailability(
          () => {},
          10,
          () => {
            this.setFetchingStatus('No Internet', 'error', false, 999);
          }
        );
      } else if (this.data.network.internetAvailable === undefined) {
        this.checkInternetAvailability(
          () => {},
          0,
          () => {}
        );
      }
    }
    if (this.data.time.getSeconds() % 2 === 0) {
      this.data.prayerInfo = this.data.prayerInfo === 'athan' ? 'iqamah' : 'athan';
    }
    const nowTime = this.data.time.getTime();
    let nextTime = this.data.nextPrayer ? this.data.nextPrayer.time.getTime() : 0;
    // console.log('nextTick');
    if (nowTime >= nextTime + 1000) {
      console.log('coming next');
      let nextPrayer;
      for (let prayer of this.todayPrayers) {
        if (nowTime < prayer.time.getTime()) {
          nextPrayer = prayer;
          break;
        }
      }
      if (!nextPrayer) {
        if (!(this.nextDayPrayers[0] && nowTime < this.nextDayPrayers[0].time.getTime())) {
          // this.onDayUpdate();
          // return this.nextTick();
        }
        nextPrayer = this.nextDayPrayers[0];
        this.showNextDayPrayers();
      }
      console.log('recalculate next prayer!', nextPrayer);
      this.data.nextPrayer = nextPrayer;
      nextTime = this.data.nextPrayer.time.getTime();

      // this.data.currentPrayer = this.data.nextPrayer;
      this.data.currentPrayerBefore = false;
      this.data.currentPrayerAfter = false;
      this.data.currentPrayerWaiting = false;
      this.data.currentPrayerBefore = {
        minutes: '00', // padZero(duration.minutes()),
        colon: this.data.currentPrayerBefore && this.data.currentPrayerBefore.colon == ':' ? ':' : ':',
        seconds: '00', // padZero(duration.seconds()),
      };
    } else if (nextTime - nowTime < this.beforeSeconds * 1000) {
      this.data.currentPrayer = this.data.nextPrayer;
      const duration = moment.duration(nextTime - nowTime, 'milliseconds');
      this.data.currentPrayerBefore = {
        minutes: padZero(duration.minutes()),
        colon: this.data.currentPrayerBefore && this.data.currentPrayerBefore.colon == ':' ? '' : ':',
        seconds: padZero(duration.seconds()),
      };
      this.data.currentPrayerAfter = false;
      this.data.currentPrayerWaiting = false;
    } else {
      if (this.data.currentPrayer) {
        this.checkCurrentPrayer(this.data.currentPrayer);
      } else {
        if (this.isInitial) {
          console.log('is isInitial');
          // if (nowTime < ) {}
          let prevPrayer;
          if (this.data.nextPrayer === this.nextDayPrayers[0]) {
            prevPrayer = this.todayPrayers[this.todayPrayers.length - 1];
          } else {
            const idx = this.todayPrayers.indexOf(this.data.nextPrayer);
            if (idx > 0) {
              // not subah
              prevPrayer = this.todayPrayers[idx - 1];
            }
          }
          if (prevPrayer) {
            this.checkCurrentPrayer(prevPrayer);
          }
          this.isInitial = false;
        } else {
          this.data.currentPrayer = undefined;
          this.data.currentPrayerBefore = false;
          this.data.currentPrayerAfter = false;
          this.data.currentPrayerWaiting = false;
        }
      }
    }
    if (this.analogClock && this.data.analogClockActive) {
      this.analogClock.nextTick();
    }
    this.commitCurrentPrayer();
  }
  forceTimeUpdate(newDate) {
    this.data.time = newDate;
    // this.onDayUpdate();
  }
  translate(text) {
    return translations[this.lang][text] || text;
  }
  openSettings() {
    this.data.settingsMode = true;
    this.checkForKioskMode();
  }
  closeSettings() {
    this.data.settingsMode = false;
    const reloadOnSettings = true;
    if (reloadOnSettings || this.shouldReload) {
      window.location.reload();
    }
  }
  showToast(message, duration) {
    duration = duration || 3000;
    var toast = new Toast(message);
    this.data.toasts.push(toast);
    setTimeout(() => {
      var i = this.data.toasts.indexOf(toast);
      if (i !== -1) {
        this.data.toasts.splice(i, 1);
      }
    }, duration);
  }
  mounted() {
    this.showToast('Application loaded.', 3000);
    // this.simulateTime = 50;
    this.updateTime();
    if (this.analogClock && this.data.analogClockActive) {
      this.analogClock.init(document.getElementById('analog-clock-container'), this.initialTestTime);
    }
    if (this.data.timeOriginMode == 'network' && this.simulateTime) {
      alert('Warning: simulateTime feature is not compatible with network time');
    }
    window._theInterval = window.setInterval(
      () => {
        this.nextTick();
      },
      this.simulateTime ? this.simulateTime : 1000
    );
    setTimeout(() => {
      this.data.showSplash = false;
    }, 1000);
  }
  created() {
    if (window._theInterval) {
      window.clearInterval(window._theInterval);
    }
  }
  initStorage(callback) {
    let iqamahTimes;
    let settings;
    try {
      settings = JSON.parse(localStorage.getItem('mdisplay.settings'));
    } catch (e) {}
    try {
      iqamahTimes = JSON.parse(localStorage.getItem('mdisplay.iqamahTimes'));
    } catch (e) {}
    if (!iqamahTimes) {
      return callback();
    }
    const iqamahTimesConfigured = localStorage.getItem('mdisplay.iqamahTimesConfigured');
    for (const name in iqamahTimes) {
      this.data.iqamahTimes[name] = IqamahTime.fromRaw(iqamahTimes[name]);
    }
    this.data.iqamahTimesConfigured = !!iqamahTimesConfigured;
    if (settings) {
      if (settings.timeOriginMode == 'device' || settings.timeOriginMode == 'network') {
        this.data.timeOriginMode = settings.timeOriginMode;
      }
      const timeAdjustmentMinutes = parseInt(settings.timeAdjustmentMinutes);
      if (!isNaN(timeAdjustmentMinutes)) {
        this.data.timeAdjustmentMinutes = timeAdjustmentMinutes;
      }
      // ...
    }
    callback();
  }
  writeStorage(callback) {
    const iqamahTimes = {};
    for (const name in this.data.iqamahTimes) {
      iqamahTimes[name] = this.data.iqamahTimes[name].toRaw();
    }
    this.data.iqamahTimesConfigured = true;
    const settings = {
      timeOriginMode: this.data.timeOriginMode,
      timeAdjustmentMinutes: this.data.timeAdjustmentMinutes,
    };
    localStorage.setItem('mdisplay.iqamahTimes', JSON.stringify(iqamahTimes));
    localStorage.setItem('mdisplay.iqamahTimesConfigured', 1);
    localStorage.setItem('mdisplay.settings', JSON.stringify(settings));
    if (callback) {
      callback();
    }
  }
  updateSettings() {
    this.writeStorage();
    this.shouldReload = true;
  }
  initShortcuts() {
    const KEY_CODES = {
      ENTER: 13,
      ARROW_LEFT: 37,
      ARROW_UP: 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN: 40,
    };
    const body = document.querySelector('body');
    body.onkeydown = (event) => {
      if (!event.metaKey) {
        // e.preventDefault();
      }
      const keyCode = event.keyCode;
      // alert('keyCode: ' + keyCode);
      if (keyCode == KEY_CODES.ENTER) {
        event.preventDefault();
        if (this.data.settingsMode) {
          this.closeSettings();
        } else {
          this.openSettings();
        }
        return;
      }
      if (!this.data.settingsMode) {
        return;
      }
      const rows = document.querySelectorAll('.times-config .time-config');
      if (keyCode == KEY_CODES.ARROW_DOWN || keyCode == KEY_CODES.ARROW_UP) {
        event.preventDefault();
        let lastSelectedRow = this.lastSelectedRow || 0;
        let lastSelectedCol = this.lastSelectedCol || 1;
        lastSelectedRow += keyCode == KEY_CODES.ARROW_UP ? -1 : 1;
        if (lastSelectedRow < 1) {
          lastSelectedRow = rows.length;
        }
        if (lastSelectedRow > rows.length) {
          lastSelectedRow = 1;
        }
        const row = rows[lastSelectedRow - 1];
        const cols = row.querySelectorAll('input');
        if (lastSelectedCol < 1) {
          lastSelectedCol = cols.length;
        }
        if (lastSelectedCol > cols.length) {
          lastSelectedCol = 1;
        }
        const col = cols[lastSelectedCol - 1];
        console.log('SHOULD FOCUS: ', col.value, col);
        col.focus();
        this.lastSelectedRow = lastSelectedRow;
        this.lastSelectedCol = lastSelectedCol;
      }

      if (keyCode == KEY_CODES.ARROW_LEFT || keyCode == KEY_CODES.ARROW_RIGHT) {
        event.preventDefault();
        let lastSelectedRow = this.lastSelectedRow || 1;
        let lastSelectedCol = this.lastSelectedCol || 0;
        if (lastSelectedRow < 1) {
          lastSelectedRow = rows.length;
        }
        if (lastSelectedRow > rows.length) {
          lastSelectedRow = 1;
        }
        const row = rows[lastSelectedRow - 1];
        const cols = row.querySelectorAll('input');
        lastSelectedCol += keyCode == KEY_CODES.ARROW_LEFT ? -1 : 1;
        if (lastSelectedCol < 1) {
          lastSelectedCol = cols.length;
        }
        if (lastSelectedCol > cols.length) {
          lastSelectedCol = 1;
        }
        const col = cols[lastSelectedCol - 1];
        console.log('SHOULD FOCUS: ', col.value, col);
        col.focus();
        this.lastSelectedRow = lastSelectedRow;
        this.lastSelectedCol = lastSelectedCol;
      }
    };
  }
  setFetchingStatus(message, mode, status, timeout) {
    const colors = {
      init: '#ffff20',
      error: '#ff1919',
      success: '#49ff50',
    };
    setTimeout(
      () => {
        this.data.timeFetchingMessage = {
          color: colors[mode],
          text: message,
        };
      },
      timeout ? 500 : 0
    );
    setTimeout(() => {
      this.fetchingInternetTime = status;
    }, timeout || 0);
  }
  updateInternetTime() {
    if (this.fetchingInternetTime) {
      return;
    }
    if (this.data.timeOriginMode != 'network') {
      // console.log('Internet time mode disabled');
      return;
    }
    if (this.data.networkTimeInitialized) {
      // console.log('Internet time mode already active');
      return;
    }

    console.log('Internet time mode fetching from...', this.data.networkTimeApiUrl);
    this.setFetchingStatus('Requesting time from network...', 'init', true);

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
      url: this.data.networkTimeApiUrl + '',
      jsonp: 'callback',
      contentType: 'application/json; charset=utf-8',
      success: (response) => {
        // console.log('Result received', response);
        if (!(response /* && response.timestamp */)) {
          console.log('Invalid response', response);
          this.setFetchingStatus('INVALID response', 'error', false, 999);
          return;
        }
        const timestamp = response.timestamp;
        const time = response.time;
        if (!timestamp && !time) {
          this.setFetchingStatus('MISSING timestamp or time from response', 'error', false, 999);
          console.log('Invalid timestamp/time response', response);
          return;
        }
        if (timestamp) {
          const timestampMillis = timestamp * 1000;
          // alert('timestampMillis: ' + timestampMillis);
          setTimeout(() => {
            // show waiting feedback at least 1 second
            this.forceTimeUpdate(new Date(timestampMillis + 1000));
          }, 1000);
        } else {
          setTimeout(() => {
            var newDate = parseDateTime(time);
            newDate.setTime(newDate.getTime() + 1000);
            this.forceTimeUpdate(newDate);
          }, 1000);
        }
        this.data.networkTimeInitialized = true;
        setTimeout(() => {
          // possibility for time inaccuracy. Hence recheck in 10 seconds.
          this.data.networkTimeInitialized = false;
        }, 10 * 1000);
        console.log('network data: ', response);
        this.setFetchingStatus('OK. Updated time from network', 'success', false, 1);
      },
      error: (err) => {
        console.log('err: ', err);
        // alert('err: ' + err);
        this.setFetchingStatus('FAILED to update time from network', 'error', false, 999);
      },
    });
  }

  tryConnectingToTimeServer(retryCount) {
    retryCount = retryCount || 0;
    if (!(this.data.timeOriginMode == 'network' && this.data.networkTimeApiUrl == this.timeServerApi)) {
      return;
    }
    if (!this.isDeviceReady || this.data.timeIsValid || typeof WifiWizard2 === 'undefined') {
      return;
    }
    if (!retryCount && this.data.network.connecting !== undefined) {
      return;
    }
    if (retryCount > 100) {
      this.data.network.connecting = false;
      return;
    }
    if (this.data.network.status == 'WiFi Connection (MDisplay TimeServer)') {
      this.data.network.connecting = false;
      return;
    }
    var bindAll = true;
    var isHiddenSSID = false;
    this.data.network.connecting = true;
    this.data.network.status = 'Connecting to MDisplay TimeServer...';
    WifiWizard2.connect('MDisplay TimeServer', bindAll, '1234567890', 'WPA', isHiddenSSID).then(
      (res) => {
        this.data.network.connecting = false;
        this.data.network.status = 'Connected to MDisplay TimeServer';
        this.checkNetworkStatus();
      },
      (err) => {
        this.data.network.status = 'ERR MDisplay TimeServer - ' + err;
        setTimeout(() => {
          this.tryConnectingToTimeServer(retryCount + 1);
        }, 1000);
      }
    );
  }

  deviceReady() {
    this.isDeviceReady = true;
    this.checkNetworkStatus();
  }
  init(initialTestTime, callback, analogClock) {
    this.initialTestTime = initialTestTime;
    this.analogClock = analogClock;
    this.initStorage(() => {
      this.nextTick();
      if (callback) {
        callback();
      }
      this.initShortcuts();
    });
  }
}

window.mdApp = new App();
