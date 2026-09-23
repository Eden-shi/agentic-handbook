import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminContent() {
  const [stages, setStages] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const load = () => api.get('/admin/stages').then(r => setStages(r.data));

  useEffect(() => { load(); }, []);

  const save = async () => {
    await api.put(`/admin/stages/${editing.id}`, editing);
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('确定删除这个模块？')) return;
    await api.delete(`/admin/stages/${id}`);
    load();
  };

  if (editing) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">编辑模块</h1>
        <div className="space-y-4 max-w-3xl">
          <div>
            <label className="block text-sm font-medium mb-1">标题</label>
            <input
              className="w-full border rounded p-2"
              value={editing.title}
              onChange={e => setEditing({ ...editing, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">副标题</label>
            <input
              className="w-full border rounded p-2"
              value={editing.subtitle || ''}
              onChange={e => setEditing({ ...editing, subtitle: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">描述</label>
            <textarea
              className="w-full border rounded p-2"
              rows={2}
              value={editing.description || ''}
              onChange={e => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">内容 (Markdown)</label>
            <textarea
              className="w-full border rounded p-2 font-mono text-sm"
              rows={20}
              value={editing.content || ''}
              onChange={e => setEditing({ ...editing, content: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">保存</button>
            <button onClick={() => setEditing(null)} className="bg-gray-200 px-4 py-2 rounded">取消</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">内容管理 - 课程模块</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-500">序号</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">标题</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">时长</th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {stages.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-3 text-sm">{s.stageNumber}</td>
                <td className="p-3 text-sm">{s.title}</td>
                <td className="p-3 text-sm text-gray-500">{s.duration}</td>
                <td className="p-3 text-sm">
                  <button onClick={() => setEditing(s)} className="text-blue-600 mr-3">编辑</button>
                  <button onClick={() => del(s.id)} className="text-red-600">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
