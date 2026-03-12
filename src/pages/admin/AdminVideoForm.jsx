import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoApi } from '../../services/api.js';
import { toYouTubeEmbed, getYouTubeThumbnail } from '../../services/youtube.js';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, Eye, EyeOff, Star, AlertCircle } from 'lucide-react';
import styles from './AdminForm.module.css';

const CATEGORIES = ['noticiero','entretenimiento','deportes','cultura','especial'];
const CAT_LABELS  = { noticiero:'Noticiero', entretenimiento:'Entretenimiento', deportes:'Deportes', cultura:'Cultura', especial:'Especial' };

export default function AdminVideoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [embedPreview, setEmbedPreview] = useState('');
  const [youtubeThumb, setYoutubeThumb] = useState('');

  // published defaults to TRUE
  const [form, setForm] = useState({
    title: '', description: '', category: 'entretenimiento',
    program: '', embedUrl: '', duration: '',
    featured: false, published: true,
    thumbnail: null, video: null,
  });

  useEffect(() => {
    if (!isEdit) return;
    videoApi.getAllAdmin({ limit: 200 }).then(r => {
      const found = r.data.data.find(v => v.id === id);
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
          thumbnail: null, video: null,
        });
        setThumbPreview(found.thumbnail ? (found.thumbnail.startsWith('http') ? found.thumbnail : 'http://localhost:4000' + found.thumbnail) : null);
        if (found.embedUrl) {
          const emb = toYouTubeEmbed(found.embedUrl);
          setEmbedPreview(emb);
          // extract YT thumb if no custom thumbnail
          if (!found.thumbnail) {
            const thumb = getYouTubeThumbnail(emb); if (thumb) setYoutubeThumb(thumb);
          }
        }
      }
    }).finally(() => setFetching(false));
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleEmbedChange = (e) => {
    const raw = e.target.value.trim();
    set('embedUrl', raw);
    if (!raw) { setEmbedPreview(''); setYoutubeThumb(''); return; }
    const converted = toYouTubeEmbed(raw);
    setEmbedPreview(converted);
    // Auto-set YouTube thumbnail preview
    const thumb = getYouTubeThumbnail(converted); if (thumb) setYoutubeThumb(thumb);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('El título es obligatorio'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title.trim());
      fd.append('description', form.description.trim());
      fd.append('category',    form.category);
      fd.append('program',     form.program.trim());
      // Always store as proper embed URL
      fd.append('embedUrl',    toYouTubeEmbed(form.embedUrl));
      fd.append('duration',    form.duration.trim());
      fd.append('featured',    String(form.featured));
      fd.append('published',   String(form.published));
      if (form.thumbnail instanceof File) fd.append('thumbnail', form.thumbnail);
      if (form.video instanceof File)     fd.append('video',     form.video);

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

  if (fetching) return (
    <div style={{ padding: 60, textAlign:'center', color:'var(--adm-muted)' }}>Cargando…</div>
  );

  const displayThumb = thumbPreview || youtubeThumb;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/videos')} className={styles.back}>
          <ArrowLeft size={14} /> Volver
        </button>
        <h1 className={styles.title}>{isEdit ? 'Editar Video' : 'Nuevo Video'}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Main col */}
        <div className={styles.mainCol}>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" value={form.title}
              onChange={e => set('title', e.target.value)} required
              placeholder="Título del video" />
          </div>

          <div className="form-group">
            <label className="form-label">
              URL de YouTube
              <span style={{fontSize:10, color:'var(--adm-muted)', fontFamily:'var(--font-body)', textTransform:'none', letterSpacing:0, marginLeft:8, fontWeight:400}}>
                — Pega el link normal, lo convertimos automáticamente
              </span>
            </label>
            <input className="form-input" value={form.embedUrl}
              onChange={handleEmbedChange}
              placeholder="https://www.youtube.com/watch?v=XXXX  o  youtu.be/XXXX" />
            {embedPreview && (
              <div style={{ marginTop:10, borderRadius:'var(--radius-lg)', overflow:'hidden', background:'#000', aspectRatio:'16/9' }}>
                <iframe
                  src={embedPreview}
                  width="100%" height="100%"
                  style={{ border:'none', display:'block', width:'100%', aspectRatio:'16/9' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Vista previa YouTube"
                />
              </div>
            )}
            {!embedPreview && (
              <div style={{ marginTop:6, padding:'10px 12px', background:'rgba(255,255,255,0.03)', border:'1px solid var(--adm-border)', borderRadius:'var(--radius)', fontSize:12, color:'var(--adm-muted)' }}>
                💡 Formatos aceptados: youtube.com/watch?v=ID · youtu.be/ID · youtube.com/live/ID · youtube.com/shorts/ID
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">O subir archivo de video</label>
            <input type="file" accept="video/*" className="form-input"
              onChange={e => set('video', e.target.files[0])} />
            <span style={{ fontSize:11, color:'var(--adm-muted)' }}>Solo si no usas YouTube. Máx. 500MB.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-input" value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Descripción del video" rows={4} />
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sideCol}>
          <div className={styles.sideCard}>

            {/* PUBLISHED */}
            <div>
              <div className={styles.toggleRow}
                onClick={() => set('published', !form.published)}
                style={{ borderColor: form.published ? 'var(--red)' : undefined }}>
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
                    {form.published ? 'Visible en el sitio' : 'Solo en el admin'}
                  </div>
                </div>
                <div className={`${styles.toggle} ${form.published ? styles.toggleOn : ''}`} />
              </div>
              {!form.published && (
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8, padding:'8px 10px', background:'rgba(255,200,0,0.06)', border:'1px solid rgba(255,200,0,0.2)', borderRadius:'var(--radius)' }}>
                  <AlertCircle size={13} color="#FFD000" />
                  <span style={{ fontSize:11, color:'#c8a800' }}>Este video NO se verá en el sitio hasta que lo publiques</span>
                </div>
              )}
            </div>

            {/* FEATURED */}
            <div className={styles.toggleRow} onClick={() => set('featured', !form.featured)}>
              <div className={styles.toggleIcon}>
                <Star size={16} color={form.featured ? 'var(--accent)' : undefined} fill={form.featured ? 'var(--accent)' : 'none'} />
              </div>
              <div>
                <div className={styles.toggleLabel}>{form.featured ? '⭐ Destacado' : 'No destacado'}</div>
                <div className={styles.toggleSub}>{form.featured ? 'Aparece en el inicio' : 'Video regular'}</div>
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

            <div className="form-group">
              <label className="form-label">Nombre del programa</label>
              <input className="form-input" value={form.program}
                onChange={e => set('program', e.target.value)}
                placeholder="Ej: Noticiero Central" />
            </div>

            <div className="form-group">
              <label className="form-label">Duración</label>
              <input className="form-input" value={form.duration}
                onChange={e => set('duration', e.target.value)}
                placeholder="28:00" />
            </div>

            {/* Miniatura */}
            <div className="form-group">
              <label className="form-label">Miniatura
                {youtubeThumb && !thumbPreview && <span style={{fontSize:10,color:'var(--green)',marginLeft:6,fontFamily:'var(--font-body)',textTransform:'none',letterSpacing:0}}>✓ Auto-detectada de YouTube</span>}
              </label>
              <label className={styles.uploadArea}>
                {displayThumb
                  ? <img src={displayThumb} alt="" className={styles.imgPreview} />
                  : <div className={styles.uploadPlaceholder}>
                      <Upload size={20} /><span>Subir miniatura</span>
                      <small>O se usará la de YouTube</small>
                    </div>
                }
                <input type="file" accept="image/*"
                  onChange={e => {
                    const f = e.target.files[0];
                    if (f) { set('thumbnail', f); setThumbPreview(URL.createObjectURL(f)); }
                  }}
                  style={{ display:'none' }} />
              </label>
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
              {loading ? 'Guardando…' : (isEdit ? '✓ Actualizar video' : '✓ Publicar video')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
