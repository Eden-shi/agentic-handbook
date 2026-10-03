import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from '../components/Markdown';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/projects/${id}`).then(r => setProject(r.data));
      api.get('/projects').then(r => setProjects(r.data));
      if (user) {
        api.get('/my-progress').then(r => {
          const p = r.data.find((x: any) => x.itemType === 'project' && x.itemId === id);
          setDone(p?.isCompleted || false);
        });
      }
    }
  }, [id, user]);

  const toggle = async () => {
    if (!user) { nav('/login'); return; }
    const newVal = !done;
    await api.post('/progress', { itemType: 'project', itemId: id, isCompleted: newVal });
    setDone(newVal);
  };

  const sorted = [...projects].sort((a, b) => a.projectNumber - b.projectNumber);
  const idx = sorted.findIndex(p => String(p.projectNumber) === String(id));
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  if (!project) return <div className="card">加载中...</div>;

  return (
    <div>
      <div className="breadcrumb">
        <span style={{ cursor: 'pointer' }} onClick={() => nav('/projects')}>应用实践路线</span>
        <span>/</span> <span className="current">{project.title}</span>
      </div>
      <div className="page-header">
        <div className="step-num">项目 {String(project.projectNumber).padStart(2, '0')}</div>
        <h2>{project.title}</h2>
        <p>{project.category} · {project.difficulty} · 预计 {project.duration}</p>
      </div>
      <div className="card" style={{ fontSize: 15, lineHeight: 1.9 }}>
        <div className="markdown-body">
          <Markdown>{project.content}</Markdown>
        </div>
        {project.prerequisites?.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <strong>前置：</strong>
            {project.prerequisites.map((p: string, i: number) => (
              <span key={i} className="badge badge-gray" style={{ marginLeft: 8 }}>{p}</span>
            ))}
          </div>
        )}
        {project.deliverables?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <strong>交付物：</strong>
            {project.deliverables.map((d: string, i: number) => (
              <span key={i} className="badge badge-green" style={{ marginLeft: 8 }}>{d}</span>
            ))}
          </div>
        )}
      </div>
      <div className="detail-nav">
        {idx > 0 ? (
          <button className="check-btn" onClick={() => nav(`/projects/${sorted[idx - 1].projectNumber}`)}>
            ← 上一项目
          </button>
        ) : <span style={{ flex: 1 }} />}
        <button className={`check-btn ${done ? 'done' : ''}`} onClick={toggle}>
          {done ? '✓ 已完成' : '标记完成'}
        </button>
        {next ? (
          <button className="btn-next" onClick={() => nav(`/projects/${next.projectNumber}`)}>
            下一项目：{next.title} →
          </button>
        ) : (
          <button className="btn-next" onClick={() => nav('/stages')}>
            回到学习路线 →
          </button>
        )}
      </div>
    </div>
  );
}
