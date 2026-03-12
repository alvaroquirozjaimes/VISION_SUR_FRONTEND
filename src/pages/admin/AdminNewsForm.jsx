import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, Eye, EyeOff, Star, AlertCircle } from 'lucide-react';
import styles from './AdminForm.module.css';

const CATEGORIES = ['noticias', 'entretenimiento', 'deportes', 'cultura', 'politica', 'economia'];
const CAT_LABELS  = {
  noticias: 'Noticias',
  entretenimiento: 'Entretenimiento',
  deportes: 'Deportes',
  cultura: 'Cultura',
  politica: 'Política',
  economia: 'Economía',
};

export default function AdminNewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [imgPreview, setImgPreview] = useState(null);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'noticias',
    featured: false,
    published: true,
    image: null,
  });

  useEffect(() => {
    if (!isEdit) return;

    newsApi
      .getAllAdmin({ limit: 200 })
      .then((r) => {
        const found = r.data.data.find((n) => n.id === id);
        if (found) {
          setForm({
            title: found.title || '',
            summary: found.summary || '',
            content: found.content || '',
            category: found.category || 'noticias',
            featured: Boolean(found.featured),
            published: Boolean(found.published),
            image: null,
          });

          setImgPreview(
            found.image
              ? found.image.startsWith('http')
                ? found.image
                : 'http://localhost:4000' + found.image
              : null
          );
        }
      })
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      set('image', file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('summary', form.summary.trim());
      fd.append('content', form.content.trim());
      fd.append('category', form.category);
      fd.append('featured', String(form.featured));
      fd.append('published', String(form.published));
      if (form.image instanceof File) fd.append('image', form.image);

      if (isEdit) {
        await newsApi.update(id, fd);
        toast.success('Noticia actualizada');
      } else {
        await newsApi.create(fd);
        toast.success('Noticia publicada correctamente');
      }

      navigate('/admin/noticias');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className={styles.loadingState}>Cargando…</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/noticias')} className={styles.back} type="button">
          <ArrowLeft size={14} />
          Volver
        </button>

        <h1 className={styles.title}>{isEdit ? 'Editar Noticia' : 'Nueva Noticia'}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.mainCol}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Título *</label>
            <input
              className={styles.formInput}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
              placeholder="Título de la noticia"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Resumen / Entradilla</label>
            <textarea
              className={styles.formInput}
              value={form.summary}
              onChange={(e) => set('summary', e.target.value)}
              placeholder="Breve resumen de la noticia"
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Contenido completo</label>
            <textarea
              className={styles.formInput}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder="Contenido de la noticia. Puedes usar HTML básico."
              rows={12}
            />
            <span className={styles.helpText}>
              Acepta HTML: &lt;p&gt;, &lt;b&gt;, &lt;h2&gt;, &lt;blockquote&gt;, &lt;img src="..."&gt;
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Imagen de portada</label>

            <label className={styles.uploadArea}>
              {imgPreview ? (
                <img src={imgPreview} alt="" className={styles.imgPreview} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <Upload size={24} />
                  <span>Haz clic para subir imagen</span>
                  <small>JPG, PNG, WebP — Recomendado: 1280×720px</small>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImg}
                className={styles.hiddenInput}
              />
            </label>

            {imgPreview && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => {
                  setImgPreview(null);
                  set('image', null);
                }}
              >
                ✕ Quitar imagen
              </button>
            )}
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.sideCard}>
            <div>
              <div
                className={`${styles.toggleRow} ${form.published ? styles.toggleRowActive : ''}`}
                onClick={() => set('published', !form.published)}
              >
                <div className={`${styles.toggleIcon} ${form.published ? styles.toggleIconActive : ''}`}>
                  {form.published ? (
                    <Eye size={16} className={styles.eyeActive} />
                  ) : (
                    <EyeOff size={16} className={styles.eyeMuted} />
                  )}
                </div>

                <div className={styles.toggleContent}>
                  <div className={styles.toggleLabel}>
                    {form.published ? 'Publicado' : 'Borrador'}
                  </div>
                  <div className={styles.toggleSub}>
                    {form.published ? 'Visible en el sitio público' : 'Solo visible en el admin'}
                  </div>
                </div>

                <div className={`${styles.toggle} ${form.published ? styles.toggleOn : ''}`} />
              </div>

              {!form.published && (
                <div className={styles.warningBox}>
                  <AlertCircle size={13} />
                  <span>Esta noticia no se verá en el sitio hasta que la publiques.</span>
                </div>
              )}
            </div>

            <div className={styles.toggleRow} onClick={() => set('featured', !form.featured)}>
              <div className={styles.toggleIcon}>
                <Star
                  size={16}
                  className={form.featured ? styles.starActive : styles.eyeMuted}
                  fill={form.featured ? 'currentColor' : 'none'}
                />
              </div>

              <div className={styles.toggleContent}>
                <div className={styles.toggleLabel}>
                  {form.featured ? 'Destacada' : 'No destacada'}
                </div>
                <div className={styles.toggleSub}>
                  {form.featured ? 'Aparece en el inicio' : 'Noticia regular'}
                </div>
              </div>

              <div className={`${styles.toggle} ${form.featured ? styles.toggleOnGold : ''}`} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Categoría</label>
              <select
                className={styles.formInput}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CAT_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Guardando…' : isEdit ? 'Actualizar noticia' : 'Publicar noticia'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}