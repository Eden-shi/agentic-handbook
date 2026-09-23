import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Projects() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState('全部');

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

  const toggle = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) { nav('/login'); return; }
    const newVal = !progress[id];
    await api.post('/progress', { itemType: 'project', itemId: id, isCompleted: newVal });
    setProgress({ ...progress, [id]: newVal });
  };

  const filtered = filter === '全部' ? projects : projects.filter(p => p.category === filter);

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">应用实践路线</span></div>
      <div className="page-header">
        <h2>应用实践路线</h2>
        <p>9 个实践项目，含主线与专项，点击项目查看详细要求。</p>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        {['全部', '主线', '专项'].map(c => (
          <button key={c} className={`check-btn ${filter === c ? 'done' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      {filtered.map((p: any) => (
        <div key={p.id} className="list-item" onClick={() => nav(`/projects/${p.id}`)}>
          <div className="num">{String(p.projectNumber).padStart(2, '0')}</div>
          <div className="info">
            <div className="title">{p.title}</div>
            <div className="desc">{p.difficulty} · 预计 {p.duration}</div>
          </div>
          <span className={`badge ${p.category === '主线' ? 'badge-green' : 'badge-gray'}`}>{p.category}</span>
          <span className={`badge ${progress[p.id] ? 'badge-green' : 'badge-gray'}`}>{progress[p.id] ? '✓ 已完成' : '未开始'}</span>
          <button className={`check-btn ${progress[p.id] ? 'done' : ''}`} onClick={(e) => toggle(e, p.id)}>
            {progress[p.id] ? '✓' : '标记完成'}
          </button>
        </div>
      ))}
    </div>
  );
}
