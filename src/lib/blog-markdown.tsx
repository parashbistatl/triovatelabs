import type { ReactNode } from "react";

type InlineToken =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "em"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; label: string; href: string };

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }

    if (match[2]) {
      tokens.push({ type: "strong", value: match[2] });
    } else if (match[3]) {
      tokens.push({ type: "em", value: match[3] });
    } else if (match[4]) {
      tokens.push({ type: "code", value: match[4] });
    } else if (match[5] && match[6]) {
      tokens.push({ type: "link", label: match[5], href: match[6] });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return tokens;
}

function renderInline(text: string): ReactNode[] {
  return parseInline(text).map((token, index) => {
    if (token.type === "strong") {
      return <strong key={index} className="font-semibold text-gray-900">{token.value}</strong>;
    }

    if (token.type === "em") {
      return <em key={index} className="italic">{token.value}</em>;
    }

    if (token.type === "code") {
      return (
        <code key={index} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.95em] text-gray-800">
          {token.value}
        </code>
      );
    }

    if (token.type === "link") {
      const isExternal = /^https?:\/\//i.test(token.href);
      return (
        <a
          key={index}
          href={token.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-800"
        >
          {token.label}
        </a>
      );
    }

    return <span key={index}>{token.value}</span>;
  });
}

export function renderBlogMarkdown(body: string) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i += 1;

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }

      if (i < lines.length) {
        i += 1;
      }

      blocks.push(
        <pre key={`code-${i}`} className="mt-8 overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-gray-100">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      const [, alt, src] = imageMatch;
      blocks.push(
        <figure key={`image-${i}`} className="mt-8">
          <img
            src={src}
            alt={alt}
            className="mx-auto max-h-[460px] w-full rounded-2xl border border-gray-200 object-contain"
          />
          {alt ? <figcaption className="mt-3 text-center text-sm text-gray-500">{alt}</figcaption> : null}
        </figure>
      );
      i += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];

      if (level === 1) {
        blocks.push(
          <h1 key={`h1-${i}`} className="mt-10 text-3xl font-bold tracking-tight text-gray-900">
            {renderInline(content)}
          </h1>
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={`h2-${i}`} className="mt-10 text-2xl font-bold text-gray-900">
            {renderInline(content)}
          </h2>
        );
      } else {
        blocks.push(
          <h3 key={`h3-${i}`} className="mt-8 text-xl font-semibold text-gray-900">
            {renderInline(content)}
          </h3>
        );
      }

      i += 1;
      continue;
    }

    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }

      blocks.push(
        <blockquote key={`quote-${i}`} className="mt-8 border-l-4 border-blue-200 bg-blue-50/60 px-5 py-4 text-gray-700 italic">
          {quoteLines.map((quoteLine, index) => (
            <p key={index} className={index === 0 ? "" : "mt-3"}>
              {renderInline(quoteLine)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    if (/^(\-|\*)\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^(\-|\*)\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^(\-|\*)\s+/, ""));
        i += 1;
      }

      blocks.push(
        <ul key={`ul-${i}`} className="mt-6 list-disc space-y-2 pl-6 text-gray-700">
          {items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }

      blocks.push(
        <ol key={`ol-${i}`} className="mt-6 list-decimal space-y-2 pl-6 text-gray-700">
          {items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const current = lines[i].trim();
      if (
        !current ||
        current.startsWith("```") ||
        current.startsWith(">") ||
        /^!\[(.*?)\]\((.*?)\)$/.test(current) ||
        /^(#{1,3})\s+/.test(current) ||
        /^(\-|\*)\s+/.test(current) ||
        /^\d+\.\s+/.test(current)
      ) {
        break;
      }
      paragraphLines.push(current);
      i += 1;
    }

    blocks.push(
      <p key={`p-${i}`} className="mt-5 leading-8 text-gray-700">
        {renderInline(paragraphLines.join(" "))}
      </p>
    );
  }

  return blocks;
}
