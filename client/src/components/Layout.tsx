import { useState } from 'react';
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="app-layout">
      {/* 移动端顶栏 */}
      <div className="mobile-topbar">
        <button className="hamburger" onClick={() => setDrawerOpen(true)} aria-label="菜单">
          <span></span><span></span><span></span>
        </button>
        <div className="mobile-topbar-title">📖 智能体工程手册</div>
        {user ? (
          <div className="mobile-topbar-user" onClick={() => nav('/settings')}>👤</div>
        ) : (
          <div className="mobile-topbar-user" onClick={() => nav('/login')}>🔑</div>
        )}
      </div>

      {/* 遮罩 */}
      {drawerOpen && <div className="drawer-overlay" onClick={closeDrawer} />}

      <aside className={`sidebar ${drawerOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-icon">📖</div>
            <div>
              <div className="sidebar-title">智能体工程手册</div>
              <div className="sidebar-subtitle">AGENTIC HANDBOOK</div>
            </div>
          </div>
          <button className="drawer-close" onClick={closeDrawer} aria-label="关闭">✕</button>
        </div>
        <nav className="sidebar-nav" onClick={closeDrawer}>
          {menu.map(m => (
            <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{m.icon}</span>
              {m.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <>
              <div style={{ padding: '12px 14px 4px', fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>管理员</div>
              <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">🛡️</span>管理后台
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">👥</span>用户管理
              </NavLink>
              <NavLink to="/admin/content" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">✏️</span>内容管理
              </NavLink>
            </>
          )}
        </nav>
        <div className="sidebar-footer" onClick={closeDrawer}>
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
