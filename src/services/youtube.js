/**
 * Convierte cualquier formato de URL de YouTube al formato embed correcto.
 * Formatos aceptados:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID  (ya correcto)
 *   https://www.youtube.com/shorts/VIDEO_ID
 */
export function toYouTubeEmbed(url) {
  if (!url) return null;

  // Ya es embed
  if (url.includes('youtube.com/embed/')) return url;

  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&\s]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&\s]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&\s]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

  // Si nada coincide, devolver null (no es YouTube, quizás es Vimeo u otro)
  return null;
}

/**
 * Genera thumbnail de YouTube desde URL embed o normal
 */
export function getYouTubeThumbnail(url) {
  if (!url) return null;
  const embedUrl = toYouTubeEmbed(url);
  if (!embedUrl) return null;
  const match = embedUrl.match(/embed\/([^?&\s]+)/);
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}
