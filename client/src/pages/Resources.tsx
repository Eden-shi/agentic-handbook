import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [cat, setCat] = useState('全部');

  useEffect(() => { api.get('/resources').then(r => setResources(r.data)); }, []);
  const cats = ['全部', ...Array.from(new Set(resources.map(r => r.category)))];
  const filtered = cat === '全部' ? resources : resources.filter(r => r.category === cat);

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">资料库</span></div>
      <div className="page-header">
        <h2>资料库</h2>
        <p>按分类浏览学习资料，按需查阅。</p>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} className={`check-btn ${cat === c ? 'done' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {filtered.map((r: any) => (
        <div key={r.id} className="list-item">
          <div className="info">
            <div className="title">{r.title}</div>
            <div className="desc">{r.description}</div>
          </div>
          <span className="badge badge-gray">{r.type}</span>
          <span className="badge badge-green">{r.category}</span>
        </div>
      ))}
    </div>
  );
}
