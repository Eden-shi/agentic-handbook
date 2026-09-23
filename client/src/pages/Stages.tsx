import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Stages() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [stages, setStages] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.get('/stages').then(r => setStages(r.data));
    if (user) {
      api.get('/my-progress').then(r => {
        const map: Record<string, boolean> = {};
        r.data.filter((p: any) => p.itemType === 'stage').forEach((p: any) => { map[p.itemId] = p.isCompleted; });
        setProgress(map);
      });
    }
  }, [user]);

  const toggle = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) { nav('/login'); return; }
    const newVal = !progress[id];
    await api.post('/progress', { itemType: 'stage', itemId: id, isCompleted: newVal });
    setProgress({ ...progress, [id]: newVal });
  };

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">基础学习路线</span></div>
      <div className="page-header">
        <h2>基础学习路线</h2>
        <p>7 个阶段，从核心概念到评测上线，按顺序推进。点击阶段查看详细内容。</p>
      </div>
      {stages.map((s: any, idx: number) => (
        <div key={s.id} className="list-item" onClick={() => nav(`/stages/${s.id}`)}>
          <div className="num">{String(s.stageNumber).padStart(2, '0')}</div>
          <div className="info">
            <div className="title">{s.title}</div>
            <div className="desc">{s.subtitle}</div>
          </div>
          {idx < stages.length - 1 && !progress[s.id] && <span style={{ color: 'var(--text-secondary)', fontSize: 20 }}>→</span>}
          <span className={`badge ${progress[s.id] ? 'badge-green' : 'badge-gray'}`}>{progress[s.id] ? '✓ 已完成' : '未开始'}</span>
          <button className={`check-btn ${progress[s.id] ? 'done' : ''}`} onClick={(e) => toggle(e, s.id)}>
            {progress[s.id] ? '✓' : '标记完成'}
          </button>
        </div>
      ))}
    </div>
  );
}
