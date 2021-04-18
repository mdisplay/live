function rotateHands() {
  let date = new Date();

  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();

  let hoursRotation = 30 * h + m / 2 + s / 120;
  let minutesRotation = 6 * m + s / 10;
  let secondsRotation = 6 * s;

  var hours = document.getElementById('analog-clock-hand-hours');
  var minutes = document.getElementById('analog-clock-hand-minutes');
  var seconds = document.getElementById('analog-clock-hand-seconds');

  hours.style.transform = `rotate(${hoursRotation}deg)`;
  minutes.style.transform = `rotate(${minutesRotation}deg)`;
  seconds.style.transform = `rotate(${secondsRotation}deg)`;
}

// rotateHands();
// setInterval(rotateHands, 1000); // Call rotateHands() after every second.

class AnalogClock {
  constructor() {
    this.isInitalized = false;
  }

  nextTick() {
    if (!this.isInitalized) {
      return;
    }
    rotateHands();
  }

  init(el, time) {
    this.isInitalized = true;
  }
}

window.analogClock = new AnalogClock();
