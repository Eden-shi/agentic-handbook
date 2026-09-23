import { useEffect, useState } from 'react';
import api from '../../lib/api';

type TabKey = 'stages' | 'projects' | 'resources' | 'experiments';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'stages', label: '课程模块' },
  { key: 'projects', label: '实践项目' },
  { key: 'resources', label: '学习资料' },
  { key: 'experiments', label: '示例实验' },
];

export default function AdminContent() {
  const [tab, setTab] = useState<TabKey>('stages');
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => {
    const endpoints: Record<TabKey, string> = {
      stages: '/admin/stages',
      projects: '/admin/projects',
      resources: '/admin/resources',
      experiments: '/admin/experiments',
    };
    api.get(endpoints[tab]).then(r => setItems(r.data));
  };

  useEffect(() => { load(); }, [tab]);

  const save = async () => {
    const endpoints: Record<TabKey, { post: string; put: (id: string) => string }> = {
      stages: { post: '/admin/stages', put: (id) => `/admin/stages/${id}` },
      projects: { post: '/admin/projects', put: (id) => `/admin/projects/${id}` },
      resources: { post: '/admin/resources', put: (id) => `/admin/resources/${id}` },
      experiments: { post: '/admin/experiments', put: (id) => `/admin/experiments/${id}` },
    };
    if (isNew) {
      await api.post(endpoints[tab].post, editing);
    } else {
      await api.put(endpoints[tab].put(editing.id), editing);
    }
    setEditing(null);
    setIsNew(false);
    load();
  };

  const del = async (id: string) => {
    const names: Record<TabKey, string> = { stages: '模块', projects: '项目', resources: '资料', experiments: '实验' };
    if (!confirm(`确定删除这个${names[tab]}？`)) return;
    const endpoints: Record<TabKey, (id: string) => string> = {
      stages: (id) => `/admin/stages/${id}`,
      projects: (id) => `/admin/projects/${id}`,
      resources: (id) => `/admin/resources/${id}`,
      experiments: (id) => `/admin/experiments/${id}`,
    };
    await api.delete(endpoints[tab](id));
    load();
  };

  const newItem = () => {
    const defaults: Record<TabKey, any> = {
      stages: { stageNumber: items.length + 1, title: '', subtitle: '', description: '', content: '', duration: '' },
      projects: { projectNumber: items.length + 1, title: '', category: '', difficulty: '初级', description: '', content: '', duration: '' },
      resources: { title: '', category: '', type: '文章', description: '', url: '', stageNumber: 1 },
      experiments: { expNumber: items.length + 1, title: '', category: '', description: '', content: '', difficulty: '初级', duration: '' },
    };
    setEditing(defaults[tab]);
    setIsNew(true);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
    borderRadius: '10px', fontSize: '14px', outline: 'none',
  };

  // 编辑表单
  if (editing) {
    return (
      <div>
        <div className="breadcrumb">工作台 <span>/</span> <span onClick={() => { setEditing(null); setIsNew(false); }} style={{ cursor: 'pointer' }}>内容管理</span> <span>/</span> <span className="current">{isNew ? '新增' : '编辑'}</span></div>
        <div className="page-header">
          <h2>{isNew ? '新增' : '编辑'}{tabs.find(t => t.key === tab)?.label}</h2>
        </div>
        <div className="card" style={{ maxWidth: '800px' }}>
          {tab === 'stages' && (
            <>
              <Field label="模块序号"><input style={inputStyle} type="number" value={editing.stageNumber} onChange={e => setEditing({ ...editing, stageNumber: parseInt(e.target.value) })} /></Field>
              <Field label="标题"><input style={inputStyle} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="副标题"><input style={inputStyle} value={editing.subtitle || ''} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} /></Field>
              <Field label="描述"><textarea style={{ ...inputStyle, minHeight: '60px' }} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
              <Field label="时长"><input style={inputStyle} value={editing.duration || ''} onChange={e => setEditing({ ...editing, duration: e.target.value })} /></Field>
            </>
          )}
          {tab === 'projects' && (
            <>
              <Field label="项目序号"><input style={inputStyle} type="number" value={editing.projectNumber} onChange={e => setEditing({ ...editing, projectNumber: parseInt(e.target.value) })} /></Field>
              <Field label="标题"><input style={inputStyle} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="分类"><input style={inputStyle} value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} /></Field>
              <Field label="难度">
                <select style={inputStyle} value={editing.difficulty || '初级'} onChange={e => setEditing({ ...editing, difficulty: e.target.value })}>
                  <option>初级</option><option>中级</option><option>高级</option>
                </select>
              </Field>
              <Field label="描述"><textarea style={{ ...inputStyle, minHeight: '60px' }} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
              <Field label="时长"><input style={inputStyle} value={editing.duration || ''} onChange={e => setEditing({ ...editing, duration: e.target.value })} /></Field>
            </>
          )}
          {tab === 'resources' && (
            <>
              <Field label="标题"><input style={inputStyle} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="分类"><input style={inputStyle} value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} /></Field>
              <Field label="类型">
                <select style={inputStyle} value={editing.type || '文章'} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                  <option>文章</option><option>视频</option><option>文档</option><option>工具</option><option>代码库</option>
                </select>
              </Field>
              <Field label="链接URL"><input style={inputStyle} value={editing.url || ''} onChange={e => setEditing({ ...editing, url: e.target.value })} /></Field>
              <Field label="所属模块"><input style={inputStyle} type="number" value={editing.stageNumber || 1} onChange={e => setEditing({ ...editing, stageNumber: parseInt(e.target.value) })} /></Field>
              <Field label="描述"><textarea style={{ ...inputStyle, minHeight: '60px' }} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
            </>
          )}
          {tab === 'experiments' && (
            <>
              <Field label="实验序号"><input style={inputStyle} type="number" value={editing.expNumber} onChange={e => setEditing({ ...editing, expNumber: parseInt(e.target.value) })} /></Field>
              <Field label="标题"><input style={inputStyle} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="分类"><input style={inputStyle} value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} /></Field>
              <Field label="难度">
                <select style={inputStyle} value={editing.difficulty || '初级'} onChange={e => setEditing({ ...editing, difficulty: e.target.value })}>
                  <option>初级</option><option>中级</option><option>高级</option>
                </select>
              </Field>
              <Field label="时长"><input style={inputStyle} value={editing.duration || ''} onChange={e => setEditing({ ...editing, duration: e.target.value })} /></Field>
              <Field label="描述"><textarea style={{ ...inputStyle, minHeight: '60px' }} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
            </>
          )}
          {(tab === 'stages' || tab === 'projects' || tab === 'experiments') && (
            <Field label="详细内容 (Markdown)"><textarea style={{ ...inputStyle, minHeight: '300px', fontFamily: 'monospace', fontSize: '13px' }} value={editing.content || ''} onChange={e => setEditing({ ...editing, content: e.target.value })} /></Field>
          )}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="check-btn done" onClick={save}>保存</button>
            <button className="check-btn" onClick={() => { setEditing(null); setIsNew(false); }}>取消</button>
          </div>
        </div>
      </div>
    );
  }

  // 列表页
  return (
    <div>
      <div className="breadcrumb">工作台 <span>/</span> <span className="current">内容管理</span></div>
      <div className="page-header">
        <h2>内容管理</h2>
        <p>共 {items.length} 条内容</p>
      </div>

      {/* Tab切换 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 20px', border: 'none', background: 'none',
              fontSize: '14px', fontWeight: tab === t.key ? '700' : '500',
              color: tab === t.key ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer', marginBottom: '-1px',
            }}
          >
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="check-btn done" onClick={newItem}>+ 新增</button>
      </div>

      {items.map((item: any) => (
        <div key={item.id} className="list-item">
          <div className="num" style={{ fontSize: '16px' }}>
            {tab === 'stages' && String(item.stageNumber).padStart(2, '0')}
            {tab === 'projects' && String(item.projectNumber).padStart(2, '0')}
            {tab === 'experiments' && String(item.expNumber).padStart(2, '0')}
            {tab === 'resources' && '🔗'}
          </div>
          <div className="info">
            <div className="title">{item.title}</div>
            <div className="desc">
              {item.subtitle}{item.category && ` · ${item.category}`}{item.difficulty && ` · ${item.difficulty}`}{item.duration && ` · ${item.duration}`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="check-btn" onClick={() => setEditing(item)}>编辑</button>
            <button className="check-btn" style={{ color: '#dc2626' }} onClick={() => del(item.id)}>删除</button>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0' }}>
          暂无内容，点击右上角"+ 新增"添加
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  );
}
