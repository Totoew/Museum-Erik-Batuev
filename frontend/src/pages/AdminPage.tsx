import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, MessageCircle,
  Plus, Pencil, Trash2, Eye, EyeOff, X, Save, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import type { Article, ArticleForm, AdminStats, AdminUser, AdminComment } from '../api/client';

type AdminTab = 'dashboard' | 'articles' | 'users' | 'comments';

const SECTIONS = [
  { value: 'biography', label: 'Биография' },
  { value: 'works', label: 'Творчество' },
  { value: 'journalism', label: 'Журналистика' },
  { value: 'archives', label: 'Архивы' },
  { value: 'research', label: 'Исследования' },
  { value: 'interactive', label: 'Интерактив' },
  { value: 'education', label: 'Образование' },
];

const sectionLabel = (v: string) => SECTIONS.find(s => s.value === v)?.label ?? v;

export default function AdminPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    if (role !== 'admin') navigate('/');
  }, [role, navigate]);

  if (role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Боковое меню */}
      <aside className="w-56 bg-blue-900 text-blue-100 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-blue-800">
          <p className="text-xs text-blue-400 uppercase tracking-wider">Администратор</p>
          <p className="font-semibold text-white mt-1 truncate">{user?.name}</p>
        </div>
        <nav className="flex-1 py-4">
          {[
            { id: 'dashboard' as const, label: 'Панель', icon: LayoutDashboard },
            { id: 'articles' as const, label: 'Статьи', icon: FileText },
            { id: 'users' as const, label: 'Пользователи', icon: Users },
            { id: 'comments' as const, label: 'Комментарии', icon: MessageCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 w-full px-5 py-2.5 text-sm transition-colors ${
                tab === id ? 'bg-blue-700 text-white' : 'hover:bg-blue-800 text-blue-200'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-blue-800">
          <a href="/" className="flex items-center gap-2 text-xs text-blue-400 hover:text-white transition-colors">
            <ChevronRight size={12} />
            На сайт
          </a>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 min-w-0 p-6 overflow-auto">
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'articles' && <ArticlesTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'comments' && <CommentsTab />}
      </main>
    </div>
  );
}

// ─── Дашборд ─────────────────────────────────────────────────────────────────

function DashboardTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.adminGetStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-slate-800 mb-6">Панель управления</h1>
      {stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Всего статей', value: stats.articles.total, color: 'bg-blue-600' },
              { label: 'Опубликовано', value: stats.articles.published, color: 'bg-green-600' },
              { label: 'Пользователей', value: stats.users, color: 'bg-indigo-600' },
              { label: 'Комментариев', value: stats.comments, color: 'bg-slate-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className={`w-8 h-1 rounded-full ${s.color} mb-3`} />
                <div className="text-3xl font-bold text-slate-800">{s.value}</div>
                <div className="text-sm text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Статьи по разделам</h3>
            <div className="space-y-2">
              {stats.by_section.map(({ section, count }) => (
                <div key={section} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-32">{sectionLabel(section)}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min((count / stats.articles.total) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-slate-400 text-sm">Загрузка статистики...</div>
      )}
    </div>
  );
}

// ─── Статьи ───────────────────────────────────────────────────────────────────

const EMPTY_FORM: ArticleForm = {
  title: '', excerpt: '', content: '', section: 'biography',
  period: '', image_url: '', is_published: false,
};

function ArticlesTab() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filterSection, setFilterSection] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    api.adminGetArticles(filterSection || undefined).then(setArticles).catch(console.error);

  useEffect(() => { load(); }, [filterSection]);

  const openCreate = () => { setEditingArticle(null); setForm(EMPTY_FORM); setShowForm(true); setError(''); };
  const openEdit = (a: Article) => {
    setEditingArticle(a);
    setForm({
      title: a.title, excerpt: a.excerpt, content: a.content,
      section: a.section, period: a.period ?? '',
      image_url: a.image_url ?? '', is_published: a.is_published,
    });
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) { setError('Заполните заголовок и текст'); return; }
    setSaving(true);
    setError('');
    try {
      if (editingArticle) {
        await api.adminUpdateArticle(editingArticle.id, form);
      } else {
        await api.adminCreateArticle(form);
      }
      setShowForm(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить статью? Это действие нельзя отменить.')) return;
    await api.adminDeleteArticle(id).catch(console.error);
    load();
  };

  const handleTogglePublish = async (id: number) => {
    await api.adminTogglePublish(id).catch(console.error);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-800">Статьи</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          <Plus size={16} />
          Добавить статью
        </button>
      </div>

      {/* Фильтр по разделу */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterSection('')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!filterSection ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}
        >
          Все
        </button>
        {SECTIONS.map(s => (
          <button
            key={s.value}
            onClick={() => setFilterSection(s.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterSection === s.value ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Таблица статей */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-500">Заголовок</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 w-28">Раздел</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 w-24">Статус</th>
              <th className="px-4 py-3 w-28"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-700 truncate max-w-xs">{a.title}</div>
                  {a.period && <div className="text-xs text-slate-400 mt-0.5">{a.period}</div>}
                </td>
                <td className="px-4 py-3 text-slate-500">{sectionLabel(a.section)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${a.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {a.is_published ? 'Опубл.' : 'Черновик'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleTogglePublish(a.id)}
                      title={a.is_published ? 'Снять с публикации' : 'Опубликовать'}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {a.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={() => openEdit(a)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400">Статьи не найдены</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Форма создания/редактирования */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingArticle ? 'Редактировать статью' : 'Новая статья'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Заголовок *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Название статьи"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Раздел *</label>
                  <select
                    value={form.section}
                    onChange={e => setForm({ ...form, section: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Период / категория</label>
                  <input
                    value={form.period}
                    onChange={e => setForm({ ...form, period: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="напр. 1969–1984"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Краткое описание *</label>
                  <textarea
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    rows={2}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Одно-два предложения для карточки"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Полный текст *</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    rows={8}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-300 font-mono"
                    placeholder="Текст статьи..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">URL обложки</label>
                  <input
                    value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="https://..."
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pub"
                    checked={form.is_published}
                    onChange={e => setForm({ ...form, is_published: e.target.checked })}
                    className="w-4 h-4 accent-blue-700"
                  />
                  <label htmlFor="pub" className="text-sm text-slate-600">Опубликовать сразу</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Save size={15} />
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Пользователи ─────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => { api.adminGetUsers().then(setUsers).catch(console.error); }, []);

  const toggle = async (id: number) => {
    await api.adminToggleUser(id).catch(console.error);
    api.adminGetUsers().then(setUsers);
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-blue-100 text-blue-700',
    student: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-slate-800 mb-6">Пользователи</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-500">Имя / Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 w-24">Роль</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 w-24">Статус</th>
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-700">{u.name}</div>
                  <div className="text-xs text-slate-400">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] ?? 'bg-slate-100 text-slate-500'}`}>
                    {u.role === 'admin' ? 'Админ' : 'Ученик'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {u.is_active ? 'Активен' : 'Заблокирован'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggle(u.id)}
                      className={`text-xs px-2 py-1 rounded-lg transition-colors ${u.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                    >
                      {u.is_active ? 'Заблок.' : 'Разблок.'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400">Нет пользователей</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Комментарии ─────────────────────────────────────────────────────────────

function CommentsTab() {
  const [comments, setComments] = useState<AdminComment[]>([]);

  useEffect(() => { api.adminGetComments().then(setComments).catch(console.error); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить комментарий?')) return;
    await api.adminDeleteComment(id).catch(console.error);
    setComments(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-slate-800 mb-6">Комментарии</h1>
      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-400">Пользователь #{c.user_id}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-400">Статья #{c.article_id}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-400">{new Date(c.created_at).toLocaleDateString('ru')}</span>
              </div>
              <p className="text-sm text-slate-700">{c.content}</p>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <MessageCircle size={32} className="mx-auto mb-3 opacity-40" />
            <p>Комментариев пока нет</p>
          </div>
        )}
      </div>
    </div>
  );
}
