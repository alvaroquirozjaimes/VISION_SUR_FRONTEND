import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi, assetUrl } from '../services/api.js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, ArrowLeft, User } from 'lucide-react';
import styles from './DetailPage.module.css';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi.getBySlug(slug)
      .then(r => setNews(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className={styles.loading}>Cargando…</div>;
  if (!news)   return <div className={styles.loading}>Noticia no encontrada.</div>;

  const imgSrc = news.image ? assetUrl(news.image) : null;

  return (
    <div className={styles.page}>
      <div className="container-sm">
        <Link to="/noticias" className={styles.back}>
          <ArrowLeft size={14} /> Volver a Noticias
        </Link>

        <div className={styles.meta}>
          <span className={`badge badge-category-${news.category}`}>{news.category}</span>
          {news.featured && <span className="badge badge-red">Destacado</span>}
          {news.publishedAt && (
            <span className={styles.date}>
              {format(new Date(news.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          )}
          <span className={styles.views}><Eye size={12} /> {news.views ?? 0} vistas</span>
        </div>

        <h1 className={styles.title}>{news.title}</h1>
        {news.summary && <p className={styles.summary}>{news.summary}</p>}

        {news.author && (
          <div className={styles.author}>
            <div className={styles.authorAvatar}><User size={14} /></div>
            <span>Por {news.author.name || news.author}</span>
          </div>
        )}

        {imgSrc && (
          <div className={styles.heroImg}>
            <img src={imgSrc} alt={news.title} />
          </div>
        )}

        {news.content && (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        )}
      </div>
    </div>
  );
}
