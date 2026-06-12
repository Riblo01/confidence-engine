# AI Confidence Engine — Kubernetes RCA Validation

> Hackathon-ready demo · React + TypeScript + Tailwind CSS · Zero backend · All mock data

Public repo: [github.com/Riblo01/confidence-engine](https://github.com/Riblo01/confidence-engine)

---

## What Is This?

The **AI Confidence Engine** is a validation layer that sits between an AI DevOps/SRE triage agent and the engineering team acting on its output.

It answers one critical question: **Can I trust this AI-generated RCA?**

It does NOT generate RCA itself. It receives an RCA already produced from an AI SRE analysis prompt or any AI triage assistant and evaluates whether that RCA is trustworthy, evidence-complete, consistent, and operationally sound.

For the current product narrative and presentation assets, use:

- [Docs index](docs/README.md)
- [Main flow diagram](docs/visuals/ai-confidence-engine-main-flow.excalidraw)
- [Main flow PNG](docs/visuals/ai-confidence-engine-main-flow.png)
- [5-minute speech](docs/presentation/ai-confidence-engine-speech.md)

---

## Problem Statement

AI agents can analyze Kubernetes incidents and produce Root Cause Analysis summaries using data from Dynatrace, CloudWatch, Prometheus, Loki, and other observability tools.

**But how does the team know if the AI-generated RCA is correct?**

- What if the agent missed critical evidence?
- What if the proposed root cause contradicts observed signals?
- What if the recommendation is based on incomplete data?

Acting on a flawed RCA wastes engineering time and risks incorrect remediation. The Confidence Engine adds an evidence-based validation gate before the team acts.

---

## Flow

```
Kubernetes Incident
      ↓
AI SRE Analysis Prompt / Internal AI triage assistant
      ↓ produces RCA
Confidence Engine
      ├── Evidence Validation (claim × source × status)
      ├── Pattern Matching (10 Kubernetes operational patterns)
      ├── Historical Similarity (matched previous incidents)
      ├── Contradiction Risk Analysis
      └── Scoring (weighted formula)
      ↓
Confidence Score + Verdict
      ├── Trusted RCA (≥ 85%) → Proceed
      ├── Needs Human Review (65–84%) → Validate first
      └── Low Confidence RCA (< 65%) → Full investigation required
      ↓
Engineer Feedback → (future) DynamoDB Learning Loop
```

---

## Scoring Formula

```
overall_score =
  evidence_quality     × 0.30
  + rca_consistency    × 0.25
  + historical_similarity × 0.20
  + operational_completeness × 0.15
  + contradiction_score × 0.10

where contradiction_score = 100 - contradiction_risk
```

**Confidence Levels:**
- 85–100: High → Trusted RCA
- 65–84: Medium → Needs Human Review
- 40–64: Low → Low Confidence RCA
- 0–39: Very Low → Low Confidence RCA

**Verdict downgrade**: if `contradiction_risk > 50`, verdict is downgraded by one level.

---

## Mock Incidents (7)

| Problem ID     | Pattern                         | Score | Verdict             |
|----------------|---------------------------------|-------|---------------------|
| P-260552295    | Deployment Migration / Canary   | 91%   | Trusted RCA         |
| P-260578120    | OOMKilled / Memory Exhaustion   | 91%   | Trusted RCA         |
| P-260564952    | Redis Saturation                | 88%   | Trusted RCA         |
| P-260590331    | HPA Max Replicas Reached        | 83%   | Needs Human Review  |
| P-260601882    | Node Pressure / Pod Evictions   | 91%   | Trusted RCA         |
| P-260612740    | RabbitMQ Consumer Backlog       | 77%   | Needs Human Review  |
| P-260623900    | Failed Deployment / CrashLoop   | 90%   | Trusted RCA         |

---

## Operational Patterns (10)

1. Deployment Migration / Canary Deployment
2. OOMKilled / Memory Exhaustion
3. Redis Saturation
4. RabbitMQ Consumer Backlog
5. HPA Max Replicas Reached
6. Node Pressure / Pod Evictions
7. Failed Deployment / CrashLoopBackOff
8. Service Mesh Routing Issue (Istio)
9. EndpointSlice / Service Endpoint Mismatch
10. Dependency Timeout

---

## Tech Stack

| Layer          | Technology            |
|----------------|-----------------------|
| UI Framework   | React 18 + TypeScript |
| Build Tool     | Vite 5                |
| Styling        | Tailwind CSS 3        |
| Icons          | Lucide React          |
| Backend        | None (all local mock) |
| Persistence    | None (memory only)    |

---

## How to Run

```bash
cd ~/confidence-engine
npm install
npm run dev
# → http://localhost:5173
```

Build for production:
```bash
npm run build
npm run preview
```

---

## How to Connect to Real Systems (Future)

| Integration            | Source                                               |
|------------------------|------------------------------------------------------|
| Incident trigger       | Dynatrace Problems API webhook                       |
| RCA input              | Kubernetes SRE analysis prompt or internal AI agent  |
| Metrics validation     | Prometheus API, CloudWatch Metrics Insights          |
| Log evidence           | Loki HTTP API, CloudWatch Logs Insights              |
| Trace evidence         | Tempo API, AWS X-Ray                                 |
| Deployment history     | Kubernetes API, ArgoCD API, GitOps webhook           |
| Pattern storage        | DynamoDB table `confidence_patterns`                 |
| Feedback storage       | DynamoDB table `confidence_feedback`                 |
| Score computation      | AWS Lambda function triggered per RCA               |
| API surface            | API Gateway + Lambda (RESTful or event-driven)       |
| OpenTelemetry          | Correlation via trace ID linking incident to RCA     |

---

## Architecture Notes

- All incident data and patterns are local TypeScript files (`src/data/`)
- Scoring logic is a pure deterministic function (`src/scoring/engine.ts`)
- No external API calls, no build-time env vars, no secrets
- Feedback is stored in component state (resets on page reload — intentional for demo)
- Extending to 7+ dimensions or new patterns requires only adding data to `src/data/incidents.ts` and `src/data/patterns.ts`

---

## License

MIT — demo use only. Not for production deployment without security and compliance review.
