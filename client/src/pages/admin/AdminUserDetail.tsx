import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function AdminUserDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'progress' | 'notes'>('progress');

  useEffect(() => {
    api.get('/admin/users').then(r => {
      const u = r.data.find((x: any) => x.id === id);
      setUser(u);
    });
    api.get(`/admin/users/${id}/progress`).then(r => setProgress(r.data));
    api.get(`/admin/users/${id}/notes`).then(r => setNotes(r.data));
  }, [id]);

  if (!user) return <div>加载中...</div>;

  const completed = progress.filter(p => p.isCompleted).length;

  return (
    <div>
      <div className="breadcrumb">
        <span onClick={() => nav('/admin/users')} style={{ cursor: 'pointer' }}>用户管理</span>
        <span>/</span>
        <span className="current">{user.username}</span>
      </div>

      {/* 用户信息卡片 */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '48px' }}>👤</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '4px' }}>{user.username}</h2>
            <p>{user.email}</p>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <span className={`badge ${user.role === 'admin' ? 'badge-green' : 'badge-gray'}`}>{user.role}</span>
              <span className={`badge ${user.banned ? 'badge-gray' : 'badge-green'}`}>{user.banned ? '已封禁' : '正常'}</span>
              <span className="badge badge-gray">注册于 {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setActiveTab('progress')}
          style={{
            padding: '10px 20px', border: 'none', background: 'none',
            fontSize: '14px', fontWeight: activeTab === 'progress' ? '700' : '500',
            color: activeTab === 'progress' ? 'var(--accent)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'progress' ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer', marginBottom: '-1px',
          }}
        >
          学习进度 ({progress.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          style={{
            padding: '10px 20px', border: 'none', background: 'none',
            fontSize: '14px', fontWeight: activeTab === 'notes' ? '700' : '500',
            color: activeTab === 'notes' ? 'var(--accent)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'notes' ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer', marginBottom: '-1px',
          }}
        >
          学习笔记 ({notes.length})
        </button>
      </div>

      {activeTab === 'progress' && (
        <>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>完成情况</div>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>
              {completed} <span style={{ fontSize: '16px', color: '#d1d5db' }}>/ {progress.length} 已完成</span>
            </div>
          </div>
          {progress.map(p => (
            <div key={p.id} className="list-item" style={{ cursor: 'default' }}>
              <div className="num" style={{ fontSize: '14px' }}>{p.isCompleted ? '✅' : '⬜'}</div>
              <div className="info">
                <div className="title">{p.itemType}</div>
                <div className="desc">{p.completedAt ? `完成于 ${new Date(p.completedAt).toLocaleString()}` : '未完成'}</div>
              </div>
            </div>
          ))}
          {progress.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>暂无学习进度记录</div>
          )}
        </>
      )}

      {activeTab === 'notes' && (
        <>
          {notes.map(n => (
            <div key={n.id} className="list-item" style={{ cursor: 'default', display: 'block' }}>
              <div className="title">{n.title}</div>
              <div className="desc" style={{ marginTop: '6px' }}>
                {n.relatedTitle && <span className="badge badge-gray" style={{ marginRight: '8px' }}>{n.relatedTitle}</span>}
                更新于 {new Date(n.updatedAt).toLocaleDateString()}
              </div>
              <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {n.content.substring(0, 200)}{n.content.length > 200 ? '...' : ''}
              </p>
            </div>
          ))}
          {notes.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>暂无笔记</div>
          )}
        </>
      )}
    </div>
  );
}
