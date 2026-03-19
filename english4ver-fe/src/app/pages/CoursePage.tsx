import { Link, useParams } from "react-router";
import { useApp } from "../context/AppContext";
import { ArrowLeft, BookOpen, ChevronRight, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export function CoursePage() {
  const { courseId } = useParams();
  const { getCourse } = useApp();
  const course = getCourse(courseId!);

  if (!course) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy khóa học</h2>
          <Button variant="link" asChild>
            <Link to="/">Quay về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
            <Link to="/">
              <ArrowLeft />
              Quay lại
            </Link>
          </Button>

          {/* Course Banner */}
          <div
            className={`${
              (course as any).coverImage ? "" : course.color
            } rounded-xl overflow-hidden relative min-h-[140px]`}
          >
            {(course as any).coverImage && (
              <img
                src={(course as any).coverImage}
                alt={course.title}
                className="w-full h-40 object-cover absolute inset-0"
              />
            )}
            <div
              className={`relative z-10 p-8 flex flex-col justify-end min-h-[140px] ${
                (course as any).coverImage
                  ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                  : ""
              }`}
            >
              <h1 className="text-4xl font-bold text-white mb-1">{course.title}</h1>
              {course.description && (
                <p className="text-white/80 text-base">{course.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {course.units.length} units
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {course.units.reduce((acc, u) => acc + u.vocabularies.length, 0)} từ vựng
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Danh sách Units</h2>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Chọn một unit để bắt đầu học từ vựng
            </p>
          </div>
          <Button asChild>
            <Link to={`/course/${courseId}/create-unit`}>
              <Plus />
              Tạo unit mới
            </Link>
          </Button>
        </div>

        <Separator className="mb-6" />

        <div className="space-y-3">
          {course.units.map((unit, index) => (
            <Link key={unit.id} to={`/unit/${courseId}/${unit.id}`} className="block">
              <Card className="hover:shadow-md hover:border-primary/40 transition-all group">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 ${course.color} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                        {unit.title}
                      </h3>
                      {unit.description && (
                        <p className="text-muted-foreground text-sm truncate">{unit.description}</p>
                      )}
                      <Badge variant="secondary" className="mt-1.5 gap-1">
                        <BookOpen className="w-3 h-3" />
                        {unit.vocabularies.length} từ vựng
                      </Badge>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {course.units.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-background">
            <BookOpen className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-1">Chưa có unit nào</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Tạo unit đầu tiên để bắt đầu thêm từ vựng
            </p>
            <Button asChild>
              <Link to={`/course/${courseId}/create-unit`}>
                <Plus />
                Tạo unit đầu tiên
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
