// ─── VideosPage ───────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { videoApi } from '../services/api.js';
import VideoCard from '../components/common/VideoCard.jsx';
import styles from './ListPage.module.css';

const VIDEO_CATS = ['', 'noticiero', 'entretenimiento', 'deportes', 'cultura', 'especial'];
const CAT_LABELS = { '': 'Todo', noticiero: 'Noticiero', entretenimiento: 'Entretenimiento', deportes: 'Deportes', cultura: 'Cultura', especial: 'Especial' };

export function VideosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    videoApi.getAll({ page, category: category || undefined, limit: 12 })
      .then(r => { setVideos(r.data.data); setPages(r.data.pages); })
      .finally(() => setLoading(false));
  }, [page, category]);

  const setFilter = (key, val) => { const p = new URLSearchParams(searchParams); p.set(key, val); p.set('page', '1'); setSearchParams(p); };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <h1 className="section-title" style={{ marginBottom: 28 }}>Videos</h1>
      <div className={styles.filters}>
        {VIDEO_CATS.map(c => <button key={c} onClick={() => setFilter('category', c)} className={`${styles.filterBtn} ${category === c ? styles.filterActive : ''}`}>{CAT_LABELS[c]}</button>)}
      </div>
      {loading ? <div className={styles.loading}>Cargando…</div> : videos.length === 0 ? <div className={styles.empty}>No hay videos.</div> :
        <div className="video-grid fade-in">{videos.map(v => <VideoCard key={v.id} video={v} />)}</div>}
      {pages > 1 && <div className="pagination">
        <button className="page-btn" disabled={page <= 1} onClick={() => setFilter('page', page - 1)}>‹</button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setFilter('page', p)}>{p}</button>)}
        <button className="page-btn" disabled={page >= pages} onClick={() => setFilter('page', page + 1)}>›</button>
      </div>}
    </div>
  );
}
export default VideosPage;
