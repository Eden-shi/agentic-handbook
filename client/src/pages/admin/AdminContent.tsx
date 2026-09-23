import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminContent() {
  const [stages, setStages] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => api.get('/admin/stages').then(r => setStages(r.data));

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (isNew) {
      await api.post('/admin/stages', editing);
    } else {
      await api.put(`/admin/stages/${editing.id}`, editing);
    }
    setEditing(null);
    setIsNew(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('确定删除这个模块？')) return;
    await api.delete(`/admin/stages/${id}`);
    load();
  };

  const newStage = () => {
    setEditing({ stageNumber: stages.length + 1, title: '', subtitle: '', description: '', content: '', duration: '' });
    setIsNew(true);
  };

  if (editing) {
    const inputStyle = {
      width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
      borderRadius: '10px', fontSize: '14px', outline: 'none',
    };
    return (
      <div>
        <div className="breadcrumb">工作台 <span>/</span> <span onClick={() => setEditing(null)} style={{ cursor: 'pointer' }}>内容管理</span> <span>/</span> <span className="current">{isNew ? '新增模块' : '编辑模块'}</span></div>
        <div className="page-header">
          <h2>{isNew ? '新增课程模块' : '编辑课程模块'}</h2>
        </div>
        <div className="card" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>模块序号</label>
            <input style={inputStyle} type="number" value={editing.stageNumber} onChange={e => setEditing({ ...editing, stageNumber: parseInt(e.target.value) })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>标题</label>
            <input style={inputStyle} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>副标题</label>
            <input style={inputStyle} value={editing.subtitle || ''} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>描述</label>
            <textarea style={{ ...inputStyle, minHeight: '60px' }} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>时长</label>
            <input style={inputStyle} value={editing.duration || ''} onChange={e => setEditing({ ...editing, duration: e.target.value })} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>内容 (Markdown)</label>
            <textarea style={{ ...inputStyle, minHeight: '400px', fontFamily: 'monospace', fontSize: '13px' }} value={editing.content || ''} onChange={e => setEditing({ ...editing, content: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="check-btn done" onClick={save}>保存</button>
            <button className="check-btn" onClick={() => { setEditing(null); setIsNew(false); }}>取消</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">内容管理</span></div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>内容管理 - 课程模块</h2>
          <p>共 {stages.length} 个模块</p>
        </div>
        <button className="check-btn done" onClick={newStage}>+ 新增模块</button>
      </div>

      {stages.map(s => (
        <div key={s.id} className="list-item">
          <div className="num">{String(s.stageNumber).padStart(2, '0')}</div>
          <div className="info">
            <div className="title">{s.title}</div>
            <div className="desc">{s.subtitle} · {s.duration}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="check-btn" onClick={() => setEditing(s)}>编辑</button>
            <button className="check-btn" style={{ color: '#dc2626' }} onClick={() => del(s.id)}>删除</button>
          </div>
        </div>
      ))}
    </div>
  );
}
