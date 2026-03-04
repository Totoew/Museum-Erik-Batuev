import { FlaskConical, ExternalLink } from 'lucide-react';
import SectionLayout, { ArticleCard } from '../components/ui/SectionLayout';

const researchArticles = [
  {
    id: 1,
    title: 'Удмуртский пейзаж в лирике Батуева',
    excerpt:
      'Исследование образов родного края в поэзии Эрика Батуева. Анализ природных мотивов, их символического значения и связи с удмуртской мифологией.',
    date: '2022',
    likes: 23,
    comments: 5,
    period: 'Литературоведение',
  },
  {
    id: 2,
    title: 'Военная тема в творчестве военных корреспондентов Удмуртии',
    excerpt:
      'Сравнительный анализ репортажей из Чечни, включая тексты Эрика Батуева. Исследование этики военной журналистики.',
    date: '2020',
    likes: 18,
    comments: 7,
    period: 'Журналистиковедение',
  },
  {
    id: 3,
    title: 'Билингвизм и перевод: Батуев между двумя языками',
    excerpt:
      'Исследование переводческой деятельности Батуева, его работы с удмуртским и русским языками, проблем сохранения национального колорита при переводе.',
    date: '2021',
    likes: 31,
    comments: 9,
    period: 'Переводоведение',
  },
];

const sources = [
  { title: 'Научная электронная библиотека e-Library', url: '#' },
  { title: 'Удмуртский государственный университет', url: '#' },
  { title: 'Национальный музей Удмуртской Республики', url: '#' },
  { title: 'Журнал «Вопросы литературы»', url: '#' },
];

export default function ResearchPage() {
  return (
    <SectionLayout
      title="Исследования"
      subtitle="Научные работы и литературоведческие статьи"
      icon={<FlaskConical size={20} />}
    >
      <div className="grid grid-cols-1 gap-6 mb-12">
        {researchArticles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            excerpt={article.excerpt}
            date={article.date}
            likes={article.likes}
            comments={article.comments}
            period={article.period}
            href={`/research/${article.id}`}
          />
        ))}
      </div>

      {/* Источники */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="text-lg font-serif font-bold text-blue-900 mb-4">Научная база и источники</h3>
        <p className="text-sm text-slate-500 mb-4">
          Все материалы музея основаны на верифицированных источниках и научных работах.
        </p>
        <div className="space-y-2">
          {sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <ExternalLink size={12} />
              {source.title}
            </a>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
