import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BookOpen, Clock } from "lucide-react";
import { getCourses, type CourseDTO } from "../services/courseApi";

const COURSE_COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500",
  "bg-red-500", "bg-yellow-500", "bg-pink-500",
];

export function Home() {
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => setError("Không thể tải danh sách khóa học"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-2xl text-blue-600">English4Ever</h1>
            <Link to="/create" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Tạo khóa học
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Khóa học của bạn</h2>
          <p className="text-gray-600">Chọn một khóa học để bắt đầu học tập</p>
        </div>

        {loading && <p className="text-gray-500">Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <Link key={course.id} to={`/course/${course.id}`} className="group">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`${COURSE_COLORS[i % COURSE_COLORS.length]} h-32 relative`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {course.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.totalUnits} units</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.totalFlashcards} từ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có khóa học nào</h3>
                <p className="text-gray-600 mb-6">Tạo khóa học đầu tiên của bạn để bắt đầu học tập</p>
                <Link to="/create" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Tạo khóa học mới
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
