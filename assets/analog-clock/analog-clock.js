function AnalogClock() {
  var self = this;
  self.isInitalized = false;
  self.container = null;
  self.canvas = null;
  self.ctx = null;
  self.themeName = 'default';
  self.lastDrawnSecond = -1;
  self.size = 0;
  self.dpr = 1;

  self.THEMES = {
    default: {
      face: ['#20242c', '#14171d', '#0a0c10'],
      bezel: [
        { r: 0.985, w: 0.014, c: '#c8ccd4' },
        { r: 0.94, w: 0.004, c: '#6a7078' }
      ],
      dots: null,
      ticks: {
        minor: { from: 0.9, to: 0.94, w: 0.004, c: '#9aa0a8' },
        major: { from: 0.84, to: 0.94, w: 0.012, c: '#e8eaee' }
      },
      hands: {
        hour: { len: 0.44, tail: 0.1, base: 0.05, tip: 0.02, c: '#e8eaee', edge: '#5a6068' },
        minute: { len: 0.66, tail: 0.12, base: 0.04, tip: 0.014, c: '#e8eaee', edge: '#5a6068' },
        second: { len: 0.78, tail: 0.2, base: 0.012, tip: 0.006, c: '#d84a4a', edge: '#7a2020' }
      },
      cap: { r: 0.045, c: '#e8eaee', dot: 0.018, dotC: '#20242c' }
    },
    emerald: {
      face: ['#0f5240', '#073026', '#031712'],
      bezel: [
        { r: 0.988, w: 0.016, c: '#d9b45c' },
        { r: 0.958, w: 0.004, c: '#8a6a2a' },
        { r: 0.9, w: 0.022, c: '#caa14f' },
        { r: 0.872, w: 0.004, c: '#8a6a2a' }
      ],
      dots: { r: 0.825, n: 72, dot: 0.006, c: '#d9b45c' },
      ticks: {
        minor: { from: 0.74, to: 0.78, w: 0.004, c: '#caa14f' },
        major: { from: 0.66, to: 0.78, w: 0.014, c: '#f0d48a' }
      },
      hands: {
        hour: { len: 0.4, tail: 0.1, base: 0.052, tip: 0.02, c: '#e8c877', edge: '#7a5c22' },
        minute: { len: 0.6, tail: 0.12, base: 0.04, tip: 0.014, c: '#e8c877', edge: '#7a5c22' },
        second: { len: 0.72, tail: 0.2, base: 0.011, tip: 0.005, c: '#f0d48a', edge: '#7a5c22' }
      },
      cap: { r: 0.045, c: '#e8c877', dot: 0.018, dotC: '#0a2e22' }
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
    var name = 'default';
    try {
      if (window.mdApp && window.mdApp.data && window.mdApp.data.analogClockTheme) {
        name = window.mdApp.data.analogClockTheme;
      }
    } catch (e) {}
    if (!self.THEMES[name]) {
      name = 'default';
    }
    self.themeName = name;
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
  };

  self.init = function (el, time) {
    self.container = self.resolveContainer(el);
    if (!self.container) {
      return;
    }
    var canvas = document.createElement('canvas');
    canvas.className = 'analog-clock-canvas';
    self.container.appendChild(canvas);
    self.canvas = canvas;
    self.ctx = canvas.getContext('2d');
    self.applyTheme();
    self.resize();
    self.isInitalized = true;
    if (window.addEventListener) {
      window.addEventListener('resize', function () {
        if (!self.isInitalized) {
          return;
        }
        self.resize();
        self.lastDrawnSecond = -1;
        self.nextTick();
      });
    }
    self.nextTick(time);
  };

  self.nextTick = function (time) {
    if (!self.isInitalized || !self.ctx) {
      return;
    }
    var date = time || new Date();
    var s = date.getSeconds();
    if (s === self.lastDrawnSecond && self.size > 0) {
      return;
    }
    self.lastDrawnSecond = s;
    self.draw(date);
  };

  self.circle = function (cx, cy, r) {
    self.ctx.beginPath();
    self.ctx.arc(cx, cy, Math.max(r, 0.1), 0, Math.PI * 2);
  };

  self.drawHand = function (angleDeg, spec, cx, cy, r) {
    var ctx = self.ctx;
    var rad = (angleDeg - 90) * Math.PI / 180;
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

  self.draw = function (date) {
    var cfg = self.THEMES[self.themeName] || self.THEMES.default;
    var ctx = self.ctx;
    var s = self.size;
    var cx = s / 2;
    var cy = s / 2;
    var r = s / 2;
    var i;
    var a;
    ctx.setTransform(self.dpr, 0, 0, self.dpr, 0, 0);
    ctx.clearRect(0, 0, s, s);
    var g = ctx.createRadialGradient(cx, cy - r * 0.15, r * 0.1, cx, cy, r);
    g.addColorStop(0, cfg.face[0]);
    g.addColorStop(0.55, cfg.face[1]);
    g.addColorStop(1, cfg.face[2]);
    ctx.fillStyle = g;
    self.circle(cx, cy, r * 0.995);
    ctx.fill();
    for (i = 0; i < cfg.bezel.length; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, cfg.bezel[i].r * r, 0, Math.PI * 2);
      ctx.strokeStyle = cfg.bezel[i].c;
      ctx.lineWidth = Math.max(1, cfg.bezel[i].w * r);
      ctx.stroke();
    }
    if (cfg.dots) {
      ctx.fillStyle = cfg.dots.c;
      for (i = 0; i < cfg.dots.n; i++) {
        a = (i / cfg.dots.n) * Math.PI * 2;
        self.circle(cx + Math.cos(a) * cfg.dots.r * r, cy + Math.sin(a) * cfg.dots.r * r, cfg.dots.dot * r);
        ctx.fill();
      }
    }
    for (i = 0; i < 60; i++) {
      a = (i / 60) * Math.PI * 2;
      var t = (i % 5 === 0) ? cfg.ticks.major : cfg.ticks.minor;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * t.from * r, cy + Math.sin(a) * t.from * r);
      ctx.lineTo(cx + Math.cos(a) * t.to * r, cy + Math.sin(a) * t.to * r);
      ctx.strokeStyle = t.c;
      ctx.lineWidth = Math.max(1, t.w * r);
      ctx.stroke();
    }
    var h = date.getHours() % 12;
    var m = date.getMinutes();
    var sec = date.getSeconds();
    self.drawHand(h * 30 + m * 0.5 + sec * (0.5 / 60), cfg.hands.hour, cx, cy, r);
    self.drawHand(m * 6 + sec * 0.1, cfg.hands.minute, cx, cy, r);
    self.drawHand(sec * 6, cfg.hands.second, cx, cy, r);
    ctx.fillStyle = cfg.cap.c;
    self.circle(cx, cy, cfg.cap.r * r);
    ctx.fill();
    ctx.fillStyle = cfg.cap.dotC;
    self.circle(cx, cy, cfg.cap.dot * r);
    ctx.fill();
  };
}

window.analogClock = new AnalogClock();
