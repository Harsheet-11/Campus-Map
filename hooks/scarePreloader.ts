const SCARE_IMAGE = "/scare.webp";
const SCARE_AUDIO = "/scare-audio.mp3";
const ROAST_IMAGE = "/meme.webp";

let scareImage: HTMLImageElement | null = null;
let roastImage: HTMLImageElement | null = null;
let audio: HTMLAudioElement | null = null;

export function preloadScareAssets() {
  if (typeof window === "undefined") return;

  // Preload scare image
  if (!scareImage) {
    scareImage = new Image();
    scareImage.decoding = "sync";
    scareImage.src = SCARE_IMAGE;
  }

  // Preload roast image
  if (!roastImage) {
    roastImage = new Image();
    roastImage.decoding = "sync";
    roastImage.src = ROAST_IMAGE;
  }

  // Preload audio
  if (!audio) {
    audio = new Audio(SCARE_AUDIO);
    audio.preload = "auto";
    audio.volume = 1;
    audio.load();
  }
}

export function getScareImage(): HTMLImageElement | null {
  return scareImage;
}

export function getRoastImage(): HTMLImageElement | null {
  return roastImage;
}

export function getScareAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(SCARE_AUDIO);
    audio.preload = "auto";
    audio.volume = 1;
    audio.load();
  }

  audio.pause();
  audio.currentTime = 0;

  return audio;
}

export function stopScareAudio() {
  if (!audio) return;

  audio.pause();

  try {
    audio.currentTime = 0;
  } catch {
    // Ignore browser-specific media errors.
  }
}

export const SCARE_ASSETS = {
  image: SCARE_IMAGE,
  audio: SCARE_AUDIO,
  roastImage: ROAST_IMAGE,
} as const;
