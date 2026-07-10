"use client";

import type { Value } from "platejs";
import {
  BoldPlugin,
  ItalicPlugin,
  H3Plugin,
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
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const ToolbarButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
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

function htmlToValue(html: string): Value {
  if (!html) return [{ type: "p", children: [{ text: "" }] }];
  // deserializeHtml needs a minimal editor with HtmlPlugin to work
  // We parse the HTML string into a DOM element and let Plate's deserializer handle it
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;
  const nodes: Value = [];
  for (const child of Array.from(body.childNodes)) {
    const parsed = parseNode(child);
    if (parsed) nodes.push(parsed);
  }
  return nodes.length > 0
    ? nodes
    : [{ type: "p", children: [{ text: "" }] }];
}

function parseNode(node: Node): any {
  if (node.nodeType === 3) {
    // Text node
    const text = node.textContent || "";
    if (!text.trim()) return null;
    return { text };
  }
  if (node.nodeType !== 1) return null;

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  // Block elements
  if (tag === "h3") {
    return { type: "h3", children: parseChildren(el) };
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

  // Fallback: treat as paragraph
  return { type: "p", children: parseChildren(el) };
}

function parseChildren(el: HTMLElement): any[] {
  const children: any[] = [];
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === 3) {
      const text = child.textContent || "";
      // Skip empty text nodes
      if (text.length > 0) children.push({ text });
    } else if (child.nodeType === 1) {
      const c = child as HTMLElement;
      const cTag = c.tagName.toLowerCase();
      if (cTag === "strong" || cTag === "b") {
        children.push({ text: c.textContent || "", bold: true });
      } else if (cTag === "em" || cTag === "i") {
        children.push({ text: c.textContent || "", italic: true });
      } else if (cTag === "br") {
        children.push({ text: "\n" });
      } else {
        // Recursively parse
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
    return text;
  }
  const children = node.children
    ? node.children.map(serializeNode).join("")
    : "";
  switch (node.type) {
    case "h3":
      return `<h3>${children}</h3>`;
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

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = usePlateEditor({
    plugins: [
      HtmlPlugin,
      BoldPlugin,
      ItalicPlugin,
      H3Plugin,
      ListPlugin,
      BulletedListPlugin,
      NumberedListPlugin,
      ListItemPlugin,
    ],
    value: htmlToValue(content),
  });

  return (
    <Plate editor={editor}>
      <div className="border border-brand-sand rounded-md overflow-hidden bg-brand-cream">
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-brand-sand bg-white">
          <ToolbarButton
            active={!!editor.api.mark("bold")}
            onClick={() => editor.tf.toggleMark("bold")}
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            active={!!editor.api.mark("italic")}
            onClick={() => editor.tf.toggleMark("italic")}
          >
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          <span className="w-px h-4 bg-brand-sand mx-1" />
          <ToolbarButton
            active={editor.api.block()?.[0]?.type === "h3"}
            onClick={() => editor.tf.toggleBlock("h3")}
          >
            <Heading2 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <span className="w-px h-4 bg-brand-sand mx-1" />
          <ToolbarButton
            active={editor.api.block()?.[0]?.type === "ul"}
            onClick={() => editor.tf.toggleBlock("ul")}
          >
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.api.block()?.[0]?.type === "ol"}
            onClick={() => editor.tf.toggleBlock("ol")}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>
        <PlateContent
          className="prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-brand-taupe"
          onChange={() => {
            const html = serializeEditorHtml(editor);
            onChange(html);
          }}
          placeholder="Tulis konten paket..."
        />
      </div>
    </Plate>
  );
}

function serializeEditorHtml(editor: any): string {
  const value = editor.children as Value;
  return value.map(serializeNode).join("");
}
