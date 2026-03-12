import { Link } from 'react-router-dom';
import { Eye, Clock, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { assetUrl } from '../../services/api.js';
import styles from './NewsCard.module.css';

export default function NewsCard({ news, featured = false }) {
  const imgSrc = news.image
    ? assetUrl(news.image)
    : `https://picsum.photos/seed/n${news.id}/600/400`;

  const dateStr = news.publishedAt
    ? format(new Date(news.publishedAt), 'd MMM yyyy', { locale: es })
    : null;

  const isFeatured = featured || news.featured;

  return (
    <Link
      to={`/noticias/${news.slug}`}
      className={`${styles.card} ${isFeatured ? styles.cardFeatured : ''}`}
    >
      <div className={styles.imgWrap}>
        <img src={imgSrc} alt={news.title} loading="lazy" />

        <div className={styles.overlay}></div>

        {isFeatured && (
          <span className={styles.featuredBadge}>
            Destacado
          </span>
        )}

        {news.category && (
          <span className={styles.categoryBadge}>
            {news.category}
          </span>
        )}

        <span className={styles.readMoreIcon}>
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{news.title}</h3>

        {news.summary && <p className={styles.summary}>{news.summary}</p>}

        <div className={styles.meta}>
          {dateStr && (
            <span className={styles.metaItem}>
              <Clock size={12} />
              {dateStr}
            </span>
          )}

          <span className={styles.views}>
            <Eye size={12} />
            {news.views ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}