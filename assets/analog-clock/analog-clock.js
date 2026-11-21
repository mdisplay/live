function AnalogClock() {
  var self = this;
  self.isInitalized = false;
  self.container = null;
  self.canvas = null;
  self.ctx = null;
  self.faceEl = null;
  self.themeName = 'galaxy';
  self.lastDate = null;
  self.lastDrawnTime = null;
  self.size = 0;
  self.dpr = 1;
  self.basePath = 'assets/analog-clock/themes/';

  self.THEMES = {
    sunrise: {
      face: 'sunrise',
      hands: {
        hour: { len: 0.42, tail: 0.1, base: 0.052, tip: 0.02, c: '#f7f4ea', edge: '#3a352a' },
        minute: { len: 0.62, tail: 0.12, base: 0.04, tip: 0.014, c: '#f7f4ea', edge: '#3a352a' },
        second: { len: 0.74, tail: 0.2, base: 0.011, tip: 0.005, c: '#f0c14b', edge: '#7a5c22' }
      },
      cap: { r: 0.045, c: '#f0c14b', dot: 0.018, dotC: '#141413' }
    },
      galaxy: {
        face: 'galaxy',
        hands: {
          hour: { len: 0.42, tail: 0.1, base: 0.05, tip: 0.02, c: '#f7fbff', edge: '#2a3b52' },
          minute: { len: 0.62, tail: 0.12, base: 0.038, tip: 0.014, c: '#f7fbff', edge: '#2a3b52' },
          second: { len: 0.72, tail: 0.2, base: 0.011, tip: 0.005, c: '#fc7878', edge: '#7a2020' }
        },
        cap: { r: 0.048, c: '#fc7878', dot: 0.02, dotC: '#0a1524' }
      },
      cosmic: {
        face: 'cosmic',
        hands: {
          hour: { len: 0.42, tail: 0.1, base: 0.05, tip: 0.02, c: '#f4fbfa', edge: '#1d3a38' },
          minute: { len: 0.62, tail: 0.12, base: 0.038, tip: 0.014, c: '#f4fbfa', edge: '#1d3a38' },
          second: { len: 0.72, tail: 0.2, base: 0.011, tip: 0.005, c: '#e8c15a', edge: '#7a5c22' }
        },
        cap: { r: 0.048, c: '#e8c15a', dot: 0.02, dotC: '#062a28' }
      }
    };

  self.resolveContainer = function (el) {
    if (el && el.appendChild) {
      return el;
    }
    if (document.querySelector) {
      return document.querySelector('.analog-clock-container');
    }
    return null;
  };

  self.applyTheme = function () {
    var name = 'galaxy';
    try {
      if (window.mdApp && window.mdApp.data && window.mdApp.data.analogClockTheme) {
        name = window.mdApp.data.analogClockTheme;
      }
    } catch (e) {}
    if (!self.THEMES[name]) {
      name = 'galaxy';
    }
    self.themeName = name;
  };

  self.getConfig = function () {
    return self.THEMES[self.themeName] || self.THEMES.galaxy;
  };

  self.faceSrc = function () {
    return self.basePath + self.getConfig().face + '/face.svg';
  };

  self.resize = function () {
    if (!self.canvas || !self.container) {
      return;
    }
    var rect = self.container.getBoundingClientRect();
    var size = Math.floor(Math.min(rect.width, rect.height));
    if (!(size > 0)) {
      size = 300;
    }
    var dpr = 1;
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
      dpr = Math.min(window.devicePixelRatio, 2);
    }
    self.size = size;
    self.dpr = dpr;
    self.canvas.width = Math.floor(size * dpr);
    self.canvas.height = Math.floor(size * dpr);
    self.redraw();
  };

  self.init = function (el, time) {
    self.container = self.resolveContainer(el);
    if (!self.container) {
      return;
    }
    self.applyTheme();
    var lookup = self.container.querySelector;
    self.faceEl = lookup ? self.container.querySelector('.analog-clock-face') : null;
    if (!self.faceEl) {
      self.faceEl = document.createElement('img');
      self.faceEl.className = 'analog-clock-face';
      self.faceEl.alt = '';
      self.container.appendChild(self.faceEl);
    }
    self.faceEl.src = self.faceSrc();
    var canvas = lookup ? self.container.querySelector('.analog-clock-canvas') : null;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'analog-clock-canvas';
      self.container.appendChild(canvas);
    }
    self.canvas = canvas;
    self.ctx = canvas.getContext('2d');
    if (!self.ctx) {
      return;
    }
    self.isInitalized = true;
    self.resize();
    self.nextTick(time);
  };

  self.nextTick = function (time) {
    if (!self.isInitalized || !self.ctx) {
      return;
    }
    if (!time) {
      time = self.lastDate;
    }
    if (!time) {
      return;
    }
    self.lastDate = time;
    var stamp = time.getTime ? time.getTime() : null;
    if (stamp !== null && stamp === self.lastDrawnTime) {
      return;
    }
    self.drawHands(time);
  };

  self.redraw = function () {
    if (!self.isInitalized || !self.ctx) {
      return;
    }
    if (!self.lastDate) {
      return;
    }
    self.lastDrawnTime = null;
    self.drawHands(self.lastDate);
  };

  self.circle = function (cx, cy, r) {
    self.ctx.beginPath();
    self.ctx.arc(cx, cy, Math.max(r, 0.1), 0, Math.PI * 2);
  };

  self.drawHand = function (angleDeg, spec, cx, cy, r) {
    var ctx = self.ctx;
    var rad = (angleDeg + 90) * Math.PI / 180;
    var hw = spec.base * r / 2;
    var tw = spec.tip * r / 2;
    var len = spec.len * r;
    var tail = (spec.tail || 0) * r;
    var dx = Math.cos(rad);
    var dy = Math.sin(rad);
    var px = -dy;
    var py = dx;
    ctx.beginPath();
    ctx.moveTo(cx + px * hw + dx * tail, cy + py * hw + dy * tail);
    ctx.lineTo(cx - px * hw + dx * tail, cy - py * hw + dy * tail);
    ctx.lineTo(cx - px * tw - dx * len, cy - py * tw - dy * len);
    ctx.lineTo(cx + px * tw - dx * len, cy + py * tw - dy * len);
    ctx.closePath();
    ctx.fillStyle = spec.c;
    ctx.fill();
    if (spec.edge) {
      ctx.strokeStyle = spec.edge;
      ctx.lineWidth = Math.max(1, r * 0.004);
      ctx.stroke();
    }
  };

  self.drawHands = function (date) {
    var cfg = self.getConfig();
    var ctx = self.ctx;
    var s = self.size;
    var cx = s / 2;
    var cy = s / 2;
    var r = s / 2;
    var totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    if (date.getMilliseconds) {
      totalSeconds += date.getMilliseconds() / 1000;
    }
    var sec = totalSeconds % 60;
    var min = Math.floor(totalSeconds / 60) % 60;
    var hour = Math.floor(totalSeconds / 3600) % 12;
    ctx.setTransform(self.dpr, 0, 0, self.dpr, 0, 0);
    ctx.clearRect(0, 0, s, s);
    self.drawHand(hour * 30 + min * 0.5 + sec * (0.5 / 60), cfg.hands.hour, cx, cy, r);
    self.drawHand(min * 6 + sec * 0.1, cfg.hands.minute, cx, cy, r);
    self.drawHand(sec * 6, cfg.hands.second, cx, cy, r);
    ctx.fillStyle = cfg.cap.c;
    self.circle(cx, cy, cfg.cap.r * r);
    ctx.fill();
    ctx.fillStyle = cfg.cap.dotC;
    self.circle(cx, cy, cfg.cap.dot * r);
    ctx.fill();
    self.lastDrawnTime = date.getTime ? date.getTime() : null;
  };
}

window.analogClock = new AnalogClock();
