import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './hooks/useAuthStore.js';

import PublicLayout from './components/layout/PublicLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import NewsPage from './pages/NewsPage.jsx';
import NewsDetailPage from './pages/NewsDetailPage.jsx';
import VideosPage from './pages/VideosPage.jsx';
import VideoDetailPage from './pages/VideoDetailPage.jsx';
import ProgramsPage from './pages/ProgramsPage.jsx';
import LivePage from './pages/LivePage.jsx';
import ContactPage from './pages/ContactPage.jsx';

import AdminLayout from './components/layout/AdminLayout.jsx';
import LoginPage from './pages/admin/LoginPage.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import AdminNewsPage from './pages/admin/AdminNewsPage.jsx';
import AdminNewsForm from './pages/admin/AdminNewsForm.jsx';
import AdminVideosPage from './pages/admin/AdminVideosPage.jsx';
import AdminVideoForm from './pages/admin/AdminVideoForm.jsx';
import AdminProgramsPage from './pages/admin/AdminProgramsPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminLivePage from './pages/admin/AdminLivePage.jsx';
import AdminContactsPage from './pages/admin/AdminContactsPage.jsx';

function ProtectedRoute({ children }) {
  const { token, initialized } = useAuthStore();
  if (!initialized) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'var(--muted)'}}>Cargando…</div>;
  return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  const { fetchMe } = useAuthStore();
  useEffect(() => { fetchMe(); }, []);
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181E', color: '#F0F0F2', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="noticias" element={<NewsPage />} />
          <Route path="noticias/:slug" element={<NewsDetailPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="videos/:id" element={<VideoDetailPage />} />
          <Route path="programacion" element={<ProgramsPage />} />
          <Route path="en-vivo" element={<LivePage />} />
          <Route path="contacto" element={<ContactPage />} />
        </Route>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="noticias" element={<AdminNewsPage />} />
          <Route path="noticias/nueva" element={<AdminNewsForm />} />
          <Route path="noticias/:id/editar" element={<AdminNewsForm />} />
          <Route path="videos" element={<AdminVideosPage />} />
          <Route path="videos/nuevo" element={<AdminVideoForm />} />
          <Route path="videos/:id/editar" element={<AdminVideoForm />} />
          <Route path="programacion" element={<AdminProgramsPage />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="en-vivo" element={<AdminLivePage />} />
          <Route path="contactos" element={<AdminContactsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
