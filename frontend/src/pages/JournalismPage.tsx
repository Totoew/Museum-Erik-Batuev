import { Newspaper } from 'lucide-react';
import SectionLayout, { ArticleCard } from '../components/ui/SectionLayout';

const mockArticles = [
  {
    id: 1,
    title: 'Репортаж с линии фронта: Чечня, 1995',
    excerpt:
      'Уникальный репортаж из зоны боевых действий. Батуев описывает судьбы простых людей в условиях войны с присущим ему гуманизмом и журналистской честностью.',
    date: '1995',
    likes: 47,
    comments: 12,
    period: 'Военная журналистика',
  },
  {
    id: 2,
    title: 'Удмуртия: возрождение культуры',
    excerpt:
      'Статья о культурном ренессансе Удмуртии в постсоветский период. Батуев анализирует процессы национального самоопределения и сохранения традиций.',
    date: '1993',
    likes: 31,
    comments: 8,
    period: 'Культурная журналистика',
  },
  {
    id: 3,
    title: 'Интервью с народным поэтом Флором Васильевым',
    excerpt:
      'Редкое интервью с классиком удмуртской поэзии. Разговор о традициях, языке и будущем национальной литературы.',
    date: '1988',
    likes: 56,
    comments: 15,
    period: 'Литературная журналистика',
  },
];

export default function JournalismPage() {
  return (
    <SectionLayout
      title="Журналистика"
      subtitle="Репортажи, статьи и интервью"
      icon={<Newspaper size={20} />}
    >
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
        <strong>Примечание редактора:</strong> В текстах этого раздела используются всплывающие подсказки
        (по наведению курсора) с пояснением исторических событий и терминов.
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockArticles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            excerpt={article.excerpt}
            date={article.date}
            likes={article.likes}
            comments={article.comments}
            period={article.period}
            href={`/journalism/${article.id}`}
          />
        ))}
      </div>
    </SectionLayout>
  );
}
