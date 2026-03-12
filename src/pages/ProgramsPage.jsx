import { useEffect, useState } from 'react';
import { programApi } from '../services/api.js';
import { CalendarDays, Clock, ArrowRight, Tv } from 'lucide-react';
import styles from './ProgramsPage.module.css';

const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

const DAY_LABELS = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

// JS getDay(): 0=domingo, 1=lunes...
const JS_DAY_MAP = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

function safeParseDays(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeCategory(category) {
  return String(category || '').trim() || 'General';
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [activeDay, setActiveDay] = useState(() => JS_DAY_MAP[new Date().getDay()]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    programApi
      .getAll()
      .then((r) => {
        const normalized = (r.data || []).map((p) => ({
          ...p,
          days: safeParseDays(p.days),
        }));
        setPrograms(normalized);
      })
      .catch((err) => setError(err.message || 'No se pudo cargar la programación.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs
    .filter((p) => p.days && p.days.some((d) => String(d).toLowerCase() === activeDay))
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  return (
    <div className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <span className={styles.heroBadge}>
            <CalendarDays size={14} />
            Programación oficial
          </span>

          <h1 className={styles.heroTitle}>Programación de Visión Sur Televisión 12.1</h1>

          <p className={styles.heroText}>
            Consulta los horarios de nuestros programas y revisa la parrilla diaria de la
            señal. Encuentra fácilmente qué se transmite cada día de la semana.
          </p>
        </section>

        <section className={styles.filtersSection}>
          <div className={styles.days}>
            {DAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setActiveDay(d)}
                className={`${styles.dayBtn} ${activeDay === d ? styles.dayActive : ''}`}
              >
                {DAY_LABELS[d]}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className={styles.stateBox}>
            <div className={styles.stateIcon}>
              <Tv size={34} />
            </div>
            <p className={styles.stateTitle}>Cargando programación…</p>
            <span className={styles.stateText}>
              Estamos preparando la grilla de contenidos del día.
            </span>
          </div>
        )}

        {error && (
          <div className={styles.stateBox}>
            <div className={styles.stateEmoji}>⚠️</div>
            <p className={styles.stateTitle}>Ocurrió un problema al cargar la programación</p>
            <span className={styles.stateText}>{error}</span>
            <span className={styles.stateHint}>
              Verifica que el backend esté disponible y que el servicio responda correctamente.
            </span>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className={styles.stateBox}>
            <div className={styles.stateEmoji}>📺</div>
            <p className={styles.stateTitle}>
              No hay programas configurados para el {DAY_LABELS[activeDay]}.
            </p>

            <span className={styles.stateText}>
              Aún no se registraron espacios en la parrilla para este día.
            </span>

            {programs.length === 0 && (
              <p className={styles.adminHint}>
                ¿Eres administrador? Agrégalos desde{' '}
                <a href="/admin/programacion" className={styles.adminLink}>
                  Panel Admin → Programación <ArrowRight size={13} />
                </a>
                .
              </p>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <section className={styles.timelineSection}>
            <div className={styles.timelineHeader}>
              <div>
                <span className={styles.timelineKicker}>Día seleccionado</span>
                <h2 className={styles.timelineTitle}>{DAY_LABELS[activeDay]}</h2>
              </div>

              <div className={styles.timelineCount}>
                {filtered.length} programa{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className={styles.timeline}>
              {filtered.map((p) => (
                <article key={p.id} className={styles.programRow}>
                  <div className={styles.timeBlock}>
                    <div className={styles.time}>{p.startTime}</div>
                    <span className={styles.timeEnd}>{p.endTime}</span>
                  </div>

                  <div className={styles.lineColumn}>
                    <div className={styles.dot} />
                    <div className={styles.line} />
                  </div>

                  <div className={styles.programCard}>
                    <div className={styles.programTop}>
                      <span className={styles.programCategory}>
                        {normalizeCategory(p.category)}
                      </span>
                    </div>

                    <h3 className={styles.programName}>{p.name}</h3>

                    {p.description && (
                      <p className={styles.programDesc}>{p.description}</p>
                    )}

                    <div className={styles.programMeta}>
                      <span className={styles.programMetaItem}>
                        <Clock size={12} />
                        {p.startTime} - {p.endTime}
                      </span>

                      <span className={styles.programMetaItem}>
                        <CalendarDays size={12} />
                        {DAY_LABELS[activeDay]}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}