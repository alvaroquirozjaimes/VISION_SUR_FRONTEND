import { useEffect, useState } from 'react';
import { programApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, X, Check } from 'lucide-react';
import styles from './AdminTable.module.css';

const DAYS_ALL = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
const DAYS_LABELS = { lunes:'Lun', martes:'Mar', miercoles:'Mié', jueves:'Jue', viernes:'Vie', sabado:'Sáb', domingo:'Dom' };
const CATS = ['noticiero','entretenimiento','deportes','cultura','especial'];
const EMPTY = { name:'', description:'', category:'entretenimiento', startTime:'08:00', endTime:'09:00', days:[], order:0, active:true };

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () => programApi.getAllAdmin().then(r => setPrograms(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleDay = (d) => set('days', form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d]);

  const startEdit = (p) => { setEditId(p.id); setForm({ name: p.name, description: p.description||'', category: p.category, startTime: p.startTime, endTime: p.endTime, days: p.days||[], order: p.order||0, active: p.active }); setShowForm(true); };
  const startNew = () => { setEditId(null); setForm(EMPTY); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description || '');
      fd.append('category', form.category);
      fd.append('startTime', form.startTime);
      fd.append('endTime', form.endTime);
      fd.append('order', String(form.order || 0));
      fd.append('active', String(form.active));
      fd.append('days', JSON.stringify(form.days));
      if (editId) { await programApi.update(editId, fd); toast.success('Programa actualizado'); }
      else { await programApi.create(fd); toast.success('Programa creado'); }
      setShowForm(false); load();
    } catch(err) { toast.error(err.response?.data?.error || 'Error al guardar'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try { await programApi.delete(id); toast.success('Eliminado'); load(); } catch { toast.error('Error'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Programación</h1>
        <button className="btn btn-primary btn-sm" onClick={startNew}><Plus size={14}/> Nuevo Programa</button>
      </div>

      {showForm && (
        <div style={{ background:'var(--adm-bg2)', border:'1px solid var(--adm-border)', borderRadius:'var(--radius-lg)', padding:24, marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--adm-text)' }}>
              {editId ? 'Editar Programa' : 'Nuevo Programa'}
            </h2>
            <button onClick={() => setShowForm(false)} style={{ background:'none', border:'1px solid var(--adm-border)', borderRadius:'var(--radius)', color:'var(--adm-muted)', padding:'6px 8px', display:'flex' }}><X size={14}/></button>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {/* Nombre */}
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label className="form-label">Nombre del programa *</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Ej: Noticiero Central" />
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="form-label">Descripción <span style={{fontSize:10,opacity:.6,fontFamily:'var(--font-body)',textTransform:'none',letterSpacing:0}}>(opcional)</span></label>
              <input className="form-input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Breve descripción del programa" />
            </div>

            {/* Horario */}
            <div className="form-group">
              <label className="form-label">Hora de inicio</label>
              <input className="form-input" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Hora de fin</label>
              <input className="form-input" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} required />
            </div>

            {/* Días */}
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label className="form-label">Días de emisión <span style={{fontSize:10,opacity:.6,fontFamily:'var(--font-body)',textTransform:'none',letterSpacing:0}}>(selecciona uno o más)</span></label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:4 }}>
                {DAYS_ALL.map(d => (
                  <button type="button" key={d} onClick={() => toggleDay(d)} style={{
                    padding:'7px 14px', borderRadius:'20px', border:'1.5px solid', fontSize:12,
                    fontFamily:'var(--font-display)', fontWeight:700, letterSpacing:0.5, transition:'all .15s',
                    background: form.days.includes(d) ? 'var(--red)' : 'var(--adm-bg3)',
                    borderColor: form.days.includes(d) ? 'var(--red)' : 'var(--adm-border2)',
                    color: form.days.includes(d) ? '#fff' : 'var(--adm-text2)',
                    cursor:'pointer'
                  }}>
                    {DAYS_LABELS[d]}
                  </button>
                ))}
              </div>
              {form.days.length === 0 && (
                <span style={{ fontSize:11, color:'var(--red)', marginTop:4 }}>Debes seleccionar al menos un día</span>
              )}
            </div>

            {/* Activo */}
            <div style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', gap:10 }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:14, color:'var(--adm-text2)' }}>
                <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} style={{ width:16, height:16, accentColor:'var(--red)' }} />
                Programa activo (visible en la programación pública)
              </label>
            </div>

            {/* Botones */}
            <div style={{ gridColumn:'1/-1', display:'flex', gap:10 }}>
              <button type="submit" className="btn btn-primary" disabled={loading || form.days.length === 0} style={{ flex:1, justifyContent:'center' }}>
                {loading ? 'Guardando…' : <><Check size={14}/> {editId ? 'Actualizar' : 'Crear programa'}</>}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)} style={{ flex:'0 0 auto' }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Programa</th>
              <th>Categoría</th>
              <th>Horario</th>
              <th>Días</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0
              ? <tr><td colSpan={6} className={styles.empty}>No hay programas. Crea el primero →</td></tr>
              : programs.map(p => (
                <tr key={p.id}>
                  <td><span className={styles.truncate}>{p.name}</span></td>
                  <td><span className={`badge badge-category-${p.category}`}>{p.category}</span></td>
                  <td style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'var(--red)', whiteSpace:'nowrap', fontSize:14 }}>
                    {p.startTime} — {p.endTime}
                  </td>
                  <td style={{ fontSize:11, color:'var(--adm-muted)' }}>
                    {p.days?.map(d => DAYS_LABELS[d] || d).join(', ') || '—'}
                  </td>
                  <td>
                    <span className={`badge ${p.active ? 'badge-red' : 'badge-dark'}`}>{p.active ? 'Activo' : 'Inactivo'}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button onClick={() => startEdit(p)} className={styles.editBtn}><Edit size={12}/> Editar</button>
                      <button onClick={() => handleDelete(p.id, p.name)} className={styles.deleteBtn}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
