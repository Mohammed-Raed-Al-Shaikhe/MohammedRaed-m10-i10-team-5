import { useState } from "react";
import Link from "next/link";
import type { KGRequest, KGResponse, UnsupportedQueryDetail } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Phrased to match the W9B mapper's supported patterns AND seeded data,
// so every chip returns rows instead of "not supported".
const SUGGESTIONS = [
  "Find Sichuan recipes",
  "Find recipes that use tofu",
  "Find recipes with cooking time under 30 minutes",
  "Find vegetarian recipes",
];

export default function KgPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<KGResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(q?: string) {
    const query = q ?? question;
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSupported(null);
    setResult(null);
    try {
      const payload: KGRequest = { question: query };
      const r = await fetch(`${API_URL}/kg/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.status === 422) {
        const body = await r.json();
        const detail = body.detail as UnsupportedQueryDetail | undefined;
        if (detail?.reason === "unsupported_question") {
          setError("That question shape is not supported. Try one of:");
          setSupported(detail.supported_patterns);
        } else {
          setError("Validation rejected the request.");
        }
        return;
      }
      if (r.status === 503) {
        setError("Backend not ready — try again in a moment.");
        return;
      }
      if (!r.ok) {
        setError(`Unexpected status: ${r.status}`);
        return;
      }
      setResult((await r.json()) as KGResponse);
    } catch {
      setError("Network error reaching the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <i className="ti ti-chef-hat" aria-hidden="true" />
          </div>
          <div>
            <div className="logo-name">Recipe AI</div>
            <div className="logo-sub">M10 Service</div>
          </div>
        </div>
        <nav className="nav">
          <div className="nav-section-label">Tools</div>
          <Link href="/" className="nav-item">
            <i className="ti ti-home" aria-hidden="true" /> Overview
          </Link>
          <Link href="/extract" className="nav-item">
            <i className="ti ti-scan" aria-hidden="true" /> Extract entities
          </Link>
          <Link href="/kg" className="nav-item active">
            <i className="ti ti-topology-star-3" aria-hidden="true" /> Knowledge graph
            <span className="nav-badge">KG</span>
          </Link>
          <Link href="/rag" className="nav-item">
            <i className="ti ti-message-dots" aria-hidden="true" /> Ask a question
            <span className="nav-badge">RAG</span>
          </Link>
          <div className="nav-section-label">System</div>
          <a className="nav-item">
            <i className="ti ti-activity" aria-hidden="true" /> API status
          </a>
          <a className="nav-item">
            <i className="ti ti-settings" aria-hidden="true" /> Settings
          </a>
        </nav>
      </aside>

      {/* Main */}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <h1>Knowledge graph</h1>
            <p>Query recipes using natural language — powered by Cypher</p>
          </div>
          <div className="status-chip">
            <span className="status-dot" />
            Backend ready
          </div>
        </header>

        <main className="page-content">
          {/* Query input */}
          <div className="section-label">Your question</div>
          <div className="query-card">
            <div className="query-row">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="e.g. Find Sichuan recipes"
              />
              <button
                className="btn btn-primary"
                onClick={() => submit()}
                disabled={loading || !question.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Querying…
                  </>
                ) : (
                  <>
                    <i className="ti ti-search" aria-hidden="true" /> Query
                  </>
                )}
              </button>
            </div>

            <div className="suggestions">
              <span className="suggestions-label">Try:</span>
              {SUGGESTIONS.map((s) => (
                <span
                  key={s}
                  className="pill"
                  onClick={() => { setQuestion(s); submit(s); }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error" role="alert" data-testid="error">
              <i className="ti ti-alert-circle" aria-hidden="true" />
              <div>
                <div>{error}</div>
                {supported && (
                  <ul className="patterns-list" data-testid="supported-patterns">
                    {supported.map((p, i) => (
                      <li key={i} onClick={() => { setQuestion(p); submit(p); }}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="result-card">
              <div className="loading-row">
                <span className="spinner" />
                Querying the knowledge graph…
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="result-card">
              <div className="result-header">
                <div className="result-header-title">
                  <i className="ti ti-code" aria-hidden="true" />
                  Generated Cypher
                </div>
                <span className="count-badge">{result.count} row{result.count !== 1 ? "s" : ""}</span>
              </div>

              <div className="cypher-block">
                <div className="label">cypher query</div>
                <pre>{result.cypher}</pre>
              </div>

              <table className="data-table">
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i} data-testid="kg-row">
                      {Object.entries(row).map(([k, v]) => (
                        <td key={k}>
                          <span style={{ color: "var(--text-3)", fontSize: 11, marginRight: 5 }}>
                            {k}
                          </span>
                          {String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
