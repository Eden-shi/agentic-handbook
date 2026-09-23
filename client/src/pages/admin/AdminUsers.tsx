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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-500">邮箱</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">用户名</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">角色</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">状态</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">注册时间</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3 text-sm">{u.email}</td>
                <td className="p-3 text-sm">{u.username}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  {u.banned ? <span className="text-red-600">已封禁</span> : <span className="text-green-600">正常</span>}
                </td>
                <td className="p-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-sm">
                  {u.role !== 'admin' && (
                    <>
                      {u.banned
                        ? <button onClick={() => unban(u.id)} className="text-blue-600 mr-3">解封</button>
                        : <button onClick={() => ban(u.id)} className="text-orange-600 mr-3">封禁</button>
                      }
                      <button onClick={() => del(u.id)} className="text-red-600">删除</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
