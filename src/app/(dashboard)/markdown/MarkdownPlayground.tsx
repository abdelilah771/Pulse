"use client";

import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import mermaid from "mermaid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Eye } from "lucide-react";

const DEFAULT_MARKDOWN = `# Markdown & Mermaid Viewer
Bienvenue dans le parseur interactif en temps réel !

## Comment ça marche ?
1. Tapez du Markdown classique ici.
2. Ajoutez des blocs de code avec \`\`\`mermaid pour générer des diagrammes !

\`\`\`mermaid
graph TD;
    A[Client] -->|Envoie| B(Serveur Next.js);
    B --> C{Base de données};
    C -->|Retourne| B;
    B -->|Répond| A;
\`\`\`
`;

export default function MarkdownPlayground() {
    const [input, setInput] = useState(DEFAULT_MARKDOWN);
    const [contentHtml, setContentHtml] = useState<{ html: string; blocks: any[] } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Parse the markdown string on change
        try {
            const mermaidBlocks: any[] = [];
            let blockIdx = 0;
            const processed = input.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
                const id = `mermaid-block-playground-${blockIdx++}`;
                mermaidBlocks.push({ id, code: code.trim() });
                return `<div class="mermaid-container" id="${id}"></div>`;
            });

            const html = marked.parse(processed, { breaks: true, gfm: true }) as string;
            setContentHtml({ html, blocks: mermaidBlocks });
        } catch (e) {
            console.error("Markdown parse error:", e);
        }
    }, [input]);

    useEffect(() => {
        // Render mermaid diagrams after the HTML is injected
        if (contentHtml && contentHtml.blocks.length > 0 && containerRef.current) {
            mermaid.initialize({ startOnLoad: false, theme: "default" });
            const renderMermaid = async () => {
                for (const block of contentHtml.blocks) {
                    const el = containerRef.current?.querySelector(`#${block.id}`);
                    if (el && !el.innerHTML.includes("<svg")) {
                        try {
                            const { svg } = await mermaid.render(`${block.id}-svg`, block.code);
                            el.innerHTML = svg;
                        } catch (err) {
                            el.innerHTML = `<pre class="text-red-500 bg-red-50 p-4 rounded text-xs">Erreur Mermaid: ${err}</pre>`;
                        }
                    }
                }
            };
            renderMermaid();
        }
    }, [contentHtml]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
            <Card className="flex flex-col border-slate-200 shadow-sm rounded-2xl h-full">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-slate-500" /> Éditeur Markdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <Textarea
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Écrivez votre Markdown ici..."
                        className="w-full h-full min-h-[300px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm p-4 bg-slate-50 text-slate-800"
                    />
                </CardContent>
            </Card>

            <Card className="flex flex-col border-slate-200 shadow-sm rounded-2xl h-full">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-indigo-500" /> Aperçu en direct
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-6 overflow-y-auto" ref={containerRef}>
                    {contentHtml ? (
                        <div
                            className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h1:border-b-2 prose-h1:border-indigo-500 prose-h1:pb-2 prose-a:text-indigo-600 prose-code:text-fuchsia-600 prose-code:bg-slate-100 prose-pre:bg-slate-800"
                            dangerouslySetInnerHTML={{ __html: contentHtml.html }}
                        />
                    ) : (
                        <div className="text-slate-400">Rendu...</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
