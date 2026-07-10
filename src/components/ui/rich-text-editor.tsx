"use client";

import { useState } from "react";
import type { Value } from "platejs";
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  H2Plugin,
  H3Plugin,
  BlockquotePlugin,
} from "@platejs/basic-nodes/react";
import {
  BulletedListPlugin,
  NumberedListPlugin,
  ListPlugin,
  ListItemPlugin,
} from "@platejs/list-classic/react";
import {
  Plate,
  PlateContent,
  usePlateEditor,
} from "platejs/react";
import { HtmlPlugin } from "platejs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Code,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const ToolbarButton = ({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    title={title}
    className={cn(
      "h-8 w-8 p-0 rounded-md",
      active
        ? "bg-brand-gold/20 text-brand-gold"
        : "text-brand-taupe/60 hover:text-brand-taupe hover:bg-brand-cream"
    )}
    onClick={onClick}
  >
    {children}
  </Button>
);

const ToolbarSeparator = () => (
  <span className="w-px h-4 bg-brand-sand mx-1" />
);

// ── HTML ↔ Plate value conversion ──

function htmlToValue(html: string): Value {
  if (!html) return [{ type: "p", children: [{ text: "" }] }];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const nodes: Value = [];
  for (const child of Array.from(doc.body.childNodes)) {
    const parsed = parseNode(child);
    if (parsed) nodes.push(parsed);
  }
  return nodes.length > 0
    ? nodes
    : [{ type: "p", children: [{ text: "" }] }];
}

function parseNode(node: Node): any {
  if (node.nodeType === 3) {
    const text = node.textContent || "";
    if (!text.trim()) return null;
    return { text };
  }
  if (node.nodeType !== 1) return null;

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  if (tag === "h2") {
    return { type: "h2", children: parseChildren(el) };
  }
  if (tag === "h3") {
    return { type: "h3", children: parseChildren(el) };
  }
  if (tag === "blockquote") {
    return { type: "blockquote", children: parseChildren(el) };
  }
  if (tag === "p" || tag === "div") {
    return { type: "p", children: parseChildren(el) };
  }
  if (tag === "ul") {
    return {
      type: "ul",
      children: Array.from(el.children)
        .filter((li) => li.tagName.toLowerCase() === "li")
        .map((li) => ({
          type: "li",
          children: parseChildren(li as HTMLElement),
        })),
    };
  }
  if (tag === "ol") {
    return {
      type: "ol",
      children: Array.from(el.children)
        .filter((li) => li.tagName.toLowerCase() === "li")
        .map((li) => ({
          type: "li",
          children: parseChildren(li as HTMLElement),
        })),
    };
  }
  if (tag === "li") {
    return { type: "li", children: parseChildren(el) };
  }

  return { type: "p", children: parseChildren(el) };
}

function parseChildren(el: HTMLElement): any[] {
  const children: any[] = [];
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === 3) {
      const text = child.textContent || "";
      if (text.length > 0) children.push({ text });
    } else if (child.nodeType === 1) {
      const c = child as HTMLElement;
      const cTag = c.tagName.toLowerCase();
      if (cTag === "strong" || cTag === "b") {
        children.push({ text: c.textContent || "", bold: true });
      } else if (cTag === "em" || cTag === "i") {
        children.push({ text: c.textContent || "", italic: true });
      } else if (cTag === "u") {
        children.push({ text: c.textContent || "", underline: true });
      } else if (cTag === "s" || cTag === "del" || cTag === "strike") {
        children.push({ text: c.textContent || "", strikethrough: true });
      } else if (cTag === "br") {
        children.push({ text: "\n" });
      } else {
        const inner = parseNode(c);
        if (inner) children.push(inner);
      }
    }
  }
  return children.length > 0 ? children : [{ text: "" }];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serializeNode(node: any): string {
  if (!node) return "";
  if ("text" in node) {
    let text = escapeHtml(node.text);
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.strikethrough) text = `<s>${text}</s>`;
    return text;
  }
  const children = node.children
    ? node.children.map(serializeNode).join("")
    : "";
  switch (node.type) {
    case "h2":
      return `<h2>${children}</h2>`;
    case "h3":
      return `<h3>${children}</h3>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "ul":
      return `<ul>${children}</ul>`;
    case "ol":
      return `<ol>${children}</ol>`;
    case "li":
      return `<li>${children}</li>`;
    case "p":
    default:
      return `<p>${children}</p>`;
  }
}

function serializeEditorHtml(editor: any): string {
  const value = editor.children as Value;
  return value.map(serializeNode).join("");
}

// ── Component ──

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [codeView, setCodeView] = useState(false);

  const editor = usePlateEditor({
    plugins: [
      HtmlPlugin,
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      StrikethroughPlugin,
      H2Plugin,
      H3Plugin,
      BlockquotePlugin,
      ListPlugin,
      BulletedListPlugin,
      NumberedListPlugin,
      ListItemPlugin,
    ],
    value: htmlToValue(content),
  });

  const currentHtml = serializeEditorHtml(editor);

  return (
    <Plate editor={editor}>
      <div className="border border-brand-sand rounded-md overflow-hidden bg-brand-cream">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-brand-sand bg-white flex-wrap">
          <ToolbarButton
            active={!!editor.api.mark("bold")}
            onClick={() => editor.tf.toggleMark("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            active={!!editor.api.mark("italic")}
            onClick={() => editor.tf.toggleMark("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            active={!!editor.api.mark("underline")}
            onClick={() => editor.tf.toggleMark("underline")}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            active={!!editor.api.mark("strikethrough")}
            onClick={() => editor.tf.toggleMark("strikethrough")}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            active={editor.api.block()?.[0]?.type === "h2"}
            onClick={() => editor.tf.toggleBlock("h2")}
            title="Heading 2"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.api.block()?.[0]?.type === "h3"}
            onClick={() => editor.tf.toggleBlock("h3")}
            title="Heading 3"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            active={editor.api.block()?.[0]?.type === "ul"}
            onClick={() => editor.tf.toggleBlock("ul")}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.api.block()?.[0]?.type === "ol"}
            onClick={() => editor.tf.toggleBlock("ol")}
            title="Ordered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            active={editor.api.block()?.[0]?.type === "blockquote"}
            onClick={() => editor.tf.toggleBlock("blockquote")}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </ToolbarButton>

          <div className="flex-1" />

          <ToolbarButton
            active={codeView}
            onClick={() => {
              if (!codeView) {
                // Sync before opening code view
                editor.tf.setValue(htmlToValue(currentHtml));
              }
              setCodeView(!codeView);
            }}
            title="Toggle HTML Code View"
          >
            <Code className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        {/* Editor area */}
        {codeView ? (
          <textarea
            className="w-full min-h-[200px] px-4 py-3 focus:outline-none text-brand-taupe bg-brand-cream font-mono text-sm resize-y"
            value={currentHtml}
            onChange={(e) => {
              const newHtml = e.target.value;
              editor.tf.setValue(htmlToValue(newHtml));
              onChange(newHtml);
            }}
            placeholder="Edit HTML directly..."
            spellCheck={false}
          />
        ) : (
          <PlateContent
            className="prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-brand-taupe"
            onChange={() => {
              const html = serializeEditorHtml(editor);
              onChange(html);
            }}
            placeholder="Tulis konten paket..."
          />
        )}
      </div>
    </Plate>
  );
}
