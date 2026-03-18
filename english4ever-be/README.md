# English4Ever Backend

Backend service for English4Ever flashcard learning platform built with Spring Boot and MongoDB.

## Features

- **Course Management**: Create and manage English learning courses
- **Unit Management**: Organize flashcards into units within courses
- **Flashcard Management**: Create flashcards with English terms, Vietnamese translations, and examples
- **SRS Learning Algorithm**: Spaced Repetition System (SM-2 algorithm) for optimal learning
- **Progress Tracking**: Track user learning progress and review schedules

## Tech Stack

- **Java 8**
- **Spring Boot 2.7.18**
- **MongoDB** - NoSQL database
- **Maven** - Build tool
- **Lombok** - Reduce boilerplate code

## Prerequisites

- Java 8 or higher
- Maven 3.6+
- MongoDB 4.0+ running on `localhost:27017`

## Installation

1. Clone the repository
```bash
cd english4ever-be
```

2. Install dependencies
```bash
mvn clean install
```

3. Make sure MongoDB is running
```bash
# Check MongoDB status
mongosh --eval "db.version()"
```

4. Run the application
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

## API Endpoints

### Course Endpoints

- `GET /api/courses` - Get all public courses
- `GET /api/courses/{id}` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

**Example Request:**
```json
POST /api/courses
{
  "name": "Basic English Vocabulary",
  "description": "Essential English words for beginners",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Unit Endpoints

- `GET /api/units/course/{courseId}` - Get all units in a course
- `GET /api/units/{id}` - Get unit by ID
- `POST /api/units` - Create new unit
- `PUT /api/units/{id}` - Update unit
- `DELETE /api/units/{id}` - Delete unit

**Example Request:**
```json
POST /api/units
{
  "courseId": "course123",
  "name": "Greetings & Introductions",
  "description": "Common greetings and how to introduce yourself"
}
```

### Flashcard Endpoints

- `GET /api/flashcards/unit/{unitId}` - Get all flashcards in a unit
- `GET /api/flashcards/{id}` - Get flashcard by ID
- `POST /api/flashcards` - Create new flashcard
- `PUT /api/flashcards/{id}` - Update flashcard
- `DELETE /api/flashcards/{id}` - Delete flashcard

**Example Request:**
```json
POST /api/flashcards
{
  "unitId": "unit123",
  "term": "hello",
  "definition": "xin chào",
  "pronunciation": "/həˈloʊ/",
  "partOfSpeech": "interjection",
  "exampleSentence": "Hello! How are you?",
  "distractors": ["goodbye", "thank you", "sorry"]
}
```

### Learning Endpoints

- `GET /api/learning/unit/{unitId}` - Get flashcards for learning session
- `POST /api/learning/answer` - Submit answer and update progress
- `GET /api/learning/due` - Get cards due for review
- `GET /api/learning/progress/unit/{unitId}` - Get progress for a unit
- `GET /api/learning/progress/course/{courseId}` - Get progress for a course

**Example Request:**
```json
POST /api/learning/answer
{
  "flashcardId": "flashcard123",
  "correct": true
}
```

## SRS Algorithm (Spaced Repetition System)

The backend implements the **SM-2 algorithm** (SuperMemo 2) for optimal learning:

### How It Works:

1. **New Cards**: Start with interval of 1 day
2. **Correct Answer**:
   - Interval increases (1 day → 6 days → ~15 days → ~38 days, etc.)
   - Easiness Factor (EF) increases
   - Progress stage advances: NEW → LEARNING → REVIEWING → MASTERED

3. **Incorrect Answer**:
   - Reset repetitions to 0
   - Interval resets to 1 day
   - EF decreases
   - Stage moves back to LEARNING

4. **Learning Stages**:
   - **NEW**: Never studied
   - **LEARNING**: < 3 correct answers in a row
   - **REVIEWING**: Passed learning phase
   - **MASTERED**: Interval ≥ 30 days

### Formula:
```
Interval(1) = 1 day
Interval(2) = 6 days
Interval(n) = Interval(n-1) × EF

EF' = EF + (0.1 - (5-q) × (0.08 + (5-q) × 0.02))
where q = quality (2 for incorrect, 4 for correct)
```

## Database Schema

### Collections:

1. **courses**
   - id, name, description, imageUrl, isPublic, totalUnits, totalFlashcards
   - createdAt, updatedAt

2. **units**
   - id, courseId, name, description, orderIndex, totalFlashcards
   - createdAt, updatedAt

3. **flashcards**
   - id, unitId, term, definition, pronunciation, audioUrl, imageUrl
   - partOfSpeech, exampleSentence, distractors[], orderIndex
   - createdAt, updatedAt

4. **user_progress**
   - id, userId, flashcardId, unitId, courseId
   - repetitions, easinessFactor, interval, nextReviewDate
   - correctCount, incorrectCount, stage
   - createdAt, updatedAt, lastReviewedAt

## CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

Update `application.yml` to add more origins if needed.

## Development

### Build
```bash
mvn clean package
```

### Run tests
```bash
mvn test
```

### Run with custom port
```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=9090
```

## Project Structure

```
src/main/java/com/english4ever/
├── config/           # Configuration classes (CORS, etc.)
├── controller/       # REST API controllers
├── dto/              # Data Transfer Objects
├── model/            # MongoDB entity models
├── repository/       # MongoDB repositories
├── service/          # Business logic services
└── English4EverApplication.java
```

## TODO

- [ ] Add user authentication (JWT)
- [ ] Add file upload for images and audio
- [ ] Add batch import for flashcards (CSV/Excel)
- [ ] Add statistics and analytics endpoints
- [ ] Add search and filter endpoints
- [ ] Implement match game logic endpoint
- [ ] Add validation error handling
- [ ] Add logging with SLF4J
- [ ] Add API documentation with Swagger
- [ ] Add unit and integration tests

## License

MIT
