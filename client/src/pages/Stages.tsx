import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Stages() {
  const { user } = useAuth();
  const [stages, setStages] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const toggle = async (id: string) => {
    if (!user) { alert('请先登录'); return; }
    const newVal = !progress[id];
    await api.post('/progress', { itemType: 'stage', itemId: id, isCompleted: newVal });
    setProgress({ ...progress, [id]: newVal });
  };

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">基础学习路线</span></div>
      <div className="page-header">
        <h2>基础学习路线</h2>
        <p>7 个阶段，从核心概念到评测上线，按顺序推进。</p>
      </div>
      {stages.map((s: any) => (
        <div key={s.id} className="list-item" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
          <div className="num">{String(s.stageNumber).padStart(2, '0')}</div>
          <div className="info">
            <div className="title">{s.title}</div>
            <div className="desc">{s.subtitle} · 预计 {s.duration}</div>
            {expanded === s.id && (
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <p style={{ marginBottom: 8 }}>{s.description}</p>
                {s.topics?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <strong>学习要点：</strong>
                    {s.topics.map((t: string, i: number) => (
                      <span key={i} className="badge badge-gray" style={{ marginRight: 6 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <span className={`badge ${progress[s.id] ? 'badge-green' : 'badge-gray'}`}>{progress[s.id] ? '已完成' : '未完成'}</span>
          <button className={`check-btn ${progress[s.id] ? 'done' : ''}`} onClick={(e) => { e.stopPropagation(); toggle(s.id); }}>
            {progress[s.id] ? '✓ 已完成' : '标记完成'}
          </button>
        </div>
      ))}
    </div>
  );
}
