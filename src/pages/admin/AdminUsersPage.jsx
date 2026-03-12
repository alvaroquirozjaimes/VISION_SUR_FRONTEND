import { useEffect, useState } from 'react';
import { userApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, X, Check } from 'lucide-react';
import styles from './AdminTable.module.css';

const EMPTY = { name:'', email:'', password:'', role:'editor' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () => userApi.getAll().then(r => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const startEdit = (u) => { setEditId(u.id); setForm({ ...u, password:'' }); setShowForm(true); };
  const startNew = () => { setEditId(null); setForm(EMPTY); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = { ...form };
      if (!data.password) delete data.password;
      if (editId) { await userApi.update(editId, data); toast.success('Actualizado'); }
      else { await userApi.create(data); toast.success('Creado'); }
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar a "${name}"?`)) return;
    try { await userApi.delete(id); toast.success('Eliminado'); load(); } catch { toast.error('Error'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Usuarios</h1>
        <button className="btn btn-primary btn-sm" onClick={startNew}><Plus size={14} /> Nuevo Usuario</button>
      </div>

      {showForm && (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24, marginBottom:24, maxWidth:480 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18 }}>{editId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <button className="btn-icon" onClick={() => setShowForm(false)}><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="form-group"><label className="form-label">Nombre</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">{editId ? 'Nueva Contraseña (vacío = sin cambio)' : 'Contraseña *'}</label><input className="form-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} required={!editId} /></div>
            <div className="form-group"><label className="form-label">Rol</label>
              <select className="form-input" value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="editor">Editor</option><option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent:'center' }}>{loading ? 'Guardando…' : <><Check size={14} /> Guardar</>}</button>
          </form>
        </div>
      )}

      <div style={{ overflowX:'auto' }}>
        <table className={styles.table}>
          <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Registrado</th><th>Acciones</th></tr></thead>
          <tbody>
            {users.length === 0 ? <tr><td colSpan={5} className={styles.empty}>No hay usuarios</td></tr> :
              users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td style={{ fontSize:13, color:'var(--text2)' }}>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-red' : 'badge-dark'}`}>{u.role}</span></td>
                  <td style={{ fontSize:12, color:'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString('es')}</td>
                  <td><div className={styles.actions}>
                    <button onClick={() => startEdit(u)} className={styles.editBtn}><Edit size={12} /></button>
                    <button onClick={() => handleDelete(u.id, u.name)} className={styles.deleteBtn}><Trash2 size={12} /></button>
                  </div></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
