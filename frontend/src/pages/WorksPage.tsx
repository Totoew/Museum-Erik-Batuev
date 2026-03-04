import { useState } from 'react';
import { BookOpen, Music, Filter } from 'lucide-react';
import SectionLayout, { CommentsSection } from '../components/ui/SectionLayout';

type WorkCategory = 'all' | 'poetry' | 'prose' | 'translations';

const mockPoems = [
  {
    id: 1,
    title: 'Удмуртская земля',
    category: 'poetry' as const,
    year: '1980',
    excerpt: 'Моя земля — берёзы белые,\nРека, поля и небо синее...',
    fullText: `Моя земля — берёзы белые,
Река, поля и небо синее,
Удмуртской речи звук певучий —
Всё это мне дороже всех.

Я помню детство у порога,
Мать пела песни по утрам,
И каждый камень, каждый холм
Хранил народный древний сон.`,
  },
  {
    id: 2,
    title: 'Дорога домой',
    category: 'poetry' as const,
    year: '1985',
    excerpt: 'По дороге домой иду я снова,\nВ душе звучит родная речь...',
    fullText: 'Полный текст стихотворения будет добавлен...',
  },
  {
    id: 3,
    title: 'Рассказ о деревне',
    category: 'prose' as const,
    year: '1988',
    excerpt: 'Маленькая деревня на берегу Вятки знала всё о своих жителях...',
    fullText: 'Полный текст рассказа будет добавлен...',
  },
  {
    id: 4,
    title: 'Из Уитмена: «Листья травы» (фрагмент)',
    category: 'translations' as const,
    year: '1992',
    excerpt: 'Перевод на удмуртский язык избранных стихов Уолта Уитмена...',
    fullText: 'Полный текст перевода будет добавлен...',
  },
];

const categoryLabels: Record<WorkCategory, string> = {
  all: 'Все произведения',
  poetry: 'Поэзия',
  prose: 'Проза',
  translations: 'Переводы',
};

export default function WorksPage() {
  const [category, setCategory] = useState<WorkCategory>('all');
  const [selectedPoem, setSelectedPoem] = useState<(typeof mockPoems)[0] | null>(null);

  const filtered = category === 'all' ? mockPoems : mockPoems.filter((w) => w.category === category);

  return (
    <SectionLayout
      title="Творчество"
      subtitle="Поэзия, проза и переводы Эрика Батуева"
      icon={<BookOpen size={20} />}
    >
      {/* Фильтр */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Filter size={14} className="text-slate-400" />
        {(Object.keys(categoryLabels) as WorkCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {selectedPoem ? (
        /* Просмотр текста */
        <div className="animate-float-up">
          <button
            onClick={() => setSelectedPoem(null)}
            className="text-sm text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
          >
            ← Назад к списку
          </button>

          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                {categoryLabels[selectedPoem.category]}
              </span>
              <span className="text-xs text-slate-400">{selectedPoem.year}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-blue-900 mb-6">{selectedPoem.title}</h2>

            {selectedPoem.category === 'poetry' ? (
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-8">
                <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                  <Music size={12} />
                  <button className="hover:text-blue-600 transition-colors">Прослушать аудиозапись</button>
                </div>
                <blockquote className="font-serif text-lg text-slate-700 leading-loose whitespace-pre-line italic">
                  {selectedPoem.fullText}
                </blockquote>
              </div>
            ) : (
              <div className="prose max-w-none text-slate-600 leading-relaxed">
                {selectedPoem.fullText}
              </div>
            )}
          </div>

          <CommentsSection articleId={selectedPoem.id} />
        </div>
      ) : (
        /* Список произведений */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((work) => (
            <button
              key={work.id}
              onClick={() => setSelectedPoem(work)}
              className="text-left bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                  {categoryLabels[work.category]}
                </span>
                <span className="text-xs text-slate-400 flex-shrink-0">{work.year}</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-blue-900 mb-2">{work.title}</h3>
              <p className="text-sm text-slate-400 whitespace-pre-line leading-relaxed line-clamp-3">
                {work.excerpt}
              </p>
              <span className="mt-4 inline-block text-xs text-blue-500 font-medium">Читать →</span>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-16 text-slate-400">
              <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
              <p>Произведения этой категории будут добавлены</p>
            </div>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
