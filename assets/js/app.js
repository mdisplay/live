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
  constructor(message){
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
    this.lang = 'ta';
    this.prayerData = [];
    for (let month in window.PRAYER_DATA) {
      if (window.PRAYER_DATA.hasOwnProperty(month)) {
        this.prayerData.push(window.PRAYER_DATA[month]);
      }
    }
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
      toasts: [
      ],
      timeOriginMode: 'device', // or 'internet'
    };
    this.isInitial = true;
    this.beforeSeconds = 5 * 60;
    // this.beforeSeconds = 1*60;
    this.afterSeconds = 5 * 60;
    // this.afterSeconds = 1;
    // this.afterSeconds = 1*60;
    this.afterSeconds = 2 * 60;
    this.data.bgVersion = '4';
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
      this.data.time = this.initialTime ? this.initialTime : new Date();
      this.data.time.setTime(this.data.time.getTime() - 1000);
    }
    this.data.time = this.initialTime ? new Date(this.data.time.getTime() + 1000) : new Date();
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
  getTime(monthParam, dayParam, time) {
    let timeParts = time.split(':');
    let hoursAdd = 0;
    if (timeParts[1].indexOf('p') != -1) {
      hoursAdd = 12;
    }
    const hours = hoursAdd + parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1].replace('a', '').replace('p', ''));
    return moment(monthParam + 1 + ' ' + dayParam + ' ' + time + 'm', 'M D hh:mma').toDate();
  }
  getTimes(monthParam, dayParam) {
    const times = [];
    for (let segment of this.prayerData[monthParam]) {
      if (segment.range[0] <= dayParam && segment.range[1] >= dayParam) {
        // this.currentSegment = segment;
        for (let time of segment.times) {
          times.push(this.getTime(monthParam, dayParam, time));
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
      const iqamahTime = this.data.iqamahTimes[name];
      if (iqamahTime.absolute) {
        iqamahTimes[name] = this.getTime(monthParam, dayParam, iqamahTime.toTime() + (name == 'Subah' ? 'a' : 'p'));
      } else {
        iqamahTimes[name] = new Date(prayerTimes[name].getTime() + parseInt(iqamahTime.minutes) * 60 * 1000);
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
    for (let i = 0; i < 1000; i++) {
      // try thousand times!;
      times = this.getTimes(dateParams[1], dateParams[2]);
      if (!times) {
        const d = new Date(this.data.time.getTime());
        d.setDate(d.getDate() + 1);
        dateParams = this.getDateParams(d);
      }
    }
    console.log('all the times', times);
    const iqamahTimes = this.getIqamahTimes(times, dateParams[1], dateParams[2]);
    this.todayPrayers = [
      new Prayer('Subah', times.Subah, iqamahTimes.Subah, this.lang),
      // new Prayer('Sunrise', times[1], 10, this.lang),
      new Prayer('Luhar', times.Luhar, iqamahTimes.Luhar, this.lang),
      new Prayer('Asr', times.Asr, iqamahTimes.Asr, this.lang),
      new Prayer('Magrib', times.Magrib, iqamahTimes.Magrib, this.lang),
      new Prayer('Isha', times.Isha, iqamahTimes.Isha, this.lang),
    ];
    this.data.prayers = this.todayPrayers;

    const tomorrowParams = this.getDateParams(new Date(this.data.time.getTime() + 24 * 60 * 60 * 1000));
    let tomorrowTimes = this.getTimes(tomorrowParams[1], tomorrowParams[2]);
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
    const d = moment(this.data.time);
    const day = translations[this.lang].days[parseInt(d.format('d'))];
    const month = translations[this.lang].months[this.data.time.getMonth()];
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

    this.data.prayerInfo = 'athan';
    this.updateBackground();
  }
  updateBackground() {
    this.data.backgroundImage = 'backgrounds/' + this.getRandomNumber(1, 11) + '.jpg?v=' + this.data.bgVersion;
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
    if (this.data.time.getMinutes() % 5 === 0 && this.data.time.getSeconds() === 0) {
      this.updateBackground();
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
    if (this.analogClock) {
      this.analogClock.nextTick();
    }
    this.commitCurrentPrayer();
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
  showToast(message, duration){
    duration = duration || 3000;
    var toast = new Toast(message);
    this.data.toasts.push(toast);
    setTimeout(() => {
      var i = this.data.toasts.indexOf(toast);
      if(i !== -1){
        this.data.toasts.splice(i, 1);
      }
    }, duration);
  }
  mounted() {
    this.showToast('Application loaded.', 3000);
    // this.simulateTime = 50;
    this.updateTime();
    if (this.analogClock) {
      this.analogClock.init(document.getElementById('analog-clock-container'), this.initialTime);
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
      this.data.timeOriginMode = settings.timeOriginMode;
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
  updateInternetTime() {
    if (this.data.timeOriginMode != 'internet') {
      // console.log('Internet time mode disabled');
      return;
    }
    if (this.internetTimeUpdated) {
      // console.log('Internet time mode already active');
      return;
    }
    // console.log('Internet time mode fetching...');
    const url =
      'https://api.openweathermap.org/data/2.5/onecall?lat=8.030097&lon=79.829091&exclude=hourly,daily,minutely&appid=434d671bede048ae31c56fce770b3149';
    ajax.get(url).then(
      (response) => {
        if (response && response.data && response.data.current && response.data.current.dt) {
          const timestamp = response.data.current.dt * 1000;
          this.data.time = new Date(timestamp);
          this.internetTimeUpdated = true;
        }
        console.log('internet data: ', response.data);
      },
      (err) => {
        console.log('err: ', err);
      }
    );
  }
  init(initialTime, callback) {
    this.initialTime = initialTime;
    this.initStorage(() => {
      this.nextTick();
      if (callback) {
        callback();
      }
      this.initShortcuts();
    });
  }
}

window.app = new App();
