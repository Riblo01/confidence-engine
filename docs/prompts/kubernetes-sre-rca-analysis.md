# Kubernetes SRE RCA Analysis Prompt

Act as a senior Site Reliability Engineer (SRE) and perform a deep operational analysis for Dynatrace Problem P-260552295.

Your objective is to identify the most probable root cause of the incident using all available observability sources.

## Tasks

Retrieve and analyze the Dynatrace problem details.

Identify:

- affected entities
- root cause entity
- impacted services
- severity
- event timeline
- evidence details

Search and correlate:

- application logs
- Kubernetes events
- pod restarts
- traces and spans
- infrastructure metrics
- CPU throttling
- memory pressure
- OOMKilled events
- latency spikes
- HTTP 4xx/5xx errors
- deployment or rollout events
- autoscaling events

Use Loki logs, Tempo traces, Prometheus metrics and Dynatrace evidence together.

Correlate logs and traces using:

- trace_id
- span_id
- pod name
- deployment name
- namespace
- transactionId

Ignore INFO logs without operational relevance unless directly correlated to the incident.

Prioritize:

- ERROR
- WARN
- exceptions
- infrastructure degradation
- failing dependencies

Distinguish clearly between:

- symptoms
- correlated events
- inferred hypotheses
- validated findings

Do not assume root cause without evidence.

If evidence is insufficient, explicitly indicate uncertainty.

## Expected Output Structure

### Incident Summary

- Problem ID
- Severity
- Time window
- Affected services
- Business impact

### Timeline

Chronological sequence of important events.

### Findings

Validated operational findings with evidence.

### Logs Analysis

Relevant errors, exceptions and operational signals.

### Traces Analysis

Failed spans, latency bottlenecks, dependency failures.

### Kubernetes Analysis

Pod restarts, throttling, scaling, node issues, deployments.

### Metrics Analysis

CPU, memory, error rate, latency, saturation.

### Root Cause Analysis

Most probable root cause with confidence level.

### Confidence Level

- High
- Medium
- Low

### Recommended Actions

Immediate mitigation and long-term corrective actions.

## Rules

- Do not generate generic recommendations without evidence.
- Do not confuse logging components with failing business services.
- Do not treat raw payloads as root cause.
- Explicitly indicate when a statement is inferred instead of validated.
- Prefer operational evidence over textual assumptions.
- Keep the analysis technical, concise and actionable.
