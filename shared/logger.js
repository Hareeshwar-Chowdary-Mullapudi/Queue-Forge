const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function resolveLevel() {
  const raw = (process.env.LOG_LEVEL || 'info').toLowerCase();
  return LEVELS[raw] !== undefined ? raw : 'info';
}

function formatMessage(level, message, meta) {
  const time = new Date().toISOString();
  const base = `[${time}] [${level.toUpperCase()}] ${message}`;
  if (meta === undefined) return base;
  if (meta instanceof Error) {
    return `${base} ${meta.stack || meta.message}`;
  }
  try {
    return `${base} ${JSON.stringify(meta)}`;
  } catch {
    return `${base} ${String(meta)}`;
  }
}

function shouldLog(level) {
  return LEVELS[level] <= LEVELS[resolveLevel()];
}

export const logger = {
  error(message, meta) {
    if (shouldLog('error')) console.error(formatMessage('error', message, meta));
  },
  warn(message, meta) {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, meta));
  },
  info(message, meta) {
    if (shouldLog('info')) console.info(formatMessage('info', message, meta));
  },
  debug(message, meta) {
    if (shouldLog('debug')) console.debug(formatMessage('debug', message, meta));
  },
};
