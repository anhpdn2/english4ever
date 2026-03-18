package com.english4ever.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Tracks user's learning progress for SRS (Spaced Repetition System)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_progress")
public class UserProgress {

    @Id
    private String id;

    private String userId; // Future: for multi-user support

    private String flashcardId;

    private String unitId;

    private String courseId;

    // SRS fields
    private int repetitions = 0; // Number of successful repetitions

    private double easinessFactor = 2.5; // Default EF in SM-2 algorithm

    private int interval = 0; // Days until next review

    private LocalDateTime nextReviewDate;

    private LocalDateTime lastReviewedAt;

    // Learning stats
    private int correctCount = 0;

    private int incorrectCount = 0;

    private LearningStage stage = LearningStage.NEW;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public enum LearningStage {
        NEW,        // Never studied
        LEARNING,   // Currently learning (< 3 correct in a row)
        REVIEWING,  // In review phase (passed learning)
        MASTERED    // Fully mastered (long intervals)
    }
}
