class AnalogClock {

  constructor() {
    this.isInitalized = false;
  }

  createSecondLines(){
    var clock = document.querySelector('.clock');
    var rotate = 0;
    
    var byFive = function(n) {
      return (n / 5 === parseInt(n / 5, 10)) ? true : false;
    };
    
    for (let i=0; i < 30; i++) {
      var span = document.createElement('span');
     
      if (byFive(i)) {
        span.className = 'fives';
      }
      
      span.style.transform = 'translate(-50%,-50%) rotate('+ rotate + 'deg)';
      clock.appendChild(span);
      rotate += 6;
    }
  }

  nextTick() {
    if (!this.isInitalized) {
      return;
    }
    if (this.deg.seconds == 360) {
      this.deg.seconds = 0;
    }
    if (Math.round(this.deg.minutes) == 360) { // 60
      this.deg.minutes = 0;
    }
    if (Math.round(this.deg.hours) == 360) { // 12
      this.deg.hours = 0;
    }
    if (Math.round(this.deg.hours) == 720) { // 24
      this.deg.hours = 0;
    }
    const prevDeg = {
      hours: this.deg.hours,
      minutes: this.deg.minutes,
      seconds: this.deg.seconds,
    };
    this.deg.hours += 360/43200;
    this.deg.minutes += 360/3600;
    this.deg.seconds += 360/60;
    // console.log('analogClock nextTick',/* this.deg.seconds, (this.deg.minutes), */(this.deg.hours));
    // if(Math.round(prevDeg.hours) != Math.round(this.deg.hours)) {
    // }
    if(Math.round(prevDeg.minutes) != Math.round(this.deg.minutes)) {
      this.clock.hours.style.transform = 'rotate(' + this.deg.hours + 'deg)';
      this.clock.minutes.style.transform = 'rotate(' + this.deg.minutes + 'deg)';
    }
    this.clock.seconds.style.transform = 'rotate(' + this.deg.seconds + 'deg)';
  }

  init(el, time) {
    time = time || new Date();
    this.time = time;
    this.createSecondLines();
// (function )();
    this.clock = {
      hours: el.querySelector('.hours'),
      minutes: el.querySelector('.minutes'),
      seconds: el.querySelector('.seconds')
    };

    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    this.deg = {
      hours: 30 * hours + .5 * minutes,
      minutes: 6 * minutes + .1 * seconds,
      seconds: 6 * seconds
    }
    
    this.clock.hours.style.transform = 'rotate(' + this.deg.hours + 'deg)';
    this.clock.minutes.style.transform = 'rotate(' + this.deg.minutes + 'deg)';
    this.clock.seconds.style.transform = 'rotate(' + this.deg.seconds + 'deg)';

    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var print = time.getDate() + ' / ' + months[time.getMonth()];
    var output = el.querySelectorAll('output');
    
    [].forEach.call(output, function(node){
      node.innerHTML = print;
    });

    this.isInitalized = true;

(function setClock() {
  return;
  
  var runClock = function(){
  };
  
  // setInterval(runClock,1000);
  
  // (function printDate(){

  // })();
  
})();
  }
}

window.analogClock = new AnalogClock();