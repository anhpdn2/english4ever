import { useState, useEffect } from "react";
import { Vocabulary } from "../data/mockData";
import { CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface LearnModeProps {
  vocabularies: Vocabulary[];
}

const MAX_ACTIVE_WORDS = 7;
const MAX_LEVEL = 4;

export function LearnMode({ vocabularies }: LearnModeProps) {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [activePool, setActivePool] = useState<string[]>([]);
  const [currentVocabId, setCurrentVocabId] = useState<string | null>(null);
  const [status, setStatus] = useState<"question" | "correct" | "incorrect" | "finished">("question");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (vocabularies.length === 0) return;
    const initialProgress: Record<string, number> = {};
    vocabularies.forEach((v) => { initialProgress[v.id] = 0; });
    setProgress(initialProgress);
    const initialPool = vocabularies.slice(0, MAX_ACTIVE_WORDS).map((v) => v.id);
    setActivePool(initialPool);
    pickNextQuestion(initialPool, initialProgress, null);
  }, [vocabularies]);

  const generateOptions = (vocab: Vocabulary, level: number) => {
    const isEnToVi = level === 0;
    const correctAnswer = isEnToVi ? vocab.vietnamese : vocab.english;
    const others = vocabularies
      .filter((v) => v.id !== vocab.id)
      .map((v) => (isEnToVi ? v.vietnamese : v.english))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setOptions([correctAnswer, ...others].sort(() => 0.5 - Math.random()));
  };

  const pickNextQuestion = (
    pool: string[],
    prog: Record<string, number>,
    lastVocabId: string | null
  ) => {
    if (pool.length === 0) { setStatus("finished"); return; }
    let available = pool;
    if (pool.length > 1 && lastVocabId) {
      available = pool.filter((id) => id !== lastVocabId);
    }
    const nextId = available[Math.floor(Math.random() * available.length)];
    setCurrentVocabId(nextId);
    const vocab = vocabularies.find((v) => v.id === nextId)!;
    const level = prog[nextId] || 0;
    if (level < 2) generateOptions(vocab, level);
    setInputValue("");
    setStatus("question");
  };

  const handleAnswer = (answer: string) => {
    if (!currentVocabId) return;
    const vocab = vocabularies.find((v) => v.id === currentVocabId)!;
    const level = progress[currentVocabId] || 0;
    let isCorrect = false;
    if (level === 0) isCorrect = answer === vocab.vietnamese;
    else if (level === 1) isCorrect = answer === vocab.english;
    else isCorrect = answer.toLowerCase().trim() === vocab.english.toLowerCase().trim();
    setStatus(isCorrect ? "correct" : "incorrect");
  };

  const handleNext = () => {
    if (!currentVocabId) return;
    const newProgress = { ...progress };
    let newPool = [...activePool];
    if (status === "correct") {
      newProgress[currentVocabId] = (newProgress[currentVocabId] || 0) + 1;
      if (newProgress[currentVocabId] >= MAX_LEVEL) {
        newPool = newPool.filter((id) => id !== currentVocabId);
        const pending = vocabularies.filter(
          (v) => newProgress[v.id] === 0 && !newPool.includes(v.id)
        );
        if (pending.length > 0) newPool.push(pending[0].id);
      }
    }
    setProgress(newProgress);
    setActivePool(newPool);
    pickNextQuestion(newPool, newProgress, currentVocabId);
  };

  const handleRestart = () => {
    const initialProgress: Record<string, number> = {};
    vocabularies.forEach((v) => { initialProgress[v.id] = 0; });
    setProgress(initialProgress);
    const initialPool = vocabularies.slice(0, MAX_ACTIVE_WORDS).map((v) => v.id);
    setActivePool(initialPool);
    pickNextQuestion(initialPool, initialProgress, null);
  };

  if (vocabularies.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">Không có từ vựng.</div>;
  }

  if (status === "finished") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center text-center py-16 px-8">
          <Trophy className="w-24 h-24 text-yellow-400 mb-6" />
          <h2 className="text-3xl font-bold mb-3">Chúc mừng!</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Bạn đã hoàn thành toàn bộ{" "}
            <span className="font-semibold text-foreground">{vocabularies.length}</span>{" "}
            từ vựng trong học phần này.
          </p>
          <Button size="lg" onClick={handleRestart}>
            <RotateCcw />
            Học lại từ đầu
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentVocabId) return null;

  const currentVocab = vocabularies.find((v) => v.id === currentVocabId)!;
  const currentLevel = progress[currentVocabId] || 0;
  const totalSteps = vocabularies.length * MAX_LEVEL;
  const currentSteps = Object.values(progress).reduce(
    (sum, val) => sum + Math.min(val, MAX_LEVEL),
    0
  );
  const progressPercent = Math.round((currentSteps / totalSteps) * 100);

  const renderQuiz = () => {
    const isEnToVi = currentLevel === 0;
    const questionText = isEnToVi ? currentVocab.english : currentVocab.vietnamese;
    const questionLabel = isEnToVi ? "Chọn nghĩa tiếng Việt" : "Chọn từ tiếng Anh";
    const correctAnswer = isEnToVi ? currentVocab.vietnamese : currentVocab.english;

    return (
      <div className="flex flex-col items-center w-full gap-6">
        <div className="text-center w-full mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {questionLabel}
          </p>
          <h3 className="text-3xl font-bold text-foreground">{questionText}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
          {options.map((option, idx) => {
            let variant: "outline" | "default" | "secondary" = "outline";
            let extraClass = "text-left justify-start h-auto py-4 px-5 text-base font-medium";

            if (status !== "question") {
              if (option === correctAnswer) {
                extraClass += " border-green-500 bg-green-50 text-green-700 hover:bg-green-50";
              } else {
                extraClass += " border-border bg-muted text-muted-foreground opacity-50";
              }
            } else {
              extraClass += " hover:border-primary hover:bg-primary/5";
            }

            return (
              <Button
                key={idx}
                variant={variant}
                disabled={status !== "question"}
                onClick={() => handleAnswer(option)}
                className={extraClass}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTyping = () => (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="text-center w-full mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Gõ từ tiếng Anh
        </p>
        <h3 className="text-3xl font-bold text-foreground">{currentVocab.vietnamese}</h3>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (status === "question" && inputValue.trim()) handleAnswer(inputValue);
          else if (status !== "question") handleNext();
        }}
        className="relative w-full max-w-2xl"
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={status !== "question"}
          placeholder="Nhập câu trả lời bằng tiếng Anh..."
          autoFocus
          className={`h-14 text-base pr-14 ${
            status === "correct"
              ? "border-green-500 bg-green-50 text-green-700 focus-visible:ring-green-500/30"
              : status === "incorrect"
              ? "border-destructive bg-destructive/5 text-destructive focus-visible:ring-destructive/30"
              : ""
          }`}
        />
        {status === "question" && (
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <ArrowRight />
          </Button>
        )}
      </form>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress header */}
      <Card className="mb-6">
        <CardContent className="py-4 px-5 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
              <span>Tiến độ tổng quan</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          <div className="hidden md:flex flex-col items-end text-xs text-muted-foreground border-l pl-4 gap-0.5">
            <span>Đang học: <strong>{activePool.length}</strong> từ</span>
            <span>Mức độ: <strong>{currentLevel + 1}/{MAX_LEVEL}</strong></span>
          </div>
        </CardContent>
      </Card>

      {/* Main card */}
      <Card className="min-h-[400px] flex flex-col relative overflow-hidden">
        {/* Level dots */}
        <div className="absolute top-5 right-5 flex gap-1.5">
          {[0, 1, 2, 3].map((level) => (
            <div
              key={level}
              className={`w-2.5 h-2.5 rounded-full ${
                level < currentLevel
                  ? "bg-green-500"
                  : level === currentLevel
                  ? "bg-primary ring-2 ring-primary/30"
                  : "bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>

        <CardContent className="flex-1 flex flex-col justify-center py-10 px-6 md:px-10">
          {currentLevel < 2 ? renderQuiz() : renderTyping()}
        </CardContent>

        {/* Feedback */}
        {status !== "question" && (
          <div
            className={`border-t px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${
              status === "correct"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {status === "correct" ? (
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-destructive flex-shrink-0" />
              )}
              <div>
                <h4 className={`font-bold text-lg ${status === "correct" ? "text-green-800" : "text-destructive"}`}>
                  {status === "correct" ? "Chính xác!" : "Chưa đúng"}
                </h4>
                {status === "incorrect" && (
                  <p className="text-sm text-muted-foreground">
                    Đáp án đúng:{" "}
                    <span className="font-bold text-foreground">{currentVocab.english}</span>
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleNext}
              autoFocus
              className={
                status === "correct"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-destructive hover:bg-destructive/90 text-white"
              }
            >
              Tiếp tục
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
