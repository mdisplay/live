function rotateHands(time) {
  var date = time || new Date();

  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();

  var hoursRotation = 30 * h + m / 2 + s / 120;
  var minutesRotation = 6 * m + s / 10;
  var secondsRotation = 6 * s;

  var hours = document.getElementById('analog-clock-hand-hours');
  var minutes = document.getElementById('analog-clock-hand-minutes');
  var seconds = document.getElementById('analog-clock-hand-seconds');

  hours.style.transform = 'rotate(' + hoursRotation + 'deg)';
  minutes.style.transform = 'rotate(' + minutesRotation + 'deg)';
  seconds.style.transform = 'rotate(' + secondsRotation + 'deg)';
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
