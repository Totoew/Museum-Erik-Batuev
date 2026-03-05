import { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, BookMarked, Upload, Send, X, FileText, ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import SectionLayout from '../components/ui/SectionLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import type { Memory } from '../api/client';

const mockRoutes = [
  {
    id: 1,
    title: 'Детство в Куштошуре',
    description: 'Истоки творчества: деревенское детство, первые стихи, народные традиции.',
    duration: '35 мин',
    articles: 5,
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 2,
    title: 'Москва и большая литература',
    description: 'МГУ, столичная литературная среда, первые публикации.',
    duration: '25 мин',
    articles: 4,
    color: 'from-indigo-500 to-indigo-700',
  },
  {
    id: 3,
    title: 'Война и мир: Чечня',
    description: 'Репортажи из зоны конфликта, военная лирика, цена правды.',
    duration: '45 мин',
    articles: 7,
    color: 'from-slate-500 to-slate-700',
  },
];

const timelineEvents = [
  { year: '1955', event: 'Рождение в деревне Куштошур', type: 'life' },
  { year: '1972', event: 'Поступление в Можгинское педагогическое училище', type: 'education' },
  { year: '1977', event: 'МГУ, факультет журналистики', type: 'education' },
  { year: '1982', event: 'Первый сборник стихов', type: 'creative' },
  { year: '1988', event: 'Главный редактор журнала «Молот»', type: 'career' },
  { year: '1994', event: 'Командировка в Чечню', type: 'life' },
  { year: '1998', event: 'Государственная премия Удмуртии', type: 'achievement' },
  { year: '2005', event: 'Третий сборник стихов "Дорога домой"', type: 'creative' },
];

const eventColors: Record<string, string> = {
  life: 'bg-blue-500',
  education: 'bg-indigo-500',
  creative: 'bg-violet-500',
  career: 'bg-sky-500',
  achievement: 'bg-amber-500',
};

const BACKEND = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? 'http://localhost:8000';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function MemoryFileIcon({ url }: { url: string }) {
  const isPdf = url.endsWith('.pdf') || url.includes('.doc');
  return isPdf ? <FileText size={14} className="text-blue-400" /> : <ImageIcon size={14} className="text-blue-400" />;
}

export default function InteractivePage() {
  const { user, openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'timeline' | 'routes' | 'memories'>('timeline');
  const [memoryText, setMemoryText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'memories') {
      setLoadingMemories(true);
      api.getMemories()
        .then(setMemories)
        .catch(() => {})
        .finally(() => setLoadingMemories(false));
    }
  }, [activeTab]);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    setSelectedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...arr.filter((f) => !existing.has(f.name + f.size))];
    });
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (!memoryText.trim()) return;
    setSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');
    try {
      const newMemory = await api.createMemory(memoryText.trim(), selectedFiles);
      setMemories((prev) => [newMemory, ...prev]);
      setMemoryText('');
      setSelectedFiles([]);
      setSubmitStatus('success');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ошибка отправки');
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionLayout
      title="Интерактив"
      subtitle="Лента жизни, маршруты читателя, народные воспоминания"
      icon={<Gamepad2 size={20} />}
    >
      {/* Табы */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-8 w-fit">
        {[
          { id: 'timeline' as const, label: 'Лента жизни' },
          { id: 'routes' as const, label: 'Маршруты читателя' },
          { id: 'memories' as const, label: 'Народные воспоминания' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Лента жизни */}
      {activeTab === 'timeline' && (
        <div className="relative">
          {/* Вертикальная линия */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200" />

          <div className="space-y-6">
            {timelineEvents.map((event, i) => (
              <div key={i} className="flex gap-6 pl-4 animate-float-up" style={{ animationDelay: `${i * 0.1}s` }}>
                {/* Точка */}
                <div className={`relative flex-shrink-0 w-5 h-5 rounded-full ${eventColors[event.type]} border-2 border-white shadow-md mt-1`} />

                {/* Контент */}
                <div className="flex-1 bg-white rounded-xl border border-blue-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <span className="text-blue-600 font-bold text-sm font-serif">{event.year}</span>
                  <p className="text-slate-700 text-sm mt-1">{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Маршруты читателя */}
      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
              <div className={`bg-gradient-to-br ${route.color} p-6 text-white`}>
                <BookMarked size={24} className="mb-3 opacity-80" />
                <h3 className="font-serif font-bold text-lg">{route.title}</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{route.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span>{route.articles} материалов</span>
                  <span>·</span>
                  <span>{route.duration}</span>
                </div>
                <button className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-xl transition-colors">
                  Пройти маршрут
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Народные воспоминания */}
      {activeTab === 'memories' && (
        <div className="max-w-2xl space-y-8">
          <p className="text-slate-500 leading-relaxed">
            Поделитесь своими воспоминаниями об Эрике Батуеве — личными историями,
            фотографиями или документами. Ваш вклад поможет сохранить живую память о поэте.
          </p>

          {/* Форма */}
          {user ? (
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Поделиться воспоминанием</h3>

              {submitStatus === 'success' ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <CheckCircle size={40} className="text-green-500" />
                  <p className="font-medium text-slate-700">Воспоминание отправлено!</p>
                  <p className="text-sm text-slate-400">
                    Оно будет опубликовано после проверки администратором.
                    <br />Спасибо за ваш вклад в сохранение памяти о поэте.
                  </p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="mt-2 px-5 py-2 bg-blue-700 text-white text-sm rounded-xl hover:bg-blue-800 transition-colors"
                  >
                    Написать ещё
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ваше воспоминание</label>
                    <textarea
                      value={memoryText}
                      onChange={(e) => setMemoryText(e.target.value)}
                      rows={5}
                      placeholder="Расскажите о своей встрече с Эриком Батуевым, о его стихах или личности..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  {/* Зона загрузки файлов */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Прикрепить файлы{' '}
                      <span className="text-slate-400 font-normal">(фото, документы)</span>
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        isDragging ? 'border-blue-500 bg-blue-50' : 'border-blue-200 hover:border-blue-400'
                      }`}
                    >
                      <Upload size={24} className="mx-auto mb-2 text-blue-300" />
                      <p className="text-sm text-slate-400">Перетащите файлы или нажмите для выбора</p>
                      <p className="text-xs text-slate-300 mt-1">JPG, PNG, PDF, DOC до 10 МБ</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => e.target.files && addFiles(e.target.files)}
                    />

                    {/* Список выбранных файлов */}
                    {selectedFiles.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {selectedFiles.map((file, i) => (
                          <li key={i} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 text-sm">
                            <MemoryFileIcon url={file.name} />
                            <span className="flex-1 truncate text-slate-700">{file.name}</span>
                            <span className="text-slate-400 text-xs flex-shrink-0">
                              {(file.size / 1024).toFixed(0)} КБ
                            </span>
                            <button
                              onClick={() => removeFile(i)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">
                      <AlertCircle size={16} />
                      {submitError}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!memoryText.trim() || submitting}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                  >
                    <Send size={16} />
                    {submitting ? 'Отправка...' : 'Отправить воспоминание'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-8 text-center">
              <p className="text-slate-500 mb-4">
                Для отправки воспоминаний необходима авторизация
              </p>
              <button
                onClick={openLoginModal}
                className="px-6 py-2.5 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition-colors"
              >
                Войти
              </button>
            </div>
          )}

          {/* Список опубликованных воспоминаний */}
          <div>
            <h3 className="font-semibold text-blue-900 mb-4">
              Воспоминания{memories.length > 0 && <span className="text-slate-400 font-normal ml-2">({memories.length})</span>}
            </h3>

            {loadingMemories ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-slate-100 rounded-2xl h-28 animate-pulse" />
                ))}
              </div>
            ) : memories.length === 0 ? (
              <p className="text-slate-400 text-sm">Пока нет воспоминаний. Будьте первым!</p>
            ) : (
              <div className="space-y-4">
                {memories.map((m) => (
                  <div key={m.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-blue-900 text-sm">{m.author_name}</span>
                      <span className="text-xs text-slate-400">{formatDate(m.created_at)}</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    {m.file_urls.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.file_urls.map((url, i) => {
                          const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url);
                          return isImage ? (
                            <a key={i} href={`${BACKEND}${url}`} target="_blank" rel="noopener noreferrer">
                              <img
                                src={`${BACKEND}${url}`}
                                alt=""
                                className="w-24 h-24 object-cover rounded-xl border border-blue-100 hover:opacity-90 transition-opacity"
                              />
                            </a>
                          ) : (
                            <a
                              key={i}
                              href={`${BACKEND}${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 rounded-lg text-xs text-blue-700 hover:bg-blue-100 transition-colors"
                            >
                              <FileText size={14} />
                              {url.split('/').pop()}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
