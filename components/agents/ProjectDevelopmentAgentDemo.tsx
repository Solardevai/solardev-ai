"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type { SolarAgentUIMessage } from "@/lib/agent/solar-agent";

export type AgentProjectOption = {
  id: string;
  name: string;
  technology: string;
  country: string;
  status: string;
  areaHa: number;
};

type Props = {
  projects: AgentProjectOption[];
  initialProjectId?: string;
  isSignedIn: boolean;
};

const quickPrompts = [
  "Estimate capacity from this project's land area and explain the assumptions.",
  "What are the three highest-priority development risks in the available evidence?",
  "Calculate the DC/AC ratio and assess whether it needs more design evidence.",
  "Summarize what is known, what is assumed, and what must be verified next.",
];

function optionalNumber(value: string) {
  const parsed = Number(value);
  return value.trim() && Number.isFinite(parsed) ? parsed : undefined;
}

function readableToolName(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

export default function ProjectDevelopmentAgentDemo({ projects, initialProjectId, isSignedIn }: Props) {
  const [input, setInput] = useState("");
  const [projectId, setProjectId] = useState(initialProjectId ?? "");
  const [pvDcMw, setPvDcMw] = useState("");
  const [pvAcMw, setPvAcMw] = useState("");
  const [bessPowerMw, setBessPowerMw] = useState("");
  const [bessEnergyMwh, setBessEnergyMwh] = useState("");
  const [documentStatus, setDocumentStatus] = useState("");
  const selectedProject = useMemo(() => projects.find((project) => project.id === projectId), [projectId, projects]);
  const { messages, sendMessage, status, error, stop } = useChat<SolarAgentUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/agents/solar" }),
  });
  const busy = status === "submitted" || status === "streaming";

  const manualInputs = {
    pvDcMw: optionalNumber(pvDcMw),
    pvAcMw: optionalNumber(pvAcMw),
    bessPowerMw: optionalNumber(bessPowerMw),
    bessEnergyMwh: optionalNumber(bessEnergyMwh),
  };

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || busy || !isSignedIn) return;
    setInput("");
    await sendMessage({ text }, { body: { projectId: projectId || undefined, manualInputs } });
  }

  async function uploadDocument(file: File | undefined) {
    if (!file || !projectId) return;
    setDocumentStatus("Uploading and indexing…");
    const body = new FormData();
    body.set("file", file);
    const response = await fetch(`/api/agents/solar/knowledge/${projectId}`, { method: "POST", body });
    const result = (await response.json()) as { document?: { name: string; chunkCount: number }; error?: string };
    setDocumentStatus(response.ok && result.document ? `${result.document.name} indexed in ${result.document.chunkCount} evidence chunks.` : result.error ?? "Upload failed.");
  }

  return (
    <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/20 lg:grid-cols-[310px_minmax(0,1fr)]">
      <aside className="border-b border-white/10 bg-slate-950/80 p-5 lg:border-b-0 lg:border-r">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Project context</p>
        <label className="mt-5 block text-xs font-semibold text-slate-300">
          Saved project
          <select value={projectId} onChange={(event) => setProjectId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white">
            <option value="">General engineering question</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
        </label>
        {selectedProject ? (
          <div className="mt-3 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.05] p-3 text-xs leading-5 text-slate-300">
            {selectedProject.technology.toUpperCase()} · {selectedProject.country} · {selectedProject.areaHa.toFixed(1)} ha<br />
            Status: {selectedProject.status.replace("-", " ")}
          </div>
        ) : null}

        <details className="mt-5 rounded-xl border border-white/10 p-3">
          <summary className="cursor-pointer text-xs font-semibold text-slate-300">Manual design inputs</summary>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[["PV DC (MWp)", pvDcMw, setPvDcMw], ["PV AC (MW)", pvAcMw, setPvAcMw], ["BESS power (MW)", bessPowerMw, setBessPowerMw], ["BESS energy (MWh)", bessEnergyMwh, setBessEnergyMwh]].map(([label, value, setter]) => (
              <label key={label as string} className="text-[10px] text-slate-400">{label as string}<input type="number" min="0" step="any" value={value as string} onChange={(event) => (setter as (value: string) => void)(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-xs text-white" /></label>
            ))}
          </div>
        </details>

        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-300">Project evidence</p>
          <label className={`mt-2 block rounded-xl border border-dashed p-3 text-center text-xs ${projectId ? "cursor-pointer border-white/15 text-slate-400 hover:border-emerald-300/30" : "border-white/10 text-slate-600"}`}>
            {projectId ? "Upload TXT, MD, CSV or JSON" : "Select a saved project to add documents"}
            <input type="file" accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json" disabled={!projectId} onChange={(event) => void uploadDocument(event.target.files?.[0])} className="sr-only" />
          </label>
          {documentStatus ? <p className="mt-2 text-[10px] leading-4 text-slate-400">{documentStatus}</p> : null}
        </div>

        <div className="mt-6 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-3 text-[10px] leading-5 text-amber-100/75">
          Screening support only. Outputs label sources, assumptions and calculated results; accountable engineers must verify design, safety and compliance decisions.
        </div>
      </aside>

      <section className="flex min-h-[680px] flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">SolarDev Engineering Agent</p><p className="mt-1 text-sm text-slate-400">Project-aware solar and BESS analysis</p></div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">AI + deterministic tools</span>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6" aria-live="polite">
          {!isSignedIn ? <div className="mx-auto mt-20 max-w-md rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-6 text-center"><h2 className="text-xl font-semibold">Sign in to use the engineering agent</h2><p className="mt-3 text-sm leading-6 text-slate-400">Authentication keeps saved-project geometry, analyses and documents isolated to their owner.</p><Link href="/sign-in?redirect_url=/agents/project-development" className="mt-5 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950">Sign in</Link></div> : null}
          {isSignedIn && messages.length === 0 ? <div className="mx-auto max-w-2xl py-10 text-center"><h2 className="text-2xl font-semibold">What should we assess?</h2><p className="mt-3 text-sm leading-6 text-slate-400">Ask about site capacity, string sizing, BESS configuration, financial screening, GIS evidence or uploaded project documents.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{quickPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => setInput(prompt)} className="rounded-xl border border-white/10 bg-white/[0.025] p-4 text-left text-sm leading-6 text-slate-300 hover:border-emerald-300/25 hover:bg-emerald-300/[0.05]">{prompt}</button>)}</div></div> : null}
          {messages.map((message) => <article key={message.id} className={message.role === "user" ? "ml-auto max-w-2xl rounded-2xl bg-emerald-400 px-4 py-3 text-sm leading-7 text-slate-950" : "max-w-3xl rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4 text-sm leading-7 text-slate-200"}>
            <p className={`mb-2 text-[10px] font-bold uppercase tracking-[0.14em] ${message.role === "user" ? "text-slate-800" : "text-emerald-300"}`}>{message.role === "user" ? "You" : "SolarDev Agent"}</p>
            {message.parts.map((part, index) => {
              if (part.type === "text") return <div key={index} className="whitespace-pre-wrap">{part.text}</div>;
              if (isToolUIPart(part)) return <div key={index} className="my-2 rounded-lg border border-sky-300/15 bg-sky-300/[0.04] px-3 py-2 text-xs text-sky-100/80">{part.state === "output-available" ? "Calculated" : "Using"}: {readableToolName(getToolName(part))}</div>;
              return null;
            })}
          </article>)}
          {error ? <div className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-3 text-sm text-rose-200">{error.message}</div> : null}
        </div>

        <form onSubmit={(event) => void submit(event)} className="border-t border-white/10 p-4 sm:p-5">
          <div className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950 p-2 focus-within:border-emerald-300/30">
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); } }} disabled={!isSignedIn} rows={2} placeholder="Ask a solar or BESS engineering question…" className="min-h-14 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600" />
            {busy ? <button type="button" onClick={stop} className="self-end rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold">Stop</button> : <button type="submit" disabled={!input.trim() || !isSignedIn} className="self-end rounded-xl bg-emerald-400 px-4 py-3 text-xs font-bold text-slate-950 disabled:opacity-40">Send</button>}
          </div>
        </form>
      </section>
    </div>
  );
}
