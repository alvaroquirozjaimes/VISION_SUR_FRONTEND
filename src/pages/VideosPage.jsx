import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { videoApi } from '../services/api.js';
import VideoCard from '../components/common/VideoCard.jsx';
import { Film, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './VideosPage.module.css';

const VIDEO_CATS = [
  '',
  'noticiero',
  'entretenimiento',
  'deportes',
  'cultura',
  'especial',
];

const CAT_LABELS = {
  '': 'Todo',
  noticiero: 'Noticiero',
  entretenimiento: 'Entretenimiento',
  deportes: 'Deportes',
  cultura: 'Cultura',
  especial: 'Especial',
};

export function VideosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);

    videoApi
      .getAll({
        page,
        category: category || undefined,
        limit: 12,
      })
      .then((r) => {
        setVideos(r.data.data || []);
        setPages(r.data.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [page, category]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);

    if (val === '' || val === null || val === undefined) {
      p.delete(key);
    } else {
      p.set(key, String(val));
    }

    if (key !== 'page') p.set('page', '1');
    setSearchParams(p);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <span className={styles.heroBadge}>
            <Film size={14} />
            Biblioteca audiovisual
          </span>

          <h1 className={styles.heroTitle}>Videos de Visión Sur Televisión 12.1</h1>

          <p className={styles.heroText}>
            Explora entrevistas, reportajes, segmentos informativos y contenidos
            especiales de nuestra señal.
          </p>
        </section>

        <section className={styles.filtersSection}>
          <div className={styles.filtersHeader}>
            <div>
              <span className={styles.filtersKicker}>Explorar</span>
              <h2 className={styles.filtersTitle}>Filtrar por categoría</h2>
            </div>

            <div className={styles.resultsCount}>
              {loading ? 'Cargando…' : `${videos.length} video${videos.length !== 1 ? 's' : ''}`}
            </div>
          </div>

          <div className={styles.filters}>
            {VIDEO_CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter('category', c)}
                className={`${styles.filterBtn} ${category === c ? styles.filterActive : ''}`}
              >
                {CAT_LABELS[c]}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className={styles.stateBox}>
            <div className={styles.stateIcon}>
              <Film size={34} />
            </div>
            <p className={styles.stateTitle}>Cargando videos…</p>
            <span className={styles.stateText}>
              Estamos preparando la galería audiovisual.
            </span>
          </div>
        ) : videos.length === 0 ? (
          <div className={styles.stateBox}>
            <div className={styles.stateEmoji}>🎞️</div>
            <p className={styles.stateTitle}>No hay videos disponibles</p>
            <span className={styles.stateText}>
              No encontramos contenidos para esta categoría en este momento.
            </span>
          </div>
        ) : (
          <div className={styles.videoGrid}>
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => setFilter('page', page - 1)}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                onClick={() => setFilter('page', p)}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= pages}
              onClick={() => setFilter('page', page + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        <div className={styles.bottomLinkWrap}>
          <button
            type="button"
            className={styles.resetLink}
            onClick={() => {
              const p = new URLSearchParams();
              setSearchParams(p);
            }}
          >
            Ver todos los videos
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideosPage;