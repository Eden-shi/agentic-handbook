import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Experiments() {
  const [exps, setExps] = useState<any[]>([]);
  useEffect(() => { api.get('/experiments').then(r => setExps(r.data)); }, []);

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">示例实验</span></div>
      <div className="page-header">
        <h2>示例实验</h2>
        <p>动手做小实验，验证学到的概念。</p>
      </div>
      {exps.map((e: any) => (
        <div key={e.id} className="list-item">
          <div className="num">{String(e.expNumber).padStart(2, '0')}</div>
          <div className="info">
            <div className="title">{e.title}</div>
            <div className="desc">{e.description}</div>
          </div>
          <span className="badge badge-gray">{e.difficulty}</span>
          <span className="badge badge-green">{e.category}</span>
        </div>
      ))}
    </div>
  );
}
