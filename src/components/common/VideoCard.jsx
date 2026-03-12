import { Link } from 'react-router-dom';
import { Play, Eye, Clock, ArrowUpRight } from 'lucide-react';
import { assetUrl } from '../../services/api.js';
import { getYouTubeThumbnail } from '../../services/youtube.js';
import styles from './VideoCard.module.css';

export default function VideoCard({ video }) {
  const thumb = video.thumbnail
    ? assetUrl(video.thumbnail)
    : (video.embedUrl ? getYouTubeThumbnail(video.embedUrl) : null)
      ?? `https://picsum.photos/seed/v${video.id}/600/400`;

  return (
    <Link to={`/videos/${video.id}`} className={styles.card}>
      <div className={styles.thumb}>
        <img src={thumb} alt={video.title} loading="lazy" />

        <div className={styles.overlay}></div>

        <div className={styles.playOverlay}>
          <div className={styles.playBtn}>
            <Play size={18} fill="currentColor" />
          </div>
        </div>

        {video.duration && (
          <span className={styles.duration}>
            <Clock size={11} />
            {video.duration}
          </span>
        )}

        <span className={styles.openIcon}>
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className={styles.body}>
        {video.program && <span className={styles.program}>{video.program}</span>}

        <h3 className={styles.title}>{video.title}</h3>

        <div className={styles.meta}>
          {video.category && (
            <span className={styles.category}>{video.category}</span>
          )}

          <span className={styles.views}>
            <Eye size={12} />
            {video.views ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}