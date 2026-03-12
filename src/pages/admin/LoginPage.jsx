import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv } from 'lucide-react';
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
        <div className={styles.logo}>
          <div className={styles.logoMark}><Tv size={20} /></div>
          <div>
            <div className={styles.logoText}>Canal 7</div>
            <div className={styles.logoSub}>Panel de Administración</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@canal7.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
