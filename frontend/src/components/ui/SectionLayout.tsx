import { useState, useEffect } from 'react';
import { Heart, MessageCircle, ChevronRight, Map } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import type { Comment } from '../../api/client';

interface SectionLayoutProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export default function SectionLayout({
  title,
  subtitle,
  icon,
  sidebar,
  children,
}: SectionLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Заголовок раздела */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <a href="/" className="hover:text-blue-600 transition-colors">Главная</a>
            <ChevronRight size={12} />
            <span className="text-slate-600">{title}</span>
          </nav>
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-blue-900">{title}</h1>
              {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
            </div>
          </div>
          {/* Орнамент-разделитель */}
          <div className="mt-6 h-0.5 bg-gradient-to-r from-blue-200 via-blue-100 to-transparent" />
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className={`flex gap-8 ${sidebar ? 'flex-col lg:flex-row' : ''}`}>
          {/* Боковая панель */}
          {sidebar && (
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">{sidebar}</div>
            </aside>
          )}

          {/* Основной контент */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

/* Компонент статьи */
interface ArticleCardProps {
  title: string;
  excerpt: string;
  date?: string;
  image?: string;
  likes?: number;
  comments?: number;
  period?: string;
  href?: string;
}

export function ArticleCard({
  title,
  excerpt,
  date,
  image,
  likes = 0,
  comments = 0,
  period,
  href = '#',
}: ArticleCardProps) {
  const { user, openLoginModal } = useAuth();
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);

  const handleLike = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    setLiked(!liked);
    setLocalLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <article className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {image ? (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
          <div className="text-blue-200 text-sm">Изображение статьи</div>
        </div>
      )}

      <div className="p-6">
        {period && (
          <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
            {period}
          </span>
        )}
        <h3 className="text-xl font-serif font-bold text-blue-900 mb-2 hover:text-blue-700 transition-colors">
          <a href={href}>{title}</a>
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">{excerpt}</p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {date && <span className="text-xs text-slate-400">{date}</span>}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <Heart size={16} className={liked ? 'fill-current' : ''} />
              {localLikes}
            </button>
            <a
              href={`${href}#comments`}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors"
            >
              <MessageCircle size={16} />
              {comments}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* Кнопка «Показать на карте» */
export function ShowOnMapButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
    >
      <Map size={16} />
      Показать на карте
    </button>
  );
}

/* Секция комментариев */
export function CommentsSection({ articleId }: { articleId: number }) {
  const { user, openLoginModal } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getComments(articleId).then(setComments).catch(() => {});
  }, [articleId]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await api.createComment(articleId, comment.trim());
      setComments((prev) => [...prev, newComment]);
      setComment('');
    } catch {
      // ошибка — пользователь увидит что ничего не отправилось
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  return (
    <div id="comments" className="mt-10 pt-8 border-t border-blue-100">
      <h3 className="text-xl font-serif font-bold text-blue-900 mb-6">
        Комментарии ({comments.length})
      </h3>

      {/* Форма */}
      {user ? (
        <div className="mb-6 bg-blue-50 rounded-xl p-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ваш комментарий..."
            rows={3}
            className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={!comment.trim() || submitting}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {submitting ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl text-center">
          <p className="text-slate-500 text-sm mb-3">
            Авторизуйтесь, чтобы оставить комментарий
          </p>
          <button
            onClick={openLoginModal}
            className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
          >
            Войти
          </button>
        </div>
      )}

      {/* Список комментариев */}
      {loading ? (
        <p className="text-sm text-slate-400">Загрузка...</p>
      ) : (
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-slate-400">Комментариев пока нет. Будьте первым!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {c.author_name[0]}
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{c.author_name}</span>
                    <span className="text-xs text-slate-400">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
