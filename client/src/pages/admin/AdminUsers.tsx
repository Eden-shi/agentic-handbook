import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  const load = () => api.get('/admin/users').then(r => setUsers(r.data));

  useEffect(() => { load(); }, []);

  const ban = async (id: string) => {
    await api.put(`/admin/users/${id}/ban`);
    load();
  };

  const unban = async (id: string) => {
    await api.put(`/admin/users/${id}/unban`);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('确定删除这个用户？')) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">用户管理</span></div>
      <div className="page-header">
        <h2>用户管理</h2>
        <p>共 {users.length} 个用户</p>
      </div>

      {users.map(u => (
        <div key={u.id} className="list-item" style={{ cursor: 'default' }}>
          <div className="num" style={{ fontSize: '18px' }}>👤</div>
          <div className="info">
            <div className="title">{u.username} <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{u.email}</span></div>
            <div className="desc">
              <span className={`badge ${u.role === 'admin' ? 'badge-green' : 'badge-gray'}`}>{u.role}</span>
              {' '}
              <span className={`badge ${u.banned ? 'badge-gray' : 'badge-green'}`}>{u.banned ? '已封禁' : '正常'}</span>
              {' '}
              <span style={{ marginLeft: '8px' }}>注册于 {new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {u.role !== 'admin' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {u.banned
                ? <button className="check-btn" onClick={() => unban(u.id)}>解封</button>
                : <button className="check-btn" onClick={() => ban(u.id)}>封禁</button>
              }
              <button className="check-btn" style={{ color: '#dc2626' }} onClick={() => del(u.id)}>删除</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
