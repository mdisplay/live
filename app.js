const translations = {
  ta: {
    Subah: 'சுபஹ்',
    Sunrise: 'சூரியோதயம்',
    Luhar: 'ளுஹர்',
    Asr: 'அஸர்',
    Magrib: 'மஃரிப்',
    Isha: 'இஷா',
    days: [
      'ஞாயிறு',
      'திங்கள்',
      'செவ்வாய்',
      'புதன்',
      'வியாழன்',
      'வெள்ளி',
      'சனி',
    ],
    months: [
      'ஜனவரி',
      'பிப்ரவரி',
      'மார்ச்',
      'ஏப்ரல்',
      'மே',
      'ஜூன்',
      'ஜூலை',
      'ஆகஸ்டு',
      'செப்டம்பர்',
      'அக்டோபர்',
      'நவம்பர்',
      'டிசம்பர்',
    ],
    hijriMonths: [
      'முஹர்ரம்',
      'சஃபர்',
      'ரபி உல் அவ்வல்',
      'ரபி உல் ஆகிர்',
      'ஜமா அத்துல் அவ்வல்',
      'ஜமா அத்துல் ஆகிர்',
      'ரஜப்',
      'ஷஃபான்',
      'ரமலான்',
      'ஷவ்வால்',
      'துல் கஃதா',
      'துல் ஹிஜ்ஜா'
    ],
     // currentPrayerBefore: 'அதானுக்கு',
     // currentPrayerBefore: 'அதான் ஆரம்பம்',
     currentPrayerBefore: 'அதான் ஆரம்பத்திற்கு',
     // currentPrayerWaiting: 'இகாமத்துக்கு',
     // currentPrayerWaiting: 'இகாமத் ஆரம்பம்',
     currentPrayerWaiting: 'இகாமத் ஆரம்பத்திற்கு',
     // currentPrayerAfter: 'இகாமத்துக்குப் பின்',
     // currentPrayerAfter: 'இகாமத் முடிவு',
     // currentPrayerAfter: 'இகாமத் முடிந்தது',
     currentPrayerAfter: 'இகாமத் முடிந்து',
  },
  en: {
    Subah: 'Subah',
    Sunrise: 'Sunrise',
    Luhar: 'Luhar',
    Asr: 'Asr',
    Magrib: 'Magrib',
    Isha: 'Isha',
    days: [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    hijriMonths: [
      'Muḥarram',
      'Ṣafar',
      'Rabīʿ al-Awwal',
      'Rabī’ al-Ākhir',
      'Jumādá al-Ūlá',
      'Jumādá al-Ākhirah',
      'Rajab',
      'Sha‘bān',
      'Ramaḍān',
      'Shawwāl',
      'Dhū al-Qa‘dah',
      'Dhū al-Ḥijjah'
     ],
     currentPrayerBefore: 'for Adhan',
     currentPrayerWaiting: 'for Iqamath',
     currentPrayerAfter: 'passed Iqamath',
  }
};

class Prayer {
  constructor(name, time, iqamah, lang) {
    this.name = name;
    this.nameDisplay = translations[lang][this.name];
    this.time = time;
    this.iqamah = iqamah;
    // this.iqamah = 100;
    this.iqamahTime = new Date(this.time.getTime() + this.iqamah * 60 * 1000);
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
    };
    this.isInitial = true;
    this.beforeSeconds = 5*60;
    // this.beforeSeconds = 1*60;
    this.afterSeconds = 5*60;
    // this.afterSeconds = 1*60;
  }
  padZero(number) {
    if (number < 10) {
      return '0' + number;
    }
    return '' + number;
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
  getTimes(monthParam, dayParam) {
    const times = [];
    for(let segment of this.prayerData[monthParam]){
      if(segment.range[0] <= dayParam && segment.range[1] >= dayParam) {
        // this.currentSegment = segment;
        for(let time of segment.times) {
          let timeParts = time.split(':');
          let hoursAdd = 0;
          if(timeParts[1].indexOf('p') != -1) {
            hoursAdd = 12;
          }
          const hours = hoursAdd + parseInt(timeParts[0]);
          const minutes = parseInt(timeParts[1].replace('a', '').replace('p', ''));
          // times.push(new Date(this.data.time.getFullYear(), monthParam, dayParam, hours, minutes));
          times.push(moment((monthParam + 1) + ' ' + dayParam + ' ' + time + 'm', 'M D hh:mma').toDate())
        }
        break;
      }
    }
    return times;
  }
  onDayUpdate() {
    const dateParams = this.getDateParams(this.data.time);
    this.currentDateParams = dateParams;
    // console.log();
    const times = this.getTimes(this.currentDateParams[1], this.currentDateParams[2]);
    console.log(times);
    this.data.prayers = [
      new Prayer('Subah', times[0], 20, this.lang),
      // new Prayer('Sunrise', times[1], 10, this.lang),
      new Prayer('Luhar', times[2], 15, this.lang),
      new Prayer('Asr', times[3], 15, this.lang),
      new Prayer('Magrib', times[4], 10, this.lang),
      new Prayer('Isha', times[5], 15, this.lang),
    ];

    const tomorrowParams = this.getDateParams(new Date(this.data.time.getTime() + (24*60*60*1000)));
    const tomorrowTimes = this.getTimes(tomorrowParams[1], tomorrowParams[2]);
    this.nextDayPrayers = [
      new Prayer('Subah', tomorrowTimes[0], 30, this.lang),
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
    this.data.dateDisplay = day + ', ' + this.padZero(this.data.time.getDate()) + ' ' + month + ' ' + this.data.time.getFullYear();
    const hijriMonth = parseInt(d.format('iM'));
    // this.data.hijriDateDisplay = d.format('iDD, ___ (iMM) iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // const hijriDate = new HijriDate(this.data.time.getTime());
    const hijriDate = HijriJS.gregorianToHijri(this.data.time.getFullYear(), this.data.time.getMonth()+1, this.data.time.getDate());
    // this.data.hijriDateDisplay = d.format('iDD ___ iYYYY').replace('___', translations.ta.months[hijriMonth - 1]);
    // this.data.hijriDateDisplay = this.padZero(hijriDate.getDate()) + ' ' + translations.ta.months[hijriDate.getMonth()] + ' ' + hijriDate.getFullYear();
    this.data.hijriDateDisplay = this.padZero(hijriDate.day) + ' ' + translations[this.lang].hijriMonths[hijriDate.month - 1] + ' ' + hijriDate.year;
    // this.data.hijriDateDisplay = hijriDate.toFormat('dd mm YYYY');
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
        // this.data.currentPrayerAfter = this.padZero(duration.minutes()) + ':' + this.padZero(duration.seconds());
        this.data.currentPrayerAfter = {
          minutes: this.padZero(duration.minutes()),
          colon: this.data.currentPrayerAfter && this.data.currentPrayerAfter.colon == ':' ? ':' : ':',
          seconds: this.padZero(duration.seconds()),
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
      const duration = moment.duration(iqamahTime - nowTime, 'milliseconds');
      this.data.currentPrayerWaiting = {
          minutes: this.padZero(duration.minutes()),
          colon: this.data.currentPrayerWaiting && this.data.currentPrayerWaiting.colon == ':' ? ':' : ':',
          seconds: this.padZero(duration.seconds()),
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
    const nowTime = this.data.time.getTime();
    let nextTime = this.data.nextPrayer ? this.data.nextPrayer.time.getTime() : 0;
    // console.log('nextTick');
    if(nowTime >= nextTime) {
      console.log('coming next');
      let nextPrayer;
      for(let prayer of this.data.prayers) {
        if(nowTime < prayer.time.getTime()) {
          nextPrayer = prayer;
          break;
        }
      }
      if (!nextPrayer) {
        nextPrayer = this.nextDayPrayers[0];
      }
      console.log('recalculate next prayer!', nextPrayer);
      this.data.nextPrayer = nextPrayer;
      nextTime = this.data.nextPrayer.time.getTime();

      // this.data.currentPrayer = this.data.nextPrayer;
      this.data.currentPrayerBefore = false;
      this.data.currentPrayerAfter = false;
      this.data.currentPrayerWaiting = false;
    } else if(nextTime - nowTime < this.beforeSeconds * 1000) {
      this.data.currentPrayer = this.data.nextPrayer;
      const duration = moment.duration(nextTime - nowTime, 'milliseconds');
      this.data.currentPrayerBefore = {
        minutes: this.padZero(duration.minutes()),
        colon: this.data.currentPrayerBefore && this.data.currentPrayerBefore.colon == ':' ? ':' : ':',
        seconds: this.padZero(duration.seconds()),
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
            prevPrayer = this.data.prayers[this.data.prayers.length - 1];
          } else {
            const idx = this.data.prayers.indexOf(this.data.nextPrayer);
            prevPrayer = this.data.prayers[idx == 0 ? this.data.prayers.length - 1 : idx - 1];
          }
          this.checkCurrentPrayer(prevPrayer);
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
  mounted() {
    // this.simulateTime = 50;
    this.updateTime();
    if (this.analogClock) {
      this.analogClock.init(document.getElementById('analog-clock-container'), this.initialTime);
    }
    window._theInterval = window.setInterval(()=> {
      this.nextTick();
    }, this.simulateTime ? this.simulateTime : 1000);
    this.data.showSplash = false;
  }
  created() {
    if(window._theInterval){
      window.clearInterval(window._theInterval);
    }
  }
  init(initialTime, analogClock){
    this.initialTime = initialTime;
    this.analogClock = analogClock;
    this.nextTick();
  }
}

window.app = new App();