import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function Admin() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data));
  }, []);

  if (!stats) return <div>加载中...</div>;

  const cards = [
    { label: '用户总数', value: stats.users, icon: '👥' },
    { label: '课程模块', value: stats.stages, icon: '📚' },
    { label: '实践项目', value: stats.projects, icon: '🛠️' },
    { label: '笔记总数', value: stats.notes, icon: '📝' },
    { label: '进度记录', value: stats.progressRecords, icon: '✅' },
  ];

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">管理后台</span></div>
      <div className="page-header">
        <h2>管理后台</h2>
        <p>平台数据概览与管理入口</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map(c => (
          <div key={c.label} className="list-item" style={{ cursor: 'default' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Link to="/admin/users" className="list-item" style={{ display: 'block' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px' }}>用户管理</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>查看所有用户，封禁或删除账号</div>
        </Link>
        <Link to="/admin/content" className="list-item" style={{ display: 'block' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px' }}>内容管理</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>编辑课程模块和实践项目内容</div>
        </Link>
      </div>
    </div>
  );
}
