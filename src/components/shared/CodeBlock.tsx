"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language = "dockerfile",
  showLineNumbers = true,
  maxHeight = "600px",
}: CodeBlockProps) {
  return (
    <div
      className="rounded-xl overflow-auto border border-white/10 text-sm"
      style={{ maxHeight }}
    >
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          background: "transparent",
          fontSize: "0.8rem",
          lineHeight: "1.6",
        }}
        lineNumberStyle={{
          color: "#4a5568",
          minWidth: "2.5em",
        }}
        wrapLines
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
