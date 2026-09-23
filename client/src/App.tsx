import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
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
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
