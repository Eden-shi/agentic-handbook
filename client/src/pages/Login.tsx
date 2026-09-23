import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) await register(email, username, password);
      else await login(email, password);
      nav('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '操作失败');
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>{isRegister ? '注册账号' : '登录'}</h1>
        <p>智能体工程手册 · 学习平台</p>
        <form onSubmit={submit}>
          {isRegister && (
            <div className="form-group">
              <label>用户名</label>
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="你的昵称" />
            </div>
          )}
          <div className="form-group">
            <label>邮箱</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="至少6位" />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="btn-primary">{isRegister ? '注册' : '登录'}</button>
        </form>
        <button className="btn-ghost" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
          {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
        </button>
        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
          测试账号：admin@example.com / admin123
        </div>
      </div>
    </div>
  );
}
