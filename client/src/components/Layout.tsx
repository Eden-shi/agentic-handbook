import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const menu = [
  { to: '/', label: '学习总览', icon: '🏠', end: true },
  { to: '/stages', label: '基础学习路线', icon: '🔗' },
  { to: '/projects', label: '应用实践路线', icon: '📖' },
  { to: '/resources', label: '资料库', icon: '📊' },
  { to: '/experiments', label: '示例实验', icon: '🔬' },
  { to: '/notes', label: '学习笔记', icon: '📝' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-icon">📖</div>
            <div>
              <div className="sidebar-title">智能体工程手册</div>
              <div className="sidebar-subtitle">AGENTIC HANDBOOK</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menu.map(m => (
            <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{m.icon}</span>
              {m.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          {user && (
            <div style={{ padding: '8px 14px', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
              👤 {user.username}
            </div>
          )}
          <NavLink to="/settings" className="nav-item"><span className="nav-icon">⚙️</span>设置</NavLink>
          <NavLink to="/about" className="nav-item"><span className="nav-icon">📁</span>产品简介 ↗</NavLink>
          {user ? (
            <div className="nav-item" onClick={() => { logout(); nav('/'); }} style={{ color: '#dc2626' }}>
              <span className="nav-icon">🚪</span>退出登录
            </div>
          ) : (
            <NavLink to="/login" className="nav-item"><span className="nav-icon">🔑</span>登录</NavLink>
          )}
        </div>
      </aside>
      <main className="main">
        <div className="search-box">
          <input className="search-input" placeholder="搜索教程、资料和示例" />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
