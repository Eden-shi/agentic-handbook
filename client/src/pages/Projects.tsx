import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data));
    if (user) {
      api.get('/my-progress').then(r => {
        const map: Record<string, boolean> = {};
        r.data.filter((p: any) => p.itemType === 'project').forEach((p: any) => { map[p.itemId] = p.isCompleted; });
        setProgress(map);
      });
    }
  }, [user]);

  const toggle = async (id: string) => {
    if (!user) { alert('请先登录'); return; }
    const newVal = !progress[id];
    await api.post('/progress', { itemType: 'project', itemId: id, isCompleted: newVal });
    setProgress({ ...progress, [id]: newVal });
  };

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">应用实践路线</span></div>
      <div className="page-header">
        <h2>应用实践路线</h2>
        <p>9 个实践项目，含主线与专项，用可验收的成果巩固所学。</p>
      </div>
      {projects.map((p: any) => (
        <div key={p.id} className="list-item" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
          <div className="num">{String(p.projectNumber).padStart(2, '0')}</div>
          <div className="info">
            <div className="title">{p.title}</div>
            <div className="desc">{p.category} · {p.difficulty} · 预计 {p.duration}</div>
            {expanded === p.id && (
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {p.prerequisites?.length > 0 && <p><strong>前置：</strong>{p.prerequisites.join('、')}</p>}
                {p.deliverables?.length > 0 && <p style={{ marginTop: 6 }}><strong>交付物：</strong>{p.deliverables.join('、')}</p>}
              </div>
            )}
          </div>
          <span className={`badge ${p.category === '主线' ? 'badge-green' : 'badge-gray'}`}>{p.category}</span>
          <button className={`check-btn ${progress[p.id] ? 'done' : ''}`} onClick={(e) => { e.stopPropagation(); toggle(p.id); }}>
            {progress[p.id] ? '✓ 已完成' : '标记完成'}
          </button>
        </div>
      ))}
    </div>
  );
}
