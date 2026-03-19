const API_BASE_URL = "http://localhost:8080/api";

export interface CourseDTO {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  color?: string;
  isPublic?: boolean;
  totalUnits?: number;
  totalFlashcards?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnitDTO {
  id?: string;
  courseId: string;
  name: string;
  description?: string;
  orderIndex: number;
  totalFlashcards?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlashcardDTO {
  id?: string;
  unitId: string;
  english: string;
  vietnamese: string;
  imageUrl?: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

// Course API
export const courseApi = {
  async getAllCourses(): Promise<CourseDTO[]> {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error("Failed to fetch courses");
    return response.json();
  },

  async getCourseById(id: string): Promise<CourseDTO> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) throw new Error("Failed to fetch course");
    return response.json();
  },

  async createCourse(course: Omit<CourseDTO, "id">): Promise<CourseDTO> {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error("Failed to create course");
    return response.json();
  },

  async updateCourse(id: string, course: Omit<CourseDTO, "id">): Promise<CourseDTO> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error("Failed to update course");
    return response.json();
  },

  async deleteCourse(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete course");
  },
};

// Unit API
export const unitApi = {
  async getUnitsByCourse(courseId: string): Promise<UnitDTO[]> {
    const response = await fetch(`${API_BASE_URL}/units/course/${courseId}`);
    if (!response.ok) throw new Error("Failed to fetch units");
    return response.json();
  },

  async getUnitById(id: string): Promise<UnitDTO> {
    const response = await fetch(`${API_BASE_URL}/units/${id}`);
    if (!response.ok) throw new Error("Failed to fetch unit");
    return response.json();
  },

  async createUnit(unit: Omit<UnitDTO, "id">): Promise<UnitDTO> {
    const response = await fetch(`${API_BASE_URL}/units`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(unit),
    });
    if (!response.ok) throw new Error("Failed to create unit");
    return response.json();
  },

  async updateUnit(id: string, unit: Omit<UnitDTO, "id">): Promise<UnitDTO> {
    const response = await fetch(`${API_BASE_URL}/units/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(unit),
    });
    if (!response.ok) throw new Error("Failed to update unit");
    return response.json();
  },

  async deleteUnit(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/units/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete unit");
  },
};

// Flashcard API
export const flashcardApi = {
  async getFlashcardsByUnit(unitId: string): Promise<FlashcardDTO[]> {
    const response = await fetch(`${API_BASE_URL}/flashcards/unit/${unitId}`);
    if (!response.ok) throw new Error("Failed to fetch flashcards");
    return response.json();
  },

  async getFlashcardById(id: string): Promise<FlashcardDTO> {
    const response = await fetch(`${API_BASE_URL}/flashcards/${id}`);
    if (!response.ok) throw new Error("Failed to fetch flashcard");
    return response.json();
  },

  async createFlashcard(flashcard: Omit<FlashcardDTO, "id">): Promise<FlashcardDTO> {
    const response = await fetch(`${API_BASE_URL}/flashcards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flashcard),
    });
    if (!response.ok) throw new Error("Failed to create flashcard");
    return response.json();
  },

  async updateFlashcard(id: string, flashcard: Omit<FlashcardDTO, "id">): Promise<FlashcardDTO> {
    const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flashcard),
    });
    if (!response.ok) throw new Error("Failed to update flashcard");
    return response.json();
  },

  async deleteFlashcard(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete flashcard");
  },
};
