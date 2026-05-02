import axios from 'axios';
import { TOKEN } from '../config';

// ─── Valid value types ────────────────────────────────────────────────────────
type LogLevel   = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type LogPackage =
  | 'api' | 'component' | 'hook' | 'page' | 'state'
  | 'style' | 'auth' | 'config' | 'middleware' | 'utils';

// ─── Deduplication: suppress identical logs within 2 s ───────────────────────
const _recentKeys = new Set<string>();
const _isDuplicate = (key: string): boolean => {
  if (_recentKeys.has(key)) return true;
  _recentKeys.add(key);
  setTimeout(() => _recentKeys.delete(key), 2000);
  return false;
};

// ─── Dedicated axios instance for logging (no circular dep with notificationsApi) ─
const logClient = axios.create({
  baseURL: 'http://20.207.122.201/evaluation-service',
  timeout: 5000,
});

/**
 * Send a structured log entry to the evaluation service.
 *
 * @param stack   Always "frontend"
 * @param level   "debug" | "info" | "warn" | "error" | "fatal"
 * @param pkg     Package label (api, page, component, …)
 * @param message Human-readable log message
 */
export const Log = (
  stack: string,
  level: LogLevel,
  pkg: LogPackage,
  message: string
): void => {
  const dedupKey = `${level}::${pkg}::${message}`;
  if (_isDuplicate(dedupKey)) return; // skip duplicate within 2 s

  // Fire-and-forget — never block the UI
  logClient
    .post(
      '/logs',
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(() => {
      console.debug(`[LOG SENT] [${level.toUpperCase()}] [${pkg}] ${message}`);
    })
    .catch((err) => {
      // Silently swallow — logging failures must never break the app
      console.warn('[LOG FAILED]', err?.response?.status ?? err?.message);
    });
};
