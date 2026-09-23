import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const load = () => { if (user) api.get('/notes').then(r => setNotes(r.data)); };
  useEffect(load, [user]);

  const newNote = () => { setEditing({}); setTitle(''); setContent(''); };
  const save = async () => {
    if (!title.trim()) return alert('请输入标题');
    if (editing?.id) {
      await api.put(`/notes/${editing.id}`, { title, content });
    } else {
      await api.post('/notes', { title, content });
    }
    setEditing(null); load();
  };
  const del = async (id: string) => { await api.delete(`/notes/${id}`); load(); };

  if (!user) return <div className="card">请先 <a href="/login" style={{ color: 'var(--accent)' }}>登录</a> 后查看学习笔记。</div>;

  if (editing !== null) {
    return (
      <div>
        <div className="breadcrumb">学习笔记 <span>/</span> <span className="current">{editing.id ? '编辑' : '新建'}</span></div>
        <div className="page-header"><h2>{editing.id ? '编辑笔记' : '新建笔记'}</h2></div>
        <div className="card">
          <input className="note-title-input" placeholder="笔记标题" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="note-editor" placeholder="写下你的学习心得、成果和未解决的问题..." value={content} onChange={e => setContent(e.target.value)} />
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={save}>保存</button>
            <button className="check-btn" onClick={() => setEditing(null)}>取消</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">学习笔记</span></div>
      <div className="page-header">
        <h2>学习笔记</h2>
        <p>记录你的学习心得、成果与未解决的问题。</p>
      </div>
      <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px', marginBottom: 20 }} onClick={newNote}>+ 新建笔记</button>
      {notes.map((n: any) => (
        <div key={n.id} className="list-item">
          <div className="info">
            <div className="title">{n.title}</div>
            <div className="desc">{n.content.substring(0, 100)}...</div>
          </div>
          <button className="check-btn" onClick={() => { setEditing(n); setTitle(n.title); setContent(n.content); }}>编辑</button>
          <button className="check-btn" style={{ color: '#dc2626' }} onClick={() => del(n.id)}>删除</button>
        </div>
      ))}
      {notes.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>还没有笔记，点击上方按钮新建一篇。</div>}
    </div>
  );
}
