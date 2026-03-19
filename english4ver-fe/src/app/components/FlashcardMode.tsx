import { useState, useEffect } from "react";
import { Vocabulary } from "../data/mockData";
import {
  Lightbulb,
  Volume2,
  Keyboard as KeyboardIcon,
  X,
  Check,
  Undo2,
  Shuffle,
  Settings,
  Maximize,
} from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FlashcardModeProps {
  vocabularies: Vocabulary[];
}

export function FlashcardMode({ vocabularies }: FlashcardModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progressEnabled, setProgressEnabled] = useState(true);

  const currentVocab = vocabularies[currentIndex];
  const progressValue = ((currentIndex + 1) / vocabularies.length) * 100;

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowLeft") {
        handlePrevious();
      } else if (e.code === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFlipped]);

  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Không có từ vựng nào.
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto bg-[#0a0b1e] rounded-3xl p-6 md:p-10 text-white font-sans flex flex-col items-center shadow-2xl">
        {/* Flashcard Area */}
        <div className="w-full max-w-4xl mx-auto [perspective:1000px] mb-8 relative">
          <div
            onClick={handleFlip}
            className="relative w-full h-[400px] md:h-[500px] cursor-pointer transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-[#2d3655] rounded-3xl shadow-xl flex flex-col justify-between overflow-hidden border border-[#3d476b]"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="flex justify-between items-center p-6 text-gray-300">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-white/10 gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Lightbulb size={18} />
                  <span className="text-sm">Hiển thị gợi ý</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Volume2 size={20} />
                </Button>
              </div>

              <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-4xl md:text-5xl font-medium text-white text-center break-words">
                  {currentVocab.english}
                </p>
              </div>

              <div className="bg-[#b4bdfc] p-4 flex items-center justify-center gap-2 md:gap-3 text-[#1a2035] font-medium text-sm w-full">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-400 p-1.5 rounded-full text-black flex items-center justify-center">
                    <KeyboardIcon size={13} />
                  </div>
                  <span className="font-bold hidden sm:inline">Phím tắt</span>
                </div>
                <span className="hidden sm:inline">Nhấn</span>
                <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 text-xs font-bold shadow-sm">
                  phím cách
                </kbd>
                <span>hoặc nhấp vào thẻ để lật</span>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 bg-[#2d3655] rounded-3xl shadow-xl flex flex-col justify-between overflow-hidden border border-[#3d476b]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="flex justify-between items-center p-6 text-gray-300">
                <div className="w-10" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Volume2 size={20} />
                </Button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
                <p className="text-3xl md:text-4xl font-medium text-white break-words">
                  {currentVocab.vietnamese}
                </p>
              </div>

              <div className="bg-[#b4bdfc] p-4 flex items-center justify-center gap-2 md:gap-3 text-[#1a2035] font-medium text-sm w-full">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-400 p-1.5 rounded-full text-black flex items-center justify-center">
                    <KeyboardIcon size={13} />
                  </div>
                  <span className="font-bold hidden sm:inline">Phím tắt</span>
                </div>
                <span className="hidden sm:inline">Nhấn</span>
                <kbd className="bg-white px-2 py-0.5 rounded border border-gray-300 text-xs font-bold shadow-sm">
                  mũi tên
                </kbd>
                <span>để chuyển thẻ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-4xl flex flex-wrap md:flex-nowrap items-center justify-between gap-6 mb-4">
          {/* Progress Toggle */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-center md:justify-start order-2 md:order-1">
            <Label className="text-sm font-semibold whitespace-nowrap">
              Theo dõi tiến độ
            </Label>
            <Switch
              checked={progressEnabled}
              onCheckedChange={setProgressEnabled}
              className="data-[state=checked]:bg-[#4B4DFF]"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 md:gap-8 mx-auto order-1 md:order-2">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              size="icon"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#2E3A5A] hover:bg-[#3D4B70] border-none"
            >
              <X size={24} className="text-[#FF725B]" strokeWidth={3} />
            </Button>

            <span className="font-bold text-lg min-w-[80px] text-center">
              {currentIndex + 1} / {vocabularies.length}
            </span>

            <Button
              onClick={handleNext}
              disabled={currentIndex === vocabularies.length - 1}
              size="icon"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#2E3A5A] hover:bg-[#3D4B70] border-none"
            >
              <Check size={24} className="text-[#23B26D]" strokeWidth={3} />
            </Button>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-1 text-gray-400 w-full md:w-auto justify-center md:justify-end order-3">
            {[
              { icon: Undo2, label: "Quay lại" },
              { icon: Shuffle, label: "Trộn thẻ" },
              { icon: Settings, label: "Cài đặt" },
              { icon: Maximize, label: "Toàn màn hình" },
            ].map(({ icon: Icon, label }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    <Icon size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {progressEnabled && (
          <div className="w-full max-w-4xl mt-4">
            <Progress
              value={progressValue}
              className="h-0.5 bg-[#2E3A5A] [&>div]:bg-white"
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
