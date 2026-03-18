package com.english4ever.controller;

import com.english4ever.dto.AnswerRequest;
import com.english4ever.dto.LearningResponse;
import com.english4ever.model.UserProgress;
import com.english4ever.service.LearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/learning")
public class LearningController {

    @Autowired
    private LearningService learningService;

    /**
     * Get flashcards for learning session in a unit
     */
    @GetMapping("/unit/{unitId}")
    public ResponseEntity<List<LearningResponse>> getFlashcardsForLearning(@PathVariable String unitId) {
        List<LearningResponse> responses = learningService.getFlashcardsForLearning(unitId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Submit answer and update progress
     */
    @PostMapping("/answer")
    public ResponseEntity<UserProgress> submitAnswer(@Valid @RequestBody AnswerRequest request) {
        UserProgress progress = learningService.submitAnswer(request.getFlashcardId(), request.getCorrect());
        return ResponseEntity.ok(progress);
    }

    /**
     * Get cards due for review across all units
     */
    @GetMapping("/due")
    public ResponseEntity<List<LearningResponse>> getDueCards() {
        List<LearningResponse> responses = learningService.getDueCards();
        return ResponseEntity.ok(responses);
    }

    /**
     * Get user progress for a unit
     */
    @GetMapping("/progress/unit/{unitId}")
    public ResponseEntity<List<UserProgress>> getUnitProgress(@PathVariable String unitId) {
        List<UserProgress> progress = learningService.getUnitProgress(unitId);
        return ResponseEntity.ok(progress);
    }

    /**
     * Get user progress for a course
     */
    @GetMapping("/progress/course/{courseId}")
    public ResponseEntity<List<UserProgress>> getCourseProgress(@PathVariable String courseId) {
        List<UserProgress> progress = learningService.getCourseProgress(courseId);
        return ResponseEntity.ok(progress);
    }
}
