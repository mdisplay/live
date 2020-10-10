var padZero = (number) => {
  number = parseInt(number);
  if (number < 10) {
    return '0' + number;
  }
  return '' + number;
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

IqamahTime.fromRaw = function(raw) {
  return new IqamahTime(raw.minutes, raw.hours, raw.absolute);
}

class App {
  constructor() {
    this.lang = 'ta';
    this.prayerData = [];
    for(let month in window.PRAYER_DATA) {
      if(window.PRAYER_DATA.hasOwnProperty(month)){
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
    };
    this.isInitial = true;
    this.beforeSeconds = 5*60;
    // this.beforeSeconds = 1*60;
    this.afterSeconds = 5*60;
    // this.afterSeconds = 1;
    // this.afterSeconds = 1*60;
    this.afterSeconds = 2*60;
    this.data.bgVersion = '3';
  }
  getRandomNumber(min, max) {
    return Math.floor(min + (Math.random() * (max - min + 1)));
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
  }
  getDateParams(date) {
    return [date.getFullYear(), date.getMonth(), date.getDate()];
  }
  getTime(monthParam, dayParam, time) {
    let timeParts = time.split(':');
    let hoursAdd = 0;
    if(timeParts[1].indexOf('p') != -1) {
      hoursAdd = 12;
    }
    const hours = hoursAdd + parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1].replace('a', '').replace('p', ''));
    return moment((monthParam + 1) + ' ' + dayParam + ' ' + time + 'm', 'M D hh:mma').toDate();

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
    for(const name in this.data.iqamahTimes) {
      const iqamahTime = this.data.iqamahTimes[name];
      if(iqamahTime.absolute) {
        iqamahTimes[name] = this.getTime(monthParam, dayParam, iqamahTime.toTime() + (name == 'Subah' ? 'a' : 'p'));
      } else {
        iqamahTimes[name] = new Date(prayerTimes[name].getTime() + (parseInt(iqamahTime.minutes) * 60 * 1000));
      }
    }
    return iqamahTimes;
  }
  showNextDayPrayers() {
    this.data.prayers = this.nextDayPrayers;
  }
  onDayUpdate() {
    const dateParams = this.getDateParams(this.data.time);
    this.currentDateParams = dateParams;
    // console.log();
    const times = this.getTimes(this.currentDateParams[1], this.currentDateParams[2]);
    console.log('all the times', times);
    const iqamahTimes = this.getIqamahTimes(times, this.currentDateParams[1], this.currentDateParams[2]);
    this.todayPrayers = [
      new Prayer('Subah', times.Subah, iqamahTimes.Subah, this.lang),
      // new Prayer('Sunrise', times[1], 10, this.lang),
      new Prayer('Luhar', times.Luhar, iqamahTimes.Luhar, this.lang),
      new Prayer('Asr', times.Asr, iqamahTimes.Asr, this.lang),
      new Prayer('Magrib', times.Magrib, iqamahTimes.Magrib, this.lang),
      new Prayer('Isha', times.Isha, iqamahTimes.Isha, this.lang),
    ];
    this.data.prayers = this.todayPrayers;

    const tomorrowParams = this.getDateParams(new Date(this.data.time.getTime() + (24*60*60*1000)));
    const tomorrowTimes = this.getTimes(tomorrowParams[1], tomorrowParams[2]);
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
    this.data.dateDisplay = //day + ', ' + 
    padZero(this.data.time.getDate()) + ' ' + month + ' ' + this.data.time.getFullYear();
    const hijriMonth = parseInt(d.format('iM'));
    // this.data.hijriDateDisplay = d.format('iDD, ___ (iMM) iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // const hijriDate = new HijriDate(this.data.time.getTime());
    const hijriDate = HijriJS.gregorianToHijri(this.data.time.getFullYear(), this.data.time.getMonth()+1, this.data.time.getDate());
    // this.data.hijriDateDisplay = d.format('iDD ___ iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // this.data.hijriDateDisplay = padZero(hijriDate.getDate()) + ' ' + translations.ta.months[hijriDate.getMonth()] + ' ' + hijriDate.getFullYear();
    this.data.hijriDateDisplay = padZero(hijriDate.day) + ' ' + translations[this.lang].hijriMonths[hijriDate.month - 1] + ' ' + hijriDate.year;
    // this.data.hijriDateDisplay = hijriDate.toFormat('dd mm YYYY');

    this.data.prayerInfo = 'athan';
    this.updateBackground();
  }
  updateBackground() {
    this.data.backgroundImage = 'backgrounds/' + this.getRandomNumber(1, 11) + '.jpg?v=' + this.data.bgVersion;
  }
  commitCurrentPrayer() {
    if(!this.data.currentPrayer) {
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
    if(nowTime >= iqamahTime) {
      if(nowTime - iqamahTime < this.afterSeconds * 1000) {
        this.data.currentPrayer = currentPrayer;
        this.data.currentPrayerBefore = false;
        // this.data.currentPrayerAfter = true;
        const duration = moment.duration(nowTime - iqamahTime, 'milliseconds');
        // this.data.currentPrayerAfter = padZero(duration.minutes()) + ':' + padZero(duration.seconds());
        let pause = nowTime - iqamahTime < (15 * 1000);
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
      if (nowTime - currentPrayer.time.getTime() < (15 * 1000)) {
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
    if(!(this.currentDateParams &&
        dateParams[0] === this.currentDateParams[0] &&
        dateParams[1] === this.currentDateParams[1] &&
        dateParams[2] === this.currentDateParams[2])) {
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
    if(nowTime >= (nextTime + 1000)) {
      console.log('coming next');
      let nextPrayer;
      for(let prayer of this.todayPrayers) {
        if(nowTime < prayer.time.getTime()) {
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
    } else if(nextTime - nowTime < this.beforeSeconds * 1000) {
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
      if(this.data.currentPrayer) {
        this.checkCurrentPrayer(this.data.currentPrayer);
      } else {
        if(this.isInitial){
          console.log('is isInitial');
          // if (nowTime < ) {}
          let prevPrayer;
          if(this.data.nextPrayer === this.nextDayPrayers[0]){
            prevPrayer = this.todayPrayers[this.todayPrayers.length - 1];
          } else {
            const idx = this.todayPrayers.indexOf(this.data.nextPrayer);
            if (idx > 0) { // not subah
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
  }
  closeSettings() {
    this.data.settingsMode = false;
    if (this.shouldReload) {
      window.location.reload();
    }
  }
  mounted() {
    // this.simulateTime = 50;
    this.updateTime();
    if (this.analogClock) {
      this.analogClock.init(document.getElementById('analog-clock-container'), this.initialTime);
    }
    window._theInterval = window.setInterval(()=> {
      this.nextTick();
    }, this.simulateTime ? this.simulateTime : 1000);
    setTimeout(()=> {
      // this.data.showSplash = false;
      setTimeout(() => {
        window.location = '../app/www/index.html';
      }, 2500);
    }, 1000);
  }
  created() {
    if(window._theInterval){
      window.clearInterval(window._theInterval);
    }
  }
  initStorage(callback) {
    let iqamahTimes;
    try {
      iqamahTimes = JSON.parse(localStorage.getItem('mdisplay.iqamahTimes'));
    }
    catch(e) {}
    if(!iqamahTimes){
      return callback();
    }
    const iqamahTimesConfigured = localStorage.getItem('mdisplay.iqamahTimesConfigured');
    for(const name in iqamahTimes) {
      this.data.iqamahTimes[name] = IqamahTime.fromRaw(iqamahTimes[name]);
    }
    this.data.iqamahTimesConfigured = !!iqamahTimesConfigured;
    callback();
  }
  writeStorage(callback) {
    const iqamahTimes = {};
    for(const name in this.data.iqamahTimes) {
      iqamahTimes[name] = this.data.iqamahTimes[name].toRaw();
    }
    this.data.iqamahTimesConfigured = true;
    localStorage.setItem('mdisplay.iqamahTimes', JSON.stringify(iqamahTimes));
    localStorage.setItem('mdisplay.iqamahTimesConfigured', 1);
    if (callback) {
      callback();
    }
  }
  updateSettings() {
    this.writeStorage();
    this.shouldReload = true;
  }
  init(initialTime, callback){
    this.initialTime = initialTime;
    this.initStorage(() => {    
      this.nextTick();
      if(callback) {
        callback();
      }
    });
  }
}

window.app = new App();