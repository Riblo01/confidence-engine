import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  KeyRound,
  Boxes,
  Workflow,
  ShieldCheck,
  GitBranch,
  Cpu,
  History,
  ScrollText,
  Gauge,
  Terminal,
  Sparkles,
} from 'lucide-react';
import type { EvaluationTemplate, TemplateDimension, TemplateVerdict } from '../types';
import { evaluationTemplates, getTemplateById } from '../data/evaluationTemplates';
import { calculateTemplateScore, effectiveScore, isRiskDimension } from '../scoring/templateEngine';
import './DeveloperDemo.css';

/* ──────────────────────────────────────────────────────────────────────────
   Tiny, robust per-line syntax highlighter (hand tokenizer — no regex soup).
   ────────────────────────────────────────────────────────────────────────── */

const KEYWORDS = new Set([
  'from', 'import', 'def', 'class', 'return', 'if', 'else', 'elif', 'for', 'in',
  'await', 'async', 'const', 'let', 'var', 'new', 'export', 'as', 'with', 'lambda',
  'while', 'not', 'and', 'or', 'True', 'False', 'None', 'true', 'false', 'null',
]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightLine(line: string): string {
  let out = '';
  let i = 0;
  const n = line.length;
  while (i < n) {
    const ch = line[i];
    // line / trailing comments
    if (ch === '#' || (ch === '/' && line[i + 1] === '/')) {
      out += `<span class="tok-com">${escapeHtml(line.slice(i))}</span>`;
      break;
    }
    // strings
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1;
      while (j < n && line[j] !== ch) {
        if (line[j] === '\\') j += 1;
        j += 1;
      }
      const str = line.slice(i, Math.min(j + 1, n));
      out += `<span class="tok-str">${escapeHtml(str)}</span>`;
      i = j + 1;
      continue;
    }
    // identifiers
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(line[j])) j += 1;
      const word = line.slice(i, j);
      if (KEYWORDS.has(word)) out += `<span class="tok-kw">${word}</span>`;
      else if (/^[A-Z]/.test(word)) out += `<span class="tok-type">${word}</span>`;
      else if (line[j] === '(') out += `<span class="tok-fn">${word}</span>`;
      else out += escapeHtml(word);
      i = j;
      continue;
    }
    // numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9._]/.test(line[j])) j += 1;
      out += `<span class="tok-num">${line.slice(i, j)}</span>`;
      i = j;
      continue;
    }
    out += escapeHtml(ch);
    i += 1;
  }
  return out;
}

function highlight(code: string): string {
  return code.split('\n').map(highlightLine).join('\n');
}

function CodeBlock({ code, lang, file }: { code: string; lang: string; file?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      },
      () => undefined,
    );
  }

  return (
    <div className="dp-code">
      <div className="dp-code-bar">
        <span className="dp-code-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        {file && <span className="dp-code-file">{file}</span>}
        <span className="dp-code-lang">{lang}</span>
        <button className="dp-code-copy" onClick={copy} type="button">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Playground data + helpers (reuses the real scoring engine).
   ────────────────────────────────────────────────────────────────────────── */

const MODELS = [
  'claude-sonnet-4-6',
  'claude-opus-4-8',
  'gpt-4o',
  'llama-3.1-70b',
  'gemini-2.0-flash',
];

const SAMPLE_OUTPUTS: Record<string, string> = {
  generic_output_validation:
    'Based on the attached report, the recommended action is to migrate the billing service to the new pricing API before the end of the quarter to avoid double-charging customers.',
  kubernetes_rca:
    'Root cause: the payments-api pods were OOMKilled after the 14:02 deploy raised the JVM heap above the 512Mi memory limit, triggering a CrashLoopBackOff and 5xx spike on checkout.',
  spec_to_code:
    'Implemented POST /v1/refunds per the spec: validates idempotency key, writes a refund row, emits refund.created. Added 6 unit tests; auth middleware reused from orders.',
  soc_investigation:
    'Assessment: the alert on host WIN-4471 is a true positive — credential dumping via LSASS access, matching MITRE T1003.001, with a follow-on outbound beacon to 51.83.x.x.',
  customer_support:
    'You can reset the 2FA on your account from Settings → Security → Reset authenticator. A backup code was emailed to the address on file; the old device is now disabled.',
  compliance_review:
    'The vendor DPA meets GDPR Art. 28 requirements: sub-processor list, audit rights and SCCs are present. One gap: breach-notification window is 96h vs the required 72h.',
  multi_agent_workflow:
    'Consensus reached: 3 of 4 agents agree the incident stems from the cache eviction change. The planner and the verifier flag a residual risk in the rollback ordering step.',
};

const ENDPOINT_LABEL: Record<string, string> = {
  generic_output_validation: 'Any LLM output',
  kubernetes_rca: 'Incident RCA',
  spec_to_code: 'Generated code',
  soc_investigation: 'Security analysis',
  customer_support: 'Support reply',
  compliance_review: 'Compliance review',
  multi_agent_workflow: 'Multi-agent output',
};

type Decision = 'auto_approve' | 'route_to_human' | 'block';

const DECISION_FOR: Record<TemplateVerdict, Decision> = {
  Trusted: 'auto_approve',
  'Needs Human Review': 'route_to_human',
  'Low Confidence': 'block',
};

const DECISION_META: Record<Decision, { label: string; action: string; tone: string }> = {
  auto_approve: {
    label: 'auto_approve',
    action: 'Ship automatically — confidence is above your trusted threshold.',
    tone: 'ok',
  },
  route_to_human: {
    label: 'route_to_human',
    action: 'Pause and route to a human reviewer before this output is acted on.',
    tone: 'warn',
  },
  block: {
    label: 'block',
    action: 'Block the output and ask the generating system for more evidence.',
    tone: 'bad',
  },
};

// Rebalance enabled dimension weights to sum to 100 so the live preview is clean.
function rebalance(dims: TemplateDimension[]): TemplateDimension[] {
  const enabled = dims.filter((d) => d.enabled);
  const total = enabled.reduce((s, d) => s + d.weight, 0);
  if (enabled.length === 0 || total === 100 || total <= 0) return dims;
  const scaled = enabled.map((d) => ({ id: d.id, weight: Math.round((d.weight / total) * 100) }));
  const delta = 100 - scaled.reduce((s, d) => s + d.weight, 0);
  scaled[0] = { ...scaled[0], weight: scaled[0].weight + delta };
  const byId = new Map(scaled.map((d) => [d.id, d.weight]));
  return dims.map((d) => (d.enabled ? { ...d, weight: byId.get(d.id) ?? d.weight } : d));
}

function cloneTemplate(id: string): EvaluationTemplate {
  const t = structuredClone(getTemplateById(id));
  return { ...t, dimensions: rebalance(t.dimensions) };
}

function Playground() {
  const [templateId, setTemplateId] = useState('kubernetes_rca');
  const [model, setModel] = useState('claude-sonnet-4-6');
  const [template, setTemplate] = useState<EvaluationTemplate>(() => cloneTemplate('kubernetes_rca'));
  const [output, setOutput] = useState(SAMPLE_OUTPUTS.kubernetes_rca);
  const [sent, setSent] = useState(true);
  const [latency, setLatency] = useState(243);

  const result = useMemo(() => calculateTemplateScore(template), [template]);
  const enabled = template.dimensions.filter((d) => d.enabled);
  const decision = DECISION_FOR[result.verdict];
  const meta = DECISION_META[decision];

  function selectTemplate(id: string) {
    setTemplateId(id);
    setTemplate(cloneTemplate(id));
    setOutput(SAMPLE_OUTPUTS[id] ?? '');
    setSent(false);
  }

  function setDimScore(id: string, value: number) {
    setTemplate((prev) => ({
      ...prev,
      dimensions: prev.dimensions.map((d) => (d.id === id ? { ...d, example_score: value } : d)),
    }));
  }

  function run() {
    setLatency(180 + Math.floor(Math.random() * 160));
    setSent(true);
  }

  const responseJson = sent
    ? JSON.stringify(
        {
          id: 'ce_eval_3f9ad1c0',
          object: 'confidence.evaluation',
          template: template.id,
          model_under_eval: model,
          confidence_score: result.score,
          confidence_level: result.confidenceLevel,
          verdict: result.verdict,
          decision,
          dimensions: enabled.map((d) => ({
            id: d.id,
            score: isRiskDimension(d) ? d.example_score : effectiveScore(d),
            weight: d.weight,
          })),
          risks: result.warnings,
          recommended_action: meta.action,
          latency_ms: latency,
        },
        null,
        2,
      )
    : '// Configure the request and press “Run evaluation”.';

  return (
    <div className="dp-pg">
      {/* Request side */}
      <div className="dp-pg-request">
        <div className="dp-pg-head">
          <span className="dp-method">POST</span>
          <code className="dp-route">/v1/evaluate</code>
        </div>

        <label className="dp-field">
          <span>Template</span>
          <div className="dp-chiprow">
            {evaluationTemplates.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`dp-chip ${templateId === t.id ? 'is-active' : ''}`}
                onClick={() => selectTemplate(t.id)}
              >
                {ENDPOINT_LABEL[t.id] ?? t.name}
              </button>
            ))}
          </div>
        </label>

        <label className="dp-field">
          <span>
            Model under evaluation
            <em>any provider — the engine only scores the output</em>
          </span>
          <select value={model} onChange={(e) => setModel(e.target.value)} className="dp-select">
            {MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="dp-field">
          <span>Generated output</span>
          <textarea
            className="dp-textarea"
            value={output}
            onChange={(e) => {
              setOutput(e.target.value);
              setSent(false);
            }}
            rows={4}
            spellCheck={false}
          />
        </label>

        <div className="dp-field">
          <span className="dp-field-label">
            Evidence signals
            <em>drag to simulate the evidence your pipeline passes in</em>
          </span>
          <div className="dp-sliders">
            {enabled.map((d) => (
              <div className="dp-slider" key={d.id}>
                <div className="dp-slider-top">
                  <span>{d.name}</span>
                  <b>{d.example_score}</b>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={d.example_score}
                  onChange={(e) => setDimScore(d.id, Number(e.target.value))}
                  style={{ ['--fill' as string]: `${d.example_score}%` }}
                />
                {isRiskDimension(d) && <small className="dp-risk-tag">risk · inverted</small>}
              </div>
            ))}
          </div>
        </div>

        <button className="dp-run" type="button" onClick={run}>
          <Terminal size={15} />
          Run evaluation
        </button>
      </div>

      {/* Response side */}
      <div className="dp-pg-response">
        <div className={`dp-verdict dp-verdict--${meta.tone} ${sent ? 'is-live' : 'is-idle'}`}>
          <div className="dp-gauge" style={{ ['--val' as string]: `${result.score}` }}>
            <div className="dp-gauge-inner">
              <strong>{sent ? result.score : '—'}</strong>
              <span>score</span>
            </div>
          </div>
          <div className="dp-verdict-body">
            <span className="dp-status">{sent ? '200 OK' : 'awaiting request'}</span>
            <h4>{sent ? result.verdict : 'No evaluation yet'}</h4>
            <div className={`dp-decision dp-decision--${meta.tone}`}>
              decision: <code>{sent ? meta.label : '—'}</code>
            </div>
            <p>{sent ? meta.action : 'Press Run evaluation to score the output above.'}</p>
          </div>
        </div>

        {sent && (
          <div className="dp-dims">
            {enabled.map((d) => {
              const eff = effectiveScore(d);
              return (
                <div className="dp-dim" key={d.id}>
                  <div className="dp-dim-top">
                    <span>{d.name}</span>
                    <b>{eff}</b>
                  </div>
                  <div className="dp-dim-bar">
                    <i style={{ width: `${eff}%` }} />
                  </div>
                  <small>weight {d.weight}%</small>
                </div>
              );
            })}
          </div>
        )}

        {sent && result.warnings.length > 0 && (
          <ul className="dp-warnings">
            {result.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}

        <CodeBlock code={responseJson} lang="json" file="200 — response" />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Static content
   ────────────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Cpu,
    title: 'Model-agnostic',
    body: 'Score outputs from Claude, GPT, Llama, Gemini or your own fine-tune. The engine evaluates the output, never the weights.',
  },
  {
    icon: Gauge,
    title: 'Configurable templates',
    body: 'Pick the dimensions, weights, evidence requirements and downgrade rules per use case. No retraining, just config.',
  },
  {
    icon: ShieldCheck,
    title: 'Evidence & contradiction checks',
    body: 'Every claim is matched to evidence. Contradictions and missing-evidence flags downgrade the trust decision automatically.',
  },
  {
    icon: GitBranch,
    title: 'Human-in-the-loop routing',
    body: 'A clean decision — auto_approve, route_to_human, block — that drops straight into a LangGraph conditional edge.',
  },
  {
    icon: History,
    title: 'Learning loop',
    body: 'Reviewer feedback recalibrates weights over time, so confidence tracks your real outcomes instead of a static rubric.',
  },
  {
    icon: ScrollText,
    title: 'Audit trail',
    body: 'Every evaluation is recorded with its score, evidence and decision — the paper trail regulated workflows require.',
  },
];

const LC_CODE = `from langchain_anthropic import ChatAnthropic
from confidence_engine.langchain import with_confidence

llm = ChatAnthropic(model="claude-sonnet-4-6")
chain = prompt | llm

# Wrap any Runnable. Every output is scored as it leaves the chain.
guarded = with_confidence(
    chain,
    template="generic_output_validation",
    block_below=60,            # auto-raise on low confidence
)

res = guarded.invoke({"question": user_question})

res.confidence.score          # 82.4
res.confidence.decision        # "route_to_human"
res.confidence.risks           # ["contradiction_risk above 30% ..."]`;

const LG_CODE = `from langgraph.graph import StateGraph, START, END
from confidence_engine.langgraph import confidence_gate

graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_node("confidence", confidence_gate(template="kubernetes_rca"))
graph.add_node("human_review", human_review_node)

graph.add_edge(START, "agent")
graph.add_edge("agent", "confidence")

# Route the run on the trust decision the engine writes to state.
graph.add_conditional_edges(
    "confidence",
    lambda s: s["confidence"].decision,
    {
        "auto_approve": END,
        "route_to_human": "human_review",
        "block": END,
    },
)
app = graph.compile()`;

const CURL_CODE = `curl https://api.confidence-engine.ai/v1/evaluate \\
  -H "Authorization: Bearer $CONFIDENCE_ENGINE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template": "kubernetes_rca",
    "model_under_eval": "claude-sonnet-4-6",
    "output": "Root cause: OOMKill on payments-api after the 14:02 deploy ...",
    "evidence": { "logs": "...", "metrics": "...", "events": "..." }
  }'`;

export default function DeveloperDemo({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'langchain' | 'langgraph' | 'rest'>('langchain');

  return (
    <div className="dev-portal">
      <div className="dp-bg" aria-hidden>
        <div className="dp-grid" />
        <div className="dp-glow dp-glow--a" />
        <div className="dp-glow dp-glow--b" />
        <div className="dp-noise" />
      </div>

      {/* Nav */}
      <header className="dp-nav">
        <button className="dp-back" type="button" onClick={onBack}>
          <ArrowLeft size={15} />
          Back to product
        </button>
        <div className="dp-brand">
          <span className="dp-brand-mark">
            <ShieldCheck size={15} />
          </span>
          Confidence Engine
          <em>API</em>
        </div>
        <nav className="dp-nav-links">
          <a href="#quickstart">Quickstart</a>
          <a href="#playground">Playground</a>
          <a href="#integrations">Integrations</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className="dp-nav-cta" href="#pricing">
          <KeyRound size={14} />
          Get API key
        </a>
      </header>

      {/* Hero */}
      <section className="dp-hero">
        <div className="dp-hero-copy">
          <span className="dp-eyebrow">
            <Sparkles size={13} />
            Confidence scoring API for LLM apps & agents
          </span>
          <h1>
            Ship AI features your users <span className="dp-hl">can trust.</span>
          </h1>
          <p>
            Confidence Engine is an API and SDK that scores every model output, flags weak evidence
            and contradictions, and returns a trust decision your code can act on. Drop it into
            <strong> LangChain</strong> and <strong>LangGraph</strong> in a few lines — no retraining,
            no model lock-in.
          </p>
          <div className="dp-hero-actions">
            <a className="dp-btn dp-btn--primary" href="#quickstart">
              <KeyRound size={16} />
              Get your API key
            </a>
            <a className="dp-btn dp-btn--ghost" href="#playground">
              Try the playground
              <ArrowRight size={16} />
            </a>
          </div>
          <div className="dp-hero-badges">
            <span>
              <Workflow size={13} /> LangChain
            </span>
            <span>
              <Boxes size={13} /> LangGraph
            </span>
            <span>
              <Cpu size={13} /> Model-agnostic
            </span>
          </div>
        </div>

        <div className="dp-hero-terminal">
          <CodeBlock
            file="quickstart.py"
            lang="python"
            code={`pip install confidence-engine

from confidence_engine import ConfidenceEngine

ce = ConfidenceEngine(api_key="ce_live_…")

report = ce.evaluate(
    template="generic_output_validation",
    model_under_eval="claude-sonnet-4-6",
    output=agent_answer,
)

report.score      # 82.4
report.decision    # "route_to_human"`}
          />
          <div className="dp-hero-pill">
            <Gauge size={14} />
            <span>
              <b>82.4</b> confidence · <b>route_to_human</b>
            </span>
          </div>
        </div>
      </section>

      {/* Quickstart steps */}
      <section className="dp-section" id="quickstart">
        <div className="dp-section-head">
          <span className="dp-kicker">Quickstart</span>
          <h2>Three steps to a trust decision</h2>
        </div>
        <div className="dp-steps">
          <article>
            <span className="dp-step-no">01</span>
            <h3>
              <KeyRound size={16} /> Get an API key
            </h3>
            <p>Create a project and grab a key. Set it once as an environment variable.</p>
            <CodeBlock lang="bash" code={`export CONFIDENCE_ENGINE_API_KEY="ce_live_…"`} />
          </article>
          <article>
            <span className="dp-step-no">02</span>
            <h3>
              <Workflow size={16} /> Wrap your chain or graph
            </h3>
            <p>Add the SDK to an existing LangChain Runnable or a LangGraph node.</p>
            <CodeBlock
              lang="python"
              code={`from confidence_engine.langchain import with_confidence

guarded = with_confidence(chain, template="generic_output_validation")`}
            />
          </article>
          <article>
            <span className="dp-step-no">03</span>
            <h3>
              <Gauge size={16} /> Read the score
            </h3>
            <p>Every output now carries a score, risks and a decision you can branch on.</p>
            <CodeBlock
              lang="python"
              code={`res = guarded.invoke(inputs)

if res.confidence.decision == "block":
    raise NeedsMoreEvidence(res.confidence.risks)`}
            />
          </article>
        </div>
      </section>

      {/* Playground */}
      <section className="dp-section" id="playground">
        <div className="dp-section-head">
          <span className="dp-kicker">Live playground</span>
          <h2>Send a request, get a real score</h2>
          <p className="dp-section-sub">
            This runs the actual scoring engine in your browser. Change the template, the model or the
            evidence signals and watch the confidence and the trust decision move.
          </p>
        </div>
        <Playground />
      </section>

      {/* Integrations */}
      <section className="dp-section" id="integrations">
        <div className="dp-section-head">
          <span className="dp-kicker">Integrations</span>
          <h2>Built for the way you already build agents</h2>
        </div>

        <div className="dp-tabs">
          <button
            className={tab === 'langchain' ? 'is-active' : ''}
            type="button"
            onClick={() => setTab('langchain')}
          >
            <Workflow size={14} /> LangChain
          </button>
          <button
            className={tab === 'langgraph' ? 'is-active' : ''}
            type="button"
            onClick={() => setTab('langgraph')}
          >
            <Boxes size={14} /> LangGraph
          </button>
          <button
            className={tab === 'rest' ? 'is-active' : ''}
            type="button"
            onClick={() => setTab('rest')}
          >
            <Terminal size={14} /> REST
          </button>
        </div>

        <div className="dp-integration">
          {tab === 'langchain' && (
            <>
              <CodeBlock file="langchain_app.py" lang="python" code={LC_CODE} />
              <div className="dp-integration-note">
                <h4>One wrapper around any Runnable</h4>
                <p>
                  <code>with_confidence</code> scores the output of any chain — prompt | model, RAG
                  pipeline or tool-calling agent — and attaches a <code>confidence</code> report to the
                  result. Set <code>block_below</code> to raise automatically on weak outputs.
                </p>
              </div>
            </>
          )}
          {tab === 'langgraph' && (
            <>
              <CodeBlock file="agent_graph.py" lang="python" code={LG_CODE} />
              <div className="dp-integration-note">
                <h4>A confidence gate as a graph node</h4>
                <div className="dp-graph">
                  <span className="dp-gnode">agent</span>
                  <ArrowRight size={14} />
                  <span className="dp-gnode dp-gnode--gate">confidence</span>
                  <div className="dp-gbranch">
                    <span className="dp-gnode dp-gnode--ok">auto_approve → END</span>
                    <span className="dp-gnode dp-gnode--warn">route_to_human</span>
                    <span className="dp-gnode dp-gnode--bad">block → END</span>
                  </div>
                </div>
                <p>
                  <code>confidence_gate</code> writes the score and decision to graph state, so a normal{' '}
                  <code>add_conditional_edges</code> routes the run — no custom plumbing.
                </p>
              </div>
            </>
          )}
          {tab === 'rest' && (
            <>
              <CodeBlock file="terminal" lang="bash" code={CURL_CODE} />
              <div className="dp-integration-note">
                <h4>Plain HTTP for everything else</h4>
                <p>
                  No framework? Call the REST endpoint directly from any language. Pass the output and
                  evidence; get back a score, the triggered risks and a decision. Same contract the SDKs
                  use under the hood.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="dp-section">
        <div className="dp-section-head">
          <span className="dp-kicker">Why a separate trust layer</span>
          <h2>The engine evaluates — your model just generates</h2>
        </div>
        <div className="dp-features">
          {FEATURES.map((f) => (
            <article key={f.title}>
              <span className="dp-feature-icon">
                <f.icon size={17} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="dp-section" id="pricing">
        <div className="dp-section-head">
          <span className="dp-kicker">Pricing</span>
          <h2>Start free, scale per evaluation</h2>
        </div>
        <div className="dp-pricing">
          <article className="dp-plan">
            <h3>Developer</h3>
            <div className="dp-price">
              $0<span>/mo</span>
            </div>
            <ul>
              <li>10k evaluations / month</li>
              <li>All templates</li>
              <li>LangChain & LangGraph SDKs</li>
              <li>Community support</li>
            </ul>
            <a className="dp-btn dp-btn--ghost" href="#">
              Get API key
            </a>
          </article>
          <article className="dp-plan dp-plan--featured">
            <span className="dp-plan-tag">Most popular</span>
            <h3>Team</h3>
            <div className="dp-price">
              $0.004<span>/eval</span>
            </div>
            <ul>
              <li>Unlimited evaluations</li>
              <li>Custom templates & weights</li>
              <li>Human-review routing + audit trail</li>
              <li>Learning loop & calibration</li>
            </ul>
            <a className="dp-btn dp-btn--primary" href="#">
              <KeyRound size={15} /> Start building
            </a>
          </article>
          <article className="dp-plan">
            <h3>Enterprise</h3>
            <div className="dp-price">Custom</div>
            <ul>
              <li>VPC / on-prem deployment</li>
              <li>SSO, RBAC, data residency</li>
              <li>Dedicated calibration models</li>
              <li>SLA & solutions engineering</li>
            </ul>
            <a className="dp-btn dp-btn--ghost" href="#">
              Talk to us
            </a>
          </article>
        </div>
      </section>

      <footer className="dp-footer">
        <div className="dp-brand">
          <span className="dp-brand-mark">
            <ShieldCheck size={14} />
          </span>
          Confidence Engine
        </div>
        <p>External systems generate. Confidence Engine evaluates. Humans decide. The platform learns.</p>
        <button className="dp-back" type="button" onClick={onBack}>
          <ArrowLeft size={14} /> Back to product
        </button>
      </footer>
    </div>
  );
}
