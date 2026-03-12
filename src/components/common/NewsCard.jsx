import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { assetUrl } from '../../services/api.js';
import styles from './NewsCard.module.css';

export default function NewsCard({ news, featured }) {
  const imgSrc = news.image
    ? assetUrl(news.image)
    : `https://picsum.photos/seed/n${news.id}/600/400`;

  const dateStr = news.publishedAt
    ? format(new Date(news.publishedAt), "d MMM yyyy", { locale: es })
    : null;

  return (
    <Link to={`/noticias/${news.slug}`} className={styles.card}>
      <div className={styles.imgWrap}>
        <img src={imgSrc} alt={news.title} loading="lazy" />
        {news.featured && <span className={`badge badge-red ${styles.featuredBadge}`}>Destacado</span>}
      </div>
      <div className={styles.body}>
        <span className={`badge badge-category-${news.category}`}>{news.category}</span>
        <h3 className={styles.title}>{news.title}</h3>
        {news.summary && <p className={styles.summary}>{news.summary}</p>}
        <div className={styles.meta}>
          {dateStr && <span><Clock size={10} /> {dateStr}</span>}
          <span className={styles.views}><Eye size={11} /> {news.views ?? 0}</span>
        </div>
      </div>
    </Link>
  );
}
