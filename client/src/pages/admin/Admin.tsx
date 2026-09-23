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
    { label: '用户总数', value: stats.users, icon: '👥', color: '#2563eb' },
    { label: '课程模块', value: stats.stages, icon: '📚', color: '#16a34a' },
    { label: '实践项目', value: stats.projects, icon: '🛠️', color: '#d97706' },
    { label: '笔记总数', value: stats.notes, icon: '📝', color: '#9333ea' },
    { label: '进度记录', value: stats.progressRecords, icon: '✅', color: '#0891b2' },
  ];

  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">管理后台</span></div>
      <div className="page-header">
        <h2>管理后台</h2>
        <p>平台数据概览与管理入口</p>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: 'var(--card)', borderRadius: 'var(--radius)',
            padding: '24px', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{c.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1, letterSpacing: '-1px' }}>{c.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* 管理入口 */}
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>管理功能</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Link to="/admin/users" style={{
          background: 'var(--card)', borderRadius: 'var(--radius)',
          padding: '28px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)', display: 'block',
          transition: 'all .15s ease',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>用户管理</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>查看所有用户，封禁或删除账号，调整角色</div>
        </Link>
        <Link to="/admin/content" style={{
          background: 'var(--card)', borderRadius: 'var(--radius)',
          padding: '28px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)', display: 'block',
          transition: 'all .15s ease',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✏️</div>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>内容管理</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>新增、编辑、删除课程模块和实践项目</div>
        </Link>
      </div>
    </div>
  );
}
