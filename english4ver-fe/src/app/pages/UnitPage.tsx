import { Link, useParams } from "react-router";
import { useApp } from "../context/AppContext";
import { FlashcardMode } from "../components/FlashcardMode";
import { VocabularyList } from "../components/VocabularyList";
import { LearnMode } from "../components/LearnMode";
import { ArrowLeft, BookOpen, Brain, List, Gamepad2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

export function UnitPage() {
  const { courseId, unitId } = useParams();
  const { getCourse } = useApp();

  const course = getCourse(courseId!);
  const unit = course?.units.find((u) => u.id === unitId);

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
    <div className="min-h-screen bg-muted/40">
      <Tabs defaultValue="list" className="gap-0">
        {/* Sticky header with tabs */}
        <header className="bg-background border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
              <Link to={`/course/${courseId}`}>
                <ArrowLeft />
                Quay lại khóa học
              </Link>
            </Button>

            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{unit.title}</h1>
                {unit.description && (
                  <p className="text-muted-foreground text-sm mt-0.5">{unit.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="w-3 h-3" />
                    {unit.vocabularies.length} từ vựng
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tabs nav */}
            <div className="flex items-center justify-between">
              <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="list"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 gap-1.5 font-medium"
                >
                  <List className="w-4 h-4" />
                  Danh sách
                </TabsTrigger>
                <TabsTrigger
                  value="flashcard"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 gap-1.5 font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  Flashcard
                </TabsTrigger>
                <TabsTrigger
                  value="learn"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 gap-1.5 font-medium"
                >
                  <Brain className="w-4 h-4" />
                  Học
                </TabsTrigger>
              </TabsList>

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 mb-px"
              >
                <Link to={`/unit/${courseId}/${unitId}/match`}>
                  <Gamepad2 className="w-4 h-4" />
                  Ghép thẻ
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Tab content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <TabsContent value="list">
            <VocabularyList vocabularies={unit.vocabularies} />
          </TabsContent>
          <TabsContent value="flashcard">
            <FlashcardMode vocabularies={unit.vocabularies} />
          </TabsContent>
          <TabsContent value="learn">
            <LearnMode vocabularies={unit.vocabularies} />
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
