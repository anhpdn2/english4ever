package com.english4ever.service;

import com.english4ever.dto.LearningResponse;
import com.english4ever.model.Flashcard;
import com.english4ever.model.UserProgress;
import com.english4ever.repository.FlashcardRepository;
import com.english4ever.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LearningService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private SRSService srsService;

    /**
     * Get flashcards for learning session in a unit
     * Priority: Due for review > New cards
     */
    public List<LearningResponse> getFlashcardsForLearning(String unitId) {
        List<Flashcard> allFlashcards = flashcardRepository.findByUnitIdOrderByOrderIndexAsc(unitId);
        List<LearningResponse> responses = new ArrayList<>();

        for (Flashcard flashcard : allFlashcards) {
            Optional<UserProgress> progressOpt = userProgressRepository.findByFlashcardId(flashcard.getId());

            UserProgress progress;
            if (progressOpt.isPresent()) {
                progress = progressOpt.get();
            } else {
                // Create new progress for this flashcard
                progress = new UserProgress();
                progress.setFlashcardId(flashcard.getId());
                progress.setUnitId(flashcard.getUnitId());
                progress.setStage(UserProgress.LearningStage.NEW);
                progress.setCreatedAt(LocalDateTime.now());
            }

            responses.add(new LearningResponse(flashcard, progress));
        }

        // Sort: Due for review first, then new cards, then by next review date
        return responses.stream()
                .sorted((a, b) -> {
                    UserProgress p1 = a.getProgress();
                    UserProgress p2 = b.getProgress();

                    // New cards last
                    if (p1.getStage() == UserProgress.LearningStage.NEW &&
                            p2.getStage() != UserProgress.LearningStage.NEW) {
                        return 1;
                    }
                    if (p1.getStage() != UserProgress.LearningStage.NEW &&
                            p2.getStage() == UserProgress.LearningStage.NEW) {
                        return -1;
                    }

                    // For cards with progress, sort by next review date
                    if (p1.getNextReviewDate() != null && p2.getNextReviewDate() != null) {
                        return p1.getNextReviewDate().compareTo(p2.getNextReviewDate());
                    }

                    return 0;
                })
                .collect(Collectors.toList());
    }

    /**
     * Submit answer and update progress using SRS algorithm
     */
    public UserProgress submitAnswer(String flashcardId, boolean correct) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));

        Optional<UserProgress> progressOpt = userProgressRepository.findByFlashcardId(flashcardId);

        UserProgress progress;
        if (progressOpt.isPresent()) {
            progress = progressOpt.get();
        } else {
            // Create new progress
            progress = new UserProgress();
            progress.setFlashcardId(flashcardId);
            progress.setUnitId(flashcard.getUnitId());
            progress.setCreatedAt(LocalDateTime.now());
        }

        // Update progress using SRS algorithm
        progress = srsService.updateProgress(progress, correct);

        return userProgressRepository.save(progress);
    }

    /**
     * Get cards due for review
     */
    public List<LearningResponse> getDueCards() {
        List<UserProgress> dueProgress = userProgressRepository
                .findByNextReviewDateBeforeOrderByNextReviewDateAsc(LocalDateTime.now());

        List<LearningResponse> responses = new ArrayList<>();
        for (UserProgress progress : dueProgress) {
            Optional<Flashcard> flashcardOpt = flashcardRepository.findById(progress.getFlashcardId());
            flashcardOpt.ifPresent(flashcard -> responses.add(new LearningResponse(flashcard, progress)));
        }

        return responses;
    }

    /**
     * Get user progress for a unit
     */
    public List<UserProgress> getUnitProgress(String unitId) {
        return userProgressRepository.findByUnitId(unitId);
    }

    /**
     * Get user progress for a course
     */
    public List<UserProgress> getCourseProgress(String courseId) {
        return userProgressRepository.findByCourseId(courseId);
    }
}
