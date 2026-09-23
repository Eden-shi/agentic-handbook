import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function AdminUsers() {
  const nav = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

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
    if (!confirm('确定删除这个用户？此操作不可恢复。')) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  const setRole = async (id: string, role: string) => {
    await api.put(`/admin/users/${id}/role`, { role });
    load();
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">用户管理</span></div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>用户管理</h2>
          <p>共 {users.length} 个用户，显示 {filtered.length} 个</p>
        </div>
        <input
          className="search-input"
          placeholder="搜索用户名或邮箱..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '280px' }}
        />
      </div>

      {filtered.map(u => (
        <div key={u.id} className="list-item" style={{ cursor: 'default' }}>
          <div className="num" style={{ fontSize: '18px' }}>👤</div>
          <div className="info">
            <div className="title">
              {u.username}
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'normal', marginLeft: '8px' }}>{u.email}</span>
            </div>
            <div className="desc">
              <span className={`badge ${u.role === 'admin' ? 'badge-green' : 'badge-gray'}`}>{u.role}</span>
              {' '}
              <span className={`badge ${u.banned ? 'badge-gray' : 'badge-green'}`}>{u.banned ? '已封禁' : '正常'}</span>
              {' '}
              <span style={{ marginLeft: '8px' }}>注册于 {new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="check-btn" onClick={() => nav(`/admin/users/${u.id}`)}>详情</button>
            {u.role !== 'admin' && (
              <>
                <select
                  className="check-btn"
                  value={u.role}
                  onChange={e => setRole(u.id, e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
                {u.banned
                  ? <button className="check-btn" onClick={() => unban(u.id)}>解封</button>
                  : <button className="check-btn" onClick={() => ban(u.id)}>封禁</button>
                }
                <button className="check-btn" style={{ color: '#dc2626' }} onClick={() => del(u.id)}>删除</button>
              </>
            )}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0' }}>
          没有找到匹配的用户
        </div>
      )}
    </div>
  );
}
