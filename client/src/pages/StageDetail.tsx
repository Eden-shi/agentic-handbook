import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from '../components/Markdown';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function StageDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [stage, setStage] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/stages/${id}`).then(r => setStage(r.data));
      api.get('/stages').then(r => setStages(r.data));
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

  // 按stageNumber排序找下一章
  const sorted = [...stages].sort((a, b) => a.stageNumber - b.stageNumber);
  const idx = sorted.findIndex(s => String(s.stageNumber) === String(id));
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

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
        <div className="markdown-body">
          <Markdown>{stage.content}</Markdown>
        </div>
        {stage.topics?.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <strong>学习要点：</strong>
            {stage.topics.map((t: string, i: number) => (
              <span key={i} className="badge badge-green" style={{ marginLeft: 8 }}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作：上一章 / 完成 / 下一章 */}
      <div className="detail-nav">
        {idx > 0 ? (
          <button className="check-btn" onClick={() => nav(`/stages/${sorted[idx - 1].stageNumber}`)}>
            ← 上一章节
          </button>
        ) : <span style={{ flex: 1 }} />}
        <button className={`check-btn ${done ? 'done' : ''}`} onClick={toggle}>
          {done ? '✓ 已完成' : '标记完成'}
        </button>
        {next ? (
          <button className="btn-next" onClick={() => nav(`/stages/${next.stageNumber}`)}>
            下一章节：{next.title} →
          </button>
        ) : (
          <button className="btn-next" onClick={() => nav('/projects')}>
            全部学完，去做实践项目 →
          </button>
        )}
      </div>
    </div>
  );
}
