import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, Eye, EyeOff, Star, AlertCircle } from 'lucide-react';
import styles from './AdminForm.module.css';

const CATEGORIES = ['noticias', 'entretenimiento', 'deportes', 'cultura', 'politica', 'economia'];
const CAT_LABELS  = { noticias:'Noticias', entretenimiento:'Entretenimiento', deportes:'Deportes', cultura:'Cultura', politica:'Política', economia:'Economía' };

export default function AdminNewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [imgPreview, setImgPreview] = useState(null);

  // published defaults to TRUE so new articles are visible immediately
  const [form, setForm] = useState({
    title: '', summary: '', content: '', category: 'noticias',
    featured: false, published: true, image: null,
  });

  useEffect(() => {
    if (!isEdit) return;
    newsApi.getAllAdmin({ limit: 200 }).then(r => {
      const found = r.data.data.find(n => n.id === id);
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
        setImgPreview(found.image ? (found.image.startsWith('http') ? found.image : 'http://localhost:4000' + found.image) : null);
      }
    }).finally(() => setFetching(false));
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) { set('image', file); setImgPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('El título es obligatorio'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title',     form.title.trim());
      fd.append('summary',   form.summary.trim());
      fd.append('content',   form.content.trim());
      fd.append('category',  form.category);
      fd.append('featured',  String(form.featured));
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

  if (fetching) return (
    <div style={{ padding: 60, textAlign: 'center', color: 'var(--adm-muted)' }}>Cargando…</div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/noticias')} className={styles.back}>
          <ArrowLeft size={14} /> Volver
        </button>
        <h1 className={styles.title}>{isEdit ? 'Editar Noticia' : 'Nueva Noticia'}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Main column */}
        <div className={styles.mainCol}>

          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" value={form.title}
              onChange={e => set('title', e.target.value)} required
              placeholder="Título de la noticia" />
          </div>

          <div className="form-group">
            <label className="form-label">Resumen / Entradilla</label>
            <textarea className="form-input" value={form.summary}
              onChange={e => set('summary', e.target.value)}
              placeholder="Breve resumen de la noticia (aparece en tarjetas)" rows={3} />
          </div>

          <div className="form-group">
            <label className="form-label">Contenido completo</label>
            <textarea className="form-input" value={form.content}
              onChange={e => set('content', e.target.value)}
              placeholder="Contenido de la noticia. Puedes usar HTML básico (<p>, <b>, <h2>, etc.)" rows={12} />
            <span style={{ fontSize: 11, color: 'var(--adm-muted)', marginTop: 4 }}>
              Acepta HTML: &lt;p&gt;, &lt;b&gt;, &lt;h2&gt;, &lt;blockquote&gt;, &lt;img src="..."&gt;
            </span>
          </div>

          {/* Image upload */}
          <div className="form-group">
            <label className="form-label">Imagen de portada</label>
            <label className={styles.uploadArea}>
              {imgPreview
                ? <img src={imgPreview} alt="" className={styles.imgPreview} />
                : <div className={styles.uploadPlaceholder}>
                    <Upload size={24} />
                    <span>Haz clic para subir imagen</span>
                    <small>JPG, PNG, WebP — Recomendado: 1280×720px</small>
                  </div>
              }
              <input type="file" accept="image/*" onChange={handleImg} style={{ display:'none' }} />
            </label>
            {imgPreview && (
              <button type="button" style={{ fontSize:11, color:'var(--adm-muted)', background:'none', border:'none', cursor:'pointer', marginTop:4 }}
                onClick={() => { setImgPreview(null); set('image', null); }}>
                ✕ Quitar imagen
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sideCol}>
          <div className={styles.sideCard}>

            {/* PUBLISHED — most important toggle */}
            <div>
              <div
                className={styles.toggleRow}
                onClick={() => set('published', !form.published)}
                style={{ borderColor: form.published ? 'var(--red)' : undefined }}
              >
                <div className={styles.toggleIcon}
                  style={{ background: form.published ? 'rgba(217,0,23,0.12)' : undefined }}>
                  {form.published
                    ? <Eye size={16} color="var(--red)" />
                    : <EyeOff size={16} color="var(--adm-muted)" />
                  }
                </div>
                <div style={{ flex:1 }}>
                  <div className={styles.toggleLabel}>
                    {form.published ? '✅ Publicado' : '📝 Borrador'}
                  </div>
                  <div className={styles.toggleSub}>
                    {form.published ? 'Visible en el sitio público' : 'Solo visible en el admin'}
                  </div>
                </div>
                <div className={`${styles.toggle} ${form.published ? styles.toggleOn : ''}`} />
              </div>
              {!form.published && (
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8, padding:'8px 10px', background:'rgba(255,200,0,0.06)', border:'1px solid rgba(255,200,0,0.2)', borderRadius:'var(--radius)' }}>
                  <AlertCircle size={13} color="#FFD000" />
                  <span style={{ fontSize:11, color:'#c8a800' }}>Esta noticia NO se verá en el sitio hasta que la publiques</span>
                </div>
              )}
            </div>

            {/* FEATURED */}
            <div className={styles.toggleRow} onClick={() => set('featured', !form.featured)}>
              <div className={styles.toggleIcon}>
                <Star size={16} color={form.featured ? 'var(--accent)' : undefined} fill={form.featured ? 'var(--accent)' : 'none'} />
              </div>
              <div>
                <div className={styles.toggleLabel}>{form.featured ? '⭐ Destacada' : 'No destacada'}</div>
                <div className={styles.toggleSub}>{form.featured ? 'Aparece en el inicio' : 'Noticia regular'}</div>
              </div>
              <div className={`${styles.toggle} ${form.featured ? styles.toggleOnGold : ''}`} />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
              {loading ? 'Guardando…' : (isEdit ? '✓ Actualizar noticia' : '✓ Publicar noticia')}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}
