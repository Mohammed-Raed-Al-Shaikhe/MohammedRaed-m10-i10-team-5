import Link from "next/link";

export default function Home() {
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
          <Link href="/" className="nav-item active">
            <i className="ti ti-home" aria-hidden="true" /> Overview
          </Link>
          <Link href="/extract" className="nav-item">
            <i className="ti ti-scan" aria-hidden="true" /> Extract entities
          </Link>
          <Link href="/kg" className="nav-item">
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
            <h1>Overview</h1>
            <p>M10 Recipe Service — AI-powered tools</p>
          </div>
        </header>

        <main className="page-content">
          <div className="section-label">Available tools</div>

          <div className="home-grid">
            <Link href="/extract" className="home-card">
              <div className="home-card-icon icon-blue">
                <i className="ti ti-scan" aria-hidden="true" />
              </div>
              <h3>Extract entities</h3>
              <p>Identify ingredients, techniques, and tools from any recipe text using NLP.</p>
              <div className="home-card-arrow">
                Open <i className="ti ti-arrow-right" aria-hidden="true" />
              </div>
            </Link>

            <Link href="/kg" className="home-card">
              <div className="home-card-icon icon-amber">
                <i className="ti ti-topology-star-3" aria-hidden="true" />
              </div>
              <h3>Knowledge graph</h3>
              <p>Query the recipe knowledge graph using natural language. Powered by Cypher.</p>
              <div className="home-card-arrow">
                Open <i className="ti ti-arrow-right" aria-hidden="true" />
              </div>
            </Link>

            <Link href="/rag" className="home-card">
              <div className="home-card-icon icon-green">
                <i className="ti ti-message-dots" aria-hidden="true" />
              </div>
              <h3>Ask a question</h3>
              <p>Get cited answers to your recipe questions using Retrieval-Augmented Generation.</p>
              <div className="home-card-arrow">
                Open <i className="ti ti-arrow-right" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
