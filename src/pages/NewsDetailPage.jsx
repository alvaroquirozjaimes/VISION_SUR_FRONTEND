import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi, assetUrl } from '../services/api.js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, ArrowLeft, User, CalendarDays, Star } from 'lucide-react';
import styles from './DetailPage.module.css';

function normalizeCategory(category) {
  return String(category || '').trim() || 'General';
}

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi
      .getBySlug(slug)
      .then((r) => setNews(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container-sm">
          <div className={styles.stateBox}>
            <div className={styles.stateIcon}>
              <CalendarDays size={36} />
            </div>
            <p className={styles.stateTitle}>Cargando noticia…</p>
            <span className={styles.stateText}>
              Estamos preparando el contenido editorial.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className={styles.page}>
        <div className="container-sm">
          <div className={styles.stateBox}>
            <div className={styles.stateEmoji}>📰</div>
            <p className={styles.stateTitle}>Noticia no encontrada</p>
            <span className={styles.stateText}>
              El contenido que buscas no está disponible o fue removido.
            </span>

            <Link to="/noticias" className={styles.backBtn}>
              <ArrowLeft size={14} />
              Volver a Noticias
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imgSrc = news.image ? assetUrl(news.image) : null;

  return (
    <div className={styles.page}>
      <div className="container-sm">
        <Link to="/noticias" className={styles.backLink}>
          <ArrowLeft size={14} />
          Volver a Noticias
        </Link>

        <header className={styles.header}>
          <div className={styles.metaTop}>
            <span className={styles.categoryBadge}>
              {normalizeCategory(news.category)}
            </span>

            {news.featured && (
              <span className={styles.featuredBadge}>
                <Star size={12} />
                Destacado
              </span>
            )}

            {news.publishedAt && (
              <span className={styles.metaInfo}>
                <CalendarDays size={13} />
                {format(new Date(news.publishedAt), "d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </span>
            )}

            <span className={styles.metaInfo}>
              <Eye size={13} />
              {news.views ?? 0} vistas
            </span>
          </div>

          <h1 className={styles.title}>{news.title}</h1>

          {news.summary && <p className={styles.lead}>{news.summary}</p>}

          {news.author && (
            <div className={styles.author}>
              <div className={styles.authorAvatar}>
                <User size={14} />
              </div>
              <span>Por {news.author.name || news.author}</span>
            </div>
          )}
        </header>

        {imgSrc && (
          <div className={styles.heroImg}>
            <img src={imgSrc} alt={news.title} />
          </div>
        )}

        {news.content && (
          <article
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        )}
      </div>
    </div>
  );
}