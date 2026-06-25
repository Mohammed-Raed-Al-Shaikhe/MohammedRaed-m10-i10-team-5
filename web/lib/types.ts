// TypeScript interfaces — must mirror api/models.py exactly.
// snake_case field names preserved (chunk_id, not chunkId).
//
// Request shapes mirror the Pydantic *Request models in api/models.py so
// the pages send typed fetch bodies. Field names + constraints are the
// backend's source of truth — do not add fields the backend does not
// expose (open an internal PR comment on backend/api-endpoints instead).

// --- Request shapes (mirror ExtractRequest / KGRequest / RAGRequest) ---

export interface ExtractRequest {
  text: string; // 1..5000 chars (backend Field constraint)
}

export interface KGRequest {
  question: string; // 1..500 chars
}

export interface RAGRequest {
  question: string; // 1..500 chars
  k?: number; // 1..10, backend default 4
}

// --- Response shapes ---

export interface Entity {
  text: string;
  label: string;
  start: number;
  end: number;
}

export interface ExtractResponse {
  entities: Entity[];
}

export interface KGResponse {
  cypher: string;
  rows: Record<string, unknown>[];
  count: number;
}

export interface UnsupportedQueryDetail {
  reason: "unsupported_question";
  supported_patterns: string[];
}

export interface Citation {
  chunk_id: number;
  score: number;
}

export interface RAGResponse {
  answer: string;
  citations: Citation[];
  confidence: number;
}
