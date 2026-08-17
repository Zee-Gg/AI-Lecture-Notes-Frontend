import { supabase } from './supabaseClient';

const RAW_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ?? '';

function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) return '';

  // Allow explicit same-origin usage in env with '/'.
  if (baseUrl === '/') return '';

  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
    return baseUrl.replace(/\/+$/, '');
  }

  // Developer-friendly fallback: `localhost:8000` -> `http://localhost:8000`.
  if (baseUrl.startsWith('localhost:') || baseUrl.startsWith('127.0.0.1:')) {
    return `http://${baseUrl}`.replace(/\/+$/, '');
  }

  return baseUrl.replace(/\/+$/, '');
}

const BASE_URL = normalizeBaseUrl(RAW_BASE_URL);

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeader = await getAuthHeader();
  const targetUrl = buildApiUrl(path);
  const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const mergedHeaders: Record<string, string> = {
    ...authHeader,
    ...(options.headers as Record<string, string> | undefined),
  };

  if (!isFormDataBody) {
    mergedHeaders['Content-Type'] = 'application/json';
  }

  let res: Response;
  try {
    res = await fetch(targetUrl, {
      ...options,
      headers: mergedHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';
    throw new Error(
      `Network request failed for ${targetUrl}. Check NEXT_PUBLIC_BACKEND_URL and backend/CORS availability. Original error: ${message}`
    );
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return null as T;
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  return null as T;
}