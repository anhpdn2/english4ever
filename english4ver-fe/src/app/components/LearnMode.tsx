import { useState, useEffect, useMemo } from "react";
import { Vocabulary } from "../data/mockData";
import { CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";

interface LearnModeProps {
  vocabularies: Vocabulary[];
}

const MAX_ACTIVE_WORDS = 7;
const MAX_LEVEL = 4; // 0 to 3, 4 is Done

export function LearnMode({ vocabularies }: LearnModeProps) {
  // State to track progress of each word. level 0 to 4.
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [activePool, setActivePool] = useState<string[]>([]);
  const [currentVocabId, setCurrentVocabId] = useState<string | null>(null);
  const [status, setStatus] = useState<"question" | "correct" | "incorrect" | "finished">("question");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  // Initialize
  useEffect(() => {
    if (vocabularies.length === 0) return;
    
    const initialProgress: Record<string, number> = {};
    vocabularies.forEach(v => {
      initialProgress[v.id] = 0;
    });
    setProgress(initialProgress);
    
    const initialPool = vocabularies.slice(0, MAX_ACTIVE_WORDS).map(v => v.id);
    setActivePool(initialPool);
    pickNextQuestion(initialPool, initialProgress, null);
  }, [vocabularies]);

  const generateOptions = (vocab: Vocabulary, level: number) => {
    // level 0: EN -> VI (options are VI)
    // level 1: VI -> EN (options are EN)
    const isEnToVi = level === 0;
    const correctAnswer = isEnToVi ? vocab.vietnamese : vocab.english;
    
    // Get other random options
    const others = vocabularies
      .filter(v => v.id !== vocab.id)
      .map(v => isEnToVi ? v.vietnamese : v.english)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
    const allOptions = [correctAnswer, ...others].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const pickNextQuestion = (pool: string[], prog: Record<string, number>, lastVocabId: string | null) => {
    if (pool.length === 0) {
      setStatus("finished");
      return;
    }
    
    // Try to pick a different word than the last one if possible
    let available = pool;
    if (pool.length > 1 && lastVocabId) {
      available = pool.filter(id => id !== lastVocabId);
    }
    
    const nextId = available[Math.floor(Math.random() * available.length)];
    setCurrentVocabId(nextId);
    
    const vocab = vocabularies.find(v => v.id === nextId)!;
    const level = prog[nextId] || 0;
    
    if (level < 2) {
      generateOptions(vocab, level);
    }
    setInputValue("");
    setStatus("question");
  };

  const handleAnswer = (answer: string) => {
    if (!currentVocabId) return;
    const vocab = vocabularies.find(v => v.id === currentVocabId)!;
    const level = progress[currentVocabId] || 0;
    
    let isCorrect = false;
    if (level === 0) {
      isCorrect = answer === vocab.vietnamese;
    } else if (level === 1) {
      isCorrect = answer === vocab.english;
    } else {
      isCorrect = answer.toLowerCase().trim() === vocab.english.toLowerCase().trim();
    }

    if (isCorrect) {
      setStatus("correct");
    } else {
      setStatus("incorrect");
    }
  };

  const handleNext = () => {
    if (!currentVocabId) return;
    
    const newProgress = { ...progress };
    let newPool = [...activePool];
    
    if (status === "correct") {
      newProgress[currentVocabId] = (newProgress[currentVocabId] || 0) + 1;
      
      // If reached max level, remove from pool and try to add a new word
      if (newProgress[currentVocabId] >= MAX_LEVEL) {
        newPool = newPool.filter(id => id !== currentVocabId);
        
        // Find a word that hasn't been added to the pool yet and isn't done
        const pendingVocabs = vocabularies.filter(v => 
          newProgress[v.id] === 0 && !newPool.includes(v.id)
        );
        
        if (pendingVocabs.length > 0) {
          newPool.push(pendingVocabs[0].id);
        }
      }
    } else {
      // If incorrect, maybe drop level by 1 but not below 0
      // For now, let's keep it same, so they have to repeat the level.
      // Or reset to 0 to be strict? Let's just not increase it.
    }
    
    setProgress(newProgress);
    setActivePool(newPool);
    pickNextQuestion(newPool, newProgress, currentVocabId);
  };

  if (vocabularies.length === 0) {
    return <div className="text-center p-8">Không có từ vựng.</div>;
  }

  if (status === "finished") {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
        <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Chúc mừng!</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Bạn đã hoàn thành việc học toàn bộ {vocabularies.length} từ vựng trong học phần này.
        </p>
        <button
          onClick={() => {
            const initialProgress: Record<string, number> = {};
            vocabularies.forEach(v => initialProgress[v.id] = 0);
            setProgress(initialProgress);
            const initialPool = vocabularies.slice(0, MAX_ACTIVE_WORDS).map(v => v.id);
            setActivePool(initialPool);
            pickNextQuestion(initialPool, initialProgress, null);
          }}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
        >
          Học lại từ đầu
        </button>
      </div>
    );
  }

  if (!currentVocabId) return null;

  const currentVocab = vocabularies.find(v => v.id === currentVocabId)!;
  const currentLevel = progress[currentVocabId] || 0;
  
  // Calculate overall progress percentage
  const totalSteps = vocabularies.length * MAX_LEVEL;
  const currentSteps = Object.values(progress).reduce((sum, val) => sum + Math.min(val, MAX_LEVEL), 0);
  const progressPercent = Math.round((currentSteps / totalSteps) * 100);

  // Render Quiz Question (Level 0 or 1)
  const renderQuiz = () => {
    const isEnToVi = currentLevel === 0;
    const questionText = isEnToVi ? currentVocab.english : currentVocab.vietnamese;
    const questionLabel = isEnToVi ? "Chọn nghĩa tiếng Việt" : "Chọn từ tiếng Anh";

    return (
      <div className="space-y-6 flex flex-col items-center w-full">
        <div className="mb-8 text-center w-full">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{questionLabel}</p>
          <h3 className="text-3xl font-bold text-gray-900">{questionText}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {options.map((option, idx) => {
            let btnClass = "p-4 text-left border-2 rounded-xl transition-all duration-200 font-medium text-lg w-full ";
            
            if (status === "question") {
              btnClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white text-gray-800";
            } else {
              const correctAnswer = isEnToVi ? currentVocab.vietnamese : currentVocab.english;
              if (option === correctAnswer) {
                btnClass += "border-green-500 bg-green-50 text-green-700";
              } else {
                btnClass += "border-gray-200 bg-gray-50 text-gray-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={status !== "question"}
                onClick={() => handleAnswer(option)}
                className={btnClass}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Typing Question (Level 2 or 3)
  const renderTyping = () => {
    return (
      <div className="space-y-6 flex flex-col items-center w-full">
        <div className="mb-8 text-center w-full">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Gõ từ tiếng Anh</p>
          <h3 className="text-3xl font-bold text-gray-900">{currentVocab.vietnamese}</h3>
        </div>
        
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (status === "question" && inputValue.trim()) {
              handleAnswer(inputValue);
            } else if (status !== "question") {
              handleNext();
            }
          }}
          className="relative w-full max-w-2xl"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={status !== "question"}
            placeholder="Nhập câu trả lời bằng tiếng Anh..."
            className={`w-full p-4 md:p-6 text-xl rounded-xl border-2 outline-none transition-colors ${
              status === "question" 
                ? "border-gray-300 focus:border-blue-500 bg-white" 
                : status === "correct"
                  ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                  : "border-red-500 bg-red-50 text-red-700 font-semibold"
            }`}
            autoFocus
          />
          {status === "question" && (
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header / Progress bar */}
      <div className="mb-8 flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1">
          <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
            <span>Tiến độ tổng quan</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        <div className="hidden md:flex flex-col text-xs text-gray-500 font-medium border-l pl-4">
          <span>Đang học: {activePool.length} từ</span>
          <span>Mức độ hiện tại: {currentLevel + 1}/{MAX_LEVEL}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[400px] flex flex-col relative overflow-hidden">
        {/* Progress Dots for current word */}
        <div className="absolute top-6 right-6 flex gap-1.5">
          {[0, 1, 2, 3].map(level => (
            <div 
              key={level} 
              className={`w-2.5 h-2.5 rounded-full ${level < currentLevel ? "bg-green-500" : level === currentLevel ? "bg-blue-500 ring-2 ring-blue-200" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {currentLevel < 2 ? renderQuiz() : renderTyping()}
        </div>

        {/* Feedback Area */}
        {status !== "question" && (
          <div className={`mt-8 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            status === "correct" ? "bg-green-100" : "bg-red-100"
          }`}>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className={`p-2 rounded-full ${status === "correct" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                {status === "correct" ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
              </div>
              <div>
                <h4 className={`text-xl font-bold ${status === "correct" ? "text-green-800" : "text-red-800"}`}>
                  {status === "correct" ? "Chính xác!" : "Chưa đúng"}
                </h4>
                {status === "incorrect" && (
                  <p className="text-red-700 mt-1">
                    Đáp án đúng là: <span className="font-bold text-red-900">{currentVocab.english}</span>
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleNext}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95 ${
                status === "correct" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
              autoFocus
            >
              Tiếp tục
            </button>
          </div>
        )}
      </div>
    </div>
  );
}