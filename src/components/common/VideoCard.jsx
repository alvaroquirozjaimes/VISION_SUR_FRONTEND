import { Link } from 'react-router-dom';
import { Play, Eye, Clock } from 'lucide-react';
import { assetUrl } from '../../services/api.js';
import { getYouTubeThumbnail } from '../../services/youtube.js';
import styles from './VideoCard.module.css';

export default function VideoCard({ video }) {
  // Prioridad: thumbnail subido → thumbnail auto de YouTube → placeholder
  const thumb = video.thumbnail
    ? assetUrl(video.thumbnail)
    : (video.embedUrl ? getYouTubeThumbnail(video.embedUrl) : null)
    ?? `https://picsum.photos/seed/v${video.id}/600/400`;

  return (
    <Link to={`/videos/${video.id}`} className={styles.card}>
      <div className={styles.thumb}>
        <img src={thumb} alt={video.title} loading="lazy" />
        <div className={styles.playOverlay}>
          <div className={styles.playBtn}><Play size={20} fill="var(--red)" color="var(--red)" /></div>
        </div>
        {video.duration && (
          <span className={styles.duration}><Clock size={10} />{video.duration}</span>
        )}
      </div>
      <div className={styles.body}>
        {video.program && <span className={styles.program}>{video.program}</span>}
        <h3 className={styles.title}>{video.title}</h3>
        <div className={styles.meta}>
          <span className={`badge badge-category-${video.category}`}>{video.category}</span>
          <span className={styles.views}><Eye size={11} />{video.views ?? 0}</span>
        </div>
      </div>
    </Link>
  );
}
