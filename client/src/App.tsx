import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import Overview from './pages/Overview';
import Stages from './pages/Stages';
import Projects from './pages/Projects';
import Resources from './pages/Resources';
import Experiments from './pages/Experiments';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import About from './pages/About';
import Login from './pages/Login';
import StageDetail from './pages/StageDetail';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/admin/Admin';
import AdminUsers from './pages/admin/AdminUsers';
import AdminContent from './pages/admin/AdminContent';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Overview />} />
        <Route path="stages" element={<Stages />} />
        <Route path="stages/:id" element={<StageDetail />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="resources" element={<Resources />} />
        <Route path="experiments" element={<Experiments />} />
        <Route path="notes" element={<Notes />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
        <Route path="admin" element={<Admin />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/content" element={<AdminContent />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
