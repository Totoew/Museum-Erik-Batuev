const BASE = 'http://localhost:8000/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Ошибка запроса');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: (email: string, password: string) =>
    request<{ access_token: string; user: AppUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, invite_code?: string) =>
    request<{ access_token: string; user: AppUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, invite_code }),
    }),

  // ── Articles ──────────────────────────────────────────────────────────────
  getArticles: (section?: string) =>
    request<Article[]>(`/articles/${section ? `?section=${section}` : ''}`),

  getArticle: (id: number) => request<Article>(`/articles/${id}`),

  likeArticle: (id: number) => request<{ likes_count: number }>(`/articles/${id}/like`, { method: 'POST' }),

  // ── Admin ─────────────────────────────────────────────────────────────────
  adminGetStats: () => request<AdminStats>('/admin/stats'),

  adminGetArticles: (section?: string) =>
    request<Article[]>(`/admin/articles${section ? `?section=${section}` : ''}`),

  adminCreateArticle: (data: ArticleForm) =>
    request<Article>('/admin/articles', { method: 'POST', body: JSON.stringify(data) }),

  adminUpdateArticle: (id: number, data: Partial<ArticleForm>) =>
    request<Article>(`/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  adminDeleteArticle: (id: number) =>
    request<void>(`/admin/articles/${id}`, { method: 'DELETE' }),

  adminTogglePublish: (id: number) =>
    request<Article>(`/admin/articles/${id}/publish`, { method: 'PATCH' }),

  adminGetUsers: () => request<AdminUser[]>('/admin/users'),

  adminToggleUser: (id: number) =>
    request<{ id: number; is_active: boolean }>(`/admin/users/${id}/toggle-active`, { method: 'PATCH' }),

  adminGetComments: () => request<AdminComment[]>('/admin/comments'),

  adminDeleteComment: (id: number) =>
    request<void>(`/admin/comments/${id}`, { method: 'DELETE' }),

  adminGetMemories: () => request<AdminMemory[]>('/admin/memories'),

  adminApproveMemory: (id: number) =>
    request<{ id: number; is_approved: boolean }>(`/admin/memories/${id}/approve`, { method: 'PATCH' }),

  adminDeleteMemory: (id: number) =>
    request<void>(`/admin/memories/${id}`, { method: 'DELETE' }),

  // ── Comments ───────────────────────────────────────────────────────────────
  getComments: (articleId: number) =>
    request<Comment[]>(`/comments/${articleId}`),

  createComment: (articleId: number, content: string) =>
    request<Comment>(`/comments/${articleId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // ── Memories ──────────────────────────────────────────────────────────────
  getMemories: () => request<Memory[]>('/memories'),

  createMemory: (content: string, files: File[]) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('content', content);
    files.forEach((file) => formData.append('files', file));
    return fetch(`${BASE}/memories`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || 'Ошибка запроса');
      }
      return res.json() as Promise<Memory>;
    });
  },
};

// ── Типы ─────────────────────────────────────────────────────────────────────

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: 'guest' | 'student' | 'admin';
  class_name: string | null;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  section: string;
  period: string | null;
  image_url: string | null;
  audio_url: string | null;
  likes_count: number;
  is_published: boolean;
  created_at: string;
  comments_count: number;
}

export interface ArticleForm {
  title: string;
  excerpt: string;
  content: string;
  section: string;
  period?: string;
  image_url?: string;
  audio_url?: string;
  is_published?: boolean;
}

export interface AdminStats {
  articles: { total: number; published: number };
  users: number;
  comments: number;
  by_section: { section: string; count: number }[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  class_name: string | null;
  created_at: string;
}

export interface AdminComment {
  id: number;
  article_id: number;
  user_id: number;
  content: string;
  is_approved: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface Memory {
  id: number;
  user_id: number;
  author_name: string;
  content: string;
  file_urls: string[];
  created_at: string;
}

export interface AdminMemory {
  id: number;
  user_id: number;
  author_name: string;
  content: string;
  file_urls: string[];
  is_approved: boolean;
  created_at: string;
}
