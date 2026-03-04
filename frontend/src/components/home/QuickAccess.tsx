import { Link } from 'react-router-dom';
import { ArrowRight, BookMarked, Brain, Clock, Star } from 'lucide-react';

const mockRoute = {
  id: 1,
  title: 'Детство в Куштошуре',
  description:
    'Путешествие по ранним годам поэта: от деревенского детства до первых стихов. Откройте истоки творчества Эрика Батуева.',
  duration: '35 мин',
  articlesCount: 5,
};

const mockTest = {
  id: 1,
  title: 'Биография и творчество',
  questionsCount: 10,
  difficulty: 'easy' as const,
  completions: 142,
};

const difficultyLabels: Record<string, { label: string; color: string }> = {
  easy: { label: 'Начальный', color: 'bg-green-100 text-green-700' },
  medium: { label: 'Средний', color: 'bg-yellow-100 text-yellow-700' },
  hard: { label: 'Сложный', color: 'bg-red-100 text-red-700' },
};

export default function QuickAccess() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Быстрый доступ
          </div>
          <h2 className="text-3xl font-serif font-bold text-blue-900">
            Актуальное сегодня
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Маршрут недели */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
                <BookMarked size={14} />
                Маршрут недели
              </div>
              <h3 className="text-white text-xl font-serif font-bold">{mockRoute.title}</h3>
            </div>

            <div className="p-6">
              {/* Заглушка для изображения */}
              <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-center text-blue-300">
                  <BookMarked size={28} />
                  <p className="text-xs mt-1">Изображение маршрута</p>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {mockRoute.description}
              </p>

              <div className="flex items-center gap-4 mb-5 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {mockRoute.duration}
                </span>
                <span>{mockRoute.articlesCount} материалов</span>
              </div>

              <Link
                to={`/interactive/routes/${mockRoute.id}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Пройти маршрут
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Тест */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
                <Brain size={14} />
                Проверь себя
              </div>
              <h3 className="text-white text-xl font-serif font-bold">{mockTest.title}</h3>
            </div>

            <div className="p-6">
              {/* Декоративный элемент теста */}
              <div className="w-full h-32 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Brain size={28} className="text-indigo-500" />
                  </div>
                  <div className="flex gap-1 justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < 3 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyLabels[mockTest.difficulty].color}`}>
                  {difficultyLabels[mockTest.difficulty].label}
                </span>
                <span className="text-xs text-slate-400">{mockTest.questionsCount} вопросов</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">{mockTest.completions} прохождений</span>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Проверьте свои знания о жизни и творчестве Эрика Батуева.
                Тест составлен на основе материалов музея.
              </p>

              <Link
                to={`/education/tests/${mockTest.id}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Пройти тест
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
