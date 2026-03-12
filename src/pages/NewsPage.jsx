import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { newsApi } from '../services/api.js';
import NewsCard from '../components/common/NewsCard.jsx';
import styles from './ListPage.module.css';

const CATEGORIES = ['', 'noticias', 'entretenimiento', 'deportes', 'cultura', 'politica', 'economia'];
const CAT_LABELS = { '': 'Todo', noticias: 'Noticias', entretenimiento: 'Entretenimiento', deportes: 'Deportes', cultura: 'Cultura', politica: 'Política', economia: 'Economía' };

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    newsApi.getAll({ page, category: category || undefined, search: search || undefined, limit: 12 })
      .then(r => { setNews(r.data.data); setTotal(r.data.total); setPages(r.data.pages); })
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    p.set(key, value); p.set('page', '1');
    setSearchParams(p);
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <h1 className="section-title" style={{ marginBottom: 28 }}>Noticias</h1>

      <div className={styles.filters}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter('category', c)} className={`${styles.filterBtn} ${category === c ? styles.filterActive : ''}`}>
            {CAT_LABELS[c]}
          </button>
        ))}
      </div>

      {search && <p className={styles.searchNote}>Resultados para: <strong>"{search}"</strong> ({total})</p>}

      {loading ? (
        <div className={styles.loading}>Cargando…</div>
      ) : news.length === 0 ? (
        <div className={styles.empty}>No se encontraron noticias.</div>
      ) : (
        <div className="news-grid fade-in">{news.map(n => <NewsCard key={n.id} news={n} />)}</div>
      )}

      {pages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page <= 1} onClick={() => setFilter('page', page - 1)}>‹</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setFilter('page', p)}>{p}</button>
          ))}
          <button className="page-btn" disabled={page >= pages} onClick={() => setFilter('page', page + 1)}>›</button>
        </div>
      )}
    </div>
  );
}
