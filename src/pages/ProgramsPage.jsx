import { useEffect, useState } from 'react';
import { programApi } from '../services/api.js';
import styles from './ProgramsPage.module.css';

const DAYS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
const DAY_LABELS = {
  lunes:'Lunes', martes:'Martes', miercoles:'Miércoles',
  jueves:'Jueves', viernes:'Viernes', sabado:'Sábado', domingo:'Domingo'
};
// JS getDay(): 0=domingo, 1=lunes...
const JS_DAY_MAP = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [activeDay, setActiveDay] = useState(() => JS_DAY_MAP[new Date().getDay()]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    programApi.getAll()
      .then(r => {
        // Normalize days — might come as array or JSON string from backend
        const normalized = (r.data || []).map(p => ({
          ...p,
          days: Array.isArray(p.days)
            ? p.days
            : (typeof p.days === 'string' ? JSON.parse(p.days || '[]') : [])
        }));
        setPrograms(normalized);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs
    .filter(p => p.days && p.days.some(d => d.toLowerCase() === activeDay))
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <h1 className="section-title" style={{ marginBottom: 28 }}>Programación</h1>

      <div className={styles.days}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setActiveDay(d)}
            className={`${styles.dayBtn} ${activeDay === d ? styles.dayActive : ''}`}>
            {DAY_LABELS[d]}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ textAlign:'center', padding:'60px 0', color:'var(--pub-muted)', fontFamily:'var(--font-display)', letterSpacing:2 }}>
          Cargando programación…
        </p>
      )}

      {error && (
        <div style={{ textAlign:'center', padding:'40px 0' }}>
          <p style={{ color:'var(--red)', fontSize:14 }}>⚠ Error al cargar: {error}</p>
          <p style={{ color:'var(--pub-muted)', fontSize:13, marginTop:8 }}>
            Verifica que el backend esté corriendo en el puerto 4000.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0' }}>
          <p style={{ color:'var(--pub-muted)', fontSize:16 }}>
            No hay programas configurados para el {DAY_LABELS[activeDay]}.
          </p>
          {programs.length === 0 && (
            <p style={{ color:'var(--pub-muted)', fontSize:13, marginTop:12 }}>
              Agrega programas desde el <a href="/admin/programacion" style={{ color:'var(--red)' }}>Panel Admin → Programación</a>.
            </p>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className={styles.timeline}>
          {filtered.map(p => (
            <div key={p.id} className={styles.programRow}>
              <div className={styles.time}>
                {p.startTime}
                <span>{p.endTime}</span>
              </div>
              <div className={styles.dot} />
              <div className={styles.program}>
                <div className={styles.programName}>{p.name}</div>
                {p.description && <p className={styles.programDesc}>{p.description}</p>}
                <span className={`badge badge-category-${p.category}`}>{p.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
