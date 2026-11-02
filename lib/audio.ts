import { site } from "./content";
import { WEEKDAYS } from "./offers";
import { isTouch } from "./site";

export type Track = { src: string; title: string };

const TRACKS = {
  yumeji: { src: "/audio/yumeji.mp3", title: "Yumeji's Theme" },
  flyMe: { src: "/audio/fly-me-to-the-moon.mp3", title: "Fly Me to the Moon" },
  feelingGood: { src: "/audio/feeling-good.mp3", title: "Feeling Good" },
  takeFive: { src: "/audio/take-five.mp3", title: "Take Five" },
  merryGoRound: { src: "/audio/merry-go-round-of-life.mp3", title: "Merry-Go-Round of Life" },
  dream: { src: "/audio/dream-a-little-dream.mp3", title: "Dream a Little Dream of Me" },
} satisfies Record<string, Track>;

// One track per day, in the bar's own time zone, matched to the day's deal or night:
// happy-hour jazz midweek, Ghibli for Wednesday, the film-night score on Friday,
// Sinatra for the Saturday jam, Nina Simone on Sunday. Monday borrows Friday's.
const WEEK: Record<(typeof WEEKDAYS)[number], Track> = {
  Mon: TRACKS.yumeji,
  Tue: TRACKS.takeFive,
  Wed: TRACKS.merryGoRound,
  Thu: TRACKS.dream,
  Fri: TRACKS.yumeji,
  Sat: TRACKS.flyMe,
  Sun: TRACKS.feelingGood,
};

// A slow connection falls back to streaming rather than holding the preloader for good.
const LOAD_LIMIT = 8000;
// Phone browsers can refuse to buffer before a user gesture, so "ready" may never come.
// The whole file is on the device by then, so this wait can stay short.
const READY_LIMIT = 1500;
const VOLUME = 0.6;
const PAUSED_KEY = "scafe-audio-paused";

export const todaysTrack = (now = new Date()) => {
  const day = new Intl.DateTimeFormat("en-GB", { timeZone: site.timeZone, weekday: "short" }).format(now);
  return WEEK[day as keyof typeof WEEK];
};

type AudioState = { track: Track | null; playing: boolean; failed: boolean };

const initial: AudioState = { track: null, playing: false, failed: false };
let state = initial;
let audio: HTMLAudioElement | null = null;
let prepared: Promise<void> | null = null;
const listeners = new Set<() => void>();

const setState = (next: Partial<AudioState>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

export const getAudioState = () => state;
export const getServerAudioState = () => initial;
export const subscribeAudio = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};

async function download(src: string, signal: AbortSignal, onProgress: (share: number) => void) {
  const response = await fetch(src, { signal });
  if (!response.ok || !response.body) throw new Error(`Track failed: ${response.status}`);
  const total = Number(response.headers.get("content-length"));
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  const reader = response.body.getReader();
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total) onProgress(Math.min(received / total, 1));
  }
  return URL.createObjectURL(new Blob(chunks, { type: "audio/mpeg" }));
}

const readyToPlay = (element: HTMLAudioElement) =>
  new Promise<void>((resolve, reject) => {
    if (element.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) return resolve();
    element.addEventListener("canplaythrough", () => resolve(), { once: true });
    element.addEventListener("error", () => reject(new Error("Track can't be decoded")), { once: true });
  });

// Downloads today's whole track, so it can start with no buffering. Always settles,
// because a missing or slow track must never stop the site from opening.
export function prepareAudio(onProgress: (share: number) => void = () => {}) {
  if (prepared) return prepared;

  const track = todaysTrack();
  const element = new Audio();
  element.loop = true;
  element.volume = VOLUME;
  element.preload = "auto";
  element.addEventListener("play", () => setState({ playing: true }));
  element.addEventListener("pause", () => setState({ playing: false }));
  audio = element;
  setState({ track });

  const load = async () => {
    // Phones refuse sound before a tap, so holding the page open for the file gains nothing.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || isTouch()) {
      element.preload = "none";
      element.src = track.src;
      return;
    }

    const controller = new AbortController();
    const limit = window.setTimeout(() => controller.abort(), LOAD_LIMIT);
    try {
      element.src = await download(track.src, controller.signal, onProgress);
      await Promise.race([readyToPlay(element), new Promise((resolve) => window.setTimeout(resolve, READY_LIMIT))]);
    } catch (error) {
      if (!controller.signal.aborted) throw error;
      element.src = track.src;
    } finally {
      window.clearTimeout(limit);
    }
  };

  prepared = load()
    .catch((error) => {
      console.warn(error);
      setState({ failed: true });
    })
    .finally(() => onProgress(1));
  return prepared;
}

const pausedByVisitor = () => {
  try {
    return window.localStorage.getItem(PAUSED_KEY) === "1";
  } catch {
    return false;
  }
};

const rememberPaused = (paused: boolean) => {
  try {
    if (paused) window.localStorage.setItem(PAUSED_KEY, "1");
    else window.localStorage.removeItem(PAUSED_KEY);
  } catch {
    // The choice simply won't last past this page.
  }
};

// Touch only counts as a gesture once the finger lifts, so pointerdown alone is refused.
const GESTURES = ["pointerdown", "pointerup", "keydown"] as const;

const stopWaiting = () => GESTURES.forEach((name) => window.removeEventListener(name, onGesture));

// The player's own button handles itself, or one tap would start and stop the track.
function onGesture(event: Event) {
  if (event.target instanceof Element && event.target.closest(".audio-player")) return;
  audio?.play().then(stopWaiting).catch(() => {});
}

// Browsers refuse sound until the visitor has interacted with the page, so a refused
// start waits for their first tap, click or key press.
export async function startAudio() {
  await prepareAudio();
  if (!audio || state.failed || pausedByVisitor()) return;
  try {
    await audio.play();
  } catch {
    GESTURES.forEach((name) => window.addEventListener(name, onGesture));
  }
}

export function toggleAudio() {
  if (!audio) return;
  stopWaiting();
  rememberPaused(!audio.paused);
  if (audio.paused) audio.play().catch(() => setState({ failed: true }));
  else audio.pause();
}
