# AGENTS.md

## STRICT RULE: ES5-only JavaScript

All JavaScript in this project MUST be authored in ES5. This is non-negotiable.

The web app runs inside a Cordova shell on older-generation Android TV boxes that only support ES5. Any ES6+ syntax will break the target devices at runtime (no transpiler/build step exists to catch or fix this).

This applies to every `.js` file and all inline `<script>` blocks (e.g. `index.html`, `assets/js/app.js`, `assets/js/translations.js`, `assets/analog-clock/analog-clock.js`, `service-worker.js`, `_tools/`).

### Forbidden (ES6+)

- `let` / `const` — use `var`
- Arrow functions `() => {}` — use `function () {}`
- Template literals `` `${x}` `` — use string concatenation `'a' + x`
- Classes — use constructor functions + prototypes
- `Promise`, `async` / `await` — use callbacks (or the existing jQuery `$.ajax` patterns)
- Default/rest parameters, rest/spread `...`
- Destructuring, `for...of`, `Object.assign`, `Array.from`, `Array.prototype.includes`, `String.prototype.includes`, `startsWith`/`endsWith`, `Object.entries`/`values`
- Shorthand property/method syntax, computed property names (when avoidable)
- `Symbol`, `Map`/`Set`, `WeakMap`/`WeakSet`, generators
- `import` / `export` (except in `service-worker.js` where `importScripts` is already used by the toolchain)

### Required

- `var` declarations
- `function` expressions/declarations
- Callback-based async
- Keep existing ES5-compatible patterns already used in `assets/js/app.js` (e.g. `var self = this;`, `padZero`, prototype-style constructors)
- Comments in code should only be added when explicitly requested

If you are about to write JS in this repo, first verify it parses as ES5 before finishing.
