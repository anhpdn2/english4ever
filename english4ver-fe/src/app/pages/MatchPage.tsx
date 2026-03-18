import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { mockCourses } from "../data/mockData";
import { ArrowLeft, Play, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Card = {
  id: string;
  pairId: string;
  text: string;
  type: "term" | "definition";
  imageUrl?: string;
  matched: boolean;
};

export function MatchPage() {
  const { courseId, unitId } = useParams();
  
  const course = mockCourses.find((c) => c.id === courseId);
  const unit = course?.units.find((u) => u.id === unitId);

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: any;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    if (!unit) return;
    
    // Pick up to 6 random vocabularies for the game
    const shuffledVocabs = [...unit.vocabularies].sort(() => Math.random() - 0.5).slice(0, 6);
    
    const newCards: Card[] = [];
    shuffledVocabs.forEach((vocab) => {
      newCards.push({
        id: `${vocab.id}-term`,
        pairId: vocab.id,
        text: vocab.english,
        type: "term",
        matched: false,
      });
      newCards.push({
        id: `${vocab.id}-def`,
        pairId: vocab.id,
        text: vocab.vietnamese,
        type: "definition",
        imageUrl: vocab.imageUrl,
        matched: false,
      });
    });

    setCards(newCards.sort(() => Math.random() - 0.5));
    setGameState("playing");
    setTimeElapsed(0);
    setSelectedIds([]);
    setIsWrong(false);
  };

  const handleCardClick = (id: string) => {
    if (gameState !== "playing" || isWrong) return;
    
    const clickedCard = cards.find((c) => c.id === id);
    if (!clickedCard || clickedCard.matched) return;
    if (selectedIds.includes(id)) return;

    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, matched: true }
                : c
            )
          );
          setSelectedIds([]);
        }, 300);
      } else {
        // Not a match
        setIsWrong(true);
        setTimeout(() => {
          setSelectedIds([]);
          setIsWrong(false);
        }, 800);
      }
    }
  };

  // Check win condition
  useEffect(() => {
    if (gameState === "playing" && cards.length > 0) {
      const allMatched = cards.every((c) => c.matched);
      if (allMatched) {
        setGameState("end");
        setBestTime((prev) => (!prev || timeElapsed < prev ? timeElapsed : prev));
      }
    }
  }, [cards, gameState, timeElapsed]);

  if (!course || !unit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy unit</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={`/unit/${courseId}/${unitId}`}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ghép thẻ</h1>
              <p className="text-sm text-gray-500">{unit.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-2xl font-mono font-bold text-gray-700">
              {timeElapsed.toFixed(1)}s
            </div>
            {gameState === "playing" && (
              <button
                onClick={startGame}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Chơi lại"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col items-center justify-center relative">
        {gameState === "start" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sẵn sàng ghép thẻ?</h2>
            <p className="text-gray-600 mb-8">
              Làm cho tất cả các thẻ biến mất. Càng nhanh càng tốt!
            </p>
            {bestTime && (
              <p className="text-sm font-medium text-gray-500 mb-6">
                Thời gian tốt nhất: <span className="text-blue-600">{bestTime.toFixed(1)}s</span>
              </p>
            )}
            <button
              onClick={startGame}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold text-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              Bắt đầu trò chơi
            </button>
          </motion.div>
        )}

        {gameState === "playing" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full h-full max-h-[800px]">
            <AnimatePresence>
              {cards.map((card) => {
                if (card.matched) return null;
                const isSelected = selectedIds.includes(card.id);
                const isError = isSelected && isWrong;

                return (
                  <motion.button
                    key={card.id}
                    layoutId={card.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isError
                        ? {
                            x: [-10, 10, -10, 10, 0],
                            backgroundColor: "#fef2f2",
                            borderColor: "#ef4444",
                            color: "#b91c1c",
                            transition: { duration: 0.4 },
                          }
                        : {
                            opacity: 1,
                            scale: 1,
                            backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                            borderColor: isSelected ? "#3b82f6" : "#e5e7eb",
                            color: isSelected ? "#1d4ed8" : "#1f2937",
                          }
                    }
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => handleCardClick(card.id)}
                    className={`relative w-full h-full min-h-[120px] md:min-h-[160px] p-4 flex flex-col items-center justify-center text-center rounded-xl border-2 shadow-sm transition-shadow hover:shadow-md cursor-pointer select-none overflow-hidden`}
                  >
                    {card.type === "definition" && card.imageUrl && (
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="font-medium text-lg md:text-xl z-10 break-words max-w-full">
                      {card.text}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {gameState === "end" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tuyệt vời!</h2>
            <p className="text-gray-600 mb-8">
              Bạn đã hoàn thành trong <span className="font-bold text-gray-900">{timeElapsed.toFixed(1)}</span> giây
            </p>
            <div className="flex gap-4">
              <Link
                to={`/unit/${courseId}/${unitId}`}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold transition-colors"
              >
                Quay lại
              </Link>
              <button
                onClick={startGame}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold transition-colors"
              >
                Chơi lại
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}