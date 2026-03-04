import { useState } from 'react';
import { Archive, Image, FileText, Music2, Filter } from 'lucide-react';
import SectionLayout from '../components/ui/SectionLayout';

type ArchiveType = 'all' | 'photos' | 'documents' | 'audio';

const archiveItems = [
  { id: 1, type: 'photos' as const, title: 'Детские фотографии. Куштошур, 1960-е', year: '~1965', description: 'Семейный архив. 3 снимка.' },
  { id: 2, type: 'photos' as const, title: 'Студенческие годы в МГУ', year: '1979', description: 'Фотографии из студенческого общежития. 7 снимков.' },
  { id: 3, type: 'documents' as const, title: 'Рукопись первого сборника стихов', year: '1982', description: 'Оригинал рукописи с правками автора. 48 стр.' },
  { id: 4, type: 'documents' as const, title: 'Удостоверение военного корреспондента', year: '1994', description: 'Документ, дающий право на работу в зоне конфликта.' },
  { id: 5, type: 'audio' as const, title: 'Авторское чтение: «Удмуртская земля»', year: '1990', description: 'Аудиозапись чтения стихов автором. 4:32.' },
  { id: 6, type: 'documents' as const, title: 'Письма к редактору журнала «Молот»', year: '1986', description: 'Переписка с редакцией. 12 писем.' },
];

const typeLabels: Record<ArchiveType, { label: string; icon: React.ElementType }> = {
  all: { label: 'Все материалы', icon: Archive },
  photos: { label: 'Фотографии', icon: Image },
  documents: { label: 'Документы', icon: FileText },
  audio: { label: 'Аудио', icon: Music2 },
};

export default function ArchivesPage() {
  const [activeType, setActiveType] = useState<ArchiveType>('all');

  const filtered = activeType === 'all' ? archiveItems : archiveItems.filter((i) => i.type === activeType);

  return (
    <SectionLayout
      title="Архивы"
      subtitle="Документы, фотографии и аудиозаписи"
      icon={<Archive size={20} />}
    >
      {/* Фильтр */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Filter size={14} className="text-slate-400" />
        {(Object.entries(typeLabels) as [ArchiveType, (typeof typeLabels)[ArchiveType]][]).map(
          ([type, { label, icon: Icon }]) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeType === type
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          )
        )}
      </div>

      {/* Сетка архивных материалов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const { icon: Icon } = typeLabels[item.type];
          const colors = {
            photos: 'bg-blue-50 text-blue-600 border-blue-100',
            documents: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            audio: 'bg-sky-50 text-sky-600 border-sky-100',
          };
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden cursor-pointer"
            >
              <div className={`w-full h-36 flex items-center justify-center border-b ${colors[item.type]}`}>
                <div className="text-center">
                  <Icon size={32} className="mx-auto mb-2 opacity-50" />
                  <span className="text-xs opacity-60">{typeLabels[item.type].label}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-semibold text-slate-700 line-clamp-2">{item.title}</h3>
                  <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{item.year}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionLayout>
  );
}
