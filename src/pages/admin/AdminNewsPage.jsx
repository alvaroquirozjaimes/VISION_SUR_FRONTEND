import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../../services/api.js';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import styles from './AdminTable.module.css';

export default function AdminNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => {
    setLoading(true);
    newsApi.getAllAdmin({ page, limit: 20 }).then(r => { setNews(r.data.data); setPages(r.data.pages); }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    try { await newsApi.delete(id); toast.success('Eliminado'); load(); } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Noticias</h1>
        <Link to="/admin/noticias/nueva" className="btn btn-primary btn-sm"><Plus size={14} /> Nueva</Link>
      </div>
      {loading ? <div className={styles.loading}>Cargando…</div> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Imagen</th><th>Título</th><th>Categoría</th><th>Estado</th><th>Fecha</th><th>Vistas</th><th>Acciones</th></tr></thead>
            <tbody>
              {news.length === 0 ? <tr><td colSpan={7} className={styles.empty}>No hay noticias</td></tr> :
                news.map(n => (
                  <tr key={n.id}>
                    <td>{n.image && <img src={n.image} alt="" className={styles.imgThumb} />}</td>
                    <td><span className={styles.truncate}>{n.title}</span></td>
                    <td><span className={`badge badge-category-${n.category}`}>{n.category}</span></td>
                    <td><span className={`badge ${n.published ? 'badge-red' : 'badge-dark'}`}>{n.published ? 'Publicado' : 'Borrador'}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{n.publishedAt ? format(new Date(n.publishedAt), 'dd/MM/yy') : '—'}</td>
                    <td style={{ fontSize: 12 }}>{n.views}</td>
                    <td><div className={styles.actions}>
                      <Link to={`/admin/noticias/${n.id}/editar`} className={styles.editBtn}><Edit size={12} /></Link>
                      <button onClick={() => handleDelete(n.id, n.title)} className={styles.deleteBtn}><Trash2 size={12} /></button>
                    </div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 && <div className="pagination" style={{ marginTop: 20 }}>
        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>)}
        <button className="page-btn" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>›</button>
      </div>}
    </div>
  );
}
