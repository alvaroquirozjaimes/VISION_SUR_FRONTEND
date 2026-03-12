import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../../services/api.js';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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
    newsApi
      .getAllAdmin({ page, limit: 20 })
      .then((r) => {
        setNews(r.data.data);
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
      await newsApi.delete(id);
      toast.success('Eliminado');
      load();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Noticias</h1>

        <div className={styles.pageHeaderActions}>
          <Link to="/admin/noticias/nueva" className={styles.primaryBtn}>
            <Plus size={14} />
            Nueva noticia
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
                <th>Imagen</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Vistas</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {news.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>No hay noticias</td>
                </tr>
              ) : (
                news.map((n) => (
                  <tr key={n.id}>
                    <td>
                      {n.image ? <img src={n.image} alt="" className={styles.imgThumb} /> : '—'}
                    </td>

                    <td>
                      <span className={styles.truncate}>{n.title}</span>
                    </td>

                    <td>
                      <span className={`${styles.badge} ${styles.badgeBlue}`}>
                        {n.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`${styles.badge} ${
                          n.published ? styles.badgeGreen : styles.badgeGray
                        }`}
                      >
                        {n.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>

                    <td>
                      <span className={styles.mutedText}>
                        {n.publishedAt ? format(new Date(n.publishedAt), 'dd/MM/yy') : '—'}
                      </span>
                    </td>

                    <td>
                      <span className={styles.mutedText}>{n.views}</span>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <Link to={`/admin/noticias/${n.id}/editar`} className={styles.editBtn}>
                          <Edit size={12} />
                        </Link>

                        <button
                          onClick={() => handleDelete(n.id, n.title)}
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