import { useEffect, useState } from 'react';
import { contactApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import { Trash2, Mail, Eye } from 'lucide-react';
import { format } from 'date-fns';
import styles from './AdminTable.module.css';

const STATUS_LABELS = { nuevo: 'Nuevo', leido: 'Leído', respondido: 'Respondido' };
const STATUS_COLORS = { nuevo: 'badge-red', leido: 'badge-dark', respondido: 'badge-accent' };
const SUBJECT_LABELS = { publicidad: 'Publicidad', prensa: 'Prensa', general: 'General', otro: 'Otro' };

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    contactApi.getAll(filter ? { status: filter } : {}).then(r => setContacts(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleStatus = async (id, status) => {
    try { await contactApi.updateStatus(id, status); toast.success('Estado actualizado'); load(); }
    catch { toast.error('Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar mensaje?')) return;
    try { await contactApi.delete(id); toast.success('Eliminado'); setSelected(null); load(); }
    catch { toast.error('Error'); }
  };

  const newCount = contacts.filter(c => c.status === 'nuevo').length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          Mensajes de Contacto
          {newCount > 0 && <span className="badge badge-red" style={{ marginLeft: 10, fontSize: 12 }}>{newCount} nuevos</span>}
        </h1>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['', 'nuevo', 'leido', 'respondido'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn btn-ghost btn-sm ${filter === s ? 'btn-primary' : ''}`}
            style={filter === s ? { background: 'var(--red)', color: '#fff', border: 'none' } : {}}>
            {s === '' ? 'Todos' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20, alignItems: 'start' }}>
        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead><tr><th>Nombre</th><th>Asunto</th><th>Empresa</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className={styles.loading}>Cargando…</td></tr> :
                contacts.length === 0 ? <tr><td colSpan={6} className={styles.empty}>No hay mensajes</td></tr> :
                contacts.map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => { setSelected(c); if (c.status === 'nuevo') handleStatus(c.id, 'leido'); }}>
                    <td>
                      <div style={{ fontWeight: c.status === 'nuevo' ? 600 : 400 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.email}</div>
                    </td>
                    <td><span className="badge badge-dark">{SUBJECT_LABELS[c.subject]}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{c.company || '—'}</td>
                    <td><span className={`badge ${STATUS_COLORS[c.status]}`}>{STATUS_LABELS[c.status]}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{format(new Date(c.createdAt), 'dd/MM/yy HH:mm')}</td>
                    <td><div className={styles.actions} onClick={e => e.stopPropagation()}>
                      <button onClick={() => setSelected(c)} className={styles.editBtn}><Eye size={12} /></button>
                      <button onClick={() => handleDelete(c.id)} className={styles.deleteBtn}><Trash2 size={12} /></button>
                    </div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{selected.name}</h3>
              <button className="btn-icon" onClick={() => setSelected(null)} style={{ fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div><span style={{ color: 'var(--muted)' }}>Email: </span><a href={`mailto:${selected.email}`} style={{ color: 'var(--red)' }}>{selected.email}</a></div>
              {selected.phone && <div><span style={{ color: 'var(--muted)' }}>Teléfono: </span>{selected.phone}</div>}
              {selected.company && <div><span style={{ color: 'var(--muted)' }}>Empresa: </span>{selected.company}</div>}
              <div><span style={{ color: 'var(--muted)' }}>Asunto: </span><span className="badge badge-dark">{SUBJECT_LABELS[selected.subject]}</span></div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                <div style={{ color: 'var(--muted)', marginBottom: 8, fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>Mensaje</div>
                <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>{selected.message}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <a href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject]} - Canal 7`}
                  className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  <Mail size={13} /> Responder
                </a>
                <button onClick={() => handleStatus(selected.id, 'respondido')} className="btn btn-ghost btn-sm">Marcar respondido</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
