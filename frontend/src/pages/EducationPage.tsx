import { useState } from 'react';
import { GraduationCap, Brain, Star, Clock, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import SectionLayout from '../components/ui/SectionLayout';
import { useAuth } from '../context/AuthContext';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

const mockTest: { title: string; questions: Question[] } = {
  title: 'Биография и творчество Эрика Батуева',
  questions: [
    {
      id: 1,
      text: 'В каком году родился Эрик Батуев?',
      options: ['1950', '1955', '1960', '1948'],
      correctIndex: 1,
    },
    {
      id: 2,
      text: 'Где родился Эрик Батуев?',
      options: ['В Ижевске', 'В Можге', 'В деревне Куштошур', 'В Москве'],
      correctIndex: 2,
    },
    {
      id: 3,
      text: 'На каком факультете МГУ учился Батуев?',
      options: ['Филологический', 'Журналистики', 'Исторический', 'Философский'],
      correctIndex: 1,
    },
  ],
};

const mockTests = [
  { id: 1, title: 'Биография и творчество', questions: 10, difficulty: 'easy', completions: 142 },
  { id: 2, title: 'Поэтика и образность', questions: 8, difficulty: 'medium', completions: 87 },
  { id: 3, title: 'Журналистская деятельность', questions: 12, difficulty: 'medium', completions: 63 },
  { id: 4, title: 'Удмуртский контекст', questions: 15, difficulty: 'hard', completions: 28 },
];

const difficultyMap: Record<string, { label: string; color: string; stars: number }> = {
  easy: { label: 'Начальный', color: 'text-green-600 bg-green-100', stars: 1 },
  medium: { label: 'Средний', color: 'text-yellow-600 bg-yellow-100', stars: 2 },
  hard: { label: 'Сложный', color: 'text-red-600 bg-red-100', stars: 3 },
};

export default function EducationPage() {
  const { user, openLoginModal } = useAuth();
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const startTest = (id: number) => {
    if (!user) {
      openLoginModal();
      return;
    }
    setSelectedTest(id);
    setCurrentQ(0);
    setAnswers([]);
    setFinished(false);
  };

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (currentQ < mockTest.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
    }
  };

  const score = answers.filter((a, i) => a === mockTest.questions[i]?.correctIndex).length;

  return (
    <SectionLayout
      title="Образование"
      subtitle="Тесты и учебные материалы"
      icon={<GraduationCap size={20} />}
    >
      {!selectedTest ? (
        /* Список тестов */
        <div>
          {!user && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700 flex items-center justify-between">
              <span>Для прохождения тестов необходима авторизация</span>
              <button
                onClick={openLoginModal}
                className="px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-medium hover:bg-blue-800"
              >
                Войти
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTests.map((test) => {
              const diff = difficultyMap[test.difficulty];
              return (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-blue-900 text-base">{test.title}</h3>
                    <div className="flex gap-0.5 ml-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < diff.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4 text-xs text-slate-400">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${diff.color}`}>{diff.label}</span>
                    <span className="flex items-center gap-1">
                      <Brain size={11} />
                      {test.questions} вопросов
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      ~{Math.round(test.questions * 1.5)} мин
                    </span>
                  </div>
                  <button
                    onClick={() => startTest(test.id)}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Начать тест
                    <ChevronRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : finished ? (
        /* Результаты */
        <div className="max-w-lg mx-auto text-center animate-float-up">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-blue-700">{score}/{mockTest.questions.length}</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-blue-900 mb-2">Тест завершён!</h2>
          <p className="text-slate-500 mb-8">
            {score === mockTest.questions.length
              ? 'Отлично! Вы ответили правильно на все вопросы.'
              : score >= mockTest.questions.length / 2
              ? 'Хороший результат! Продолжайте изучать материалы музея.'
              : 'Рекомендуем перечитать биографию Эрика Батуева.'}
          </p>

          {/* Разбор ответов */}
          <div className="text-left space-y-3 mb-8">
            {mockTest.questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-slate-700">{q.text}</p>
                      {!isCorrect && (
                        <p className="text-xs text-green-600 mt-1">Правильный ответ: {q.options[q.correctIndex]}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setSelectedTest(null)}
            className="px-6 py-2.5 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors"
          >
            К списку тестов
          </button>
        </div>
      ) : (
        /* Вопрос теста */
        <div className="max-w-lg mx-auto animate-float-up">
          {/* Прогресс */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
              <span>Вопрос {currentQ + 1} из {mockTest.questions.length}</span>
              <button onClick={() => setSelectedTest(null)} className="text-xs text-slate-400 hover:text-slate-600">
                Выйти
              </button>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${((currentQ) / mockTest.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-xl font-serif font-semibold text-blue-900 mb-6">
            {mockTest.questions[currentQ].text}
          </h3>

          <div className="space-y-3">
            {mockTest.questions[currentQ].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left px-5 py-3.5 bg-white border-2 border-blue-100 rounded-xl text-sm text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all font-medium"
              >
                <span className="text-blue-300 font-bold mr-3">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </SectionLayout>
  );
}
