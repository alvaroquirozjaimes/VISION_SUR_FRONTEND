import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { videoApi } from '../../services/api.js';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => {
    setLoading(true);
    videoApi
      .getAllAdmin({ page, limit: 20 })
      .then((r) => {
        setVideos(r.data.data);
        setPages(r.data.pages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return;

    try {
      await videoApi.delete(id);
      toast.success('Eliminado');
      load();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Videos</h1>

        <div className={styles.pageHeaderActions}>
          <Link to="/admin/videos/nuevo" className={styles.primaryBtn}>
            <Plus size={14} />
            Nuevo video
          </Link>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando…</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Miniatura</th>
                <th>Título</th>
                <th>Programa</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Vistas</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>No hay videos</td>
                </tr>
              ) : (
                videos.map((v) => (
                  <tr key={v.id}>
                    <td>
                      {v.thumbnail ? <img src={v.thumbnail} alt="" className={styles.imgThumb} /> : '—'}
                    </td>

                    <td>
                      <span className={styles.truncate}>{v.title}</span>
                    </td>

                    <td>
                      <span className={styles.mutedText}>{v.program || '—'}</span>
                    </td>

                    <td>
                      <span className={`${styles.badge} ${styles.badgeBlue}`}>
                        {v.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`${styles.badge} ${
                          v.published ? styles.badgeGreen : styles.badgeGray
                        }`}
                      >
                        {v.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>

                    <td>
                      <span className={styles.mutedText}>{v.views}</span>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <Link to={`/admin/videos/${v.id}/editar`} className={styles.editBtn}>
                          <Edit size={12} />
                        </Link>

                        <button
                          onClick={() => handleDelete(v.id, v.title)}
                          className={styles.deleteBtn}
                          type="button"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            type="button"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
              onClick={() => setPage(p)}
              type="button"
            >
              {p}
            </button>
          ))}

          <button
            className={styles.pageBtn}
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            type="button"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}