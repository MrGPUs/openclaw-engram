// openclaw-engram: Local-first memory plugin

// src/logger.ts
var NOOP_LOGGER = {
  info() {
  },
  warn() {
  },
  error() {
  },
  debug() {
  }
};
var _backend = NOOP_LOGGER;
var _debug = false;
function initLogger(backend, debug) {
  _backend = backend;
  _debug = debug;
}
var log = {
  info(msg, ...args) {
    _backend.info(`openclaw-engram: ${msg}`, ...args);
  },
  warn(msg, ...args) {
    _backend.warn(`openclaw-engram: ${msg}`, ...args);
  },
  error(msg, err) {
    const detail = err instanceof Error ? err.message : err ? String(err) : "";
    _backend.error(
      `openclaw-engram: ${msg}${detail ? ` \u2014 ${detail}` : ""}`
    );
  },
  debug(msg, ...args) {
    if (!_debug) return;
    const fn = _backend.debug ?? _backend.info;
    fn(`openclaw-engram [debug]: ${msg}`, ...args);
  }
};

export {
  initLogger,
  log
};
//# sourceMappingURL=chunk-SSIIJJKA.js.map