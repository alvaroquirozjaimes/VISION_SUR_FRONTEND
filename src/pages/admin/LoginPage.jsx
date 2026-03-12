import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';
import useAuthStore from '../../hooks/useAuthStore.js';
import toast from 'react-hot-toast';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-scope ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardKicker}>Panel administrativo</span>
          <h1 className={styles.cardTitle}>Iniciar sesión</h1>
          <p className={styles.cardText}>
            Ingresa tus credenciales para acceder al panel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Correo electrónico</label>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                className={styles.formInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@visionsur.com"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Contraseña</label>
            <div className={styles.inputWrap}>
              <LockKeyhole size={16} className={styles.inputIcon} />
              <input
                className={styles.formInput}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={loading}
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}