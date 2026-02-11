const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("retinacheck_token");
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token = getToken(), ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers as HeadersInit);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && fetchOptions.body && typeof fetchOptions.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || "Request failed");
  }
  const contentType = res.headers.get("Content-Type");
  if (contentType?.includes("application/json")) return res.json() as Promise<T>;
  return res.text() as Promise<T>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "medical_professional" | "admin";
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return api<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return api<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getMe(): Promise<{ user: User }> {
  return api<{ user: User }>("/api/auth/me");
}

export interface AnalysisResult {
  id: string;
  patientId: string;
  date: string;
  imageUrl: string;
  prediction: "No DR" | "Mild NPDR" | "Moderate NPDR" | "Severe NPDR" | "Proliferative DR";
  confidence: number;
  severityScore: number;
  details: {
    microaneurysms: boolean;
    hemorrhages: boolean;
    exudates: boolean;
    cottonWoolSpots: boolean;
    neovascularization: boolean;
  };
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  const form = new FormData();
  form.append("image", file);
  const token = getToken();
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}/api/analyses`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || "Analysis failed");
  }
  return res.json() as Promise<AnalysisResult>;
}

export async function getAnalyses(): Promise<AnalysisResult[]> {
  return api<AnalysisResult[]>("/api/analyses");
}

export async function getAnalysis(id: string): Promise<AnalysisResult> {
  return api<AnalysisResult>(`/api/analyses/${id}`);
}

/** Fetches analysis image with auth and returns a blob URL for use in <img src>. Revoke with URL.revokeObjectURL when done. */
export async function getAnalysisImageBlobUrl(id: string): Promise<string> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_BASE}/api/analyses/${id}/image`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load image");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
