package com.english4ever.service;

import com.english4ever.model.UserProgress;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Spaced Repetition System (SRS) Service using SM-2 Algorithm
 * Based on SuperMemo 2 algorithm for optimal learning intervals
 */
@Service
public class SRSService {

    /**
     * Update user progress based on answer correctness
     * Implements SM-2 algorithm
     *
     * @param progress Current user progress
     * @param correct  Whether the answer was correct
     * @return Updated progress
     */
    public UserProgress updateProgress(UserProgress progress, boolean correct) {
        if (progress == null) {
            progress = new UserProgress();
            progress.setRepetitions(0);
            progress.setEasinessFactor(2.5);
            progress.setInterval(0);
            progress.setStage(UserProgress.LearningStage.NEW);
        }

        if (correct) {
            progress.setCorrectCount(progress.getCorrectCount() + 1);

            // Update repetitions
            progress.setRepetitions(progress.getRepetitions() + 1);

            // Calculate new interval
            int newInterval = calculateInterval(progress.getRepetitions(), progress.getInterval());
            progress.setInterval(newInterval);

            // Update easiness factor (quality = 4 for correct answer)
            double newEF = updateEasinessFactor(progress.getEasinessFactor(), 4);
            progress.setEasinessFactor(newEF);

            // Update stage
            updateStage(progress);

        } else {
            progress.setIncorrectCount(progress.getIncorrectCount() + 1);

            // Reset to start for incorrect answer
            progress.setRepetitions(0);
            progress.setInterval(1); // Review again tomorrow

            // Decrease easiness factor (quality = 2 for incorrect answer)
            double newEF = updateEasinessFactor(progress.getEasinessFactor(), 2);
            progress.setEasinessFactor(newEF);

            // Update stage back to learning
            if (progress.getStage() != UserProgress.LearningStage.NEW) {
                progress.setStage(UserProgress.LearningStage.LEARNING);
            }
        }

        // Set next review date
        LocalDateTime nextReview = LocalDateTime.now().plusDays(progress.getInterval());
        progress.setNextReviewDate(nextReview);
        progress.setLastReviewedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());

        return progress;
    }

    /**
     * Calculate interval based on SM-2 algorithm
     */
    private int calculateInterval(int repetitions, int previousInterval) {
        if (repetitions == 1) {
            return 1; // 1 day
        } else if (repetitions == 2) {
            return 6; // 6 days
        } else {
            // I(n) = I(n-1) * EF
            // Simplified: interval increases by factor
            return Math.max(1, (int) Math.ceil(previousInterval * 2.5));
        }
    }

    /**
     * Update Easiness Factor (EF) based on SM-2 algorithm
     * EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
     *
     * @param currentEF Current easiness factor
     * @param quality   Quality of answer (0-5): 0=total blackout, 5=perfect response
     *                  We use: 2=incorrect, 4=correct
     * @return New easiness factor (minimum 1.3)
     */
    private double updateEasinessFactor(double currentEF, int quality) {
        double newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

        // EF should not fall below 1.3
        if (newEF < 1.3) {
            newEF = 1.3;
        }

        return newEF;
    }

    /**
     * Update learning stage based on progress
     */
    private void updateStage(UserProgress progress) {
        int correct = progress.getCorrectCount();
        int interval = progress.getInterval();

        if (progress.getStage() == UserProgress.LearningStage.NEW && correct >= 1) {
            progress.setStage(UserProgress.LearningStage.LEARNING);
        } else if (progress.getStage() == UserProgress.LearningStage.LEARNING && correct >= 3) {
            progress.setStage(UserProgress.LearningStage.REVIEWING);
        } else if (progress.getStage() == UserProgress.LearningStage.REVIEWING && interval >= 30) {
            // After 30 days interval, consider mastered
            progress.setStage(UserProgress.LearningStage.MASTERED);
        }
    }
}
