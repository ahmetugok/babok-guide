// --- TIME TRACKER UTILITIES (pure JS, no React) ---

const KEY_PREFIX = 'babok_timer_';

/**
 * Starts a timer for the given entityId.
 * Stores { startTime: Date.now() } in localStorage.
 */
export function startTimer(entityId) {
  localStorage.setItem(KEY_PREFIX + entityId, JSON.stringify({ startTime: Date.now() }));
}

/**
 * Stops the timer for the given entityId.
 * Returns elapsed minutes (0 if no timer was running).
 */
export function stopTimer(entityId) {
  const raw = localStorage.getItem(KEY_PREFIX + entityId);
  if (!raw) return 0;
  const { startTime } = JSON.parse(raw);
  if (!startTime) return 0;
  const elapsed = Math.round((Date.now() - startTime) / 60000);
  localStorage.removeItem(KEY_PREFIX + entityId);
  return elapsed;
}

/**
 * Returns the current state of a timer for the given entityId.
 * { isRunning: true, startTime, elapsedSeconds } or { isRunning: false }
 */
export function getActiveTimer(entityId) {
  const raw = localStorage.getItem(KEY_PREFIX + entityId);
  if (!raw) return { isRunning: false };
  const { startTime } = JSON.parse(raw);
  return {
    isRunning: true,
    startTime,
    elapsedSeconds: Math.floor((Date.now() - startTime) / 1000),
  };
}

/**
 * Formats a duration in minutes to a human-readable string.
 * Examples: 45 → "45 dk", 90 → "1 sa 30 dk", 60 → "1 sa 0 dk"
 */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours} sa ${remaining} dk`;
}

/**
 * Returns a list of entityIds that currently have active timers in localStorage.
 */
export function getAllActiveTimers() {
  const ids = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEY_PREFIX)) {
      ids.push(key.slice(KEY_PREFIX.length));
    }
  }
  return ids;
}
