function rotateHands(time) {
  let date = time || new Date();

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
  if(secondsRotation === 0) {
    // prevent inverse roatation on 12'o clock position
    // when continuous transition is enabled
    secondsRotation = 360;
    let oldTransition = seconds.style.transition;
    setTimeout(function() {
      seconds.style.transition = 'none';
      seconds.style.transform = `rotate(${0}deg)`;
      setTimeout(function() {
        seconds.style.transition = oldTransition;
      }, 50);
    }, 900);
  }
  seconds.style.transform = `rotate(${secondsRotation}deg)`;
}

// rotateHands();
// setInterval(rotateHands, 1000); // Call rotateHands() after every second.

var AnalogClock = function() {
  var self = this;
  self.isInitalized = false;

  self.nextTick = function(time) {
    if (!self.isInitalized) {
      return;
    }
    rotateHands(time);
  }

  self.init = function(el, time) {
    self.isInitalized = true;
  }
}

window.analogClock = new AnalogClock();
