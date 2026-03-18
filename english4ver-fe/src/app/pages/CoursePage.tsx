import { Link, useParams } from "react-router";
import { mockCourses } from "../data/mockData";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";

export function CoursePage() {
  const { courseId } = useParams();
  const course = mockCourses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy khóa học
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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
          <div className={`${course.color} rounded-lg p-8 text-white`}>
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-white/90 text-lg">{course.description}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-white/80">
              <span>{course.units.length} units</span>
              <span>•</span>
              <span>
                {course.units.reduce((acc, unit) => acc + unit.vocabularies.length, 0)} từ vựng
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Danh sách Units</h2>
          <p className="text-gray-600 mt-1">
            Chọn một unit để bắt đầu học từ vựng
          </p>
        </div>

        <div className="space-y-4">
          {course.units.map((unit, index) => (
            <Link
              key={unit.id}
              to={`/unit/${courseId}/${unit.id}`}
              className="block"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 ${course.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {unit.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{unit.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span>{unit.vocabularies.length} từ vựng</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
