import { useState } from "react";
import Link from "next/link";
import type { RAGRequest, RAGResponse } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SUGGESTIONS = [
  "How do I make dough from scratch?",
  "What spices go with lamb?",
  "Best way to caramelize onions?",
];

export default function RagPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<RAGResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(q?: string) {
    const query = q ?? question;
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload: RAGRequest = { question: query, k: 4 };
      const r = await fetch(`${API_URL}/rag/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.status === 422) {
        setError("Question shape rejected by validation.");
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
      setResult((await r.json()) as RAGResponse);
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
          <Link href="/kg" className="nav-item">
            <i className="ti ti-topology-star-3" aria-hidden="true" /> Knowledge graph
            <span className="nav-badge">KG</span>
          </Link>
          <Link href="/rag" className="nav-item active">
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
            <h1>Ask a question</h1>
            <p>Get cited answers powered by Retrieval-Augmented Generation</p>
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
                placeholder="Ask a recipe question…"
              />
              <button
                className="btn btn-primary"
                onClick={() => submit()}
                disabled={loading || !question.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Asking…
                  </>
                ) : (
                  <>
                    <i className="ti ti-send" aria-hidden="true" /> Ask
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
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="result-card">
              <div className="loading-row">
                <span className="spinner" />
                Searching the knowledge base…
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="result-card">
              {/* Answer */}
              <div className="result-header">
                <div className="result-header-title">
                  <i className="ti ti-sparkles" aria-hidden="true" />
                  Answer
                </div>
                <span
                  className={`tag ${
                    result.confidence >= 0.8
                      ? "tag-green"
                      : result.confidence >= 0.5
                      ? "tag-blue"
                      : "tag-amber"
                  }`}
                >
                  {result.confidence >= 0.8
                    ? "High confidence"
                    : result.confidence >= 0.5
                    ? "Medium confidence"
                    : "Low confidence"}
                </span>
              </div>

              <div className="answer-block">
                <p className="answer-text" data-testid="rag-answer">
                  {result.answer}
                </p>
                <div className="confidence-row">
                  <span className="conf-label">Confidence</span>
                  <div className="conf-bar">
                    <div
                      className="conf-fill"
                      style={{ width: `${Math.round(result.confidence * 100)}%` }}
                    />
                  </div>
                  <span className="conf-val">{Math.round(result.confidence * 100)}%</span>
                </div>
              </div>

              {/* Citations */}
              {result.citations.length > 0 && (
                <>
                  <div
                    style={{
                      padding: "10px 18px 4px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-3)",
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    Sources ({result.citations.length})
                  </div>
                  <div className="citations-list">
                    {result.citations.map((c) => (
                      <div key={c.chunk_id} className="citation-item">
                        <span className="cit-id" data-testid="citation-marker">
                          {c.chunk_id}
                        </span>
                        <span className="cit-score">
                          Relevance score: {c.score.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
