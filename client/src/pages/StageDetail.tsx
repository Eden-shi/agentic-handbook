import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function StageDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [stage, setStage] = useState<any>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/stages/${id}`).then(r => setStage(r.data));
      if (user) {
        api.get('/my-progress').then(r => {
          const p = r.data.find((x: any) => x.itemType === 'stage' && x.itemId === id);
          setDone(p?.isCompleted || false);
        });
      }
    }
  }, [id, user]);

  const toggle = async () => {
    if (!user) { nav('/login'); return; }
    const newVal = !done;
    await api.post('/progress', { itemType: 'stage', itemId: id, isCompleted: newVal });
    setDone(newVal);
  };

  if (!stage) return <div className="card">加载中...</div>;

  return (
    <div>
      <div className="breadcrumb">
        <span style={{ cursor: 'pointer' }} onClick={() => nav('/stages')}>基础学习路线</span>
        <span>/</span> <span className="current">{stage.title}</span>
      </div>
      <div className="page-header">
        <div className="step-num">阶段 {String(stage.stageNumber).padStart(2, '0')}</div>
        <h2>{stage.title}</h2>
        <p>{stage.subtitle} · 预计 {stage.duration}</p>
      </div>
      <div className="card" style={{ fontSize: 15, lineHeight: 1.9 }}>
        <div style={{ whiteSpace: 'pre-wrap' }}>{stage.content}</div>
        {stage.topics?.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <strong>学习要点：</strong>
            {stage.topics.map((t: string, i: number) => (
              <span key={i} className="badge badge-green" style={{ marginLeft: 8 }}>{t}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className={`check-btn ${done ? 'done' : ''}`} onClick={toggle} style={{ padding: '12px 28px', fontSize: 14 }}>
          {done ? '✓ 已完成' : '标记为已完成'}
        </button>
        <button className="check-btn" onClick={() => nav('/stages')} style={{ padding: '12px 28px', fontSize: 14 }}>返回列表</button>
      </div>
    </div>
  );
}
