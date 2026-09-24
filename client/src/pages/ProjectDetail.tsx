import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/projects/${id}`).then(r => setProject(r.data));
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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown>
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
      <div style={{ display: 'flex', gap: 12 }}>
        <button className={`check-btn ${done ? 'done' : ''}`} onClick={toggle} style={{ padding: '12px 28px', fontSize: 14 }}>
          {done ? '✓ 已完成' : '标记为已完成'}
        </button>
        <button className="check-btn" onClick={() => nav('/projects')} style={{ padding: '12px 28px', fontSize: 14 }}>返回列表</button>
      </div>
    </div>
  );
}
