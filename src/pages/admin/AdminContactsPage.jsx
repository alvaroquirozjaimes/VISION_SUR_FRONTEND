import { useEffect, useState } from 'react';
import { contactApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import { Trash2, Mail, Eye, X, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import styles from './AdminTable.module.css';

const STATUS_LABELS = { nuevo: 'Nuevo', leido: 'Leído', respondido: 'Respondido' };
const SUBJECT_LABELS = { publicidad: 'Publicidad', prensa: 'Prensa', general: 'General', otro: 'Otro' };

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    contactApi
      .getAll(filter ? { status: filter } : {})
      .then((r) => setContacts(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleStatus = async (id, status) => {
    try {
      await contactApi.updateStatus(id, status);
      toast.success('Estado actualizado');
      load();
    } catch {
      toast.error('Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar mensaje?')) return;
    try {
      await contactApi.delete(id);
      toast.success('Eliminado');
      setSelected(null);
      load();
    } catch {
      toast.error('Error');
    }
  };

  const newCount = contacts.filter((c) => c.status === 'nuevo').length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1 className={styles.pageTitle}>Mensajes de Contacto</h1>
          {newCount > 0 && (
            <span className={`${styles.badge} ${styles.badgeGold}`}>
              {newCount} nuevos
            </span>
          )}
        </div>
      </div>

      <div className={styles.filterBar}>
        {['', 'nuevo', 'leido', 'respondido'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`${styles.filterBtn} ${filter === s ? styles.filterBtnActive : ''}`}
            type="button"
          >
            {s === '' ? 'Todos' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className={styles.contactsLayout}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Asunto</th>
                <th>Empresa</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={styles.loading}>Cargando…</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>No hay mensajes</td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr
                    key={c.id}
                    className={styles.clickableRow}
                    onClick={() => {
                      setSelected(c);
                      if (c.status === 'nuevo') handleStatus(c.id, 'leido');
                    }}
                  >
                    <td>
                      <div className={styles.contactName}>{c.name}</div>
                      <div className={styles.mutedText}>{c.email}</div>
                    </td>

                    <td>
                      <span className={`${styles.badge} ${styles.badgeGray}`}>
                        {SUBJECT_LABELS[c.subject]}
                      </span>
                    </td>

                    <td>
                      <span className={styles.mutedText}>{c.company || '—'}</span>
                    </td>

                    <td>
                      <span
                        className={`${styles.badge} ${
                          c.status === 'nuevo'
                            ? styles.badgeGold
                            : c.status === 'respondido'
                            ? styles.badgeGreen
                            : styles.badgeGray
                        }`}
                      >
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>

                    <td>
                      <span className={styles.mutedText}>
                        {format(new Date(c.createdAt), 'dd/MM/yy HH:mm')}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelected(c)}
                          className={styles.editBtn}
                          type="button"
                        >
                          <Eye size={12} />
                        </button>

                        <button
                          onClick={() => handleDelete(c.id)}
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

        {selected && (
          <div className={styles.contactDetailCard}>
            <div className={styles.contactDetailHeader}>
              <h3 className={styles.formTitle}>{selected.name}</h3>
              <button
                className={styles.iconBtn}
                onClick={() => setSelected(null)}
                type="button"
              >
                <X size={14} />
              </button>
            </div>

            <div className={styles.contactDetailBody}>
              <div><span className={styles.detailLabel}>Email:</span> <a href={`mailto:${selected.email}`} className={styles.detailLink}>{selected.email}</a></div>
              {selected.phone && <div><span className={styles.detailLabel}>Teléfono:</span> {selected.phone}</div>}
              {selected.company && <div><span className={styles.detailLabel}>Empresa:</span> {selected.company}</div>}
              <div><span className={styles.detailLabel}>Asunto:</span> <span className={`${styles.badge} ${styles.badgeGray}`}>{SUBJECT_LABELS[selected.subject]}</span></div>

              <div className={styles.messageBox}>
                <div className={styles.messageTitle}>Mensaje</div>
                <p>{selected.message}</p>
              </div>

              <div className={styles.contactActions}>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject]} - Visión Sur`}
                  className={styles.primaryBtn}
                >
                  <Mail size={13} />
                  Responder
                </a>

                <button
                  onClick={() => handleStatus(selected.id, 'respondido')}
                  className={styles.secondaryBtn}
                  type="button"
                >
                  Marcar respondido
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}