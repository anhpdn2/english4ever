package com.english4ever.repository;

import com.english4ever.model.UserProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
    Optional<UserProgress> findByFlashcardId(String flashcardId);
    List<UserProgress> findByUnitId(String unitId);
    List<UserProgress> findByCourseId(String courseId);
    List<UserProgress> findByNextReviewDateBeforeOrderByNextReviewDateAsc(LocalDateTime date);
}
