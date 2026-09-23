import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function Admin() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data));
  }, []);

  if (!stats) return <div className="p-6">加载中...</div>;

  const cards = [
    { label: '用户总数', value: stats.users, icon: '👥' },
    { label: '课程模块', value: stats.stages, icon: '📚' },
    { label: '实践项目', value: stats.projects, icon: '🛠️' },
    { label: '笔记总数', value: stats.notes, icon: '📝' },
    { label: '进度记录', value: stats.progressRecords, icon: '✅' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">管理员后台</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-sm text-gray-500">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/users" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <div className="text-xl font-semibold mb-2">用户管理</div>
          <p className="text-gray-500 text-sm">查看所有用户，封禁或删除账号</p>
        </Link>
        <Link to="/admin/content" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <div className="text-xl font-semibold mb-2">内容管理</div>
          <p className="text-gray-500 text-sm">编辑课程模块和实践项目内容</p>
        </Link>
      </div>
    </div>
  );
}
