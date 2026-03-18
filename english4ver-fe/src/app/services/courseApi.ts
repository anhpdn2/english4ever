const BASE_URL = 'http://localhost:8080/api';

export interface CourseDTO {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  totalUnits: number;
  totalFlashcards: number;
  isPublic: boolean;
}

export interface CreateCourseRequest {
  name: string;
  description: string;
  imageUrl?: string;
}

export async function getCourses(): Promise<CourseDTO[]> {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}

export async function createCourse(data: CreateCourseRequest): Promise<CourseDTO> {
  const res = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create course');
  return res.json();
}
