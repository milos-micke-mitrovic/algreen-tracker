/**
 * Sound effects utilities for tablet interactions
 * Uses Web Audio API for low-latency playback
 */

type SoundType = 'tap' | 'success' | 'error' | 'warning' | 'notification';

// Audio context singleton
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }

  return audioContext;
}

/**
 * Generate a simple tone using Web Audio API
 */
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Resume if suspended (required after user interaction)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Fade in
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);

    // Fade out
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail
  }
}

/**
 * Sound effect definitions
 */
const soundEffects: Record<SoundType, () => void> = {
  tap: () => {
    playTone(800, 0.05, 'sine', 0.05);
  },

  success: () => {
    playTone(523.25, 0.1, 'sine', 0.08); // C5
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.08), 100); // E5
    setTimeout(() => playTone(783.99, 0.15, 'sine', 0.08), 200); // G5
  },

  error: () => {
    playTone(200, 0.15, 'square', 0.06);
    setTimeout(() => playTone(180, 0.2, 'square', 0.06), 150);
  },

  warning: () => {
    playTone(440, 0.1, 'triangle', 0.08);
    setTimeout(() => playTone(440, 0.1, 'triangle', 0.08), 200);
  },

  notification: () => {
    playTone(880, 0.08, 'sine', 0.06);
    setTimeout(() => playTone(1108.73, 0.12, 'sine', 0.06), 100);
  },
};

// Sound enabled state (persisted)
let soundEnabled = true;

/**
 * Check if sounds are enabled
 */
export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Enable or disable sounds
 */
export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  localStorage.setItem('sound-enabled', String(enabled));
}

/**
 * Initialize sound state from localStorage
 */
export function initializeSounds(): void {
  const stored = localStorage.getItem('sound-enabled');
  if (stored !== null) {
    soundEnabled = stored === 'true';
  }
}

/**
 * Play a sound effect
 */
export function playSound(type: SoundType): void {
  if (!soundEnabled) return;
  soundEffects[type]();
}

/**
 * Sound effect presets
 */
export const sounds = {
  tap: () => playSound('tap'),
  success: () => playSound('success'),
  error: () => playSound('error'),
  warning: () => playSound('warning'),
  notification: () => playSound('notification'),
};
