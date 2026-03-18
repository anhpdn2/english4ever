import { useState } from "react";
import { Link, useParams } from "react-router";
import { mockCourses } from "../data/mockData";
import { FlashcardMode } from "../components/FlashcardMode";
import { VocabularyList } from "../components/VocabularyList";
import { LearnMode } from "../components/LearnMode";
import { ArrowLeft, BookOpen, Brain, List, Gamepad2 } from "lucide-react";

type Mode = "list" | "flashcard" | "learn";

export function UnitPage() {
  const { courseId, unitId } = useParams();
  const [mode, setMode] = useState<Mode>("list");

  const course = mockCourses.find((c) => c.id === courseId);
  const unit = course?.units.find((u) => u.id === unitId);

  if (!course || !unit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy unit
          </h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to={`/course/${courseId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại khóa học
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{unit.title}</h1>
              <p className="text-gray-600 mt-1">{unit.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                {unit.vocabularies.length} từ vựng
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                mode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <List className="w-4 h-4" />
              Danh sách
            </button>
            <button
              onClick={() => setMode("flashcard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                mode === "flashcard"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Flashcard
            </button>
            <button
              onClick={() => setMode("learn")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                mode === "learn"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Brain className="w-4 h-4" />
              Học
            </button>
            <Link
              to={`/unit/${courseId}/${unitId}/match`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              <Gamepad2 className="w-4 h-4" />
              Ghép thẻ (Match)
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {mode === "list" && <VocabularyList vocabularies={unit.vocabularies} />}
        {mode === "flashcard" && <FlashcardMode vocabularies={unit.vocabularies} />}
        {mode === "learn" && <LearnMode vocabularies={unit.vocabularies} />}
      </main>
    </div>
  );
}
