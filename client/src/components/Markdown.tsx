import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidChart from './MermaidChart';

interface Props {
  children: string;
}

export default function Markdown({ children }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          const { className, children: codeChildren, ...rest } = props as any;
          const text = String(codeChildren ?? '');
          if (/language-mermaid/.test(className || '')) {
            return <MermaidChart chart={text.replace(/\n$/, '')} />;
          }
          return (
            <code className={className} {...rest}>
              {codeChildren}
            </code>
          );
        },
        a(props) {
          return <a {...props} target="_blank" rel="noopener noreferrer" />;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
