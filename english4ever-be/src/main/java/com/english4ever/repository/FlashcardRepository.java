package com.english4ever.repository;

import com.english4ever.model.Flashcard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends MongoRepository<Flashcard, String> {
    List<Flashcard> findByUnitIdOrderByOrderIndexAsc(String unitId);
    long countByUnitId(String unitId);
}
