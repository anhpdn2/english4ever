import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Play, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

type MatchCard = {
  id: string;
  pairId: string;
  text: string;
  type: "term" | "definition";
  matched: boolean;
};

export function MatchPage() {
  const { courseId, unitId } = useParams();
  const { getCourse } = useApp();

  const course = getCourse(courseId!);
  const unit = course?.units.find((u) => u.id === unitId);

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState === "playing") {
      timer = setInterval(() => setTimeElapsed((p) => p + 0.1), 100);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    if (!unit) return;
    const shuffled = [...unit.vocabularies].sort(() => Math.random() - 0.5).slice(0, 6);
    const newCards: MatchCard[] = [];
    shuffled.forEach((vocab) => {
      newCards.push({ id: `${vocab.id}-term`, pairId: vocab.id, text: vocab.english, type: "term", matched: false });
      newCards.push({ id: `${vocab.id}-def`, pairId: vocab.id, text: vocab.vietnamese, type: "definition", matched: false });
    });
    setCards(newCards.sort(() => Math.random() - 0.5));
    setGameState("playing");
    setTimeElapsed(0);
    setSelectedIds([]);
    setIsWrong(false);
  };

  const handleCardClick = (id: string) => {
    if (gameState !== "playing" || isWrong) return;
    const clicked = cards.find((c) => c.id === id);
    if (!clicked || clicked.matched || selectedIds.includes(id)) return;

    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);
      if (first && second && first.pairId === second.pairId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
            )
          );
          setSelectedIds([]);
        }, 300);
      } else {
        setIsWrong(true);
        setTimeout(() => { setSelectedIds([]); setIsWrong(false); }, 800);
      }
    }
  };

  useEffect(() => {
    if (gameState === "playing" && cards.length > 0 && cards.every((c) => c.matched)) {
      setGameState("end");
      setBestTime((prev) => (!prev || timeElapsed < prev ? timeElapsed : prev));
    }
  }, [cards, gameState, timeElapsed]);

  if (!course || !unit) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy unit</h2>
          <Button variant="link" asChild>
            <Link to="/">Quay về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link to={`/unit/${courseId}/${unitId}`}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-bold text-lg">Ghép thẻ</h1>
              <p className="text-xs text-muted-foreground">{unit.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-base px-3 py-1">
              {timeElapsed.toFixed(1)}s
            </Badge>
            {bestTime && (
              <Badge variant="secondary" className="gap-1">
                🏆 {bestTime.toFixed(1)}s
              </Badge>
            )}
            {gameState === "playing" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={startGame}
                className="rounded-full text-muted-foreground hover:text-destructive"
                title="Chơi lại"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col items-center justify-center">
        {/* Start screen */}
        {gameState === "start" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardContent className="flex flex-col items-center text-center py-10 px-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Trophy className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Sẵn sàng ghép thẻ?</h2>
                <p className="text-muted-foreground mb-6">
                  Làm cho tất cả các thẻ biến mất. Càng nhanh càng tốt!
                </p>
                {bestTime && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Thời gian tốt nhất:{" "}
                    <span className="text-primary font-semibold">{bestTime.toFixed(1)}s</span>
                  </p>
                )}
                <Button size="lg" onClick={startGame} className="w-full gap-2">
                  <Play className="w-4 h-4" />
                  Bắt đầu trò chơi
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Playing */}
        {gameState === "playing" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
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
                            x: [-8, 8, -8, 8, 0],
                            backgroundColor: "hsl(0 86% 97%)",
                            borderColor: "hsl(0 84% 60%)",
                            color: "hsl(0 72% 35%)",
                            transition: { duration: 0.4 },
                          }
                        : {
                            opacity: 1,
                            scale: 1,
                            backgroundColor: isSelected ? "hsl(221 83% 97%)" : "hsl(0 0% 100%)",
                            borderColor: isSelected ? "hsl(221 83% 53%)" : "hsl(214 32% 91%)",
                            color: isSelected ? "hsl(221 83% 40%)" : "hsl(222 47% 11%)",
                          }
                    }
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    onClick={() => handleCardClick(card.id)}
                    className="relative w-full min-h-[120px] md:min-h-[150px] p-4 flex flex-col items-center justify-center text-center rounded-xl border-2 shadow-sm hover:shadow-md cursor-pointer select-none overflow-hidden transition-shadow"
                  >
                    <span className="font-medium text-base md:text-lg z-10 break-words max-w-full leading-snug">
                      {card.text}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* End screen */}
        {gameState === "end" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardContent className="flex flex-col items-center text-center py-10 px-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Trophy className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Tuyệt vời!</h2>
                <p className="text-muted-foreground mb-2">Hoàn thành trong</p>
                <p className="text-4xl font-mono font-bold text-primary mb-8">
                  {timeElapsed.toFixed(1)}s
                </p>
                <div className="flex gap-3 w-full">
                  <Button variant="outline" asChild className="flex-1">
                    <Link to={`/unit/${courseId}/${unitId}`}>Quay lại</Link>
                  </Button>
                  <Button onClick={startGame} className="flex-1">
                    Chơi lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
