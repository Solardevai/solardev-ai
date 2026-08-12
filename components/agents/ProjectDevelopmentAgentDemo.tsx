"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import {
  ArrowUp,
  Check,
  ChevronDown,
  FilePlus2,
  LoaderCircle,
  LogIn,
  Pause,
  Settings2,
  Sparkles,
  Volume2,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { PersonaState } from "@/components/ai-elements/persona";
import type { SolarAgentUIMessage } from "@/lib/agent/solar-agent";

const MessageResponse = dynamic(() =>
  import("@/components/ai-elements/message").then(
    (module) => module.MessageResponse,
  ),
);

const Persona = dynamic(
  () =>
    import("@/components/ai-elements/persona").then(
      (module) => module.Persona,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="size-24 animate-pulse rounded-full bg-emerald-100/70" />
    ),
  },
);

const subscribeToWideViewport = (onStoreChange: () => void) => {
  const query = window.matchMedia("(min-width: 1280px)");
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
};

const getWideViewportSnapshot = () =>
  window.matchMedia("(min-width: 1280px)").matches;

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

const projectQuickPrompts = [
  {
    label: "Indicative capacity",
    description: "Gross area, usable fraction and DC planning density",
    prompt:
      "Estimate indicative PV DC capacity from this project's gross site area. Separate gross area, assumed usable area and planning density, and state what a layout must still verify.",
  },
  {
    label: "Development priorities",
    description: "Rank evidence-backed risks and next actions",
    prompt:
      "Rank the three most material development risks in the available project evidence. For each, state the evidence, uncertainty, owner and recommended next action.",
  },
  {
    label: "DC/AC basis",
    description: "Calculate the ratio or identify missing design inputs",
    prompt:
      "Using the available project inputs, calculate the PV DC/AC ratio. If either capacity is missing, list the exact input required and explain the design evidence needed before fixing the ratio.",
  },
  {
    label: "Evidence gap register",
    description: "Separate confirmed inputs, assumptions and gaps",
    prompt:
      "Prepare a concise evidence gap register: confirmed project inputs, assumptions, missing evidence, decision impact and recommended next action.",
  },
] as const;

const generalQuickPrompts = [
  {
    label: "PV screening brief",
    description: "Build a structured utility-scale input checklist",
    prompt:
      "Create a utility-scale solar PV screening input checklist, grouped by land, grid, planning, environment, resource, design and commercial workstreams.",
  },
  {
    label: "Hybrid sizing basis",
    description: "Separate PV, grid and BESS sizing parameters",
    prompt:
      "What project inputs are required to size a co-located solar PV and BESS project without confusing PV AC rating, grid export capacity, BESS power and usable energy?",
  },
  {
    label: "DC/AC decision",
    description: "Review engineering and commercial trade-offs",
    prompt:
      "Explain the engineering and commercial trade-offs that determine a utility-scale PV DC/AC ratio, and list the evidence needed before selecting a project value.",
  },
  {
    label: "Development data room",
    description: "Create a stage-gated evidence index",
    prompt:
      "Create a stage-gated data-room index for a utility-scale solar or BESS project, distinguishing screening evidence from detailed-design evidence.",
  },
] as const;

const toolLabels: Record<string, string> = {
  calculateDcAcRatio: "PV DC/AC ratio",
  estimateLandCapacity: "land-to-capacity screen",
  sizePvString: "PV string voltage screen",
  estimateBess: "BESS duration and container screen",
  calculateFinancialMetrics: "financial screen",
  searchProjectKnowledge: "project evidence search",
};

function optionalNumber(value: string) {
  const parsed = Number(value);
  return value.trim() && Number.isFinite(parsed) ? parsed : undefined;
}

function readableToolName(value: string) {
  return (
    toolLabels[value] ??
    value
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (letter) => letter.toUpperCase())
  );
}

function projectTechnologyLabel(value: string) {
  if (value === "bess") return "BESS";
  if (value === "hybrid") return "Solar PV + BESS";
  return "Solar PV";
}

function projectStageLabel(value: string) {
  if (value === "due-diligence") return "Due diligence";
  if (value === "development") return "Development";
  return "Screening";
}

function readableError(error: Error) {
  try {
    const parsed = JSON.parse(error.message) as { error?: unknown };
    if (typeof parsed.error === "string") return parsed.error;
  } catch {
    // The AI SDK may already provide a plain-text message.
  }
  return error.message || "The Engineering Copilot could not complete the request.";
}

function messageText(message: SolarAgentUIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function speechText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " Code block omitted. ")
    .replace(/[#*_>`~\[\]()|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function SolarDevMark({ dark = false }: { dark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative block h-8 w-8 rounded-xl ${dark ? "bg-[#0b2a21]" : "bg-white"}`}
    >
      <span className="absolute bottom-2 left-[7px] h-3.5 w-1.5 -skew-y-12 rounded-sm bg-lime-300" />
      <span className="absolute bottom-2 left-[14px] h-5 w-1.5 -skew-y-12 rounded-sm bg-lime-300" />
      <span className="absolute bottom-2 left-[21px] h-4 w-1.5 -skew-y-12 rounded-sm bg-lime-300" />
    </span>
  );
}

export default function ProjectDevelopmentAgentDemo({
  projects,
  initialProjectId,
  isSignedIn,
}: Props) {
  const [input, setInput] = useState("");
  const [projectId, setProjectId] = useState(initialProjectId ?? "");
  const [pvDcMw, setPvDcMw] = useState("");
  const [pvAcMw, setPvAcMw] = useState("");
  const [bessPowerMw, setBessPowerMw] = useState("");
  const [bessEnergyMwh, setBessEnergyMwh] = useState("");
  const [documentStatus, setDocumentStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSupported = useSyncExternalStore(
    () => () => undefined,
    () => "speechSynthesis" in window,
    () => false,
  );
  const showAnimatedPersona = useSyncExternalStore(
    subscribeToWideViewport,
    getWideViewportSnapshot,
    () => false,
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === projectId),
    [projectId, projects],
  );
  const activeQuickPrompts = selectedProject
    ? projectQuickPrompts
    : generalQuickPrompts;
  const agentTransport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agents/solar" }),
    [],
  );

  const { messages, sendMessage, status, error, stop } =
    useChat<SolarAgentUIMessage>({
      transport: agentTransport,
    });

  const busy = status === "submitted" || status === "streaming";
  const latestAssistantText = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].role === "assistant") {
        const text = messageText(messages[index]);
        if (text) return text;
      }
    }
    return "";
  }, [messages]);

  const personaState: PersonaState = busy
    ? "thinking"
    : isSpeaking
      ? "speaking"
      : "idle";

  const personaStatus = busy
    ? "Reviewing the project and running engineering tools"
    : isSpeaking
      ? "Reading the latest answer"
      : latestAssistantText
        ? "Ready for your follow-up"
        : "Ready when you are";

  const manualInputs = {
    pvDcMw: optionalNumber(pvDcMw),
    pvAcMw: optionalNumber(pvAcMw),
    bessPowerMw: optionalNumber(bessPowerMw),
    bessEnergyMwh: optionalNumber(bessEnergyMwh),
  };
  const manualInputCount = Object.values(manualInputs).filter(
    (value) => typeof value === "number" && value > 0,
  ).length;
  const contextModeLabel = selectedProject
    ? "Project context loaded"
    : "General advisory mode";
  const voiceButtonLabel = !speechSupported
    ? "Voice unavailable"
    : busy
      ? "Available when complete"
      : !latestAssistantText
        ? "Available after an answer"
        : "Speak latest answer";

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? "smooth" : "auto",
      block: "end",
    });
  }, [messages, busy]);

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || busy || !isSignedIn) return;
    setInput("");
    await sendMessage(
      { text },
      { body: { projectId: projectId || undefined, manualInputs } },
    );
  }

  function choosePrompt(prompt: string) {
    setInput(prompt);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function stopSpeaking() {
    if (speechSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  function speakLatestAnswer() {
    if (!speechSupported || !latestAssistantText || busy) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      speechText(latestAssistantText),
    );
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  async function uploadDocument(file: File | undefined) {
    if (!file || !projectId || isUploading) return;
    setIsUploading(true);
    setDocumentStatus(`Indexing ${file.name}…`);

    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch(
        `/api/agents/solar/knowledge/${projectId}`,
        { method: "POST", body },
      );
      const result = (await response.json()) as {
        document?: { name: string; chunkCount: number };
        error?: string;
      };
      setDocumentStatus(
        response.ok && result.document
          ? `${result.document.name} indexed in ${result.document.chunkCount} evidence chunks.`
          : result.error ?? "Upload failed.",
      );
    } catch {
      setDocumentStatus("The document could not be uploaded. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#f4f5f0] shadow-2xl shadow-black/30">
      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_220px]">
        <aside className="bg-[#071d17] text-white lg:min-h-[760px]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 lg:border-b-0 lg:px-6 lg:pt-6">
            <div className="flex items-center gap-3">
              <SolarDevMark dark />
              <div>
                <p className="text-sm font-bold tracking-tight">SolarDev</p>
                <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-emerald-300/70">
                  Engineering intelligence
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setContextOpen((current) => !current)}
              aria-expanded={contextOpen}
              aria-controls="agent-project-context"
              className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:border-emerald-300/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 lg:hidden"
            >
              <Settings2 className="size-4" />
              <span className="sr-only">Toggle project context</span>
            </button>
          </div>

          <div
            id="agent-project-context"
            className={`${contextOpen ? "block" : "hidden"} px-5 pb-5 lg:block lg:px-6 lg:pb-6`}
          >
            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200/60">
              Engineering context
            </p>

            <label className="mt-4 block text-[10px] font-semibold text-slate-300">
              Project context
              <span className="relative mt-1.5 block">
                <select
                  value={projectId}
                  disabled={!isSignedIn}
                  onChange={(event) => {
                    setProjectId(event.target.value);
                    setDocumentStatus("");
                  }}
                  className="min-h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5 pr-9 text-xs text-white outline-none transition focus:border-emerald-300/40 focus-visible:ring-2 focus-visible:ring-emerald-300/30 disabled:cursor-not-allowed disabled:text-slate-500"
                >
                  <option value="">
                    {isSignedIn
                      ? "General guidance (no project)"
                      : "Sign in to load saved projects"}
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              </span>
            </label>
            {!isSignedIn ? (
              <p className="mt-2 text-[9px] leading-4 text-slate-500">
                Saved project context is available after sign-in.
              </p>
            ) : null}

            {selectedProject ? (
              <dl className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.045] p-3 text-[10px]">
                <div>
                  <dt className="text-slate-500">Country / jurisdiction</dt>
                  <dd className="mt-1 text-slate-200">
                    {selectedProject.country || "Not set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Gross site area</dt>
                  <dd className="mt-1 text-slate-200">
                    {selectedProject.areaHa > 0
                      ? `${selectedProject.areaHa.toFixed(1)} ha`
                      : "Not recorded"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Technology</dt>
                  <dd className="mt-1 text-slate-200">
                    {projectTechnologyLabel(selectedProject.technology)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Stage</dt>
                  <dd className="mt-1 text-slate-200">
                    {projectStageLabel(selectedProject.status)}
                  </dd>
                </div>
              </dl>
            ) : null}

            <details className="group mt-4 rounded-xl border border-white/10 bg-white/[0.025]">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 text-[10px] font-semibold text-slate-300">
                Optional design inputs
                <ChevronDown className="size-3.5 transition group-open:rotate-180" />
              </summary>
              <fieldset
                disabled={!isSignedIn}
                className="grid grid-cols-2 gap-2 border-t border-white/10 p-3 disabled:opacity-60"
              >
                {[
                  ["PV DC capacity", "MWp", pvDcMw, setPvDcMw],
                  ["PV AC rating", "MWac", pvAcMw, setPvAcMw],
                  ["BESS power", "MW", bessPowerMw, setBessPowerMw],
                  ["BESS usable energy", "MWh", bessEnergyMwh, setBessEnergyMwh],
                ].map(([label, unit, value, setter]) => (
                  <label key={label as string} className="text-[9px] text-slate-500">
                    <span className="flex justify-between gap-1">
                      {label as string}
                      <span className="text-emerald-300/60">{unit as string}</span>
                    </span>
                    <input
                      type="number"
                      min="0.001"
                      step="any"
                      aria-label={`${label as string} (${unit as string})`}
                      value={value as string}
                      onChange={(event) =>
                        (setter as (nextValue: string) => void)(event.target.value)
                      }
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-2 text-xs text-white outline-none focus:border-emerald-300/40 focus-visible:ring-2 focus-visible:ring-emerald-300/30"
                    />
                  </label>
                ))}
                <p className="col-span-2 text-[8px] leading-4 text-slate-500">
                  User-supplied overrides. They are labelled as project inputs,
                  not verified evidence.
                </p>
              </fieldset>
            </details>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-300">
                <FilePlus2 className="size-3.5 text-emerald-300" />
                Text project evidence
              </div>
              <label
                className={`mt-2.5 block rounded-lg border border-dashed px-3 py-2.5 text-center text-[9px] transition ${
                  projectId && !isUploading
                    ? "cursor-pointer border-white/15 text-slate-400 hover:border-emerald-300/35 hover:text-slate-200"
                    : "border-white/10 text-slate-600"
                }`}
              >
                {isUploading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="size-3 animate-spin" /> Indexing
                    evidence
                  </span>
                ) : projectId ? (
                  "Add TXT, MD, CSV or JSON"
                ) : isSignedIn ? (
                  "Select a saved project first"
                ) : (
                  "Sign in to add project evidence"
                )}
                <input
                  type="file"
                  accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json"
                  disabled={!projectId || isUploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    void uploadDocument(file);
                  }}
                  className="sr-only"
                />
              </label>
              <p className="mt-2 text-[8px] leading-4 text-slate-500">
                Text formats only · 1 MB maximum. PDF and DOCX ingestion is a
                planned extension.
              </p>
              {documentStatus ? (
                <p className="mt-2 text-[9px] leading-4 text-slate-400" role="status">
                  {documentStatus}
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex items-start gap-2 border-t border-white/10 pt-4 text-[9px] leading-4 text-slate-400">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-300">
                <Check className="size-2.5" />
              </span>
              <span>
                Screening support only. Sources, project inputs, assumptions,
                calculated results and engineering judgement are separated.
              </span>
            </div>
          </div>
        </aside>

        <section className="flex min-h-[680px] min-w-0 flex-col bg-[#f4f5f0] text-[#10271f] lg:min-h-[760px]">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#10271f]/10 px-5 py-4 sm:px-7">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#17805f]">
                Solar &amp; BESS engineering copilot
              </p>
              <p className="mt-1 text-sm font-semibold">
                {selectedProject?.name ?? "General engineering guidance"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-semibold text-[#4c625a]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-[#10271f]/5">
                <span className={`size-1.5 rounded-full ${busy ? "animate-pulse bg-amber-400" : "bg-emerald-500"}`} />
                {busy ? "Working" : "Ready"}
              </span>
              <span className="hidden rounded-full bg-[#e9eeea] px-2.5 py-1.5 sm:inline-flex">
                {contextModeLabel}
              </span>
            </div>
          </header>

          <div
            className="flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8"
            aria-live="polite"
          >
            {!isSignedIn ? (
              <div className="mx-auto mt-20 max-w-md rounded-2xl border border-[#10271f]/10 bg-white p-7 text-center shadow-sm">
                <SolarDevMark />
                <h2 className="mt-5 text-xl font-semibold">
                  Sign in to open the engineering workspace
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#5d7069]">
                  Work with saved project context, GIS findings and owner-scoped
                  evidence while keeping each project private.
                </p>
                <Link
                  href="/sign-in?redirect_url=/agents/project-development"
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  <LogIn className="size-4" /> Sign in to continue
                </Link>
              </div>
            ) : null}

            {isSignedIn && messages.length === 0 ? (
              <div className="mx-auto flex min-h-[470px] max-w-3xl flex-col items-center justify-center text-center">
                <div className="xl:hidden">
                  <SolarDevMark />
                </div>
                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#17805f]">
                  {selectedProject
                    ? "Project-grounded copilot"
                    : "General engineering copilot"}
                </p>
                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  {selectedProject
                    ? "Turn project evidence into a defensible next decision."
                    : "Build the engineering basis before fixing a project value."}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#5d7069]">
                  {selectedProject
                    ? "Ask about the selected project, test assumptions and expose the evidence still needed. Supported calculations use deterministic tools."
                    : "Ask a general solar PV, BESS or development question. Select a saved project when you need project-specific conclusions."}
                </p>
                <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
                  {activeQuickPrompts.map(
                    ({ label, description, prompt }, index) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => choosePrompt(prompt)}
                        className="group flex min-h-20 items-start gap-3 rounded-xl border border-[#10271f]/10 bg-white/80 px-4 py-3 text-left text-xs leading-5 text-[#233b32] transition hover:-translate-y-0.5 hover:border-[#17805f]/30 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17805f]/50"
                      >
                        <span className="mt-0.5 font-mono text-[9px] font-bold text-[#17805f]/65">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="block font-semibold text-[#10271f]">
                            {label}
                          </span>
                          <span className="mt-0.5 block text-[#60736c]">
                            {description}
                          </span>
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </div>
            ) : null}

            {messages.length > 0 ? (
              <div className="mx-auto max-w-3xl space-y-7">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#0b2a21] px-4 py-3 text-sm leading-6 text-white sm:max-w-[78%]"
                        : "grid grid-cols-[30px_minmax(0,1fr)] gap-3"
                    }
                  >
                    {message.role === "assistant" ? (
                      <div className="flex size-7 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-[#10271f]/10">
                        <Sparkles className="size-3.5 text-[#17805f]" />
                      </div>
                    ) : null}
                    <div className={message.role === "assistant" ? "min-w-0" : ""}>
                      <p
                        className={`mb-2 text-[9px] font-bold uppercase tracking-[0.16em] ${
                          message.role === "user"
                            ? "text-emerald-100/65"
                            : "text-[#17805f]"
                        }`}
                      >
                        {message.role === "user" ? "You" : "SolarDev copilot"}
                      </p>
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return message.role === "assistant" ? (
                            <MessageResponse
                              key={index}
                              className="text-sm leading-7 text-[#243a32] [&_a]:text-[#087a58] [&_a]:underline [&_blockquote]:border-l-[#17805f]/40 [&_blockquote]:text-[#536860] [&_code]:rounded [&_code]:bg-[#e7ece8] [&_code]:px-1 [&_h1]:text-xl [&_h2]:mt-6 [&_h2]:text-lg [&_h3]:mt-5 [&_h3]:text-base [&_li]:my-1 [&_strong]:font-semibold [&_strong]:text-[#10271f]"
                            >
                              {part.text}
                            </MessageResponse>
                          ) : (
                            <p key={index}>{part.text}</p>
                          );
                        }

                        if (isToolUIPart(part)) {
                          return (
                            <div
                              key={index}
                              className="my-3 inline-flex items-center gap-2 rounded-full border border-[#17805f]/15 bg-[#e7eee9] px-3 py-1.5 text-[10px] font-semibold text-[#356153]"
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  part.state === "output-available"
                                    ? "bg-emerald-500"
                                    : "animate-pulse bg-amber-400"
                                }`}
                              />
                              {part.state === "output-available"
                                ? "Completed"
                                : "Running"}{" "}
                              {readableToolName(getToolName(part))}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </article>
                ))}

                {busy ? (
                  <div className="grid grid-cols-[30px_minmax(0,1fr)] gap-3">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-[#10271f]/10">
                      <Sparkles className="size-3.5 animate-pulse text-[#17805f]" />
                    </div>
                    <p className="pt-1 text-xs text-[#60736c]">
                      Reviewing context, evidence and calculations…
                    </p>
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-xl border border-rose-300/50 bg-rose-50 p-3 text-sm text-rose-800">
                    {readableError(error)}
                  </div>
                ) : null}
                <div ref={conversationEndRef} />
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(event) => void submit(event)}
            className="border-t border-[#10271f]/10 bg-[#f4f5f0] px-4 py-4 sm:px-6"
          >
            <div className="mx-auto max-w-3xl rounded-2xl border border-[#10271f]/15 bg-white p-2 shadow-[0_14px_35px_rgba(16,39,31,0.08)] transition focus-within:border-[#17805f]/40 focus-within:shadow-[0_14px_38px_rgba(16,39,31,0.12)]">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submit();
                  }
                }}
                disabled={!isSignedIn}
                rows={2}
                aria-label="Ask the SolarDev engineering copilot"
                placeholder={
                  selectedProject
                    ? `Ask about ${selectedProject.name}…`
                    : "Ask a solar PV, BESS or project-development question…"
                }
                className="min-h-14 w-full resize-none bg-transparent px-2.5 py-2 text-sm text-[#10271f] outline-none placeholder:text-[#7b8c85]"
              />
              <div className="flex items-center justify-between gap-3 px-2 pb-1">
                <span className="text-[9px] text-[#899790]">
                  Enter to send · Shift + Enter for a new line
                </span>
                {busy ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="flex size-10 items-center justify-center rounded-xl bg-[#0b2a21] text-white transition hover:bg-[#123d30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17805f]/60"
                  >
                    <Pause className="size-3.5" />
                    <span className="sr-only">Stop response</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() || !isSignedIn}
                    className="flex size-10 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 disabled:cursor-not-allowed disabled:bg-[#cbd5d0] disabled:text-[#71827b]"
                  >
                    <ArrowUp className="size-3.5" />
                    <span className="sr-only">Send message</span>
                  </button>
                )}
              </div>
            </div>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[8px] leading-4 text-[#8b9892]">
              Screening support only. Verify safety-critical, regulatory and
              investment decisions with qualified professionals and authoritative
              sources.
            </p>
          </form>
        </section>

        <aside className="relative hidden overflow-hidden border-l border-[#10271f]/10 bg-[#edf0e9] px-5 py-7 text-[#10271f] xl:flex xl:min-h-[760px] xl:flex-col xl:items-center">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.16),transparent_68%)]" />
          <div className="relative mt-5 flex size-36 items-center justify-center rounded-full border border-white/70 bg-white/45 shadow-[0_20px_60px_rgba(18,57,44,0.12)]">
            {showAnimatedPersona ? (
              <Persona
                state={personaState}
                variant="halo"
                className="size-32"
              />
            ) : null}
          </div>
          <p className="relative mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#17805f]">
            Sol · Engineering copilot
          </p>
          <p className="relative mt-2 min-h-10 text-center text-xs leading-5 text-[#5d7069]">
            {personaStatus}
          </p>

          <div className="relative mt-5 w-full rounded-2xl border border-[#10271f]/10 bg-white/70 p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#71827b]">
              Voice
            </p>
            <button
              type="button"
              onClick={isSpeaking ? stopSpeaking : speakLatestAnswer}
              disabled={!speechSupported || !latestAssistantText || busy}
              className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#10271f]/10 bg-white px-3 py-2.5 text-[10px] font-bold text-[#16372b] transition hover:border-[#17805f]/30 hover:bg-[#f7faf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17805f]/50 disabled:cursor-not-allowed disabled:bg-[#e4e9e5] disabled:text-[#7b8c85]"
            >
              {isSpeaking ? (
                <>
                  <Pause className="size-3.5" /> Stop speaking
                </>
              ) : (
                <>
                  <Volume2 className="size-3.5" /> {voiceButtonLabel}
                </>
              )}
            </button>
            <p className="mt-2 text-center text-[8px] leading-4 text-[#819089]">
              Browser-native playback; availability depends on your device.
            </p>
          </div>

          <div className="relative mt-4 w-full rounded-2xl border border-[#10271f]/10 bg-white/70 p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#71827b]">
              Session basis
            </p>
            <dl className="mt-3 space-y-2.5 text-[9px] leading-4">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#71827b]">Context</dt>
                <dd className="text-right font-semibold text-[#29483c]">
                  {selectedProject?.name ?? "General guidance"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#71827b]">Manual inputs</dt>
                <dd className="text-right font-semibold text-[#29483c]">
                  {manualInputCount > 0
                    ? `${manualInputCount} supplied`
                    : "None supplied"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#71827b]">Project evidence</dt>
                <dd className="text-right font-semibold text-[#29483c]">
                  {selectedProject ? "Search enabled" : "Not available"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-auto w-full border-t border-[#10271f]/10 pt-5">
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#71827b]">
              Response discipline
            </p>
            <div className="space-y-3 text-[9px] leading-4 text-[#65776f]">
              {["Sources", "Assumptions", "Calculated results"].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="flex size-4 items-center justify-center rounded-full bg-[#dce8e1] text-[#17805f]">
                    <Check className="size-2.5" />
                  </span>
                  {label} clearly labelled
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
