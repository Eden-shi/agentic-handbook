import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

let idCounter = 0;

export default function MermaidChart({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const renderId = `mermaid-svg-${idCounter++}`;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });
    mermaid
      .render(renderId, chart.trim())
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message || e));
      });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div style={{ border: '1px solid #fca5a5', borderRadius: 8, padding: 12 }}>
        <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 8 }}>流程图渲染失败，显示原始代码：</div>
        <pre style={{ margin: 0, fontSize: 12 }}>{chart}</pre>
      </div>
    );
  }

  return (
    <div
      className="mermaid-chart"
      style={{ textAlign: 'center', overflowX: 'auto', padding: '8px 0' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
