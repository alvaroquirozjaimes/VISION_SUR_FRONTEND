import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoApi } from '../../services/api.js';
import { toYouTubeEmbed, getYouTubeThumbnail } from '../../services/youtube.js';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, Eye, EyeOff, Star, AlertCircle } from 'lucide-react';
import styles from './AdminForm.module.css';

const CATEGORIES = ['noticiero', 'entretenimiento', 'deportes', 'cultura', 'especial'];
const CAT_LABELS = {
  noticiero: 'Noticiero',
  entretenimiento: 'Entretenimiento',
  deportes: 'Deportes',
  cultura: 'Cultura',
  especial: 'Especial',
};

export default function AdminVideoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [embedPreview, setEmbedPreview] = useState('');
  const [youtubeThumb, setYoutubeThumb] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'entretenimiento',
    program: '',
    embedUrl: '',
    duration: '',
    featured: false,
    published: true,
    thumbnail: null,
    video: null,
  });

  useEffect(() => {
    if (!isEdit) return;

    videoApi
      .getAllAdmin({ limit: 200 })
      .then((r) => {
        const found = r.data.data.find((v) => v.id === id);

        if (found) {
          setForm({
            title: found.title || '',
            description: found.description || '',
            category: found.category || 'entretenimiento',
            program: found.program || '',
            embedUrl: found.embedUrl || '',
            duration: found.duration || '',
            featured: Boolean(found.featured),
            published: Boolean(found.published),
            thumbnail: null,
            video: null,
          });

          setThumbPreview(
            found.thumbnail
              ? found.thumbnail.startsWith('http')
                ? found.thumbnail
                : 'http://localhost:4000' + found.thumbnail
              : null
          );

          if (found.embedUrl) {
            const emb = toYouTubeEmbed(found.embedUrl);
            setEmbedPreview(emb);

            if (!found.thumbnail) {
              const thumb = getYouTubeThumbnail(emb);
              if (thumb) setYoutubeThumb(thumb);
            }
          }
        }
      })
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleEmbedChange = (e) => {
    const raw = e.target.value.trim();
    set('embedUrl', raw);

    if (!raw) {
      setEmbedPreview('');
      setYoutubeThumb('');
      return;
    }

    const converted = toYouTubeEmbed(raw);
    setEmbedPreview(converted);

    const thumb = getYouTubeThumbnail(converted);
    if (thumb) setYoutubeThumb(thumb);
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
      fd.append('description', form.description.trim());
      fd.append('category', form.category);
      fd.append('program', form.program.trim());
      fd.append('embedUrl', toYouTubeEmbed(form.embedUrl));
      fd.append('duration', form.duration.trim());
      fd.append('featured', String(form.featured));
      fd.append('published', String(form.published));

      if (form.thumbnail instanceof File) fd.append('thumbnail', form.thumbnail);
      if (form.video instanceof File) fd.append('video', form.video);

      if (isEdit) {
        await videoApi.update(id, fd);
        toast.success('Video actualizado');
      } else {
        await videoApi.create(fd);
        toast.success('Video publicado correctamente');
      }

      navigate('/admin/videos');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.loadingState}>
        Cargando…
      </div>
    );
  }

  const displayThumb = thumbPreview || youtubeThumb;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/videos')} className={styles.back}>
          <ArrowLeft size={14} />
          Volver
        </button>

        <h1 className={styles.title}>{isEdit ? 'Editar Video' : 'Nuevo Video'}</h1>
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
              placeholder="Título del video"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              URL de YouTube
              <span className={styles.inlineHint}>
                — pega el link normal, lo convertimos automáticamente
              </span>
            </label>

            <input
              className={styles.formInput}
              value={form.embedUrl}
              onChange={handleEmbedChange}
              placeholder="https://www.youtube.com/watch?v=XXXX o youtu.be/XXXX"
            />

            {embedPreview ? (
              <div className={styles.embedPreviewWrap}>
                <iframe
                  src={embedPreview}
                  title="Vista previa YouTube"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.embedPreview}
                />
              </div>
            ) : (
              <div className={styles.helpBox}>
                💡 Formatos aceptados: youtube.com/watch?v=ID · youtu.be/ID ·
                youtube.com/live/ID · youtube.com/shorts/ID
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>O subir archivo de video</label>
            <input
              type="file"
              accept="video/*"
              className={styles.formInput}
              onChange={(e) => set('video', e.target.files[0])}
            />
            <span className={styles.helpText}>
              Solo si no usas YouTube. Máx. 500MB.
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Descripción</label>
            <textarea
              className={styles.formInput}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Descripción del video"
              rows={4}
            />
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.sideCard}>
            <div
              className={`${styles.toggleRow} ${
                form.published ? styles.toggleRowActive : ''
              }`}
              onClick={() => set('published', !form.published)}
            >
              <div
                className={`${styles.toggleIcon} ${
                  form.published ? styles.toggleIconActive : ''
                }`}
              >
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
                  {form.published ? 'Visible en el sitio' : 'Solo en el admin'}
                </div>
              </div>

              <div className={`${styles.toggle} ${form.published ? styles.toggleOn : ''}`} />
            </div>

            {!form.published && (
              <div className={styles.warningBox}>
                <AlertCircle size={13} />
                <span>Este video no se verá en el sitio hasta que lo publiques.</span>
              </div>
            )}

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
                  {form.featured ? 'Destacado' : 'No destacado'}
                </div>
                <div className={styles.toggleSub}>
                  {form.featured ? 'Aparece en el inicio' : 'Video regular'}
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

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nombre del programa</label>
              <input
                className={styles.formInput}
                value={form.program}
                onChange={(e) => set('program', e.target.value)}
                placeholder="Ej: Noticiero Central"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Duración</label>
              <input
                className={styles.formInput}
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                placeholder="28:00"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Miniatura
                {youtubeThumb && !thumbPreview && (
                  <span className={styles.successHint}> ✓ auto-detectada de YouTube</span>
                )}
              </label>

              <label className={styles.uploadArea}>
                {displayThumb ? (
                  <img src={displayThumb} alt="" className={styles.imgPreview} />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <Upload size={20} />
                    <span>Subir miniatura</span>
                    <small>O se usará la de YouTube</small>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      set('thumbnail', f);
                      setThumbPreview(URL.createObjectURL(f));
                    }
                  }}
                  className={styles.hiddenInput}
                />
              </label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? 'Guardando…'
                : isEdit
                ? 'Actualizar video'
                : 'Publicar video'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}