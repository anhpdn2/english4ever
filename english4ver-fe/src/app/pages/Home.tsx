import { Link } from "react-router";
import { BookOpen, Clock, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "../components/ui/card";

export function Home() {
  const { courses, loading, error } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-2xl text-primary">Quizlet Clone</h1>
          <Button asChild>
            <Link to="/create-course">
              <Plus />
              Tạo khóa học
            </Link>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-1">Khóa học của bạn</h2>
          <p className="text-muted-foreground">Chọn một khóa học để bắt đầu học tập</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} to={`/course/${course.id}`} className="group">
              <Card className="overflow-hidden gap-0 hover:shadow-lg transition-shadow">
                <div
                  className={`${(course as any).coverImage ? "" : course.color} h-32 relative`}
                >
                  {(course as any).coverImage ? (
                    <img
                      src={(course as any).coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                  )}
                </div>
                <CardContent className="pt-4 pb-2">
                  <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {course.description}
                  </p>
                </CardContent>
                <CardFooter className="pb-4 gap-3">
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course.units.length} units
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {course.units.reduce((acc, u) => acc + u.vocabularies.length, 0)} từ
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}

          {/* Add new card */}
          <Link
            to="/create-course"
            className="group bg-background rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center h-48 gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Tạo khóa học mới
              </p>
              <p className="text-sm text-muted-foreground">Bắt đầu xây dựng khóa học của bạn</p>
            </div>
          </Link>
        </div>

        {/* Empty state */}
        {courses.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-background">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Chưa có khóa học nào</h3>
            <p className="text-muted-foreground mb-6">
              Tạo khóa học đầu tiên để bắt đầu học từ vựng
            </p>
            <Button asChild size="lg">
              <Link to="/create-course">
                <Plus />
                Tạo khóa học đầu tiên
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
