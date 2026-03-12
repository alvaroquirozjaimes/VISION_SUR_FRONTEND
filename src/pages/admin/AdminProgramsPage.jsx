import { useEffect, useState } from 'react';
import { programApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, X, Check } from 'lucide-react';
import styles from './AdminTable.module.css';

const DAYS_ALL = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DAYS_LABELS = {
  lunes: 'Lun',
  martes: 'Mar',
  miercoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
  sabado: 'Sáb',
  domingo: 'Dom',
};
const CATS = ['noticiero', 'entretenimiento', 'deportes', 'cultura', 'especial'];
const EMPTY = {
  name: '',
  description: '',
  category: 'entretenimiento',
  startTime: '08:00',
  endTime: '09:00',
  days: [],
  order: 0,
  active: true,
};

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () =>
    programApi
      .getAllAdmin()
      .then((r) => setPrograms(r.data))
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleDay = (d) =>
    set(
      'days',
      form.days.includes(d)
        ? form.days.filter((x) => x !== d)
        : [...form.days, d]
    );

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      category: p.category,
      startTime: p.startTime,
      endTime: p.endTime,
      days: p.days || [],
      order: p.order || 0,
      active: p.active,
    });
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
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description || '');
      fd.append('category', form.category);
      fd.append('startTime', form.startTime);
      fd.append('endTime', form.endTime);
      fd.append('order', String(form.order || 0));
      fd.append('active', String(form.active));
      fd.append('days', JSON.stringify(form.days));

      if (editId) {
        await programApi.update(editId, fd);
        toast.success('Programa actualizado');
      } else {
        await programApi.create(fd);
        toast.success('Programa creado');
      }

      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await programApi.delete(id);
      toast.success('Eliminado');
      load();
    } catch {
      toast.error('Error');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Programación</h1>
        <div className={styles.pageHeaderActions}>
          <button className={styles.primaryBtn} onClick={startNew}>
            <Plus size={14} />
            Nuevo programa
          </button>
        </div>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {editId ? 'Editar Programa' : 'Nuevo Programa'}
            </h2>

            <button
              onClick={() => setShowForm(false)}
              className={styles.iconBtn}
              type="button"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.formGridTwo}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.formLabel}>Nombre del programa *</label>
              <input
                className={styles.formInput}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                required
                placeholder="Ej: Noticiero Central"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Categoría</label>
              <select
                className={styles.formInput}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Descripción <span className={styles.formHint}>(opcional)</span>
              </label>
              <input
                className={styles.formInput}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Breve descripción del programa"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Hora de inicio</label>
              <input
                className={styles.formInput}
                type="time"
                value={form.startTime}
                onChange={(e) => set('startTime', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Hora de fin</label>
              <input
                className={styles.formInput}
                type="time"
                value={form.endTime}
                onChange={(e) => set('endTime', e.target.value)}
                required
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.formLabel}>
                Días de emisión <span className={styles.formHint}>(uno o más)</span>
              </label>

              <div className={styles.dayList}>
                {DAYS_ALL.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={`${styles.dayBtn} ${
                      form.days.includes(d) ? styles.dayBtnActive : ''
                    }`}
                  >
                    {DAYS_LABELS[d]}
                  </button>
                ))}
              </div>

              {form.days.length === 0 && (
                <span className={styles.errorText}>
                  Debes seleccionar al menos un día
                </span>
              )}
            </div>

            <div className={`${styles.fullWidth} ${styles.checkRow}`}>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => set('active', e.target.checked)}
                />
                Programa activo (visible en la programación pública)
              </label>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={loading || form.days.length === 0}
              >
                {loading ? 'Guardando…' : (
                  <>
                    <Check size={14} />
                    {editId ? 'Actualizar' : 'Crear programa'}
                  </>
                )}
              </button>

              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

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
            {programs.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No hay programas. Crea el primero.
                </td>
              </tr>
            ) : (
              programs.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className={styles.truncate}>{p.name}</span>
                  </td>

                  <td>
                    <span className={`${styles.badge} ${styles.badgeBlue}`}>
                      {p.category}
                    </span>
                  </td>

                  <td>
                    <span className={styles.valueHighlight}>
                      {p.startTime} — {p.endTime}
                    </span>
                  </td>

                  <td>
                    <span className={styles.mutedText}>
                      {p.days?.map((d) => DAYS_LABELS[d] || d).join(', ') || '—'}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`${styles.badge} ${
                        p.active ? styles.badgeGreen : styles.badgeGray
                      }`}
                    >
                      {p.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => startEdit(p)}
                        className={styles.editBtn}
                        type="button"
                      >
                        <Edit size={12} />
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(p.id, p.name)}
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