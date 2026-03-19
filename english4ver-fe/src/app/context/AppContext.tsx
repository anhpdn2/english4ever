import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Course, Unit } from "../data/mockData";
import { courseApi, CourseDTO } from "../services/courseApi";

interface AppContextType {
  courses: Course[];
  addCourse: (course: Course) => Promise<void>;
  addUnit: (courseId: string, unit: Unit) => void;
  getCourse: (courseId: string) => Course | undefined;
  loading: boolean;
  error: string | null;
  refreshCourses: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

// Convert DTO to frontend model
function convertCourseDTOToCourse(dto: CourseDTO): Course {
  return {
    id: dto.id || "",
    title: dto.name,
    description: dto.description || "",
    color: dto.color || "bg-blue-500",
    coverImage: dto.imageUrl,
    units: [], // Units will be loaded separately when needed
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const courseDTOs = await courseApi.getAllCourses();
      const convertedCourses = courseDTOs.map(convertCourseDTOToCourse);
      setCourses(convertedCourses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCourses();
  }, []);

  const addCourse = async (course: Course) => {
    try {
      const courseDTO: Omit<CourseDTO, "id"> = {
        name: course.title,
        description: course.description,
        imageUrl: (course as any).coverImage,
        color: course.color,
      };
      const createdCourse = await courseApi.createCourse(courseDTO);
      const convertedCourse = convertCourseDTOToCourse(createdCourse);
      setCourses((prev) => [...prev, convertedCourse]);
    } catch (err) {
      console.error("Error creating course:", err);
      throw err;
    }
  };

  const addUnit = (courseId: string, unit: Unit) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, units: [...c.units, unit] } : c
      )
    );
  };

  const getCourse = (courseId: string) => courses.find((c) => c.id === courseId);

  return (
    <AppContext.Provider value={{ courses, addCourse, addUnit, getCourse, loading, error, refreshCourses }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}