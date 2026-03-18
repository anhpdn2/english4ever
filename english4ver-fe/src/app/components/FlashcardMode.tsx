import { useState, useEffect } from "react";
import { Vocabulary } from "../data/mockData";
import { Lightbulb, Volume2, Keyboard as KeyboardIcon, X, Check, Undo2, Shuffle, Settings, Maximize } from "lucide-react";

interface FlashcardModeProps {
  vocabularies: Vocabulary[];
}

export function FlashcardMode({ vocabularies }: FlashcardModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progressEnabled, setProgressEnabled] = useState(true);

  const currentVocab = vocabularies[currentIndex];
  const progress = ((currentIndex + 1) / vocabularies.length) * 100;

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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Keyboard events for spacebar to flip, arrows to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
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
    return <div className="text-center p-8">Không có từ vựng nào.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-[#0a0b1e] rounded-3xl p-6 md:p-10 text-white font-sans flex flex-col items-center shadow-2xl">
      {/* Flashcard Area */}
      <div className="w-full max-w-4xl mx-auto [perspective:1000px] mb-8 relative">
        <div
          onClick={handleFlip}
          className={`relative w-full h-[400px] md:h-[500px] cursor-pointer transition-transform duration-500`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 bg-[#2d3655] rounded-3xl shadow-xl flex flex-col justify-between overflow-hidden border border-[#3d476b]"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Top icons */}
            <div className="flex justify-between items-center p-6 text-gray-300">
              <button className="flex items-center gap-2 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <Lightbulb size={20} />
                <span className="font-semibold text-sm">Hiển thị gợi ý</span>
              </button>
              <button className="hover:text-white transition-colors p-2" onClick={(e) => e.stopPropagation()}>
                <Volume2 size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-4xl md:text-5xl font-medium text-white text-center break-words">
                {currentVocab.english}
              </p>
            </div>
            
            {/* Bottom bar inside card */}
            <div className="bg-[#b4bdfc] p-4 flex items-center justify-center gap-2 md:gap-3 text-[#1a2035] font-medium text-sm w-full">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-400 p-1.5 rounded-full text-black flex items-center justify-center">
                  <KeyboardIcon size={14} />
                </div>
                <span className="font-bold hidden sm:inline">Phím tắt</span>
              </div>
              <span className="mx-1 hidden sm:inline">Nhấn</span>
              <span className="bg-white px-2 py-1 rounded border border-gray-300 text-xs font-bold shadow-sm">phím cách</span>
              <span>hoặc nhấp vào thẻ để lật</span>
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute inset-0 bg-[#2d3655] rounded-3xl shadow-xl flex flex-col justify-between overflow-hidden border border-[#3d476b]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex justify-between items-center p-6 text-gray-300">
              <div className="w-10"></div> {/* Spacer for centering */}
              <button className="hover:text-white transition-colors p-2" onClick={(e) => e.stopPropagation()}>
                <Volume2 size={20} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
              <p className="text-3xl md:text-4xl font-medium text-white break-words">
                {currentVocab.vietnamese}
              </p>
            </div>
            
            <div className="bg-[#b4bdfc] p-4 flex items-center justify-center gap-2 md:gap-3 text-[#1a2035] font-medium text-sm w-full">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-400 p-1.5 rounded-full text-black flex items-center justify-center">
                  <KeyboardIcon size={14} />
                </div>
                <span className="font-bold hidden sm:inline">Phím tắt</span>
              </div>
              <span className="mx-1 hidden sm:inline">Nhấn</span>
              <span className="bg-white px-2 py-1 rounded border border-gray-300 text-xs font-bold shadow-sm">mũi tên</span>
              <span>để chuyển thẻ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Area */}
      <div className="w-full max-w-4xl flex flex-wrap md:flex-nowrap items-center justify-between gap-6 mb-4">
        
        {/* Left: Progress Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start order-2 md:order-1">
          <span className="font-semibold text-sm whitespace-nowrap">Theo dõi tiến độ</span>
          <button 
            onClick={() => setProgressEnabled(!progressEnabled)}
            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${progressEnabled ? "bg-[#4B4DFF]" : "bg-gray-600"}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${progressEnabled ? "translate-x-6" : "translate-x-0"}`}></div>
          </button>
        </div>

        {/* Center: Navigation & Action */}
        <div className="flex items-center gap-6 md:gap-8 mx-auto order-1 md:order-2">
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#2E3A5A] hover:bg-[#3D4B70] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={24} className="text-[#FF725B]" strokeWidth={3} />
          </button>
          
          <div className="font-bold text-lg min-w-[80px] text-center">
            {currentIndex + 1} / {vocabularies.length}
          </div>
          
          <button 
            onClick={handleNext}
            disabled={currentIndex === vocabularies.length - 1}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#2E3A5A] hover:bg-[#3D4B70] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={24} className="text-[#23B26D]" strokeWidth={3} />
          </button>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-4 text-gray-400 w-full md:w-auto justify-center md:justify-end order-3">
          <button className="hover:text-white transition-colors p-2" title="Quay lại">
            <Undo2 size={20} />
          </button>
          <button className="hover:text-white transition-colors p-2" title="Trộn thẻ">
            <Shuffle size={20} />
          </button>
          <button className="hover:text-white transition-colors p-2" title="Cài đặt">
            <Settings size={20} />
          </button>
          <button className="hover:text-white transition-colors p-2" title="Toàn màn hình">
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      {progressEnabled && (
        <div className="w-full max-w-4xl h-0.5 bg-[#2E3A5A] mt-6 relative rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
