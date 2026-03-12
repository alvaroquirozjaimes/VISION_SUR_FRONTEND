import { useEffect, useState } from 'react';
import { userApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, X, Check } from 'lucide-react';
import styles from './AdminTable.module.css';

const EMPTY = { name: '', email: '', password: '', role: 'editor' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () =>
    userApi
      .getAll()
      .then((r) => setUsers(r.data))
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = (u) => {
    setEditId(u.id);
    setForm({ ...u, password: '' });
    setShowForm(true);
  };

  const startNew = () => {
    setEditId(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { ...form };
      if (!data.password) delete data.password;

      if (editId) {
        await userApi.update(editId, data);
        toast.success('Actualizado');
      } else {
        await userApi.create(data);
        toast.success('Creado');
      }

      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar a "${name}"?`)) return;
    try {
      await userApi.delete(id);
      toast.success('Eliminado');
      load();
    } catch {
      toast.error('Error');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Usuarios</h1>

        <div className={styles.pageHeaderActions}>
          <button className={styles.primaryBtn} onClick={startNew}>
            <Plus size={14} />
            Nuevo usuario
          </button>
        </div>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {editId ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>

            <button
              className={styles.iconBtn}
              onClick={() => setShowForm(false)}
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.formGridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nombre</label>
              <input
                className={styles.formInput}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                className={styles.formInput}
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {editId ? 'Nueva contraseña' : 'Contraseña *'}
                {editId && (
                  <span className={styles.formHint}> (vacío = sin cambio)</span>
                )}
              </label>
              <input
                className={styles.formInput}
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                required={!editId}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Rol</label>
              <select
                className={styles.formInput}
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryBtn} disabled={loading}>
                {loading ? 'Guardando…' : (
                  <>
                    <Check size={14} />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registrado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No hay usuarios
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>

                  <td>
                    <span className={styles.mutedText}>{u.email}</span>
                  </td>

                  <td>
                    <span
                      className={`${styles.badge} ${
                        u.role === 'admin' ? styles.badgeGold : styles.badgeGray
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td>
                    <span className={styles.mutedText}>
                      {new Date(u.createdAt).toLocaleDateString('es')}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => startEdit(u)}
                        className={styles.editBtn}
                        type="button"
                      >
                        <Edit size={12} />
                      </button>

                      <button
                        onClick={() => handleDelete(u.id, u.name)}
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
    </div>
  );
}