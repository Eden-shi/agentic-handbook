import { useAuth } from '../lib/auth';

export default function Settings() {
  const { user, logout } = useAuth();
  if (!user) return <div className="card">请先 <a href="/login" style={{ color: 'var(--accent)' }}>登录</a>。</div>;
  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">设置</span></div>
      <div className="page-header"><h2>设置</h2></div>
      <div className="card">
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>个人信息</h2>
        <p style={{ marginBottom: 8 }}><strong>用户名：</strong>{user.username}</p>
        <p style={{ marginBottom: 8 }}><strong>邮箱：</strong>{user.email}</p>
        <button className="check-btn" style={{ marginTop: 16, color: '#dc2626' }} onClick={logout}>退出登录</button>
      </div>
    </div>
  );
}
