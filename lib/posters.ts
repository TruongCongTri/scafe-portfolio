// Pixel sizes of the posters and photos that show at their own shape, so the page can
// hold the right space for each before it loads. Add a line when a new one goes in.
// Uploads record their size when saved; anything unlisted is taken as a 4:5 post.

export type Size = { width: number; height: number };
export type Poster = Size & { src: string };

const POST: Size = { width: 1200, height: 1500 };

const SIZES: Record<string, Size> = {
  "/images/events/coraline.webp": { width: 1200, height: 1500 },
  "/images/events/howl.webp": { width: 1200, height: 1500 },
  "/images/events/jam.webp": { width: 1200, height: 1500 },
  "/images/events/mood.webp": { width: 1200, height: 1500 },
  "/images/events/slay.webp": { width: 1080, height: 1080 },
  "/images/discount/happy-hour.jpg": { width: 1080, height: 1080 },
  "/images/discount/mon.jpg": { width: 2048, height: 2048 },
  "/images/discount/sun.jpg": { width: 2160, height: 2160 },
  "/images/discount/thu.jpg": { width: 1080, height: 1080 },
  "/images/press/grand-opening.jpg": { width: 945, height: 1181 },
  "/images/press/grand-opening.webp": { width: 1536, height: 1920 },
  "/images/press/how-to-find.webp": { width: 1600, height: 2133 },
  "/images/press/soft-opening.webp": { width: 1600, height: 2133 },
  "/images/glass-stack.webp": { width: 1800, height: 1200 },
  "/images/whisky.webp": { width: 1800, height: 1200 },
  "/images/pour.webp": { width: 1800, height: 1200 },
  "/images/taps-room.webp": { width: 1536, height: 2048 },
  "/images/old-taps.webp": { width: 1800, height: 2398 },
  "/images/snug.webp": { width: 1800, height: 1012 },
};

export const poster = (src: string, known?: Size): Poster => ({ src, ...(known ?? SIZES[src] ?? POST) });
