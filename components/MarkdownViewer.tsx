import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  // Sanitize content to prevent XSS attacks
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "ul", "ol", "li", "strong", "em", "code", "pre", "a", "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td"],
      ALLOWED_ATTR: ["href", "title", "target", "rel"],
    });
  }, [content]);

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{sanitizedContent}</ReactMarkdown>
    </div>
  );
}
