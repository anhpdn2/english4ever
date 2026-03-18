package com.english4ever.repository;

import com.english4ever.model.Unit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnitRepository extends MongoRepository<Unit, String> {
    List<Unit> findByCourseIdOrderByOrderIndexAsc(String courseId);
}
