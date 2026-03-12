import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { newsApi } from '../services/api.js';
import NewsCard from '../components/common/NewsCard.jsx';
import { Newspaper, Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ListPage.module.css';

const CATEGORIES = [
  '',
  'noticias',
  'entretenimiento',
  'deportes',
  'cultura',
  'politica',
  'economia',
];

const CAT_LABELS = {
  '': 'Todo',
  noticias: 'Noticias',
  entretenimiento: 'Entretenimiento',
  deportes: 'Deportes',
  cultura: 'Cultura',
  politica: 'Política',
  economia: 'Economía',
};

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);

    newsApi
      .getAll({
        page,
        category: category || undefined,
        search: search || undefined,
        limit: 12,
      })
      .then((r) => {
        setNews(r.data.data || []);
        setTotal(r.data.total || 0);
        setPages(r.data.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);

    if (value === '' || value === null || value === undefined) {
      p.delete(key);
    } else {
      p.set(key, String(value));
    }

    if (key !== 'page') p.set('page', '1');
    setSearchParams(p);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          {/* <span className={styles.heroBadge}>
            <Newspaper size={14} />
            Sala de prensa
          </span> */}

          <h1 className={styles.heroTitle}>Noticias de Visión Sur Televisión 12.1</h1>

          <p className={styles.heroText}>
            Sigue la actualidad, reportajes y contenidos informativos de nuestra señal
            con una cobertura cercana, regional y actualizada.
          </p>
        </section>

        <section className={styles.filtersSection}>
          <div className={styles.filtersHeader}>
            <div>
              <span className={styles.filtersKicker}>Explorar</span>
              {/* <h2 className={styles.filtersTitle}>Filtrar por categoría</h2> */}
            </div>

            <div className={styles.resultsCount}>
              {loading ? 'Cargando…' : `${total} resultado${total !== 1 ? 's' : ''}`}
            </div>
          </div>

          <div className={styles.filters}>
            {CATEGORIES.map((c) => (
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

          {search && (
            <div className={styles.searchNote}>
              <Search size={14} />
              <span>
                Resultados para: <strong>"{search}"</strong> ({total})
              </span>
            </div>
          )}
        </section>

        {loading ? (
          <div className={styles.stateBox}>
            <div className={styles.stateIcon}>
              <Newspaper size={34} />
            </div>
            <p className={styles.stateTitle}>Cargando noticias…</p>
            <span className={styles.stateText}>
              Estamos preparando la cobertura informativa.
            </span>
          </div>
        ) : news.length === 0 ? (
          <div className={styles.stateBox}>
            <div className={styles.stateEmoji}>📰</div>
            <p className={styles.stateTitle}>No se encontraron noticias</p>
            <span className={styles.stateText}>
              No hay contenidos disponibles para esta búsqueda o categoría.
            </span>
          </div>
        ) : (
          <div className={styles.newsGrid}>
            {news.map((n) => (
              <NewsCard key={n.id} news={n} />
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
            Ver todas las noticias
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}