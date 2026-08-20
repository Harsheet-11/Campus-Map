const SCARE_IMAGE = "/scare.webp";
const SCARE_AUDIO = "/scare-audio.mp3";
const ROAST_IMAGE = "/meme.webp";

let audio: HTMLAudioElement | null = null;

let imageReady = false;
let roastImageReady = false;

export function preloadScareAssets() {
  if (typeof window === "undefined") return;

  if (!imageReady) {
    const image = new Image();

    image.onload = () => {
      imageReady = true;
    };

    image.src = SCARE_IMAGE;
  }

  if (!roastImageReady) {
    const image = new Image();

    image.onload = () => {
      roastImageReady = true;
    };

    image.src = ROAST_IMAGE;
  }

  if (!audio) {
    audio = new Audio();

    audio.src = SCARE_AUDIO;
    audio.preload = "auto";
    audio.volume = 1;

    // Ask browser to load it now.
    audio.load();
  }
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
