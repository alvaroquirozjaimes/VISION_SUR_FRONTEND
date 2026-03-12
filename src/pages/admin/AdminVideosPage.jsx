import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { videoApi } from '../../services/api.js';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => {
    setLoading(true);
    videoApi.getAllAdmin({ page, limit: 20 }).then(r => { setVideos(r.data.data); setPages(r.data.pages); }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    try { await videoApi.delete(id); toast.success('Eliminado'); load(); } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Videos</h1>
        <Link to="/admin/videos/nuevo" className="btn btn-primary btn-sm"><Plus size={14} /> Nuevo</Link>
      </div>
      {loading ? <div className={styles.loading}>Cargando…</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead><tr><th>Miniatura</th><th>Título</th><th>Programa</th><th>Categoría</th><th>Estado</th><th>Vistas</th><th>Acciones</th></tr></thead>
            <tbody>
              {videos.length === 0 ? <tr><td colSpan={7} className={styles.empty}>No hay videos</td></tr> :
                videos.map(v => (
                  <tr key={v.id}>
                    <td>{v.thumbnail && <img src={v.thumbnail} alt="" className={styles.imgThumb} />}</td>
                    <td><span className={styles.truncate}>{v.title}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{v.program || '—'}</td>
                    <td><span className={`badge badge-category-${v.category}`}>{v.category}</span></td>
                    <td><span className={`badge ${v.published ? 'badge-red' : 'badge-dark'}`}>{v.published ? 'Publicado' : 'Borrador'}</span></td>
                    <td style={{ fontSize: 12 }}>{v.views}</td>
                    <td><div className={styles.actions}>
                      <Link to={`/admin/videos/${v.id}/editar`} className={styles.editBtn}><Edit size={12} /></Link>
                      <button onClick={() => handleDelete(v.id, v.title)} className={styles.deleteBtn}><Trash2 size={12} /></button>
                    </div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
